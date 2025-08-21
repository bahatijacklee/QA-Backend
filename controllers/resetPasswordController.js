
const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const sendEmail = require('../utils/email');

// In-memory store for reset tokens (for demo; use DB or cache in production)
const resetTokens = {};

// @desc    Request password reset
// @route   POST /api/auth/request-reset
// @access  Public
const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  const token = crypto.randomBytes(32).toString('hex');
  resetTokens[token] = { userId: user._id, expires: Date.now() + 3600000 };
  // Send reset link via email
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
  await sendEmail(
    user.email,
    'Password Reset Request',
    `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password. This link is valid for 1 hour.</p>`
  );
  res.json({ message: 'Password reset link sent to your email.' });
});

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  const data = resetTokens[token];
  if (!data || data.expires < Date.now()) {
    res.status(400);
    throw new Error('Invalid or expired token');
  }
  const user = await User.findById(data.userId);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();
  delete resetTokens[token];
  res.json({ message: 'Password reset successful' });
});

module.exports = {
  requestPasswordReset,
  resetPassword,
};
