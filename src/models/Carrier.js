const mongoose = require('../utils/db');
const carrierSchema = new mongoose.Schema({
  name: { type: String, required: true }
});
module.exports = mongoose.model('Carrier', carrierSchema);
