const express = require('express');
const router = express.Router();
const announcementsController = require('../Controllers/announcementsController');
const { protect,restrictTo,authorizeMentorBy_SessionId } = require('../Middleware/auth');



router.post('/session/:sessionId/createannouncement/', protect,authorizeMentorBy_SessionId,restrictTo('Mentor'), announcementsController.createAnnouncement);
router.get('/session/:sessionId/getannouncementins/', protect,authorizeMentorBy_SessionId,restrictTo('Mentor'), announcementsController.getAnnouncementsBySession);
router.get('/session/:sessionId/:announcementId/getannouncementbyid/', protect,authorizeMentorBy_SessionId,restrictTo('Mentor'), announcementsController.getAnnouncementById);
router.put('/session/:sessionId/:announcementId/updateannouncement/', protect,authorizeMentorBy_SessionId,restrictTo('Mentor'), announcementsController.updateAnnouncement);
router.delete('/session/:sessionId/:announcementId/deleteannouncement/', protect,authorizeMentorBy_SessionId,restrictTo('Mentor'), announcementsController.deleteAnnouncement);
router.get('/session/:sessionId/geturgentannouncements/', protect,authorizeMentorBy_SessionId,restrictTo('Mentor'), announcementsController.getUrgentAnnouncements);



module.exports = router;