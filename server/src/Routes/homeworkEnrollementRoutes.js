const express = require('express');
const router = express.Router();
const homeworkEnrollementController = require('../Controllers/homeworkEnrollementController');
const { protect, restrictTo } = require('../Middleware/auth');
const { uploadHomeworkSubmission } = require('../Middleware/upload');

router.get('/course/:courseId/homeworks', protect,restrictTo('student'), homeworkEnrollementController.getHomeworksByCourse);

// Student enrolls in homework
router.post('/enroll/:homeworkId', protect, restrictTo('student'), homeworkEnrollementController.enrollInHomework);

// Student gets all their enrolled homeworks
router.get('/my-homeworks', protect, restrictTo('student'), homeworkEnrollementController.getMyHomeworks);

// Student get it enrolled homework

router.get('/my-homework/:homeworkId', protect, restrictTo('student'), homeworkEnrollementController.getMyHomeworkById);

// Student submits homework solution (multiple images allowed)
router.post(
  '/submit/:homeworkId',
  protect,
  restrictTo('student'),
  uploadHomeworkSubmission,
  homeworkEnrollementController.submitHomeworkSolution
);

module.exports = router;