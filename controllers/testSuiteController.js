const asyncHandler = require('express-async-handler');
const TestSuite = require('../models/TestSuite');
const TestCase = require('../models/TestCase');

// Get all test suites (optionally filter by project)
const getTestSuites = asyncHandler(async (req, res) => {
  const { project_id } = req.query;
  const filter = project_id ? { project_id } : {};
  const suites = await TestSuite.find(filter)
    .populate('project_id', 'name')
    .populate('assigned_to_user_id', 'username email')
    .populate('test_case_ids', 'title status')
    .populate('bug_id', 'title status');
  res.json(suites);
});

// Get a single test suite
const getTestSuite = asyncHandler(async (req, res) => {
  const suite = await TestSuite.findById(req.params.id)
    .populate('project_id', 'name')
    .populate('assigned_to_user_id', 'username email')
    .populate('test_case_ids', 'title status')
    .populate('bug_id', 'title status');
  if (!suite) {
    res.status(404);
    throw new Error('Test suite not found');
  }
  res.json(suite);
});

// Create a new test suite
const createTestSuite = asyncHandler(async (req, res) => {
  const { test_suite_name, project_id, start_date, end_date, bug_id, executed_by, executed_date, assigned_to_user_id, test_case_ids } = req.body;
  if (!test_suite_name || !project_id || !test_case_ids || !Array.isArray(test_case_ids) || test_case_ids.length === 0) {
    res.status(400);
    throw new Error('Test suite name, project, and at least one test case are required');
  }
  // Optionally: Validate test_case_ids exist
  const testCases = await TestCase.find({ _id: { $in: test_case_ids } });
  if (testCases.length !== test_case_ids.length) {
    res.status(400);
    throw new Error('One or more test cases not found');
  }
  const suite = await TestSuite.create({
    test_suite_name,
    project_id,
    start_date,
    end_date,
    bug_id,
    executed_by,
    executed_date,
    assigned_to_user_id,
    test_case_ids
  });
  res.status(201).json(suite);
});

// Update a test suite
const updateTestSuite = asyncHandler(async (req, res) => {
  const suite = await TestSuite.findById(req.params.id);
  if (!suite) {
    res.status(404);
    throw new Error('Test suite not found');
  }
  Object.assign(suite, req.body);
  await suite.save();
  res.json(suite);
});

// Delete a test suite
const deleteTestSuite = asyncHandler(async (req, res) => {
  const suite = await TestSuite.findById(req.params.id);
  if (!suite) {
    res.status(404);
    throw new Error('Test suite not found');
  }
  await suite.remove();
  res.json({ message: 'Test suite deleted' });
});

module.exports = {
  getTestSuites,
  getTestSuite,
  createTestSuite,
  updateTestSuite,
  deleteTestSuite
};
