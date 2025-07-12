
const mongoose = require('mongoose');


//  Course Enrollment
const CourseEnrollment = new mongoose.Schema({
   course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'course',
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

  progress_percentage: { // we calculate it using final_grade * 100 / 20
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },

  final_grade: {   // we calculate it using Σ Homework_grade / Σ Homeworks
    type: String,
    default: null,
    min: 0,
    max: 20
  }
});



// Create Models
const User = mongoose.model('User', user);
const Session = mongoose.model('Session', session);
const SessionEnrollment = mongoose.model('SessionEnrollment', sessionEnrollment);
const Course = mongoose.model('Course', course);
const CourseEnrollmentModel = mongoose.model('CourseEnrollment', CourseEnrollment);
const Homework = mongoose.model('Homework', homework);
const HomeworkEnrollmentModel = mongoose.model('HomeworkEnrollment', HomeworkEnrollment);
const Message = mongoose.model('Message', messageSchema);
const Announcement = mongoose.model('Announcement', announcementSchema);

// Export all models
module.exports = {
  User,
  Session,
  SessionEnrollment,
  Course,
  CourseEnrollment: CourseEnrollmentModel,
  Homework,
  HomeworkEnrollment: HomeworkEnrollmentModel,
  Message,
  Announcement
};
