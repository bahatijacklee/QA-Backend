const mongoose = require('mongoose');

const testCaseExecution = new mongoose.Schema({
  test_suite_name: { type: String, required: true },
  project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  
  //statuses can be changed from the user once other statuses are given
  status: { type: String, enum: ['Passed', 'Failed', 'Blocked', 'In Progress'], default: 'In Progress' },
  start_date: { type: Date },
  end_date: { type: Date },
  bug_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Defect'},
  executed_by: {type:String},
  executed_date: {type: String},
  assigned_to_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  remarks: {type: String},
  test_case_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TestCase' }]
}, { timestamps: true });

module.exports = mongoose.models.TestCaseExecution || mongoose.model('TestCaseExecution', testCaseExecution);
