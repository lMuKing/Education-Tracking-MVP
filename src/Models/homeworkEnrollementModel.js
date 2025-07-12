
const mongoose = require('mongoose');




//  Homework Enrollment
const HomeworkEnrollment = new mongoose.Schema({
   course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'course',
    required: true
  },
   homework_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'homework',
    required: true
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  Homework_Solution: { // upload 
    type: String,
    default: null
  },
  Homework_grade: {
    type: String,
    default: null,
    min: 0,
    max: 20
  }
});



// Create Model
const HomeworkEnrollmentModel = mongoose.model('HomeworkEnrollment', HomeworkEnrollment);


// Export all models
module.exports = HomeworkEnrollment;

