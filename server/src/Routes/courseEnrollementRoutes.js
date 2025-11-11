
const express = require('express');
const router = express.Router();
const courseEnrollementController = require('../Controllers/courseEnrollementController');
const { protect, restrictTo } = require('../Middleware/auth');

// Enroll in a course (Student only)
// router.post('/course/:courseId/enroll', protect, restrictTo('student'), courseEnrollementController.enrollStudentInCourse);
router.get('/session/:sessionId/courses', protect, restrictTo('student'), courseEnrollementController.getMySessionCourses);
// Get all course enrollments for the logged-in student
router.get('/my-courses', protect, restrictTo('student'), courseEnrollementController.getMyCourseEnrollments);

// Get details of a specific course enrollment (Student only)
router.get('/courseenrollment/:enrollmentId', protect, restrictTo('student'), courseEnrollementController.getCourseEnrollmentDetails);

module.exports = router;