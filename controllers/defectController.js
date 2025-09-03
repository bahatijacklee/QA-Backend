const asyncHandler = require('express-async-handler');
const Defect = require('../models/Defect');

// @desc    Get a single defect
// @route   GET /api/defects/:id
// @access  Private
const getDefect = asyncHandler(async (req, res) => {
  const defect = await Defect.findById(req.params.id)
    .populate('test_case_id', 'test_case_id title')
    .populate('reported_by_user_id', 'username email')
    .populate('assigned_to_user_id', 'username email');
  if (!defect) {
    res.status(404);
    throw new Error('Defect not found');
  }
  res.json(defect);
});

// @desc    Update a defect (full update)
// @route   PUT /api/defects/:id
// @access  Private
const updateDefect = asyncHandler(async (req, res) => {
  const defect = await Defect.findById(req.params.id);
  if (!defect) {
    res.status(404);
    throw new Error('Defect not found');
  }
  Object.assign(defect, req.body);
  await defect.save();
  res.json(defect);
});

// @desc    Delete a defect
// @route   DELETE /api/defects/:id
// @access  Private
const deleteDefect = asyncHandler(async (req, res) => {
  const defect = await Defect.findById(req.params.id);
  if (!defect) {
    res.status(404);
    throw new Error('Defect not found');
  }
  await defect.remove();
  res.json({ message: 'Defect deleted' });
});

// @desc    Get all defects
// @route   GET /api/defects
// @access  Private
// Optionally filter by test_case_id
const getDefects = asyncHandler(async (req, res) => {
  const { test_case_id } = req.query;
  const filter = test_case_id ? { test_case_id } : {};
  const defects = await Defect.find(filter)
    .populate('test_case_id', 'test_case_id title')
    .populate('reported_by_user_id', 'username email')
    .populate('assigned_to_user_id', 'username email');
  res.json(defects);
});

// @desc    Create a defect
// @route   POST /api/defects
// @access  Private
const createDefect = asyncHandler(async (req, res) => {
  const { test_case_id, title, description, status, priority, assigned_to_user_id } = req.body;
  if (!test_case_id || !title || !description) {
    res.status(400);
    throw new Error('Test case, title, and description are required');
  }
  const defect = await Defect.create({
    test_case_id,
    title,
    description,
    status,
    priority,
    assigned_to_user_id,
    reported_by_user_id: req.user._id,
    date_reported: new Date()
  });
  res.status(201).json(defect);
});

// @desc    Update defect status
// @route   PATCH /api/defects/:id/status
// @access  Private
const updateDefectStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const defect = await Defect.findById(req.params.id);
  if (!defect) {
    res.status(404);
    throw new Error('Defect not found');
  }
  defect.status = status;
  await defect.save();
  res.json(defect);
});

module.exports = {
  getDefects,
  createDefect,
  updateDefectStatus,
  getDefect,
  updateDefect,
  deleteDefect,
};
