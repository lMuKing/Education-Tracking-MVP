const Homework = require('../Models/homeworkModel');
const Course = require('../Models/courseModel');
const User = require('../Models/userModel');
const HomeworkEnrollment = require('../Models/homeworkEnrollementModel');
const CourseEnrollment = require('../Models/courseEnrollement');







// Create new homework (Mentor only)
exports.createHomework = async (req, res) => {
  try {

    const { 
      title, 
      description, 
      documents_url, 
      instructions, 
      task_type, 
      deadline, 
      extended_deadline, 
      late_submission_penalty
    } = req.body;
    const courseId = req.params.courseId;

    // Validation
    if (!title || !task_type || !deadline) {
      return res.status(400).json({ msg: 'Title, task type, and deadline are required' });
    }

    // Validate deadline is in the future
    if (new Date(deadline) <= new Date()) {
      return res.status(400).json({ msg: 'Deadline must be in the future' });
    }

    // Validate extended deadline if provided
    if (extended_deadline && new Date(extended_deadline) <= new Date(deadline)) {
      return res.status(400).json({ msg: 'Extended deadline must be after the original deadline' });
    }

    // Create homework
    const newHomework = await Homework.create({
      course_id: courseId,
      title: title.trim(),
      description: description?.trim() || '',
      instructions: instructions?.trim() || '',
      task_type,
      deadline,
      documents_url,
      extended_deadline: extended_deadline || null,
      late_submission_penalty: late_submission_penalty || 0
    });

    res.status(201).json({
      msg: 'Homework created successfully',
      homework: newHomework
    });

  } catch (err) {
    res.status(500).json({ msg: 'Failed to create homework', error: err.message });
  }
};





// Get all homework for a specific course
exports.getHomeworkByCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    if (!courseId) {
      return res.status(400).json({ msg: 'Course ID is required' });
    }

    // Get homework for the course
    const homework = await Homework.find({
      course_id: courseId
    })

    if (!homework || homework.length === 0) {
      return res.status(404).json({ msg: 'No homework found for this course' });
    }

    res.status(200).json({
      msg: 'Homework retrieved successfully',
      count: homework.length,
      homework
    });

  } catch (err) {
    res.status(500).json({ msg: 'Failed to retrieve homework', error: err.message });
  }
};



// Get single homework by ID
exports.getHomeworkById = async (req, res) => {
  try {
    const homeworkId = req.params.homeworkId;

    if (!homeworkId) {
      return res.status(400).json({ msg: 'Homework ID is required' });
    }

    const homework = await Homework.findById(homeworkId)

    if (!homework) {
      return res.status(404).json({ msg: 'Homework not found' });
    }

    res.status(200).json({
      msg: 'Homework retrieved successfully',
      homework
    });

  } catch (err) {
    res.status(500).json({ msg: 'Failed to retrieve homework', error: err.message });
  }
};




// Update homework (Mentor only - for their course)
exports.updateHomework = async (req, res) => {
  try {
    const homeworkId = req.params.homeworkId;
    const { 
      title, 
      description, 
      documents_url, 
      instructions, 
      extended_deadline, 
      late_submission_penalty
    } = req.body;

    if (!homeworkId) {
      return res.status(400).json({ msg: 'Homework ID is required' });
    }

    // Validation
    if (!title && !description && !instructions && 
        extended_deadline === undefined && late_submission_penalty === undefined) {
      return res.status(400).json({ msg: 'At least one field is required to update' });
    }

    // Find homework
    const homework = await Homework.findById(homeworkId)
    if (!homework) {
      return res.status(404).json({ msg: 'Homework not found' });
    }

    // Update fields if provided
    if (title) homework.title = title.trim();
    if (description !== undefined) homework.description = description.trim();
    if (instructions !== undefined) homework.instructions = instructions.trim();
    if (documents_url !== undefined) homework.documents_url = documents_url.trim();
    if (extended_deadline !== undefined) homework.extended_deadline = extended_deadline;
    if (late_submission_penalty !== undefined) homework.late_submission_penalty = late_submission_penalty;


    if (extended_deadline !== undefined) {
      if (extended_deadline && new Date(extended_deadline) <= new Date(homework.deadline)) {
        return res.status(400).json({ msg: 'Extended deadline must be after the original deadline' });
      }
      homework.extended_deadline = extended_deadline;
    }
    if (late_submission_penalty !== undefined) homework.late_submission_penalty = late_submission_penalty;


    await homework.save();

    // Get updated homework with populated fields
    const updatedHomework = await Homework.findById(homeworkId);

    res.status(200).json({
      msg: 'Homework updated successfully',
      homework: updatedHomework
    });

  } catch (err) {
    res.status(500).json({ msg: 'Failed to update homework', error: err.message });
  }
};




// Delete homework (Mentor only - for their course)
exports.deleteHomework = async (req, res) => {
  try {
    const homeworkId = req.params.homeworkId;

    if (!homeworkId) {
      return res.status(400).json({ msg: 'Homework ID is required' });
    }

    // Find homework
    const homework = await Homework.findById(homeworkId);
    if (!homework) {
      return res.status(404).json({ msg: 'Homework not found' });
    }

    await Homework.findByIdAndDelete(homeworkId);

    res.status(200).json({
      msg: 'Homework deleted successfully'
    });

  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete homework', error: err.message });
  }
};




// Get upcoming homework (due within next 7 days)
exports.getUpcomingHomework = async (req, res) => {
  try {
    const currentDate = new Date();
    const nextWeek = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);

    const upcomingHomework = await Homework.find({
      deadline: { 
        $gte: currentDate,
        $lte: nextWeek
      }
    })
    .populate('course_id', 'title course_code')
    .sort({ deadline: 1 });

    if (!upcomingHomework || upcomingHomework.length === 0) {
      return res.json({ 
        msg: 'No upcoming homework found for the next 7 days',
        count: 0,
        homework: []
      });
    }

    res.status(200).json({
      msg: 'Upcoming homework retrieved successfully',
      count: upcomingHomework.length,
      homework: upcomingHomework
    });

  } catch (err) {
    res.status(500).json({ msg: 'Failed to retrieve upcoming homework', error: err.message });
  }
};





// Get homework by task type
exports.getHomeworkByType = async (req, res) => {
  try {
    const { taskType } = req.params;
    const { courseId } = req.query;

    if (!taskType) {
      return res.status(400).json({ msg: 'Task type is required' });
    }

    let filter = { task_type: taskType };
    if (courseId) {
      filter.course_id = courseId;
    }

    const homework = await Homework.find(filter)
      .populate('course_id', 'title course_code')
      .sort({ deadline: 1 });

    if (!homework || homework.length === 0) {
      return res.json({ 
        msg: `No ${taskType} homework found`,
        count: 0,
        homework: []
      });
    }

    res.status(200).json({
      msg: `${taskType.charAt(0).toUpperCase() + taskType.slice(1)} homework retrieved successfully`,
      count: homework.length,
      homework
    });

  } catch (err) {
    res.status(500).json({ msg: 'Failed to retrieve homework by type', error: err.message });
  }
};




// Mentor Update the homework grade then the course progress_percentage will be updated auto


exports.gradeHomework = async (req, res) => {
  try {
    const { homeworkEnrollmentId } = req.params;
    const { grade } = req.body;

    // 1. Update the Homework grade
    const homeworkEnrollment = await HomeworkEnrollment.findByIdAndUpdate(
      homeworkEnrollmentId,
      { Homework_grade: grade },
      { new: true }
    );

    if (!homeworkEnrollment) {
      return res.status(404).json({ msg: 'Homework enrollment not found' });
    }

    // 2. Gather all homework enrollments for this student and course
    const { course_id, student_id } = homeworkEnrollment;

    // Get all homeworks for this course
    const allHomeworks = await Homework.find({ course_id });
    const totalHomeworks = allHomeworks.length;

    const studentHomeworks = await HomeworkEnrollment.find({
      course_id,
      student_id
    });

    // Calculate sum of grades
    let sumGrades = 0;
    for (const hw of studentHomeworks) {
      if (hw.Homework_grade !== null) {
        sumGrades += Number(hw.Homework_grade);
      }
    }

    // Calculate progress percentage
    const maxScore = totalHomeworks * 20;
    const progress_percentage = maxScore ? (sumGrades / maxScore) * 100 : 0;

    // 3. Update CourseEnrollment
    await CourseEnrollment.findOneAndUpdate(
      { course_id, student_id },
      { progress_percentage }
    );

    res.status(200).json({
      msg: 'Homework graded and progress updated',
      homeworkEnrollment,
      progress_percentage
    });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to grade homework', error: err.message });
  }
};



// Get all homework enrollments 
exports.getAllHomeworkEnrollments = async (req, res) => {
  try {
    const enrollments = await HomeworkEnrollment.find()
      .populate('course_id')
      .populate('homework_id')
      .populate('student_id');

    res.status(200).json({
      msg: 'All homework enrollments retrieved',
      enrollments
    });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to retrieve enrollments', error: err.message });
  }
};


// Get one homework enrollment by its ID
exports.getHomeworkEnrollmentById = async (req, res) => {
  try {
    const { enrollmentId } = req.params;

    const enrollment = await HomeworkEnrollment.findById(enrollmentId)
      .populate('course_id')
      .populate('homework_id')
      .populate('student_id');

    if (!enrollment) {
      return res.status(404).json({ msg: 'Enrollment not found.' });
    }

    res.status(200).json({
      msg: 'Homework enrollment retrieved',
      enrollment
    });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to retrieve enrollment', error: err.message });
  }
};

// Mentor: Get all submissions for a specific homework
exports.getHomeworkSubmissions = async (req, res) => {
  try {
    const { homeworkId } = req.params;

    // Get all enrollments for this homework with submitted status
    const submissions = await HomeworkEnrollment.find({
      homework_id: homeworkId,
      submission_status: 'submitted'
    })
      .populate('student_id', 'firstName lastName email')
      .populate('homework_id', 'title deadline')
      .sort({ submitted_at: -1 });

    // Count total enrolled and submitted
    const totalEnrolled = await HomeworkEnrollment.countDocuments({ homework_id: homeworkId });
    const totalSubmitted = submissions.length;

    res.status(200).json({
      msg: 'Submissions retrieved successfully',
      totalEnrolled,
      totalSubmitted,
      submissions: submissions.map(sub => ({
        enrollmentId: sub._id,
        student: {
          id: sub.student_id._id,
          firstName: sub.student_id.firstName,
          lastName: sub.student_id.lastName,
          email: sub.student_id.email
        },
        images: sub.submission_images,
        submittedAt: sub.submitted_at,
        grade: sub.Homework_grade,
        status: sub.submission_status
      }))
    });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to retrieve submissions', error: err.message });
  }
};

// Mentor: Get a specific student's submission for a homework
exports.getStudentSubmission = async (req, res) => {
  try {
    const { homeworkId, studentId } = req.params;

    const enrollment = await HomeworkEnrollment.findOne({
      homework_id: homeworkId,
      student_id: studentId
    })
      .populate('student_id', 'firstName lastName email')
      .populate('homework_id', 'title description instructions deadline');

    if (!enrollment) {
      return res.status(404).json({ msg: 'Submission not found' });
    }

    res.status(200).json({
      msg: 'Submission retrieved successfully',
      submission: {
        enrollmentId: enrollment._id,
        student: {
          id: enrollment.student_id._id,
          firstName: enrollment.student_id.firstName,
          lastName: enrollment.student_id.lastName,
          email: enrollment.student_id.email
        },
        homework: {
          id: enrollment.homework_id._id,
          title: enrollment.homework_id.title,
          description: enrollment.homework_id.description,
          deadline: enrollment.homework_id.deadline
        },
        images: enrollment.submission_images,
        submittedAt: enrollment.submitted_at,
        grade: enrollment.Homework_grade,
        status: enrollment.submission_status
      }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to retrieve submission', error: err.message });
  }
};