const express = require('express');
const router = express.Router();
const {
  getDefects,
  createDefect,
  updateDefectStatus,
  getDefect,
  updateDefect,
  deleteDefect
} = require('../controllers/defectController');
const { protect } = require('../middleware/verifyToken');


router.route('/').get(protect, getDefects).post(protect, createDefect);
router.route('/:id').get(protect, getDefect).put(protect, updateDefect).delete(protect, deleteDefect);
router.route('/:id/status').patch(protect, updateDefectStatus);

module.exports = router;
