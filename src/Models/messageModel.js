
const mongoose = require('mongoose');



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




// Create Model
const Message = mongoose.model('Message', messageSchema);


// Export all models
module.exports = Message;

