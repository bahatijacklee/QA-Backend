const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/verifyToken');
const testCaseExecutionController = require('../controllers/testCaseExecutionController');

// All routes require authentication
router.get('/', protect, testCaseExecutionController.getTestSuites);
router.get('/:id', protect, testCaseExecutionController.getTestSuite);
router.post('/', protect, testCaseExecutionController.createTestSuite);
router.put('/:id', protect, testCaseExecutionController.updateTestSuite);
router.delete('/:id', protect, testCaseExecutionController.deleteTestSuite);

module.exports = router;
