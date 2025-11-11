// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/adminController');
const { uploadSessionImage } = require('../Middleware/upload');

const { protect,restrictTo,authorizeMentorById } = require('../Middleware/auth');

// Users Management Route 

router.get('/findusers_all/', protect,restrictTo('Admin') ,adminController.FindUsers_All);
router.get('/finduser_id/:id', protect,restrictTo('Admin') ,adminController.FindUsers_byID);
router.put('/update_role/:id', protect , restrictTo('Admin'),adminController.UpdateRoles);
router.delete('/deleteuser/:id', protect , restrictTo('Admin'),adminController.DeleteUser);

// Sessions Management Route 

router.post('/create_session/', protect, restrictTo('Admin'), uploadSessionImage, adminController.Create_Session);
router.get('/findsessions_all/',adminController.FindSessions_All);
router.get('/findsession_byid/:id', protect,restrictTo('Admin') ,adminController.FindSession_byID);
router.put('/updatesession/:id', protect, restrictTo('Admin'), uploadSessionImage, adminController.UpdateSession);
router.delete('/deletesession/:id', protect , restrictTo('Admin'),adminController.DeleteSession);
router.put('/approverequest/:id', protect , restrictTo('Admin'),adminController.ApproveRequest);
router.delete('/rejectrequest/:id', protect , restrictTo('Admin'),adminController.RejectRequest);


// Requests Management Route 

router.get('/getallrequests/', protect,restrictTo('Admin') ,adminController.getAllRequests);

// Announcements Management Route 
router.get('/announcements/', protect, restrictTo('Admin'), adminController.getAllAnnouncements);


module.exports = router;
