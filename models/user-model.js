const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  googleId: String,
  username: String,
  thumbnail: String,
  isAdmin: { type: Boolean, default: false },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
