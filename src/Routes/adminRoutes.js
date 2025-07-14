// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/adminController');
const { protect,restrictTo } = require('../Middleware/auth');

// Users Management Route 

router.get('/FindUsers_All/', protect,restrictTo('Admin') ,adminController.FindUsers_All);
router.get('/FindUser_ID/:id', protect,restrictTo('Admin') ,adminController.FindUsers_byID);
router.put('/Update_Role/', protect , restrictTo('Admin'),adminController.UpdateRoles);
router.delete('/DeleteUser/:id', protect , restrictTo('Admin'),adminController.DeleteUser);

// Sessions Management Route 

router.post('/Create_Session/', protect,restrictTo('Admin') ,adminController.Create_Session);
router.get('/FindSessions_All/', protect,restrictTo('Admin') ,adminController.FindSessions_All);
router.get('/FindSession_byID/:id', protect,restrictTo('Admin') ,adminController.FindSession_byID);






module.exports = router;
