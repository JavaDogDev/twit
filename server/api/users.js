const express = require('express');
const bodyParser = require('body-parser');
const User = require('../database/user');

const usersRouter = express.Router();
usersRouter.use(bodyParser.json());

/* Get info for a user by username */
usersRouter.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('+following').exec();
    return res.json(user);
  } catch (err) {
    console.error(`Couldn't get info for username ${req.params.userId}:\n${err}`);
    return res.status(500).end();
  }
});

module.exports = usersRouter;
