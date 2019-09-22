const mongoose = require("mongoose");
const schema = mongoose.Schema;

// Create Schema
const UserSchema = new schema({
  name: {
    type: String,
    required: true,
    default: "John"
  },
  email: {
    type: String,
    required: true,
    default: "no email"
  },
  password: {
    type: String,
    required: true,
    default: "no password"
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model("users", UserSchema);
