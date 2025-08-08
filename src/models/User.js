const mongoose = require("../utils/db");

const userSchema = new mongoose.Schema({
  firstName: String,
  gender: String,
  dob: Date,
  address: String,
  city: String,
  state: String,
  zip: String,
  phone: String,
  email: { type: String, unique: true },
  userType: String,
  accountType: String,
  applicantId: String, // From Applicant ID
});

module.exports = mongoose.model("User", userSchema);
