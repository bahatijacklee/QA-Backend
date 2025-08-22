const mongoose = require('mongoose');

const defectSchema = new mongoose.Schema({
  defect_id: { type: String, unique: true },
  test_case_id: { type: mongoose.Schema.Types.ObjectId, ref: 'TestCase', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String },
  priority: { type: String },
  severity: { type: String },
  steps_to_reproduce: {type: String},
  expected_result: {type: String},
  actual_result: {type: String},
  attachments: {type: String},
  environment: {type: String},
  assigned_to_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reported_by_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date_reported: { type: Date, default: Date.now },
  remarks: {type: String}
}, { timestamps: true });

defectSchema.pre('save', async function(next) {
  if (!this.defect_id) {
    const date = new Date().toISOString().slice(0,10).replace(/-/g, '');
    const count = await this.constructor.countDocuments({}) + 1;
    this.defect_id = `BUG-${date}-${String(count).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Defect', defectSchema);
