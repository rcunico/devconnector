// Going to deal with authentication
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

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
  User.findOne({ email: req.body.email }).then(user => {
    // if (!user.email || !user.password) {
    //   return res.send("Must include email and password");
    // }

    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      // Create a newUser object if email does not exist
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        pasword: req.body.password
      });

      // console.log(`Name: ${name}`);
      // console.log(`Email: ${email}`);
      // console.log(`PW: ${password}`);
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
  });
});

// Use Mongoose to first find if the email exists
// Once we require User, we can use any Mongoose method inside of it
// findOne() is used to find a record that matches
// When we send data through a route through a Post request (ultimately through a form in the application), access it with 'req.body', then form input name ('email', for example)
// In order to use req.body, you have to import body-parser in server.js

// With Mongoose you can use Promises or Callbacks

module.exports = router;
