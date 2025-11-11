// controllers/courseController.js
const Course = require('../Models/courseModel');
const Session = require('../Models/sessionModel');


exports.createCourse = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    let { title, description, external_links, documents_url } = req.body;


    // Validate required fields
    if (!title) {
      return res.status(400).json({ msg: 'Title is required' });
    }
    if (!documents_url) {
      return res.status(400).json({ msg: 'Documents URL is required' });
    }

    // Handle if documents_url comes as array - extract first element
    if (Array.isArray(documents_url)) {
      documents_url = documents_url[0];
    }

    // Handle external_links - ensure it's an array
    if (!external_links) {
      external_links = [];
    } else if (!Array.isArray(external_links)) {
      external_links = [external_links]; // Convert string to array
    }
    
    const newCourse = await Course.create({
      session_id: sessionId,
      title,
      description,
      external_links,
      documents_url
    });

    return res.status(201).json({
      msg: 'Course created successfully',
      course: newCourse
    });

  } catch (error) {
    console.error('Create course error:', error);
    return res.status(500).json({
      msg: 'Failed to create course',
      error: error.message
    });
  }
};


exports.getCoursesBySession = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;

    const courses = await Course.find({ session_id: sessionId });

    if (!courses || courses.length === 0) {
      return res.status(404).json({
        msg: 'No courses found for this session'
      });
    }

    return res.status(200).json({
      msg: 'Courses fetched successfully',
      courses
    });

  } catch (error) {
    return res.status(500).json({
      msg: 'Failed to fetch courses',
      error: error.message
    });
  }
};



exports.getCourseById = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    return res.status(200).json({
      msg: 'Course fetched successfully',
      course
    });

  } catch (error) {
    return res.status(500).json({
      msg: 'Failed to fetch course',
      error: error.message
    });
  }
};



exports.updateCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    let { external_links, documents_url } = req.body;

    // Handle documents_url - extract first element if array
    if (documents_url && Array.isArray(documents_url)) {
      documents_url = documents_url[0];
    }

    // Handle external_links - convert to array if needed
    if (external_links && !Array.isArray(external_links)) {
      external_links = [external_links];
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { external_links, documents_url },
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    return res.status(200).json({
      msg: 'Course updated successfully',
      course: updatedCourse
    });

  } catch (error) {
    return res.status(500).json({
      msg: 'Failed to update course',
      error: error.message
    });
  }
};




exports.deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    const deletedCourse = await Course.findByIdAndDelete(courseId);

    if (!deletedCourse) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    return res.status(200).json({
      msg: 'Course deleted successfully'
    });

  } catch (error) {
    return res.status(500).json({
      msg: 'Failed to delete course',
      error: error.message
    });
  }
};
