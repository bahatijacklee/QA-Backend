const express = require('express');
const router = express.Router();
const { requestPasswordReset, resetPassword } = require('../controllers/resetPasswordController');

router.post('/request-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

module.exports = router;
