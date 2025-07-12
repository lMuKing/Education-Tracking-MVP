const mongoose = require('mongoose');



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




// Create Model
const Course = mongoose.model('Course', course);

// Export all models
module.exports = Course;

