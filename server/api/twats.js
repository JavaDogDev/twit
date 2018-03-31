const express = require('express');
const bodyParser = require('body-parser');
const flatten = require('array-flatten');
const User = require('../database/user');
const Twat = require('../database/twat');

const twatsRouter = express.Router();
twatsRouter.use(bodyParser.json());

/* Accept new Twats */
twatsRouter.post('/', (req, res) => {
  const newTwat = new Twat({
    twatText: req.body.twatText,
    meta: { likes: 0, retwats: 0 },
    userId: req.session.userId,
  });

  newTwat.save()
    .then(() => res.status(200).end())
    .catch((err) => {
      console.log(`Error saving new Twat: ${err}`);
      return res.status(500).end();
    });
});

/* Deletion endpoint */
twatsRouter.delete('/:id', async (req, res) => {
  // Make sure current user can delete this twat
  Promise.all([
    User.findOne({ userId: req.session.userId }),
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
  Get twats from followed users
  Returns JSON object: { twats: [] }
*/
twatsRouter.get('/following', async (req, res) => {
  const followedUserIds = await User.find({ userId: req.session.userId })
    .then(users => users.map(user => user.following))
    .catch(err => console.error(`Couldn't get followed users: ${err}`));

  // Not following anyone!
  if (!Array.isArray(followedUserIds) || followedUserIds.length === 0) {
    return res.json({ twats: [] });
  }

  // Make two arrays of promises
  const followedUsers = Promise.all(followedUserIds.map(userId => User.find({ userId }).exec()));
  const followedUsersTwats = Promise.all(followedUserIds.map(Twat.twatsByUser.bind(Twat)));

  Promise.all([followedUsers, followedUsersTwats])
    .then(([foundUsers, foundTwats]) => {
      // Flatten [ [user 1 twats...], [user 2 twats...] ] to [ allTwats... ]
      const flattenedTwats = flatten(foundTwats);
      const flattenedUsers = flatten(foundUsers);

      // Embed user data into every returned Twat
      const responseTwats = [];
      flattenedTwats.forEach((twat) => {
        const twatClone = { ...twat.toObject() }; // toObject gets actual _doc

        flattenedUsers.forEach((user) => {
          // Embed only public-api-safe user data
          if (user.userId === twatClone.userId) twatClone.user = user.getPublicInfo();
        });

        // Delete userId prop because I think I want it to remain server-side only...?
        delete twatClone.userId;

        responseTwats.push(twatClone);
      });

      res.json({ twats: responseTwats });
    })
    .catch(err => console.error(`Error loading Twats from followed users: ${err}`));
});

module.exports = twatsRouter;
