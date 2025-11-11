
const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


// Users Schema

const user = new mongoose.Schema({
   // we use mongo db Default id
  full_name: {
    type: String,
    required: true,
    trim: true, // automatically removes spaces 
    maxlength: 255
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone_number: {
   type : Number,
   required:true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255
  },
  profile_image_url: {
    type: String,
    default: null
  },
  user_role: {
    type: String,
    enum: ['student','Parent', 'Mentor', 'Admin'],
    default: 'student',
    required: true, // NOT NULL
  },
  password_changed_at: {
    type: Date,
    default: null
  },
  email_verification_token: {
    type: String,
    default: null
  },
  google_id: {
    type: String,
    default: null
  },
  google_access_token: {
    type: String,
    default: null
  },
  google_refresh_token: {
    type: String,
    default: null
  },
  google_token_expiry: {
    type: Date,
    default: null
  },
  email_verification_expires: {
    type: Date,
    default: null
  },
  is_email_verified: {
    type: Boolean,
    default: false,
    required: true, // NOT NULL
  },
  reset_Password_Token: {
    type: String,
    default: null
  },
  reset_Password_expires_at: {
    type: Date,
    default: null
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});





// Create Model
const User = mongoose.model('User', user);


// Export model
module.exports = User;