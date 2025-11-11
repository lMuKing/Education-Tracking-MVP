

const express = require('express');
const router = express.Router();
const courseController = require('../Controllers/courseController');
const { protect,restrictTo,authorizeMentorBy_SessionId } = require('../Middleware/auth');



router.post('/session/:sessionId/createcourse/', protect,authorizeMentorBy_SessionId,restrictTo('Mentor'), courseController.createCourse);
router.get('/session/:sessionId/getCoursesBySession/', protect,authorizeMentorBy_SessionId,restrictTo('Mentor'), courseController.getCoursesBySession);

router.get('/session/:sessionId/getCourseById/:courseId/', protect,authorizeMentorBy_SessionId,restrictTo('Mentor'), courseController.getCourseById);

router.put('/session/:sessionId/updateCourse/:courseId/', protect,authorizeMentorBy_SessionId, restrictTo('Mentor'), courseController.updateCourse);

// Delete course
router.delete('/session/:sessionId/deleteCourse/:courseId/', protect,authorizeMentorBy_SessionId, restrictTo('Mentor'), courseController.deleteCourse);

module.exports = router;