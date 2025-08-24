const express = require('express');
const router = express.Router();
const {
  getTestCases,
  getTestCase,
  createTestCase,
  updateTestCase,
  deleteTestCase
} = require('../controllers/testCaseController');
const { protect } = require('../middleware/verifyToken');

router.route('/').get(protect, getTestCases).post(protect, createTestCase);
router.route('/:id').get(protect, getTestCase).put(protect, updateTestCase).delete(protect, deleteTestCase);

module.exports = router;
