const express = require('express');
const bodyParser = require('body-parser');
const User = require('../database/user');

const loginRouter = express.Router();
loginRouter.use(bodyParser.urlencoded());

loginRouter.post('/', (req, res) => {
  const { username, password } = req.body;

  // check if user exists
  User.findOne({ username }).exec((userError, user) => {
    if (userError) {
      console.log(`Error querying users: ${userError}`);
      return res.redirect('/login');
    }

    if (!user) {
      console.log(`Error finding user with username: ${username}`);
      return res.redirect('/login');
    }

    // found them, check password
    user.comparePassword(password, (passError, isMatch) => {
      if (passError) {
        console.log(`Error while checking password: ${passError}`);
        return res.redirect('/login');
      }

      if (isMatch) {
        console.log(`User successfully logged in: ${username}`);
        return res.redirect('/');
      }

      console.log(`Incorrect password for user: ${username}`);
      return res.redirect('/login');
    });
  });
});

module.exports = loginRouter;
