const mongoose = require('../utils/db');
const agentSchema = new mongoose.Schema({
  name: { type: String, required: true }
});
module.exports = mongoose.model('Agent', agentSchema);
