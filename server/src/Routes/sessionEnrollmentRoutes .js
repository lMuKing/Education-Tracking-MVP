
// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const sessionEnrollmentController = require('../Controllers/sessionEnrollmentController');
const { protect,restrictTo,authorizeStudentBy_SessionId, authorizeStudentBy_CourseId } = require('../Middleware/auth');




// --- SESSION JOIN REQUESTS ---

//getAll sessions
router.get('/getallsessions/', protect, sessionEnrollmentController.getAllSessions);

// Student sends join request
router.post('/join-request/:session_id', protect, restrictTo('student'), sessionEnrollmentController.sendJoinRequest);

// student gets their join requests
router.get('/join-requests', protect, restrictTo('student'), sessionEnrollmentController.getMyJoinRequests);


// student cancels their join request
router.delete('/join-request/:requestId/delete', protect, restrictTo('student'), sessionEnrollmentController.cancelJoinRequest);




// --- SESSION ENROLLMENTS ---

// student enrolls in a session (should only be allowed after approval)
 // router.post('/enroll/:session_id', protect, restrictTo('student'), sessionEnrollmentController.enrollInSession);

// student gets their enrollments
router.get('/enrollments', protect, restrictTo('student'), sessionEnrollmentController.getMyEnrollments);

// student gets details of a specific enrollment
router.get('/enrollment/:enrollmentId', protect, restrictTo('student'), sessionEnrollmentController.getEnrollmentDetails);

// student unenrolls from a session
router.delete('/unenrolls/:enrollmentId', protect, restrictTo('student'), sessionEnrollmentController.unenrollFromSession);


module.exports = router;