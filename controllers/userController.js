const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  if (req.user.role !== 'Admin') {
    res.status(403);
    throw new Error('Not authorized as admin');
  }
  const users = await User.find().select('-password');
  res.json(users);
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  if (req.user.role !== 'Admin') {
    res.status(403);
    throw new Error('Not authorized as admin');
  }
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json(user);
});

// @desc    Update user role
// @route   PATCH /api/users/:id/role
// @access  Private/Admin
const updateUserRole = asyncHandler(async (req, res) => {
  if (req.user.role !== 'Admin') {
    res.status(403);
    throw new Error('Not authorized as admin');
  }
  const { role } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  user.role = role;
  await user.save();
  res.json(user);
});

module.exports = {
  getUsers,
  getUserById,
  updateUserRole,
};
