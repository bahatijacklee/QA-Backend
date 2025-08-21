const asyncHandler = require('express-async-handler');
const TestCase = require('../models/TestCase');

// @desc    Get all test cases
// @route   GET /api/testcases
// @access  Private
// Optionally filter by test_plan_id
const getTestCases = asyncHandler(async (req, res) => {
  const { test_plan_id } = req.query;
  const filter = test_plan_id ? { test_plan_id } : {};
  const cases = await TestCase.find(filter)
    .populate('test_plan_id', 'test_plan_name')
    .populate('executed_by_user_id', 'username email');
  res.json(cases);
});

// @desc    Get single test case
// @route   GET /api/testcases/:id
// @access  Private
const getTestCase = asyncHandler(async (req, res) => {
  const testCase = await TestCase.findById(req.params.id)
    .populate('createdBy', 'username email')
    .populate('relatedRequirement', 'reqId description');
  if (!testCase) {
    res.status(404);
    throw new Error('Test case not found');
  }
  res.json(testCase);
});

// @desc    Create new test case
// @route   POST /api/testcases
// @access  Private
const createTestCase = asyncHandler(async (req, res) => {
  const { test_plan_id, title, preconditions, test_steps, test_data, expected_results, actual_results, status, test_type, executed_by_user_id, execution_date, remarks, written_by_user_id, related_requirement_id, defect_ids } = req.body;
  if (!test_plan_id || !title) {
    res.status(400);
    throw new Error('Test plan and title are required');
  }
  const testCase = await TestCase.create({
    test_plan_id,
    title,
    preconditions,
    test_steps,
    test_data,
    expected_results,
    actual_results,
    status,
    test_type,
    executed_by_user_id,
    execution_date,
    remarks,
    written_by_user_id: written_by_user_id || req.user._id,
    related_requirement_id,
    defect_ids
  });
  res.status(201).json(testCase);
});

// @desc    Update test case
// @route   PUT /api/testcases/:id
// @access  Private
const updateTestCase = asyncHandler(async (req, res) => {
  const testCase = await TestCase.findById(req.params.id);
  if (!testCase) {
    res.status(404);
    throw new Error('Test case not found');
  }
  if (testCase.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
    res.status(403);
    throw new Error('Not authorized to update this test case');
  }
  const updated = await TestCase.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// @desc    Delete test case
// @route   DELETE /api/testcases/:id
// @access  Private
const deleteTestCase = asyncHandler(async (req, res) => {
  const testCase = await TestCase.findById(req.params.id);
  if (!testCase) {
    res.status(404);
    throw new Error('Test case not found');
  }
  if (testCase.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
    res.status(403);
    throw new Error('Not authorized to delete this test case');
  }
  await testCase.remove();
  res.json({ message: 'Test case removed' });
});

module.exports = {
  getTestCases,
  getTestCase,
  createTestCase,
  updateTestCase,
  deleteTestCase,
};
