const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Define our model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
});

// On save hook, encrypt pw

// Before saving a model, run a function
userSchema.pre('save', function(next) {
  // get access to user model
  const user = this;

  // generate a salt
  bcrypt.genSalt(10, function(err, salt) {
    if (err) {return next(err); }

    // hash (encrypt) password using salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(comparePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return callback(err); }

    callback(null, isMatch);
  });
}

// Create the model class
const ModelClass = mongoose.model('user', userSchema);


// export the model
module.exports = ModelClass;
