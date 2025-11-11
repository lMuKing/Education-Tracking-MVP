

const mongoose = require('mongoose');


const sRequestModel = new mongoose.Schema({
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
  request_message: {
    type: String,
    maxlength: 500,
    default: 'I would like to join this session.'
  },
  isApproved: {
    type: Boolean,
    default: null
  },
  rejection_count: {
    type: Number,
    default: 0
  },
  requested_at: {
    type: Date,
  },  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});


sRequestModel.index({ session_id: 1, student_id: 1 }, { unique: true });


const SessionJoinRequest = mongoose.model('SessionJoinRequest', sRequestModel);
module.exports = SessionJoinRequest;