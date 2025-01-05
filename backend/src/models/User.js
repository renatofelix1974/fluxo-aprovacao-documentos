const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // existing fields
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  // existing fields
});

module.exports = mongoose.model('User', userSchema);
