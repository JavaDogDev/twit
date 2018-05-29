const mongoose = require('mongoose');
const User = require('./user');

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
   * @returns a Promise which resolves to an array of the user's Twats
   */
  twatSchema.statics.twatsByUser = function twatsByUser(userId) {
    return this.where({ userId }).exec();
  };

  /**
   * @returns a Promise which resolves to the Twat object,
   * with a new "user" prop added containing user info.
   */
  twatSchema.statics.getTwatWithUser = async function getTwatWithUser(twatId) {
    try {
      const twat = await this.findById(twatId).exec();
      if (twat === null) {
        console.error(`Error finding a Twat with ID '${twatId}'`);
        return null;
      }

      const user = await User.findOne({ userId: twat.userId }).exec();
      if (user === null) {
        console.error(`Error finding user with ID: ${twat.userId}`);
        return null;
      }

      // Embed user data into Twat
      const resultTwat = twat.toObject();
      resultTwat.user = user;

      return resultTwat;
    } catch (err) {
      console.error(`Error getting Twat with ID '${twatId}'\n${err}`);
      return null;
    }
  };

  return mongoose.model('Twat', twatSchema);
}

const TwatModel = createTwatModel();

module.exports = TwatModel;
