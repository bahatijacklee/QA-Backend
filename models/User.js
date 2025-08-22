const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone_number: {type: String},
  role: { type: String, enum: ['Tester', 'Lead', 'Admin'], default: 'Tester' },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  verificationTokenExpires: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
