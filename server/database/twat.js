const mongoose = require('mongoose');

function createTwatModel() {
  const twatSchema = mongoose.Schema({
    // twats use Mongo's _id as identifiers
    timestamp: { type: Date, default: () => Date.now(), required: true },
    twatText: { type: String, required: true },
    meta: {
      likes: { type: Number, default: 0 },
      retwats: { type: Number, default: 0 },
    },
    userId: { type: String, required: true, index: true },
    replies: { type: [mongoose.Schema.Types.ObjectId], ref: 'Twat', required: true },
  });

  /**
   * @returns a Promise which evaluates to an array of the user's Twats
   */
  twatSchema.statics.twatsByUser = function twatsByUser(userId) {
    return this.where({ userId }).exec();
  };

  return mongoose.model('Twat', twatSchema);
}

const TwatModel = createTwatModel();

module.exports = TwatModel;
