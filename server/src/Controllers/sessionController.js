

const User = require('../Models/userModel');
const Session = require('../Models/sessionModel');
const Request = require('../Models/requestModel')
const SessionJoinRequest = require('../Models/sRequestModel');
const SessionEnrollment = require('../Models/sessionEnrollmentModel');
const CourseEnrollment = require('../Models/courseEnrollement');
const Course = require('../Models/courseModel'); // Adjust the path if needed
const { measureAsync } = require('../Middleware/performanceMonitor');


// session management request:


exports.sessionreq = async (req,res) => {

try{

const { session_id, message } = req.body;
    const mentorId = req.user.id; 

     if (!mentorId) return res.status(400).json({ msg: 'Mentor ID is required' });
     if (!session_id) return res.status(400).json({ msg: 'session ID is required' });
     if (!message) return res.status(400).json({ msg: 'session ID is required' });



    const newRequest = new Request({
      mentor_id: mentorId,
      session_id,
      message
    });

    await newRequest.save();

    res.status(201).json({ message: 'Request sent to admin.' });

}catch(err){

 res.status(500).json({ msg: 'Request failed', error: err.message });
}
}



exports.getAllRequests = async (req,res) => {

try{

    const mentorId = req.user.id; // assuming the logged-in mentor's ID is in req.user

    const requests = await Request.find({ mentorId });



    const Requests = await Request.find();

    if (!Requests || Requests.length === 0) {
      return res.status(404).json({ msg: 'No Requests found' });
    }

    const formattedRequests = Requests.map(Request => ({ // Use .map() to format each Request (return only needed fields).
      id: Request._id,
      mentorId: Request.mentorId,
      session_id: Request.session_id,
      message: Request.message,
      isApproved : Request.isApproved
    }));

    
    res.status(200).json({
      msg: 'Requests found:',
      Requests: formattedRequests,
    });


}catch(err){
    res.status(500).json({ msg: 'Search failed', error: err.message });

}
}



exports.getApprovedRequests = async (req, res) => {
  try {
    const approvedRequests = await Request.find({ isApproved: true });

    if (!approvedRequests || approvedRequests.length === 0) {
      return res.status(404).json({ msg: 'No approved requests found' });
    }

    const formattedRequests = approvedRequests.map(request => ({
      id: request._id,
      mentorId: request.mentor_id,
      session_id: request.session_id,
      message: request.message,
      isApproved: request.isApproved
    }));

    res.status(200).json({
      msg: 'Approved requests found:',
      requests: formattedRequests
    });

  } catch (err) {
    res.status(500).json({ msg: 'Search failed', error: err.message });
  }
};







exports.sessionUpdate = async (req,res) =>{

try{

const { max_students, status, meeting_schedule, meeting_platform, meeting_link, session_category, duration } = req.body;
const session_id = req.params.sessionId;
 if (!session_id) return res.status(400).json({ msg: 'ID is required' });

    if (!status) return res.status(400).json({ msg: 'New status is required' });
    if (!max_students) return res.status(400).json({ msg: 'New status is required' });


    const session = await Session.findOne({ _id : session_id });
    if (!session) return res.status(400).json({ msg: 'session Does not Exist' });


    session.max_students=max_students;
    session.status = status;
    session.meeting_schedule=meeting_schedule;
    session.meeting_platform=meeting_platform;
    session.meeting_link=meeting_link;
    if (session_category !== undefined) session.session_category = session_category;
    if (duration !== undefined) session.duration = duration;
    await session.save();
    
    res.status(200).json({
    msg: 'session Updated',
    session: {
    id: session._id,
    title: session.title,
    description: session.description,
    status: session.status,
    max_students : session.max_students,
    meeting_schedule:session.meeting_schedule,
    meeting_platform:session.meeting_platform,
    meeting_link:session.meeting_link,
    session_category: session.session_category,
    duration: session.duration


 } });

}catch(err){

res.status(500).json({msg : 'Update Failed', error : err.message});
}}





exports.getAllsessions = async (req, res) => {
  try {
    const user = req.user; // Comes from protect middleware

    // Ensure the user is a mentor
    if (!user || user.user_role?.toLowerCase() !== 'mentor') {
      return res.status(403).json({ msg: 'Access denied: You are not a mentor' });
    }

    // Get only sessions where the mentor_id matches the current user's ID
    const sessions = await Session.find({ mentor_id: user._id });

    if (!sessions || sessions.length === 0) {
      return res.status(404).json({ msg: 'No sessions found for this mentor' });
    }

    // Format the sessions for response
    const formattedSessions = sessions.map(session => ({
      id: session._id,
      title: session.title,
      description: session.description,
      status: session.status,
      mentor_id: session.mentor_id,
      reviews: session.reviews,
      max_students: session.max_students,
      current_enrolled_count: session.current_enrolled_count,
      duration: session.duration,
      session_category: session.session_category,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt
    }));

    return res.status(200).json({
      msg: 'Sessions found',
      sessions: formattedSessions
    });

  } catch (err) {
    return res.status(500).json({ msg: 'Search failed', error: err.message });
  }
};


// Browse all sessions in the system (for all users)
exports.browseSessions = async (req, res) => {
  try {
    // Get all sessions in the system - wrapped in performance measurement
    const sessions = await measureAsync('DB: Fetch all sessions with mentor populate', async () => {
      return await Session.find()
        .populate('mentor_id', 'full_name email profile_image_url')
        .sort({ created_at: -1 });
    });

    if (!sessions || sessions.length === 0) {
      return res.status(404).json({ msg: 'No sessions found' });
    }

    // Format sessions with all required fields
    const formattedSessions = sessions.map(session => ({
      id: session._id,
      title: session.title,
      description: session.description,
      mentor_name: session.mentor_id?.full_name || 'N/A',
      mentor_email: session.mentor_id?.email || null,
      mentor_profile_image: session.mentor_id?.profile_image_url || null,
      max_students: session.max_students || 0,
      current_enrolled_count: session.current_enrolled_count || 0,
      status: session.status,
      price: session.price || 0,
      duration: session.duration || 0,
      session_image: session.session_image || null,
      session_category: session.session_category || null,
      reviews: session.reviews || 0,
      timezone: session.timezone || null,
      meeting_schedule: session.meeting_schedule || null,
      meeting_platform: session.meeting_platform || null,
      meeting_link: session.meeting_link || null,
      created_at: session.created_at,
      updated_at: session.updated_at
    }));

    return res.status(200).json({
      msg: 'All sessions retrieved successfully',
      count: formattedSessions.length,
      sessions: formattedSessions
    });

  } catch (err) {
    return res.status(500).json({ msg: 'Failed to retrieve sessions', error: err.message });
  }
};
 

// DELETE - Cancel a mentor request
exports.cancelRequest = async (req, res) => {
  try {
    const mentorId = req.user._id; // Assuming authentication populates req.user
    const { requestId } = req.params;

    // Find the request and ensure the mentor owns it
    const request = await Request.findOne({ _id: requestId, mentor_id: mentorId });

    if (!request) {
      return res.status(404).json({ msg: 'Request not found or not authorized' });
    }

    await Request.findByIdAndDelete(requestId);

    res.status(200).json({
      msg: 'Request canceled successfully',
      canceled_request: {
        session_id: request.session_id,
        message: request.message,
        createdAt: request.createdAt
      }
    });

  } catch (err) {
    console.error('❌ Cancel request error:', err);
    res.status(500).json({ msg: 'Failed to cancel request', error: err.message });
  }
};


// Student Join Session requests Management


// READ - Get session join requests (for mentors)
exports.getSessionJoinRequests = async (req, res) => {
  try {
    const mentorId = req.user._id;
    const { sessionId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    
    // Check if session exists and mentor owns it
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ msg: 'Session not found' });
    }

    if (session.mentor_id.toString() !== mentorId.toString()) {
      return res.status(403).json({ msg: 'Access denied: Not your session' });
    }

    // Build query
    let query = { session_id: sessionId };
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      query.status = status;
    }

    const requests = await SessionJoinRequest.find(query)
      .populate('student_id', 'full_name email phone_number profile_image_url')
      .sort({ requested_at: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);


    res.status(200).json({
      msg: 'Session join requests retrieved successfully',
      session: {
        id: session._id,
        title: session.title
      },
      requests,

    });

  } catch (err) {
    console.error(' Get session join requests error:', err);
    res.status(500).json({ msg: 'Failed to retrieve session join requests', error: err.message });
  }
};







// UPDATE - Approve/Reject join request (for mentors)

exports.reviewJoinRequest = async (req, res) => {
  try {
    const mentorId = req.user._id;
    const { requestId } = req.params;
    const { action, review_message } = req.body;

    // Validation
    if (!action || !['approve', 'reject'].includes(action)) {
      return res.status(400).json({ msg: 'Action must be either "approve" or "reject"' });
    }

    // Find the request
    const joinRequest = await SessionJoinRequest.findById(requestId)
      .populate('session_id', 'title mentor_id')
      .populate('student_id', 'full_name email');

    if (!joinRequest) {
      return res.status(404).json({ msg: 'Join request not found' });
    }

    // Only mentor of session can review
    if (String(joinRequest.session_id.mentor_id) !== String(mentorId)) {
      return res.status(403).json({ msg: 'Not authorized to review this request' });
    }

    const currentDate = new Date();

    joinRequest.isApproved = (action === 'approve');
    joinRequest.reviewed_at = currentDate;
    joinRequest.reviewed_by = mentorId;
    if (review_message) {
      joinRequest.review_message = review_message;
    }

    await joinRequest.save();

    if (action === 'approve') {
      // Enroll student in the session
      const enrollment = new SessionEnrollment({
        session_id: joinRequest.session_id._id,
        student_id: joinRequest.student_id._id,
        enrollment_date: currentDate
      });
      await enrollment.save();

      // Increment current_enrolled_count in the session
      await Session.findByIdAndUpdate(
        joinRequest.session_id._id,
        { $inc: { current_enrolled_count: 1 } }
      );

      // Find all courses in this session
      const sessionCourses = await Course.find({ session_id: joinRequest.session_id._id });

      // Enroll student in all courses of the session
      let courseEnrollments = [];
      for (const course of sessionCourses) {
        // Prevent duplicate enrollments
        const existing = await CourseEnrollment.findOne({
          course_id: course._id,
          student_id: joinRequest.student_id._id
        });
        if (!existing) {
          const courseEnrollment = await CourseEnrollment.create({
            course_id: course._id,
            student_id: joinRequest.student_id._id,
            completed: false,
            progress_percentage: 0,
            final_grade: null
          });
          courseEnrollments.push(courseEnrollment);
        }
      }

      return res.status(200).json({
        msg: 'Join request approved and student enrolled successfully',
        request: joinRequest,
        sessionEnrollment: enrollment,
        courseEnrollments
      });
    } else {
      // action === 'reject'
      // Increment rejection count
      joinRequest.rejection_count = (joinRequest.rejection_count || 0) + 1;
      await joinRequest.save();
      
      return res.status(200).json({
        msg: 'Join request rejected',
        request: joinRequest,
        rejection_count: joinRequest.rejection_count,
        warning: joinRequest.rejection_count >= 2 ? 'Student has reached maximum rejections (2) for this session' : null
      });
    }
  } catch (err) {
    console.error('Review join request error:', err);
    res.status(500).json({ msg: 'Failed to review join request', error: err.message });
  }
};




// Get all students enrolled in a session (for mentor)
exports.getSessionStudents = async (req, res) => {
  try {
    const mentorId = req.user._id; // Mentor must be authenticated
    const { sessionId } = req.params;

    // Find the session and check mentor owns it
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ msg: 'Session not found' });
    }
    if (String(session.mentor_id) !== String(mentorId)) {
      return res.status(403).json({ msg: 'You are not authorized for this session' });
    }

    // Find all enrollments for this session and populate student info
    const enrollments = await SessionEnrollment.find({ session_id: sessionId })
      .populate('student_id', 'full_name email phone_number profile_image_url'); // select fields as needed

    // Map to return only student info
    const students = enrollments.map(e => e.student_id);

    res.status(200).json({
      msg: 'Students enrolled in this session retrieved successfully',
      students
    });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to retrieve students', error: err.message });
  }
};

