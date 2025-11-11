const mongoose = require('mongoose');

// Session Enrollments Schema
const sessionEnrollment = new mongoose.Schema({
  session_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  enrollment_date: {
    type: Date,
    default: Date.now
  },
  progress_percentage: { // we calculate it using Σ Course_Progress / Σ Courses
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
});



// Create Model
const SessionEnrollment = mongoose.model('SessionEnrollment', sessionEnrollment);

// Export all models
module.exports = SessionEnrollment;
