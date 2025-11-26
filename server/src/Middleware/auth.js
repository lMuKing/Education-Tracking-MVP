const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');
const Request = require('../Models/requestModel');
const Session = require('../Models/sessionModel');
const Course = require('../Models/courseModel');
const SessionEnrollment = require('../Models/sessionEnrollmentModel');
const logger = require('../Config/logger');

const secretKey = process.env.JWT_SECRET;


//  Protect middleware — for authenticated users only  // reads JWT from cookies

// PRODUCTION CODE (Version 2 enhanced):
exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // Priority 1: Authorization header (modern standard)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Priority 2: Cookie fallback (for browsers)
    else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    
    if (!token) {
      return res.status(401).json({ 
        msg: 'Access denied. Provide token via Authorization header or cookie.' 
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ msg: 'User not found' });
    }
    
    req.user = user;
    next();
    
  } catch (err) {
    logger.warn('Authentication failed:', { 
      error: err.message, 
      ip: req.ip,
      url: req.originalUrl 
    });
    res.status(401).json({ 
      msg: 'Invalid or expired token', 
      error: err.message 
    });
  }
};




exports.restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.user_role)) {
      return res.status(403).json({ msg: 'Access denied. Insufficient role.' });
    }
    next();
  };
};


// those function i use them like this :

// router.get('/dashboard', protect, restrictTo('student', 'Parent'), dashboardController.view);

 // or Session, depending on what you're protecting







exports.authorizeMentorBy_SessionId = async (req, res, next) => { // this middleware help us to authorize the only the specific mentor to modify in session enviroment
  try {
    const user = req.user; // from auth middleware (should contain user.id and user.role)
    const { sessionId } = req.params; // session ID


    const session = await Session.findById(sessionId); // or Session.findById(id)

        if (!session) {
      return res.status(404).json({ msg: 'Session not found' });
    }

    if (!session.mentor_id) {
    return res.status(403).json({ msg: 'Access denied: Session has no mentor assigned' });
    }

    if (session.mentor_id.toString() !== user._id.toString()) {
      return res.status(403).json({ msg: 'Access denied: You are not authorized' });
    }

      // Check if the mentor's request to the session is approved
const request = await Request.findOne({
  mentor_id: session.mentor_id,  // from the session
  session_id: session._id
});

if (!request) {
  return res.status(403).json({ msg: 'Access denied: No session request found' });
}

if (!request.isApproved) {
  return res.status(403).json({ msg: 'Access denied: Session request not approved' });
}

    next();

  } catch (err) {
    res.status(500).json({ msg: 'Authorization failed', error: err.message });
  }
};







exports.authorizeMentorBy_CourseId = async (req, res, next) => {
  try {
    const user = req.user;
    const courseId = req.params.courseId;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    if (!course.session_id) {
      return res.status(403).json({ msg: 'Access denied: Course has no session assigned' });
    }

    // Fetch session manually
    const session = await Session.findById(course.session_id);

    if (!session) {
      return res.status(404).json({ msg: 'Session not found' });
    }

    if (!session.mentor_id) {
      return res.status(403).json({ msg: 'Access denied: Session has no mentor assigned' });
    }

    if (session.mentor_id.toString() !== user._id.toString()) {
      return res.status(403).json({ msg: 'Access denied: You are not authorized' });
    }

    const request = await Request.findOne({
      mentor_id: session.mentor_id,
      session_id: session._id
    });

    if (!request) {
      return res.status(403).json({ msg: 'Access denied: No session request found' });
    }

    if (!request.isApproved) {
      return res.status(403).json({ msg: 'Access denied: Session request not approved' });
    }

    next();

  } catch (err) {
    res.status(500).json({ msg: 'Authorization failed', error: err.message });
  }
};


exports.authorizeStudentBy_SessionId = async (req, res, next) => {
  try {
    const user = req.user;
    const { sessionId, enrollmentId } = req.params;

    if (user.user_role !== 'student') {
      return res.status(403).json({ msg: 'Access denied: Only students can perform this action' });
    }

    let enrollmentQuery = {
      session_id: sessionId,
      student_id: user._id
    };

    // If enrollmentId is provided in params, add to the query
    if (enrollmentId) {
      enrollmentQuery._id = enrollmentId;
    }

    // Check if the student is enrolled in the session (and enrollmentId if provided)
    const enrollment = await SessionEnrollment.findOne(enrollmentQuery);

    if (!enrollment) {
      return res.status(403).json({ msg: 'Access denied: You are not enrolled in this session or invalid enrollmentId' });
    }

    // Optionally, attach enrollment to req for downstream handlers
    req.enrollment = enrollment;

    next();
  } catch (err) {
    res.status(500).json({ msg: 'Authorization failed', error: err.message });
  }
};

// Authorize student by courseId (checks course -> session -> enrollment)
exports.authorizeStudentBy_CourseId = async (req, res, next) => {
  try {
    const user = req.user;
    const { courseId } = req.params;

    if (user.user_role !== 'student') {
      return res.status(403).json({ msg: 'Access denied: Only students can perform this action' });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    if (!course.session_id) {
      return res.status(403).json({ msg: 'Access denied: Course has no session assigned' });
    }

    // Check if the student is enrolled in the related session
    const enrollment = await SessionEnrollment.findOne({
      session_id: course.session_id,
      student_id: user._id
    });


    if (!enrollment) {
      return res.status(403).json({ msg: 'Access denied: You are not enrolled in the session for this course' });
    }

    next();
  } catch (err) {
    res.status(500).json({ msg: 'Authorization failed', error: err.message });
  }
};



















