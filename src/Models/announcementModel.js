
const mongoose = require('mongoose');



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




// Create Model
const Announcement = mongoose.model('Announcement', announcementSchema);

// Export all models
module.exports = Announcement;
