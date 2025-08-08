const mongoose = require('../utils/db');
const policySchema = new mongoose.Schema({
  policyNumber: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  lobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lob', required: true },
  carrierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Carrier', required: true }
});
module.exports = mongoose.model('Policy', policySchema);
