const mongoose = require("../utils/db");

const agentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  agencyId: String,
});

module.exports = mongoose.model("Agent", agentSchema);
