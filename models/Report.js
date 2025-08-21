const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  report_name: { type: String, required: true },
  report_type: { type: String, required: true },
  generated_by_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  generation_date: { type: Date, default: Date.now },
  link_to_file: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
