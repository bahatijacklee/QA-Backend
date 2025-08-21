const express = require('express');
const router = express.Router();
const {
  getDefects,
  createDefect,
  updateDefectStatus
} = require('../controllers/defectController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getDefects).post(protect, createDefect);
router.route('/:id/status').patch(protect, updateDefectStatus);

module.exports = router;
