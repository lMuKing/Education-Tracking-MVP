const mongoose = require('mongoose');

const request = new mongoose.Schema({
  mentor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  session_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
      required: true
    },
  message: {
    type: String,
    required: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Request', request);




