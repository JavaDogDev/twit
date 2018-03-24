const mongoose = require('mongoose');
const { createUserModel } = require('./user');

async function connectToDatabase() {
  mongoose.connect('mongodb://localhost:27017/twit');
  console.log('Connected to database.');

  const User = createUserModel();
}

module.exports = { connectToDatabase };
