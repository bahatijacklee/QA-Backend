const asyncHandler = require('express-async-handler');
const TestPlan = require('../models/TestPlan');
const Project = require('../models/Project');

// @desc    Get all test plans
// @route   GET /api/testplans
// @access  Private
// Optionally filter by project_id
const getTestPlans = asyncHandler(async (req, res) => {
  const { project_id } = req.query;
  const filter = project_id ? { project_id } : {};
  const plans = await TestPlan.find(filter).populate('project_id', 'project_name').populate('uploaded_by_user_id', 'username email');
  res.json(plans);
});

// @desc    Get single test plan
// @route   GET /api/testplans/:id
// @access  Private
const getTestPlan = asyncHandler(async (req, res) => {
  const plan = await TestPlan.findById(req.params.id).populate('uploadedBy', 'username email');
  if (!plan) {
    res.status(404);
    throw new Error('Test plan not found');
  }
  res.json(plan);
});

// @desc    Create new test plan
// @route   POST /api/testplans
// @access  Private
const createTestPlan = asyncHandler(async (req, res) => {
  const { test_plan_name, project_id, expected_start_date, expected_end_date, description, status } = req.body;
  if (!test_plan_name || !project_id) {
    res.status(400);
    throw new Error('Test plan name and project are required');
  }
  const plan = await TestPlan.create({
    test_plan_name,
    project_id,
    expected_start_date,
    expected_end_date,
    description,
    status,
    uploaded_by_user_id: req.user._id,
    uploaded_on: new Date()
  });
  // Add to project
  await Project.findByIdAndUpdate(project_id, { $push: { test_plan_ids: plan._id } });
  res.status(201).json(plan);
});

// @desc    Update test plan
// @route   PUT /api/testplans/:id
// @access  Private
const updateTestPlan = asyncHandler(async (req, res) => {
  const plan = await TestPlan.findById(req.params.id);
  if (!plan) {
    res.status(404);
    throw new Error('Test plan not found');
  }
  if (plan.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
    res.status(403);
    throw new Error('Not authorized to update this test plan');
  }
  const updated = await TestPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// @desc    Delete test plan
// @route   DELETE /api/testplans/:id
// @access  Private
const deleteTestPlan = asyncHandler(async (req, res) => {
  const plan = await TestPlan.findById(req.params.id);
  if (!plan) {
    res.status(404);
    throw new Error('Test plan not found');
  }
  if (plan.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
    res.status(403);
    throw new Error('Not authorized to delete this test plan');
  }
  await plan.remove();
  res.json({ message: 'Test plan removed' });
});

module.exports = {
  getTestPlans,
  getTestPlan,
  createTestPlan,
  updateTestPlan,
  deleteTestPlan,
};
