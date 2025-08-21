const mongoose = require('mongoose');

const requirementSchema = new mongoose.Schema({
  reqId: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  testPlan: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'TestPlan' }
}, { timestamps: true });

module.exports = mongoose.model('Requirement', requirementSchema);
