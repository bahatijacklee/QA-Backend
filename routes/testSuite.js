const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/verifyToken');
const testSuiteController = require('../controllers/testSuiteController');

// All routes require authentication
router.get('/', protect, testSuiteController.getTestSuites);
router.get('/:id', protect, testSuiteController.getTestSuite);
router.post('/', protect, testSuiteController.createTestSuite);
router.put('/:id', protect, testSuiteController.updateTestSuite);
router.delete('/:id', protect, testSuiteController.deleteTestSuite);

module.exports = router;
