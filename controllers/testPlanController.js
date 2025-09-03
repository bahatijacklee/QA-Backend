const asyncHandler = require('express-async-handler');
const TestPlan = require('../models/TestPlan');
const Project = require('../models/Project');

// @desc    Get all test plans
// @route   GET /api/testplans
// @access  Private
// Optionally filter by project (now ObjectId reference)
const getTestPlans = asyncHandler(async (req, res) => {
  const { project } = req.query;
  const filter = project ? { project } : {};
  const plans = await TestPlan.find(filter)
    .populate('project', 'project_name')
    .populate('uploadedBy', 'username email');
  res.json(plans);
});

// @desc    Get single test plan
// @route   GET /api/testplans/:id
// @access  Private
const getTestPlan = asyncHandler(async (req, res) => {
  const plan = await TestPlan.findById(req.params.id)
    .populate('project', 'project_name')
    .populate('uploadedBy', 'username email');
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
  const { title, description, project, link, startDate, endDate, status } = req.body;
  if (!title || !project) {
    res.status(400);
    throw new Error('Test plan title and project are required');
  }
  const plan = await TestPlan.create({
    title,
    description,
    project,
    link,
    startDate,
    endDate,
    status,
    uploadedBy: req.user._id
  });
  // Add to project
  await Project.findByIdAndUpdate(project, { $push: { test_plan_ids: plan._id } });
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
  const updateFields = (({ title, description, project, link, startDate, endDate, status }) => ({ title, description, project, link, startDate, endDate, status }))(req.body);
  const updated = await TestPlan.findByIdAndUpdate(req.params.id, updateFields, { new: true });
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
  // Remove from project
  await Project.findByIdAndUpdate(plan.project, { $pull: { test_plan_ids: plan._id } });
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
