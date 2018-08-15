const mongoose              = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  avatar: { type: String, default: "../assets/default-avatar.jpg" },
  firstName: String,
  lastName: String,
  email: { type: String, unique: true, required: true },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  isAdmin: { type: Boolean, default: false }
});

// this adds some methods to our User
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
