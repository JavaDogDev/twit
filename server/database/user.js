const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const SALT_WORK_FACTOR = 10;

function createUserModel() {
  const userSchema = mongoose.Schema({
    userId: { type: String, required: true, index: { unique: true } },
    username: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
    password: { type: String, required: true },
    following: [String],
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

  userSchema.methods.comparePassword = function compare(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      if (err) { return callback(err); }
      callback(null, isMatch);
    });
  };

  /**
   * @ returns User fields which are safe to expose to the webclient
   */
  userSchema.methods.getPublicInfo = function getPublicInfo() {
    return {
      username: this.username,
      displayName: this.displayName,
    };
  };

  return mongoose.model('User', userSchema);
}

const User = createUserModel();

module.exports = User;
