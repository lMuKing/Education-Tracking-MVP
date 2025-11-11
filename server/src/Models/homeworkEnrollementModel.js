
const mongoose = require('mongoose');




//  Homework Enrollment
const HomeworkEnrollment = new mongoose.Schema({
   course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
   homework_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Homework',
    required: true
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  submission_images: [{ // Array of Cloudinary image URLs
    type: String
  }],
  submission_status: {
    type: String,
    enum: ['pending', 'submitted', 'graded'],
    default: 'pending'
  },
  submitted_at: {
    type: Date,
    default: null
  },
  Homework_grade: { // the mentor update it
    type: Number,
    default: null,
    min: 0,
    max: 20
  }
});






// Create Model
const HomeworkEnrollmentModel = mongoose.model('HomeworkEnrollment', HomeworkEnrollment);


// Export all models
module.exports = HomeworkEnrollmentModel;
