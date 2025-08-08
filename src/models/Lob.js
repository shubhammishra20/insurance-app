const mongoose = require('../utils/db');
const lobSchema = new mongoose.Schema({
  name: { type: String, required: true }
});
module.exports = mongoose.model('Lob', lobSchema);
