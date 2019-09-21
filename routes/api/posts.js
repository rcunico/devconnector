// Going to deal with authentication
const express = require("express");
const router = express.Router();

//Instead of using app.get() like we did in app.js, use router.get() or router.post() to handle requests

//For /api/users/test, only have to use router.get('/test') here because /api/users is already handled in app.js

//res.json is similar to res.send (used to output hello world), but it outputs json

//This will output a 200 status, meaning 'everything's okay'
// @route   GET api/posts/test
// @desc    Tests posts route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Posts works!" }));

module.exports = router;
