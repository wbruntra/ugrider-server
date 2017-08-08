const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// creat local strategy
const localOptions = { usernameField: 'email'}
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
  // Try to verify user and password
  // if correct call done with user
  // otherwise call done without user
  User.findOne({ email: email }, function(err, user) {
    if (err) { return done(err);}
    if (!user) { return done(null, false); }

    // compare passwords
    user.comparePassword(password, function(err, isMatch) {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false); }

      return done(null, user);
    });

  })
});

// set up options on JwtStrategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// create jwt Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // See if user ID in payload exists in DB.
  // If so call 'done' with user
  // else call 'done' without user object

  User.findById(payload.sub, function(err, user) {
    if (err) { return done(err, false); }
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});


// tell passport to use Strategy
passport.use(jwtLogin);
