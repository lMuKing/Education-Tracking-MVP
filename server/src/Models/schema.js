
const mongoose = require('mongoose');


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
    enum: ['student','Parent', 'Mentor', 'admin'],
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
  reset_code: {
    type: String,
    default: null
  },
  reset_code_expires_at: {
    type: Date,
    default: null
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});


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
    required: true
  },
    student_id: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  max_students: {
    type: Number,
    default: 1,
    required: true
  },
  current_enrolled_count: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  timezone: {
    type: String,
    required: true
  },
  meeting_schedule: {
    type: Date,
    required: true
  },
  meeting_platform: {
    type: String,
    required: true
  },
  meeting_link: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});


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



// Courses Schema
const course = new mongoose.Schema({
  session_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: 'No description'
  },
  documents_url: { // upalod
    type: String,
    default: null
  },
  external_links: {
    type: [String],
    default: []
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});



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




// Homework Schema

const homework = new mongoose.Schema({
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'course',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  instructions: {
    type: String,
    default: ''
  },
  task_type: {
    type: String,
    enum: ['quiz', 'project'],
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  extended_deadline: {
    type: Date,
    default: null
  },
  late_submission_penalty: {
    type: Number,
    default: 0
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});



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



// Messages Schema
const messageSchema = new mongoose.Schema({
  session_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  edited_at: {
    type: Date,
    default: null
  },
  deleted_at: {
    type: Date,
    default: null
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});



// Announcements Schema
const announcementSchema = new mongoose.Schema({
  session_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  mentor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  announcement_type: {
    type: String,
    enum: ['general', 'urgent', 'reminder', 'assignment'],
    default: 'general'
  },
  published_at: {
    type: Date,
    default: Date.now
  },
  expires_at: {
    type: Date,
    default: null
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
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


