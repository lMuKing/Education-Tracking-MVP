

// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const mentorController = require('../Controllers/mentorController');
const sessionEnrollmentController = require('../Controllers/sessionEnrollmentController');
const { protect,restrictTo } = require('../Middleware/auth');
const { uploadProfileImage } = require('../Middleware/upload');



router.get('/getprofile/', protect,restrictTo('Mentor') ,mentorController.getProfile);
router.put('/updateprofile/', protect,restrictTo('Mentor') ,mentorController.updateProfile);
router.put('/changepassword/', protect,restrictTo('Mentor') ,mentorController.changePassword);
router.put('/image/', protect,restrictTo('Mentor'), uploadProfileImage.single('profile_image'), mentorController.updateProfileImage);




module.exports = router;