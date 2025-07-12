
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
  reviews:{
    type: Number,
    default: 1,
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






// Create Models

const Session = mongoose.model('Session', session);


// Export all models
module.exports = Session;
