const mongoose = require("../utils/db");

const accountSchema = new mongoose.Schema({
  name: { type: String, required: true },
  csr: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Account", accountSchema);
