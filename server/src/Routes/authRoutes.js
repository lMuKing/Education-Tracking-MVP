
const express = require('express');
const router = express.Router();
const passport = require('passport');

const authController = require('../Controllers/authController');


// POST /api/auth/signup
router.post('/signup', authController.signup);


// POST /api/auth/login
router.post('/login', authController.login);

// POST /api/auth/logout
router.post('/logout', authController.logout);

// GET /api/auth/verify-email?token=abc123
router.get('/verify-email', authController.verifyEmail);

// POST /api/auth/resend-verification
router.post('/resend-verification', authController.resendVerificationEmail);


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] ,  session: false }));
 // When a user visit this url they are redirected to Google.
// The scope tells Google which user info you want: 'profile': full name, Google ID, etc. / 'email': user's primary email


// Google auth callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/api/auth/google/failure', session: false  }),
  (req, res) => {
    // Successful login
res.json({ message: 'Login successful', user: req.user });  }
);

// This route is the callback that Google calls after the user do google logs in.
// So Google will return user’s info here '/google/callback' .


// Failure route → read message
router.get('/google/failure', (req, res) => {
  res.status(400).json({ message: 'Google login failed Account already exists' });
});


router.post('/forgot-password',  authController.forgotPassword);
router.post('/reset-password/:token',  authController.resetPassword);









module.exports = router;
