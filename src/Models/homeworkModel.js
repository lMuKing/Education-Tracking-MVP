

const mongoose = require('mongoose');



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




// Create Models

const Homework = mongoose.model('Homework', homework);


// Export all models
module.exports = Homework;

