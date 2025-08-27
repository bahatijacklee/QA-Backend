const mongoose = require('mongoose');

const requirementSchema = new mongoose.Schema({
  reqId: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  testPlan: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'TestPlan' },
  mainFeature: {type: String},
  featureSubsection: {type: String},
  remarks: {type: String},
  testStatus: {type: String, enum: ["Pass", "Fail"]},
  testcaseIds: {type: String},
}, { timestamps: true });

module.exports = mongoose.model('Requirement', requirementSchema);
