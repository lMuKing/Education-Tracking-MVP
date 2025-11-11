const Announcement = require('../Models/announcementModel');
const Session = require('../Models/sessionModel');
const User = require('../Models/userModel');
const SessionEnrollment = require('../Models/sessionEnrollmentModel');






// Create new announcement (Mentor only)
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, content, announcement_type, expires_at } = req.body;
     const sessionId = req.params.sessionId;
    const mentor_id = req.user._id;

    // Validation
    if (!title || !content || !announcement_type) {
      return res.status(400).json({ msg: 'Title, and content are required' });
    }

    // Create announcement
    const newAnnouncement = await Announcement.create({
      session_id:sessionId,
      mentor_id,
      title: title.trim(),
      content: content.trim(),
      announcement_type: announcement_type,
      expires_at: expires_at || null
    });


    res.status(201).json({
      msg: 'Announcement created successfully',
      announcement: newAnnouncement
    });


  } catch (err) {
    res.status(500).json({ msg: 'Failed to create announcement', error: err.message });
  }
};




// Get all announcements for a specific session
exports.getAnnouncementsBySession = async (req, res) => {
  try {
     const sessionId = req.params.sessionId;

    if (!sessionId) {
      return res.status(400).json({ msg: 'Session ID is required' });
    }


    // Get announcements for the session (excluding expired ones by default)
    const announcements = await Announcement.find({
      session_id: sessionId
    })

    if (!announcements || announcements.length === 0) {
      return res.status(404).json({ msg: 'No active announcements found for this session' });
    }

    res.status(200).json({
      msg: 'Announcements retrieved successfully',
      announcements
    });

  } catch (err) {
    res.status(500).json({ msg: 'Failed to retrieve announcements', error: err.message });
  }
};



// Get single announcement by ID
exports.getAnnouncementById = async (req, res) => {
  try {
    const announcementId  = req.params.announcementId;

    if (!announcementId) {
      return res.status(400).json({ msg: 'Announcement ID is required' });
    }

    const announcement = await Announcement.findById(announcementId)

    if (!announcement) {
      return res.status(404).json({ msg: 'Announcement not found' });
    }

    res.status(200).json({
      msg: 'Announcement retrieved successfully',
      announcement
    });

  } catch (err) {
    res.status(500).json({ msg: 'Failed to retrieve announcement', error: err.message });
  }
};




// Update announcement (Mentor only - own announcements)
exports.updateAnnouncement = async (req, res) => {
  try {
    const announcementId  = req.params.announcementId;
    const { title, content, announcement_type, } = req.body;
    const mentor_id = req.user._id;

    if (!announcementId) {
      return res.status(400).json({ msg: 'Announcement ID is required' });
    }

    // Validation
    if (!title && !content && !announcement_type && expires_at === undefined) {
      return res.status(400).json({ msg: 'At least one field is required to update' });
    }

    // Find announcement
    const announcement = await Announcement.findById(announcementId);
    if (!announcement) {
      return res.status(404).json({ msg: 'Announcement not found' });
    }

    // Check if mentor owns this announcement
    if (announcement.mentor_id.toString() !== mentor_id.toString()) {
      return res.status(403).json({ msg: 'Access denied: You can only update your own announcements' });
    }

    // Update fields if provided
    if (title) announcement.title = title.trim();
    if (content) announcement.content = content.trim();
    if (announcement_type) announcement.announcement_type = announcement_type;

    await announcement.save();

    // Populate for response
    const updatedAnnouncement = await Announcement.findById(announcementId)

    res.status(200).json({
      msg: 'Announcement updated successfully',
      announcement: updatedAnnouncement
    });

  } catch (err) {
    res.status(500).json({ msg: 'Failed to update announcement', error: err.message });
  }
};




// Delete announcement (Mentor only - own announcements)
exports.deleteAnnouncement = async (req, res) => {
  try {
    const  announcementId  = req.params.announcementId;
    const mentor_id = req.user._id;

    if (!announcementId) {
      return res.status(400).json({ msg: 'Announcement ID is required' });
    }

    // Find announcement
    const announcement = await Announcement.findById(announcementId);
    if (!announcement) {
      return res.status(404).json({ msg: 'Announcement not found' });
    }

    // Check if mentor owns this announcement
    if (announcement.mentor_id.toString() !== mentor_id.toString()) {
      return res.status(403).json({ msg: 'Access denied: You can only delete your own announcements' });
    }

    await Announcement.findByIdAndDelete(announcementId);

    res.status(200).json({
      msg: 'Announcement deleted successfully'
    });

  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete announcement', error: err.message });
  }
};






// Get urgent announcements for a session
exports.getUrgentAnnouncements = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;

    if (!sessionId) {
      return res.status(400).json({ msg: 'Session ID is required' });
    }

    const urgentAnnouncements = await Announcement.find({
      session_id: sessionId,
      announcement_type: 'urgent',
    })
    .sort({ published_at: -1 });

    // Check if no urgent announcements found
    if (!urgentAnnouncements || urgentAnnouncements.length === 0) {
      return res.json({ 
        msg: 'No urgent announcements found for this session',
        count: 0,
        announcements: []
      });
    }

    res.status(200).json({
      msg: 'Urgent announcements retrieved successfully',
      count: urgentAnnouncements.length,
      announcements: urgentAnnouncements
    });

  } catch (err) {
    res.status(500).json({ msg: 'Failed to retrieve urgent announcements', error: err.message });
  }
};




// Get announcements for a specific session (Student only - must be enrolled)
exports.getSessionAnnouncementsForStudent = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const studentId = req.user._id;

    if (!sessionId) {
      return res.status(400).json({ msg: 'Session ID is required' });
    }

    // Check if student is enrolled in this session
    const enrollment = await SessionEnrollment.findOne({
      session_id: sessionId,
      student_id: studentId
    });

    if (!enrollment) {
      return res.status(403).json({ 
        msg: 'Access denied: You are not enrolled in this session' 
      });
    }

    // Get announcements for the session
    const announcements = await Announcement.find({
      session_id: sessionId
    })
    .populate('mentor_id', 'full_name email')
    .sort({ published_at: -1 });

    if (!announcements || announcements.length === 0) {
      return res.status(404).json({ 
        msg: 'No announcements found for this session',
        count: 0,
        announcements: []
      });
    }

    res.status(200).json({
      msg: 'Announcements retrieved successfully',
      count: announcements.length,
      session_id: sessionId,
      announcements
    });

  } catch (err) {
    res.status(500).json({ msg: 'Failed to retrieve announcements', error: err.message });
  }
};



