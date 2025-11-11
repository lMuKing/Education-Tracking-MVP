const mongoose = require('mongoose');

// Course Enrollment Schema
const CourseEnrollmentSchema = new mongoose.Schema({
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course', // Reference should match your model name (usually capitalized)
    required: true
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  progress_percentage: {  // we calculate it using Σ Homework_gread = N1 ||||   Σ homeworks * 20 = N2 |||    N2 --> 100 
                                                                                                   // |||    N1 --> ? = progress_percentage
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  final_grade: {   // we calculate it using Σ Homework_gread / Σ homeworks
    type: String,
    default: null,
    min: 0,
    max: 20
  }
});

// Export ONLY CourseEnrollment model
const CourseEnrollment = mongoose.model('CourseEnrollment', CourseEnrollmentSchema);
module.exports = CourseEnrollment;