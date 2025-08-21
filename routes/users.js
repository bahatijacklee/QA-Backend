const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUserRole
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getUsers);
router.route('/:id').get(protect, getUserById);
router.route('/:id/role').patch(protect, updateUserRole);

module.exports = router;
