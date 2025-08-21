const mongoose = require('mongoose');

const testSuiteSchema = new mongoose.Schema({
  test_suite_name: { type: String, required: true },
  project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  start_date: { type: Date },
  end_date: { type: Date },
  assigned_to_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  test_case_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TestCase' }]
}, { timestamps: true });

module.exports = mongoose.model('TestSuite', testSuiteSchema);
