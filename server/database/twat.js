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
    replyingTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Twat' },
  });

  /**
   * @returns a Promise which resolves to an array of the user's Twats
   */
  twatSchema.statics.twatsByUser = function twatsByUser(userId) {
    return this.where({ userId }).exec();
  };

  /**
   * @param twatIds can be either a single Twat ID or an array of several
   *
   * @returns a Promise which resolves to the Twat object (or array of them),
   * with a new "user" prop added containing user info.
   */
  twatSchema.statics.getTwatsWithUser = async function getTwatsWithUser(twatIds) {
    try {
      if (Array.isArray(twatIds)) {
        /* Find multiple twats and attach corresponding User objects */
        const foundTwats = await this.find({ _id: { $in: twatIds } }).exec();
        if (foundTwats.length === 0) {
          console.error(`Error finding Twats with IDs: '${twatIds}'`);
          return null;
        }
        if (foundTwats.length !== twatIds.length) {
          console.warn(`Warning: Couldn't find all twats from list: ${twatIds}`);
        }

        /* Get corresponding users */
        const neededUsersIds = foundTwats.map(twat => twat.userId);
        const foundUsers = await User.find({ userId: { $in: neededUsersIds } }).exec();

        const resultUsers = foundUsers.map(user => user.toObject());

        /* Add .user property to each resultTwat */
        return foundTwats.map((twat) => {
          const finalTwat = twat.toObject();
          finalTwat.user = resultUsers.find(user => user.userId === finalTwat.userId);
          return finalTwat;
        });
      }

      /* Find single Twat and attach corresponding User object */
      const twat = await this.findById(twatIds).exec();
      if (twat === null) {
        console.error(`Error finding a Twat with ID '${twatIds}'`);
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
      console.error(`Error getting Twats with IDs: '${twatIds}'\n${err}`);
      return null;
    }
  };

  return mongoose.model('Twat', twatSchema);
}

const TwatModel = createTwatModel();

module.exports = TwatModel;
