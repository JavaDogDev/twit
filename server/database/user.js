const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const SALT_WORK_FACTOR = 10;

function createUserModel() {
  const userSchema = mongoose.Schema({
    userId: { type: String, required: true, index: { unique: true } },
    username: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
    bio: { type: String, default: '' },
    password: { type: String, required: true, select: false },
    following: { type: [String], select: false },
  });

  userSchema.pre('save', function encryptPasswords(next) {
    const user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, (saltError, salt) => {
      if (saltError) return next(saltError);

      // hash the password along with our new salt
      bcrypt.hash(user.password, salt, (hashError, hash) => {
        if (hashError) return next(hashError);

        // override the cleartext password with the hashed one
        user.password = hash;
        next();
      });
    });
  });

  userSchema.methods.comparePassword = async function compare(candidatePassword, callback) {
    /* eslint-disable no-use-before-define */ // not actually an error here
    // Need to do this nasty thing because 'select: false' in model hides password field
    const { password } = await (User.findOne({ userId: this.userId })
      .select('password')
      .exec()
      .then(doc => doc.toObject())
      .catch(err => console.log(`Error getting actual password for userId '${this.userId}': ${err}`)));

    bcrypt.compare(candidatePassword, password, (err, isMatch) => {
      if (err) { return callback(err); }
      callback(null, isMatch);
    });
  };

  return mongoose.model('User', userSchema);
}

const User = createUserModel();

module.exports = User;
