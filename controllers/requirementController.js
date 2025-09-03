const Requirement = require('../models/Requirement');
const TestPlan = require('../models/TestPlan');

// Create a new Requirement (RTM entry) for a TestPlan
exports.createRequirement = async (req, res) => {
  try {
    const { reqId, description, testPlan, mainFeature, featureSubsection, remarks, testStatus, testcaseIds } = req.body;
    if (!reqId || !description || !testPlan) {
      return res.status(400).json({ message: 'reqId, description, and testPlan are required' });
    }
    // Ensure the testPlan exists
    const plan = await TestPlan.findById(testPlan);
    if (!plan) {
      return res.status(404).json({ message: 'TestPlan not found' });
    }
    const requirement = new Requirement({
      reqId,
      description,
      testPlan,
      mainFeature,
      featureSubsection,
      remarks,
      testStatus,
      testcaseIds
    });
    await requirement.save();
    res.status(201).json(requirement);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all requirements for a test plan (RTM for a test plan)
exports.getRequirementsByTestPlan = async (req, res) => {
  try {
    const { testPlanId } = req.params;
    const requirements = await Requirement.find({ testPlan: testPlanId });
    res.status(200).json(requirements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single requirement by ID
exports.getRequirement = async (req, res) => {
  try {
    const requirement = await Requirement.findById(req.params.id);
    if (!requirement) return res.status(404).json({ message: 'Requirement not found' });
    res.status(200).json(requirement);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a requirement
exports.updateRequirement = async (req, res) => {
  try {
    const updated = await Requirement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Requirement not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a requirement
exports.deleteRequirement = async (req, res) => {
  try {
    const deleted = await Requirement.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Requirement not found' });
    res.status(200).json({ message: 'Requirement deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
