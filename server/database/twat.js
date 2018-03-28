const mongoose = require('mongoose');

function createTwatModel() {
  const twatSchema = mongoose.Schema({
    // twats use Mongo's _id as identifiers
    timestamp: { type: Date, default: Date.now(), required: true },
    twatText: { type: String, required: true },
    meta: { likes: 0, retwats: 0 },
    userId: { type: String, required: true },
    replies: { type: [mongoose.Schema.Types.ObjectId], required: true },
  });

  return mongoose.model('Twat', twatSchema);
}

const TwatModel = createTwatModel();

module.exports = TwatModel;
