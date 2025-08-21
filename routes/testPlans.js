const express = require('express');
const router = express.Router();
const {
  getTestPlans,
  getTestPlan,
  createTestPlan,
  updateTestPlan,
  deleteTestPlan
} = require('../controllers/testPlanController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getTestPlans).post(protect, createTestPlan);
router.route('/:id').get(protect, getTestPlan).put(protect, updateTestPlan).delete(protect, deleteTestPlan);

module.exports = router;
