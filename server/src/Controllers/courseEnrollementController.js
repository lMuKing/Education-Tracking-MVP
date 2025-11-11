// controllers/courseEnrollementController.js
const Course = require('../Models/courseModel');
const Session = require('../Models/sessionModel');
const CourseEnrollment = require('../Models/courseEnrollement');
const User = require('../Models/userModel');


// Get all courses in a session that the student is enrolled in (simple version)
exports.getMySessionCourses = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const studentId = req.user._id;

    // Find all enrollments for this student in this session's courses
    const enrollments = await CourseEnrollment.find({ student_id: studentId })
      .populate({
        path: 'course_id',
        match: { session_id: sessionId }
      });

    // Only include enrollments where course_id is not null (i.e., matches session)
    const courses = enrollments
      .filter(e => e.course_id)
      .map(e => e.course_id);

    res.status(200).json({
      msg: 'Courses in this',
      courses
    });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to retrieve courses', error: err.message });
  }
};




// Get all enrollments for a student
exports.getMyCourseEnrollments = async (req, res) => {
  try {
    const studentId = req.user._id;
    const enrollments = await CourseEnrollment.find({ student_id: studentId })
      .populate('course_id', 'title description');

    res.status(200).json({
      msg: 'Enrollments retrieved successfully',
      enrollments
    });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to retrieve enrollments', error: err.message });
  }
};



// Get details of a specific course enrollment (for the logged-in student)
exports.getCourseEnrollmentDetails = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const studentId = req.user._id;

    const enrollment = await CourseEnrollment.findOne({
      _id: enrollmentId,
      student_id: studentId
    })
      .populate('course_id', 'title description documents_url external_links session_id')
      .populate({
        path: 'course_id',

      });

    if (!enrollment) {
      return res.status(404).json({ msg: 'Enrollment not found' });
    }

    res.status(200).json({
      msg: 'Course enrollment details retrieved successfully',
      enrollment
    });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to retrieve course enrollment details', error: err.message });
  }
};




