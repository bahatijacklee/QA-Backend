const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  project_name: { type: String, required: true },
  start_date: { type: Date },
  end_date: { type: Date },
  test_plan_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TestPlan' }]
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
