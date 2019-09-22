// Going to deal with authentication
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/User");

//Instead of using app.get() like we did in app.js, use router.get() or router.post() to handle requests

//For /api/users/test, only have to use router.get('/test') here because /api/users is already handled in app.js

//res.json is similar to res.send (used to output hello world), but it outputs json

//This will output a 200 status, meaning 'everything's okay'
// 400 Status - validation error
// 404 Status - resource not found (ex: profile not found)

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Users works!" }));

// @route   GET api/users/register
// @desc    Register a user
// @access  Public
// We're going to expect a Post request
router.post("/register", (req, res) => {
  // We want to pull out 'errors' and 'isValid' from the validation function
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email })
    .then(user => {
      // if (!user.email || !user.password) {
      //   return res.send("Must include email and password");
      // }

      if (user) {
        errors.email = "Email already exists";
        return res.status(400).json(errors);
      } else {
        // Create a newUser object if email does not exist
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });

        // Use bcryptjs to hash the password before sending to DB
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            // Save newUser's password as the newly created hashed PW
            newUser.password = hash;
            // Mongoose method to save new PW
            newUser
              .save()
              // Gives us new user / send back successful response
              .then(user => res.json(user))
              // Throw error if needed
              .catch(err => console.log(err));
          });
        });
      }
    })
    .catch(console.log("User email:" + req.body.email));
});

// Use Mongoose to first find if the email exists
// Once we require User, we can use any Mongoose method inside of it
// findOne() is used to find a record that matches
// When we send data through a route through a Post request (ultimately through a form in the application), access it with 'req.body', then form input name ('email', for example)
// In order to use req.body, you have to import body-parser in server.js

// With Mongoose you can use Promises or Callbacks

// @route   GET api/users/login
// @desc    Login a user / return the JWT token
// @access  Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  //Find the user by email
  User.findOne({ email: email }).then(user => {
    //Check for user

    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }

    //Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched

        // Create JWT payload
        const payload = { id: user.id, name: user.name };

        //Sign token - jwt takes in multiple things:
        // 1) Payload (what we want to include in the token)
        // 2) Secret key (in keys.js file)
        // 3) Expiration definition (in object)
        // 4) Callback function
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
            // Once token is received, we place it in the header as an authorization - it goes to the server, the server verifies the user information and we can then use user info in our Express server
            // Passport will now be used to verify that token, and you can also make routes private
          }
        );
      } else {
        errors.password = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
// Specifies jwt Strategy, session false (not using session), then normal req, res callback - route is now protected
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // res.json({ msg: "Successful authentication!" });
    // After successful authentication, the user is now in req.user
    res.json({ id: req.user.id, name: req.user.name, email: req.user.email });
  }
);

module.exports = router;
