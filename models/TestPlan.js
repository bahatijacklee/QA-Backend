const mongoose = require('mongoose');

const testPlanSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  project: { type: String, required: true },
  link: { type: String, required: true},
  startDate: { type: Date },
  endDate: { type: Date },
  status: { type: String, enum: ['Draft', 'In Progress', 'Completed'], default: 'Draft' },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('TestPlan', testPlanSchema);
