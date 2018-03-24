const mongoose = require('mongoose');

async function connectToDatabase() {
  mongoose.connect('mongodb://localhost:27017/twit');
  console.log('Connected to database.');
}

module.exports = { connectToDatabase };
