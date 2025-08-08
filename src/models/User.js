// models/User.js
const mongoose = require('../utils/db');
const userSchema = new mongoose.Schema({
  firstName: String,
  dob: Date,
  address: String,
  phone: String,
  state: String,
  zip: String,
  email: { type: String, unique: true },
  gender: String,
  userType: String
});
module.exports = mongoose.model('User', userSchema);
