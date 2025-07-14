

const mongoose = require('mongoose');

// Sessions Schema
const session = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: 'No Description'
  },
  mentor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  reviews:{
    type: Number,
    default: 1,
    required: false
  },
  max_students: {
    type: Number,
    default: 0,
    required: false
  },
  current_enrolled_count: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Pending','active', 'completed', 'cancelled'],
    default: 'Pending'
  },
  timezone: {
    type: String,
    required: false
  },
  meeting_schedule: {
    type: Date,
    required: false
  },
  meeting_platform: {
    type: String,
    required: false
  },
  meeting_link: {
    type: String,
    required: false
  },
  duration: {
    type: Number, // in Days
    required: false
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});






// Create Models

const Session = mongoose.model('Session', session);


// Export all models
module.exports = Session;
