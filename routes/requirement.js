const express = require('express');
const router = express.Router();
const requirementController = require('../controllers/requirementController');

// Create a new requirement (RTM entry) for a test plan
router.post('/', requirementController.createRequirement);

// Get all requirements for a test plan (RTM for a test plan)
router.get('/testplan/:testPlanId', requirementController.getRequirementsByTestPlan);

// Get a single requirement by ID
router.get('/:id', requirementController.getRequirement);

// Update a requirement
router.put('/:id', requirementController.updateRequirement);

// Delete a requirement
router.delete('/:id', requirementController.deleteRequirement);

module.exports = router;
