const mongoose = require("../utils/db");

const carrierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  companyName: String,
  categoryName: String,
});

module.exports = mongoose.model("Carrier", carrierSchema);
