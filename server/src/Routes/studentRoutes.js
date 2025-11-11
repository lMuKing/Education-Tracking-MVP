const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../Middleware/auth');
const {
  getProfile,
  updateProfile,
  changePassword,
  updateProfileImage,
} = require('../Controllers/studentController');
const announcementsController = require('../Controllers/announcementsController');
const { uploadProfileImage } = require('../Middleware/upload');

router.get('/getprofile/', protect, restrictTo('student'), getProfile);
router.put('/updateprofile/', protect, restrictTo('student'), updateProfile);
router.put('/changepassword/', protect, restrictTo('student'), changePassword);
router.put('/image/', protect, restrictTo('student'), uploadProfileImage.single('profile_image'), updateProfileImage);

// Student - Get announcements for a specific session
router.get('/session/:sessionId/announcements/', protect, restrictTo('student'), announcementsController.getSessionAnnouncementsForStudent);





module.exports = router;