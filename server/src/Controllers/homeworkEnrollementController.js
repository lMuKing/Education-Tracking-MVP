const HomeworkEnrollment = require('../Models/homeworkEnrollementModel');
const Homework = require('../Models/homeworkModel');
const User = require('../Models/userModel');



// Get all homeworks available in a specific course
exports.getHomeworksByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Assuming Homework model has a field "course_id"
    const homeworks = await Homework.find({ course_id: courseId });

    res.status(200).json({
      msg: 'Homeworks for this course retrieved',
      homeworks
    });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to retrieve homeworks', error: err.message });
  }
};




// Student enrolls in a homework
exports.enrollInHomework = async (req, res) => {
  try {
    const { homeworkId } = req.params;
    const studentId = req.user._id;

    // Check if homework exists and populate course details
    const homework = await Homework.findById(homeworkId)
      .populate('course_id', 'title course_code description');
    
    if (!homework) {
      return res.status(404).json({ msg: 'Homework not found' });
    }

    // Prevent duplicate enrollments
    const alreadyEnrolled = await HomeworkEnrollment.findOne({
      homework_id: homeworkId,
      student_id: studentId
    });
    if (alreadyEnrolled) {
      return res.status(400).json({ msg: 'Already enrolled in this homework' });
    }

    // Create enrollment, make sure to include course_id
    const enrollment = await HomeworkEnrollment.create({
      course_id: homework.course_id,
      homework_id: homeworkId,
      student_id: studentId
    });

    // Return complete homework information
    res.status(201).json({
      msg: 'Enrolled in homework successfully',
      enrollment_id: enrollment._id,
      homework: {
        _id: homework._id,
        title: homework.title,
        description: homework.description,
        instructions: homework.instructions,
        documents_url: homework.documents_url,
        task_type: homework.task_type,
        deadline: homework.deadline,
        extended_deadline: homework.extended_deadline,
        late_submission_penalty: homework.late_submission_penalty,
        course: homework.course_id,
        created_at: homework.created_at
      },
      enrolled_at: enrollment.enrolled_at
    });
  } catch (err) {
    res.status(500).json({ msg: 'Enrollment failed', error: err.message });
  }
};




// Student: Get all homework they are enrolled in
exports.getMyHomeworks = async (req, res) => {
  try {
    const studentId = req.user._id;

    const enrollments = await HomeworkEnrollment.find({ student_id: studentId })
      .populate('homework_id');

    const homeworks = enrollments.map(e => e.homework_id);

    res.status(200).json({
      msg: 'Your enrolled homeworks retrieved',
      homeworks
    });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to retrieve homeworks', error: err.message });
  }
};



// Student: Get a specific homework they are enrolled in
exports.getMyHomeworkById = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { homeworkId } = req.params;

    // Find enrollment for this student and homework
    const enrollment = await HomeworkEnrollment.findOne({
      student_id: studentId,
      homework_id: homeworkId
    }).populate('homework_id');

    if (!enrollment) {
      return res.status(404).json({ msg: 'You are not enrolled in this homework' });
    }

    res.status(200).json({
      msg: 'Homework retrieved',
      homework: enrollment.homework_id
    });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to retrieve homework', error: err.message });
  }
};

// Student: Submit homework solution
exports.submitHomeworkSolution = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { homeworkId } = req.params;

    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ msg: 'No images uploaded. Please select at least one image.' });
    }

    // Validate number of images (max 4)
    if (req.files.length > 4) {
      return res.status(400).json({ msg: 'Maximum 4 images allowed per submission' });
    }

    // Check if enrolled, if not, enroll them automatically
    let enrollment = await HomeworkEnrollment.findOne({
      student_id: studentId,
      homework_id: homeworkId
    }).populate('homework_id').populate('student_id');

    if (!enrollment) {
      // Get homework details to get course_id
      const homework = await Homework.findById(homeworkId);
      
      if (!homework) {
        return res.status(404).json({ msg: 'Homework not found' });
      }

      // Auto-enroll the student
      enrollment = new HomeworkEnrollment({
        course_id: homework.course_id,
        student_id: studentId,
        homework_id: homeworkId
      });
      await enrollment.save();
      
      // Populate the fields after saving
      enrollment = await HomeworkEnrollment.findById(enrollment._id)
        .populate('homework_id')
        .populate('student_id');
    }

    // Check submission deadline
    const now = new Date();
    const deadline = enrollment.homework_id.extended_deadline || enrollment.homework_id.deadline;
    
    if (now > deadline) {
      return res.status(400).json({ msg: 'Submission deadline has passed' });
    }

    // Extract Cloudinary URLs from uploaded files
    const imageUrls = req.files.map(file => file.path);

    // Update enrollment with submission details
    enrollment.submission_images = imageUrls;
    enrollment.submission_status = 'submitted';
    enrollment.submitted_at = now;
    await enrollment.save();

    res.status(200).json({
      msg: 'Homework submitted successfully',
      submittedImages: imageUrls.length,
      submittedAt: now
    });
  } catch (err) {
    res.status(500).json({ msg: 'Submission failed', error: err.message });
  }
};