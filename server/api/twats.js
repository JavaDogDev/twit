const express = require('express');
const bodyParser = require('body-parser');
const flatten = require('array-flatten');
const User = require('../database/user');
const Twat = require('../database/twat');

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

      // Update doc of Twat we're replying to if this is a reply
      const savedReply = await newTwat.save();

      Twat.update({ _id: req.body.replyingTo }, { $push: { replies: savedReply._id } })
        .then(() => res.status(200).end())
        .catch((err) => {
          console.log(`Error while updating replied-to Twat ${req.body.replyingTo}, deleting reply.\n${err}`);
          savedReply.remove();
          return res.status(500).end();
        });
    } catch (err) {
      console.log(`Error saving new reply: ${err}`);
      return res.status(500).end();
    }
  } else {
    // Not a reply, just save normally
    newTwat.save()
      .then(() => res.status(200).end())
      .catch((err) => {
        console.log(`Error saving new Twat: ${err}`);
        return res.status(500).end();
      });
  }
});

/* Deletion endpoint */
twatsRouter.delete('/:id', async (req, res) => {
  // Make sure current user can delete this twat
  Promise.all([
    User.findOne({ userId: req.session.userId }).exec(),
    Twat.findById(req.params.id),
  ])
    .then(([user, twat]) => {
      if (user.userId === twat.userId) {
        twat.remove();
        return res.status(200).end();
      }
      console.log(`User "${user.username}" not authorized to delete Twat ${twat._id}`);
      return res.status(401).end();
    })
    .catch((err) => {
      console.log(`Error while deleting twat: ${err}`);
      res.status(500).end();
    });
});

/*
  Get twats from followed users and self to populate trough
  Returns JSON object: { twats: [] }
*/
twatsRouter.get('/trough', async (req, res) => {
  let followedUserIds = [];
  try {
    followedUserIds =
      (await User.findOne({ userId: req.session.userId }).select('+following').exec()).following;
  } catch (err) {
    console.error(`Couldn't get followed users: ${err}`);
  }

  const followedUsers = Promise.all(followedUserIds.map(userId => User.findOne({ userId }).exec()));
  const followedUsersTwats = Promise.all(followedUserIds.map(Twat.twatsByUser.bind(Twat)));
  const currentUser = User.findOne({ userId: req.session.userId }).exec();
  const currentUserTwats = Twat.twatsByUser(req.session.userId);

  Promise.all([followedUsers, followedUsersTwats, currentUser, currentUserTwats])
    .then(([foundUsers, foundTwats, thisUser, ownTwats]) => {
      // Flatten [ [user 1 twats...], [user 2 twats...] ] to [ allTwats... ]
      const flattenedTwats = flatten(foundTwats);

      // Add in the current user's Twats
      flattenedTwats.push(...ownTwats);

      // and add the current user's info to foundUsers for simplicity below...
      foundUsers.push(thisUser);

      // Embed user data into every returned Twat
      const responseTwats = [];
      flattenedTwats.forEach((twat) => {
        const twatClone = twat.toObject(); // toObject gets actual _doc
        twatClone.user = foundUsers.find(user => user.userId === twatClone.userId);
        responseTwats.push(twatClone);
      });

      return res.json({ twats: responseTwats });
    })
    .catch(err => console.error(`Error loading Twats from followed users: ${err}`));
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

/* Returns an array of direct replies to a given Twat, sorted newest first */
twatsRouter.get('/replies/:id', async (req, res) => {
  const mainTwat = await Twat.getTwatsWithUser(req.params.id);
  if (mainTwat === null) {
    console.error(`Error getting Twat with ID '${req.params.id}'`);
    return res.status(404).end();
  }

  if (mainTwat.replies.length === 0) {
    // no replies
    return res.json([]);
  }

  const replyTwats = (await Twat.getTwatsWithUser(mainTwat.replies))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  res.json(replyTwats);
});

module.exports = twatsRouter;
