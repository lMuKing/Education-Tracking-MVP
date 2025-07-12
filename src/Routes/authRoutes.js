
const express = require('express');
const router = express.Router();


const authController = require('../Controllers/authController');


// POST /api/auth/signup
router.post('/signup', authController.signup);


// POST /api/auth/login
router.post('/login', authController.login);


// GET /api/auth/verify-email?token=abc123
router.get('/verify-email', authController.verifyEmail);

// POST /api/auth/resend-verification
router.post('/resend-verification', authController.resendVerificationEmail);




module.exports = router;
