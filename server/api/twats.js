const express = require('express');
const bodyParser = require('body-parser');
const flatten = require('array-flatten');

const User = require('../database/user');
const Twat = require('../database/twat');
const { deleteImageAttachment } = require('./file-upload');

const twatsRouter = express.Router();
twatsRouter.use(bodyParser.json());

/* Accept new Twats and replies */
twatsRouter.post('/', async (req, res) => {
  const newTwat = new Twat({
    twatText: req.body.twatText,
    userId: req.session.userId,
  });

  if (typeof req.body.replyingTo === 'string') {
    newTwat.replyingTo = req.body.replyingTo;

    try {
      // Make sure user isn't replying to a reply (not allowed)
      const parentTwat = await Twat.findById(req.body.replyingTo);
      if (parentTwat.replyingTo) {
        return res.status(400).end('Can\'t reply to a reply.');
      }
    } catch (err) {
      console.log(`Couldn't get parent for reply: ${err}`);
      return res.status(500).end();
    }
  }

  newTwat.save()
    .then(() => res.status(200).end())
    .catch((err) => {
      console.log(`Error saving new Twat: ${err}`);
      return res.status(500).end();
    });
});

/* Deletion endpoint */
twatsRouter.delete('/:id', (req, res) => (
  // Make sure current user can delete this twat
  Twat.findById(req.params.id).exec()
    .then(async (twat) => {
      if (twat === null) {
        return Promise.reject(
          new Error(`Couldn't find Twat with ID '${req.params.id}'`));
      }

      if (req.session.userId === twat.userId) {
        // Check if there's any ImageAttachment referenced by this Twat to delete it also
        const { images } = twat;
        await twat.remove();
        return images;
      }
      return Promise.reject(
        new Error(`UserID '${req.session.userId}' not authorized to delete Twat '${twat._id}'`));
    })
    .then(async (imageAttachmentId) => {
      // Delete any ImageAttachment
      if (typeof imageAttachmentId !== 'undefined') {
        await deleteImageAttachment(imageAttachmentId.toString(), req.session.userId);
      }
      return res.status(200).end();
    })
    .catch((err) => {
      console.log(`Error while deleting twat: ${err}`);
      res.status(500).end();
    })
));

/*
  Get twats from followed users and self to populate trough on dashboard page
  Returns JSON object: { twats: [] }
*/
twatsRouter.get('/dashboard-trough', async (req, res) => {
  let followedUserIds = [];
  try {
    followedUserIds = (await User.findOne({ userId: req.session.userId }).select('+following').exec()).following;
  } catch (err) {
    console.error(`Couldn't get followed users: ${err}`);
  }

  const followedUsers = Promise.all(followedUserIds.map(userId => User.findOne({ userId }).exec()));
  const followedUsersTwats = Promise.all(followedUserIds.map(Twat.twatsByUser.bind(Twat)));
  const currentUser = User.findOne({ userId: req.session.userId }).exec();
  const currentUserTwats = Twat.twatsByUser(req.session.userId);

  Promise.all([followedUsers, followedUsersTwats, currentUser, currentUserTwats])
    .then(async ([foundUsers, foundTwats, thisUser, ownTwats]) => {
      // Flatten [ [user 1 twats...], [user 2 twats...] ] to [ allTwats... ]
      const flattenedTwats = flatten(foundTwats);

      // Add in the current user's Twats
      flattenedTwats.push(...ownTwats);

      // and add the current user's info to foundUsers for simplicity below...
      foundUsers.push(thisUser);

      // Embed user data into every returned Twat
      const userifiedTwats = [];
      flattenedTwats.forEach((twat) => {
        const twatClone = twat.toObject(); // toObject gets actual _doc
        twatClone.user = foundUsers.find(user => user.userId === twatClone.userId);
        userifiedTwats.push(twatClone);
      });

      /* Hacky solution to include `numReplies` prop on every top-level Twat */
      try {
        const needReplyCounts = userifiedTwats.filter(twat => typeof twat.replyingTo === 'undefined');
        const dontNeedReplyCounts = userifiedTwats.filter(twat => typeof twat.replyingTo !== 'undefined');

        // Get reply counts (same order as Twats in needReplyCounts)
        const replyCounts = await Promise.all(
          needReplyCounts.map(twat => Twat.countDocuments({ replyingTo: twat._id }).exec()));

        const responseTwats = [...dontNeedReplyCounts];
        needReplyCounts.forEach((twat, index) => {
          const twatClone = { ...twat };
          twatClone.numReplies = replyCounts[index];
          responseTwats.push(twatClone);
        });

        // Send list back
        res.json({ twats: responseTwats });
      } catch (err) {
        console.error(`Couldn't get reply counts for twats: ${err}`);
      }
    })
    .catch(err => console.error(`Error loading Twats from followed users: ${err}`));
});

/* Return an array of Twats made by user with given userId. */
twatsRouter.get('/by/:userId', async (req, res) => {
  try {
    const twats = await Twat.twatsByUser(req.params.userId);
    return res.json(twats);
  } catch (err) {
    console.error(`Error getting Twats by userId ${req.params.userId}:\n${err}`);
    return res.status(500).end();
  }
});

/* Return a Twat with its user data embedded */
twatsRouter.get('/:id', async (req, res) => {
  try {
    const twat = await Twat.getTwatsWithUser(req.params.id);
    if (twat === null) {
      console.error(`Error getting Twat with ID '${req.params.id}'`);
      return res.status(500).end();
    }

    return res.json({ twat });
  } catch (err) {
    console.error(`Error getting Twat with ID '${req.params.id}'\n${err}`);
    res.status(400).end();
  }
});

/**
 * Like a Twat
 * Replies with the updated Twat object.
 */
twatsRouter.post('/:id/like', async (req, res) => {
  try {
    await Twat.findOneAndUpdate(
      { _id: req.params.id },
      { $addToSet: { 'meta.likedBy': req.session.userId } });

    const updatedTwat = await Twat.getTwatsWithUser(req.params.id);

    return res.json({ twat: updatedTwat });
  } catch (err) {
    console.error(`Error liking Twat with ID '${req.params.id}' as user '${req.session.userId}'\n${err}`);
    res.status(400).end();
  }
});

/**
 * Unlike a Twat
 * Replies with the updated Twat object.
 */
twatsRouter.post('/:id/unlike', async (req, res) => {
  try {
    await Twat.findOneAndUpdate(
      { _id: req.params.id },
      { $pull: { 'meta.likedBy': req.session.userId } });

    const updatedTwat = await Twat.getTwatsWithUser(req.params.id);

    return res.json({ twat: updatedTwat });
  } catch (err) {
    console.error(`Error unliking Twat with ID '${req.params.id}' as user '${req.session.userId}'\n${err}`);
    res.status(400).end();
  }
});

/* Returns an array of direct replies to a given Twat, sorted newest first */
twatsRouter.get('/replies/:id', async (req, res) => {
  try {
    const allReplyIds = await Twat.find({ replyingTo: req.params.id }, '_id').exec();

    if (allReplyIds.length === 0) {
      return res.json([]);
    }

    const replyTwats = (await Twat.getTwatsWithUser(allReplyIds))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json(replyTwats);
  } catch (err) {
    console.error(`Error getting replies to ID: '${req.params.id}'\n${err}`);
    return res.status(500).end();
  }
});

module.exports = twatsRouter;
