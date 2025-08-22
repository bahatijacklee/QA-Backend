const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  test_case_id: { type: String, unique: true },
  test_plan_id: { type: mongoose.Schema.Types.ObjectId, ref: 'TestPlan', required: true },
  requirement_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Requirement' },
  title: { type: String, required: true },
  preconditions: { type: String },
  test_steps: { type: String },
  test_data: { type: String },
  test_suite: {type: String},
  expected_results: { type: String },
  actual_results: { type: String },
  status: { type: String },
  test_type: { type: String, enum: ['Manual', 'Automated', 'Performance'], default: 'Manual' },
  executed_by_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  execution_date: { type: Date },
  remarks: { type: String },
  written_by_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  link_to_testplan: { type: String },
  defect_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Defect' }]
}, { timestamps: true });

testCaseSchema.pre('save', async function(next) {
  if (!this.test_case_id) {
    const date = new Date().toISOString().slice(0,10).replace(/-/g, '');
    const count = await this.constructor.countDocuments({}) + 1;
    this.test_case_id = `TC-${date}-${String(count).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('TestCase', testCaseSchema);
