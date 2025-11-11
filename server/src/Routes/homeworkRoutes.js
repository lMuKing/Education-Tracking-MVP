const express = require('express');
const router = express.Router();
const homeworkController = require('../Controllers/homeworkControllers');
const { protect, restrictTo,authorizeMentorBy_CourseId } = require('../Middleware/auth');

// Create new homework (Mentor only)
router.post('/course/:courseId/createhm', protect,authorizeMentorBy_CourseId, restrictTo('Mentor'), homeworkController.createHomework);

// Get all homework for a specific course
router.get('/course/:courseId/getallhm', protect,authorizeMentorBy_CourseId,restrictTo('Mentor'), homeworkController.getHomeworkByCourse);

// Get single homework by ID
router.get('/course/:courseId/:homeworkId/gethomeworkbyid', protect,authorizeMentorBy_CourseId,restrictTo('Mentor'), homeworkController.getHomeworkById);

// Update homework (Mentor only)
router.put('/course/:courseId/:homeworkId/update', protect,authorizeMentorBy_CourseId, restrictTo('Mentor'), homeworkController.updateHomework);

// Delete homework (Mentor only)
router.delete('/course/:courseId/:homeworkId/delete', protect,authorizeMentorBy_CourseId, restrictTo('Mentor'), homeworkController.deleteHomework);

// Get upcoming homework (due within next 7 days)
router.get('/course/:courseId/upcoming/list', protect,authorizeMentorBy_CourseId,restrictTo('Mentor'), homeworkController.getUpcomingHomework);

// Get homework by task type (with optional courseId query parameter)
router.get('/course/:courseId/type/:taskType', protect,authorizeMentorBy_CourseId,restrictTo('Mentor'), homeworkController.getHomeworkByType);

// Controller-based: Mentor grades homework and triggers progress update
router.put('/mentor/grade-homework/:homeworkEnrollmentId', protect, restrictTo('Mentor'), homeworkController.gradeHomework);

// Get all enrollments
router.get('/mentor/homework-enrollments', protect,restrictTo('Mentor'), homeworkController.getAllHomeworkEnrollments);

// Get one enrollment by its ID
router.get('/mentor/homework-enrollments/:enrollmentId', protect,restrictTo('Mentor'), homeworkController.getHomeworkEnrollmentById);

// Mentor: Get all submissions for a specific homework
router.get('/:homeworkId/submissions', protect, restrictTo('Mentor'), homeworkController.getHomeworkSubmissions);

// Mentor: Get a specific student's submission
router.get('/:homeworkId/student/:studentId/submission', protect, restrictTo('Mentor'), homeworkController.getStudentSubmission);

module.exports = router;