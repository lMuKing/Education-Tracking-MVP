const SessionEnrollment = require('../Models/sessionEnrollmentModel');
const Session = require('../Models/sessionModel');
const User = require('../Models/userModel');
const SessionJoinRequest = require('../Models/sRequestModel');


// Requests System


// READ - Get all sessions (for students to browse before sending join requests)
exports.getAllSessions = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const sessions = await Session.find({})
      .populate('mentor_id', 'full_name email profile_image_url')
      .sort({ start_date: 1 })

    const total = await Session.countDocuments();

    res.status(200).json({
      msg: 'All sessions retrieved successfully',
      sessions,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / limit),
        total_sessions: total,
        has_next: page * limit < total,
        has_prev: page > 1
      }
    });
  } catch (err) {
    console.error(' Get all sessions error:', err);
    res.status(500).json({ msg: 'Failed to retrieve sessions', error: err.message });
  }
};




// CREATE - Student sends join request
exports.sendJoinRequest = async (req, res) => {
  try {
    const studentId = req.user._id;
    const  session_id  = req.params.session_id;
    const currentDate = new Date();


    // Validation
    if (!session_id) {
      return res.status(400).json({ msg: 'Session ID is required' });
    }

    // Check if session exists
    const session = await Session.findById(session_id)
    if (!session) {
      return res.status(404).json({ msg: 'Session not found' });
    }


    // Check if student is already enrolled
    const existingEnrollment = await SessionEnrollment.findOne({ 
      session_id, 
      student_id: studentId 
    });
    if (existingEnrollment) {
      return res.status(400).json({ msg: 'You are already enrolled in this session' });
    }

    // Check if request already exists (but allow re-requesting after rejection)
    const existingRequest = await SessionJoinRequest.findOne({ 
      session_id, 
      student_id: studentId 
    });

    if (existingRequest) {
      // If the request was rejected, check rejection count
      if (existingRequest.isApproved === false) {
        const rejectionCount = existingRequest.rejection_count || 0;
        
        // Block if rejected 2 or more times
        if (rejectionCount >= 2) {
          return res.status(403).json({ 
            msg: 'You have been rejected 2 times for this session and cannot request again',
            rejection_count: rejectionCount,
            rejected_at: existingRequest.reviewed_at,
            reason: existingRequest.review_message || 'No reason provided'
          });
        }
        
        // If rejected less than 2 times, delete old request and allow new one
        await SessionJoinRequest.findByIdAndDelete(existingRequest._id);
      } 
      // If pending (null) or approved (true), block duplicate request
      else {
        const status = existingRequest.isApproved === true ? 'approved' : 'pending';
        return res.status(400).json({ 
          msg: `You already have a ${status} request for this session`,
          existing_request: {
            status: status,
            requested_at: existingRequest.requested_at,
            review_message: existingRequest.review_message
          }
        });
      }
    }


    // Create join request
    const joinRequest = new SessionJoinRequest({
      session_id,
      student_id: studentId,
      requested_at: currentDate
    });

    await joinRequest.save();

    // Populate request data for response
    const populatedRequest = await SessionJoinRequest.findById(joinRequest._id)
      .populate('session_id', 'title description start_date end_date')
      .populate('student_id', 'full_name')

    res.status(201).json({
      msg: 'Join request sent successfully',
      request: populatedRequest,
      note: 'Your request has been sent to the mentor for approval'
    });

  } catch (err) {
    console.error('Send join request error:', err);
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'You already have a request for this session' });
    }
    res.status(500).json({ msg: 'Failed to send join request', error: err.message });
  }
};





// READ - Get student's join requests
exports.getMyJoinRequests = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { status, page = 1, limit = 10 } = req.query;


    // Build query
    let query = { student_id: studentId };
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      query.status = status;
    }

    const requests = await SessionJoinRequest.find(query)
      .populate('session_id', 'title description start_date end_date mentor_id')
      .populate({
        path: 'session_id',
        populate: {
          path: 'mentor_id',
          select: 'full_name email'
        }
      })


    res.status(200).json({
      msg: 'Join requests retrieved successfully',
      requests,

    });

  } catch (err) {
    console.error('❌ Get join requests error:', err);
    res.status(500).json({ msg: 'Failed to retrieve join requests', error: err.message });
  }
};






// DELETE - Cancel join request (for students)
exports.cancelJoinRequest = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { requestId } = req.params;


    const joinRequest = await SessionJoinRequest.findOne({
      _id: requestId,
      student_id: studentId
    }).populate('session_id', 'title');

    if (!joinRequest) {
      return res.status(404).json({ msg: 'Join request not found' });
    }

    // Only allow canceling pending requests (isApproved = null means pending)
    if (joinRequest.isApproved !== null) {
      const status = joinRequest.isApproved ? 'approved' : 'rejected';
      return res.status(400).json({ 
        msg: `Cannot cancel a ${status} request`,
        current_status: status
      });
    }

    await SessionJoinRequest.findByIdAndDelete(requestId);

    res.status(200).json({
      msg: 'Join request canceled successfully',
      canceled_request: {
        session_title: joinRequest.session_id.title,
        requested_at: joinRequest.requested_at
      }
    });

  } catch (err) {
    console.error('❌ Cancel join request error:', err);
    res.status(500).json({ msg: 'Failed to cancel join request', error: err.message });
  }
};




// READ - Get student's enrollments
exports.getMyEnrollments = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { page = 1, limit = 10 } = req.query;


    const enrollments = await SessionEnrollment.find({ student_id: studentId })
      .populate('session_id', 'title description start_date end_date mentor_id')
      .populate({
        path: 'session_id',
        populate: {
          path: 'mentor_id',
          select: 'full_name email'
        }
      })
      .sort({ enrollment_date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await SessionEnrollment.countDocuments({ student_id: studentId });

    res.status(200).json({
      msg: 'Enrollments retrieved successfully',
      enrollments,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / limit),
        total_enrollments: total,
        has_next: page * limit < total,
        has_prev: page > 1
      }
    });

  } catch (err) {
    console.error('❌ Get enrollments error:', err);
    res.status(500).json({ msg: 'Failed to retrieve enrollments', error: err.message });
  }
};



// READ - Get specific enrollment details
exports.getEnrollmentDetails = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { enrollmentId } = req.params;

    const enrollment = await SessionEnrollment.findOne({
      _id: enrollmentId,
      student_id: studentId
    })
      .populate('session_id', 'title description start_date end_date mentor_id')
      .populate({
        path: 'session_id',
        populate: {
          path: 'mentor_id',
          select: 'full_name email phone_number'
        }
      })
      .populate('student_id', 'full_name email');

    if (!enrollment) {
      return res.status(404).json({ msg: 'Enrollment not found' });
    }

    res.status(200).json({
      msg: 'Enrollment details retrieved successfully',
      enrollment
    });

  } catch (err) {
    console.error('❌ Get enrollment details error:', err);
    res.status(500).json({ msg: 'Failed to retrieve enrollment details', error: err.message });
  }
};




// DELETE - Unenroll from session
exports.unenrollFromSession = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { enrollmentId } = req.params;


    const enrollment = await SessionEnrollment.findOne({
      _id: enrollmentId,
      student_id: studentId
    }).populate('session_id', 'title start_date');

    if (!enrollment) {
      return res.status(404).json({ msg: 'Enrollment not found' });
    }

    // Check if session has already started (optional business rule)
    const currentDate = new Date('2025-08-01T11:08:02Z');
    if (enrollment.session_id.start_date && new Date(enrollment.session_id.start_date) < currentDate) {
      return res.status(400).json({ 
        msg: 'Cannot unenroll from a session that has already started' 
      });
    }

    await SessionEnrollment.findByIdAndDelete(enrollmentId);

    // Decrement current_enrolled_count in the session
    await Session.findByIdAndUpdate(
      enrollment.session_id._id,
      { $inc: { current_enrolled_count: -1 } }
    );

    res.status(200).json({
      msg: 'Successfully unenrolled from session',
      unenrolled_session: {
        title: enrollment.session_id.title,
        enrollment_date: enrollment.enrollment_date
      }
    });

  } catch (err) {
    console.error('❌ Unenrollment error:', err);
    res.status(500).json({ msg: 'Unenrollment failed', error: err.message });
  }
};



