// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/adminController');
const { protect,restrictTo } = require('../Middleware/auth');

// Route to find user by ID
router.get('/FindUser_ID/:id', protect,restrictTo('Admin') ,adminController.FindUsers_byID);



module.exports = router;
