// models/Policy.js
const mongoose = require("../utils/db");

const policySchema = new mongoose.Schema({
  policy_number: { type: String, required: true },
  policy_mode: { type: String },
  policy_type: { type: String },
  producer: { type: String },
  premium_amount: { type: Number },
  premium_amount_written: { type: Number },
  policy_start_date: { type: Date },
  policy_end_date: { type: Date },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  lobId: { type: mongoose.Schema.Types.ObjectId, ref: "Lob", required: true },
  carrierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Carrier",
    required: true,
  },
});

module.exports = mongoose.model("Policy", policySchema);
