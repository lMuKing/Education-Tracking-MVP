

// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const sessionController = require('../Controllers/sessionController');
const { protect,restrictTo,authorizeMentorBy_SessionId } = require('../Middleware/auth');





router.post('/sessionreq/', protect,restrictTo('Mentor') ,sessionController.sessionreq);
router.get('/getAllRequests/', protect,restrictTo('Mentor') ,sessionController.getAllRequests);
router.get('/getApprovedRequests/', protect,restrictTo('Mentor') ,sessionController.getApprovedRequests);

router.put('/sessionUpdate/:sessionId',protect,restrictTo('Mentor'), authorizeMentorBy_SessionId, sessionController.sessionUpdate);

// Get mentor's own sessions only (sessions where they are the mentor)
router.get('/getallsessions/', protect,restrictTo('Mentor') ,sessionController.getAllsessions);

// Browse ALL sessions in the system (accessible to all authenticated users)
router.get('/browsesessions/', protect, sessionController.browseSessions);

router.delete('/cancelreq/:requestId', protect, restrictTo('Mentor'), sessionController.cancelRequest);

/*
// In your main routes file or create routes/public.js
router.get('/public/sessions', async (req, res) => {
  try {
const Session = require('../Models/sessionModel');    const sessions = await Session.find()
      .populate('mentor_id', 'full_name')
      .sort({ createdAt: -1 });
    
    res.json({ sessions });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

*/
// Mentor gets join requests for their session
router.get('/join-requests/:sessionId/', protect, restrictTo('Mentor'),authorizeMentorBy_SessionId, sessionController.getSessionJoinRequests);

// Mentor reviews (approve/reject) a join request
router.put('/join-request/:sessionId/:requestId/review/', protect, restrictTo('Mentor'),authorizeMentorBy_SessionId, sessionController.reviewJoinRequest);
// Get all students enrolled in a session (for mentor)

router.get('/session/:sessionId/students', protect, restrictTo('Mentor'), sessionController.getSessionStudents);

module.exports = router;