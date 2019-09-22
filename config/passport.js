// Summary of the steps in this config file:
// ExtractJWT allows us to extract the payload, which is the user data
// Specify that we're using a Bearer token
// Create a new JwtStrategy using those options, then callback will include the payload
// Once we have the payload - find that user, and validate it

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
// Mongoose allows us to search for the user that comes with the payload
const mongoose = require("mongoose");
// 'users' was defined in the export statement in the User.js User model (last line)
const User = mongoose.model("users");
const keys = require("../config/keys");

const options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = keys.secretOrKey;

// 'passport' was a parameter that was passed in (server.js) - require("./config/passport")(passport);
// JwtStrategy takes in options and returns a payload (which should include our user info), which was added in the payload inside users.js
module.exports = passport => {
  passport.use(
    new JwtStrategy(options, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then(user => {
          if (user) {
            // First parameter is an error (null because there isn't any), second is the user
            return done(null, user);
          }
          // If the user is not found, return false as the second paramater because there is no user
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
};

// The only way this is going to be used is if we specify it on a protected route
