


const User = require('../Models/userModel');
const Session = require('../Models/sessionModel');
const Request = require('../Models/requestModel');
const Announcement = require('../Models/announcementModel');
const SessionEnrollment = require('../Models/sessionEnrollmentModel');
const Course = require('../Models/courseModel');
const CourseEnrollment = require('../Models/courseEnrollement');
const Homework = require('../Models/homeworkModel');
const HomeworkEnrollment = require('../Models/homeworkEnrollementModel');
const cloudinary = require('../Config/cloudinary');


// Users Management


exports.FindUsers_All = async (req,res) => {

try{

    // Only fetch users who have verified their email
    const users = await User.find({ is_email_verified: true });

    if (!users || users.length === 0) {
      return res.status(404).json({ msg: 'No verified users found' });
    }

    const formattedUsers = users.map(user => ({ // Use .map() to format each user (return only needed fields).
      id: user._id,
      full_name: user.full_name,
      email: user.email,
      user_role: user.user_role
    }));

    
    res.status(200).json({
      msg: 'Verified users found:',
      users: formattedUsers
    });


}catch(err){
    res.status(500).json({ msg: 'Search failed', error: err.message });

}
}



exports.FindUsers_byID = async (req,res) => {

try{

const { id } = req.params;

if (!id) return res.status(400).json({ msg: 'ID is required' });

const user = await User.findOne({ _id : id});
if (!user) return res.status(400).json({ msg: 'User Does not Exist' });

res.status(200).json({
 msg: 'User Exist',
user: {
    id: user._id,
    full_name: user.full_name,
    email: user.email,
    user_role: user.user_role
},

});

}catch(err){
    res.status(500).json({ msg: 'Search failed', error: err.message });

}
}




exports.UpdateRoles = async (req,res) => {

try{
    const{ id } = req.params;

    const{ role } = req.body;

    if (!id) return res.status(400).json({ msg: 'ID is required' });
    if (!role) return res.status(400).json({ msg: 'New role is required' });

    const user = await User.findOne({ _id : id});
    if (!user) return res.status(400).json({ msg: 'User Does not Exist' });

    user.user_role = role;
    await user.save();
    
    res.status(200).json({
    msg: 'User Updated',
    user: {
    id: user._id,
    full_name: user.full_name,
    email: user.email,
    user_role: user.user_role

 } });

}catch(err){

res.status(500).json({msg : 'Update Failed', error : err.message});
}}




exports.DeleteUser = async (req,res) => {

try{


  const{ id } = req.params;

    if (!id) return res.status(400).json({ msg: 'ID is required' });

    const user = await User.findOne({ _id : id});
    if (!user) return res.status(400).json({ msg: 'User Does not Exist' });

    await User.deleteOne({ _id: id });

    res.status(200).json({ msg: 'User deleted successfully' });




}catch(err){

res.status(500).json({msg : 'Delete Failed' , error :err.message})

}
}


// Sessions Management


exports.Create_Session = async (req,res) => {

try{
const {title, description, status, price, session_category} = req.body;

console.log('📸 Create Session - Image Upload Debug:');
console.log('  - Has file:', !!req.file);
console.log('  - File details:', req.file ? {
    fieldname: req.file.fieldname,
    originalname: req.file.originalname,
    path: req.file.path
  } : 'No file');
console.log('  - Body fields:', Object.keys(req.body));

if (!title || !description || !status) {
    return res.status(400).json({ msg: 'Title, description, and status are required' });
 }

// Get the Cloudinary URL if file was uploaded
const session_image = req.file ? req.file.path : null;

console.log('  - Saving image URL:', session_image);

const session = await Session.create({
title,
description,
status,
price: price || 0,
session_image: session_image,
session_category: session_category || null
})

console.log('  ✅ Session created with image:', session.session_image);

res.status(201).json({ msg: 'Session created successfully.',
session:{
id:session._id,
title:session.title,
description:session.description,
status : session.status,
price: session.price,
session_image: session.session_image,
session_category: session.session_category
}});

}catch(err){
console.error('  ❌ Create Session Error:', err);
res.status(500).json({msg : 'Session Creation Failed' , error : err.message});
}
}



exports.FindSessions_All = async (req,res) => {

try{

    const sessions = await Session.find()
      .populate('mentor_id', 'full_name email profile_image_url phone_number'); // Populate mentor details

    if (!sessions || sessions.length === 0) {
      return res.status(404).json({ msg: 'No sessions found', sessions: [] });
    }

    // Format sessions with all information
    const formattedSessions = sessions.map(session => ({
        id: session._id,
        title: session.title,
        description: session.description,
        status: session.status,
        price: session.price || 0,
        session_image: session.session_image || null,
        session_category: session.session_category || null,
        mentor_id: session.mentor_id || null,
        reviews: session.reviews || 0,
        max_students: session.max_students || 0,
        current_enrolled_count: session.current_enrolled_count || 0,
        duration: session.duration || 0,
        timezone: session.timezone || null,
        meeting_schedule: session.meeting_schedule || null,
        meeting_platform: session.meeting_platform || null,
        meeting_link: session.meeting_link || null,
        created_at: session.created_at,
        updated_at: session.updated_at
    }));

    res.status(200).json({
      msg: 'All sessions retrieved successfully',
      count: formattedSessions.length,
      sessions: formattedSessions
    });


}catch(err){
    console.error('FindSessions_All Error:', err);
    res.status(500).json({ msg: 'Search failed', error: err.message });

}
}



exports.FindSession_byID = async (req,res) => {

try{

const { id } = req.params;

if (!id) return res.status(400).json({ msg: 'ID is required' });

const session = await Session.findOne({ _id : id})
  .populate('mentor_id', 'full_name email profile_image_url phone_number');

if (!session) return res.status(400).json({ msg: 'Session Does not Exist' });

res.status(200).json({
 msg: 'Session Exist',
session: {
    id: session._id,
    title: session.title,
    description: session.description,
    status: session.status,
    price: session.price,
    session_image: session.session_image,
    session_category: session.session_category,
    mentor_id: session.mentor_id,
    reviews: session.reviews,
    max_students: session.max_students,
    current_enrolled_count: session.current_enrolled_count,
    duration: session.duration,
    timezone: session.timezone,
    meeting_schedule: session.meeting_schedule,
    meeting_platform: session.meeting_platform,
    meeting_link: session.meeting_link,
    created_at: session.created_at,
    updated_at: session.updated_at
},

});

}catch(err){
    res.status(500).json({ msg: 'Search failed', error: err.message });

}
}






exports.UpdateSession = async (req,res) => {

try{
    const{ id } = req.params;
    const { title, description, status, price, session_category } = req.body;

    console.log('📸 Update Session - Image Upload Debug:');
    console.log('  - Session ID:', id);
    console.log('  - Has file:', !!req.file);
    console.log('  - File details:', req.file ? {
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        path: req.file.path
      } : 'No file');
    console.log('  - Body fields:', Object.keys(req.body));

    if (!id) return res.status(400).json({ msg: 'ID is required' });

    const session = await Session.findOne({ _id : id});
    if (!session) return res.status(400).json({ msg: 'session Does not Exist' });

    console.log('  - Current image URL:', session.session_image);

    // Update fields if provided
    if (title) session.title = title;
    if (description) session.description = description;
    if (status) session.status = status;
    if (price !== undefined) session.price = price;
    if (session_category !== undefined) session.session_category = session_category;
    
    // Update session image if new file was uploaded
    if (req.file) {
      console.log('  - New image URL:', req.file.path);
      session.session_image = req.file.path; // Cloudinary URL
    }
    
    await session.save();
    
    console.log('  ✅ Session updated, final image URL:', session.session_image);
    
    res.status(200).json({
    msg: 'session Updated',
    session: {
    id: session._id,
    title: session.title,
    description: session.description,
    status: session.status,
    price: session.price,
    session_image: session.session_image,
    session_category: session.session_category
 } });

}catch(err){
console.error('=== Update Session Error Details ===');
console.error('Error message:', err.message);
console.error('Error stack:', err.stack);
console.error('Full error:', err);
res.status(500).json({msg : 'Update Failed', error : err.message});
}}




exports.DeleteSession = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ msg: 'ID is required' });

    const session = await Session.findOne({ _id: id });
    if (!session) return res.status(400).json({ msg: 'Session does not exist' });

    let deletedImages = {
      sessionImages: 0,
      homeworkImages: 0
    };

    // Helper function to delete image from Cloudinary
    const deleteCloudinaryImage = async (imageUrl) => {
      try {
        if (!imageUrl) return;
        // Extract public_id from Cloudinary URL
        const urlParts = imageUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const publicId = `edtrack/sessions/${fileName.split('.')[0]}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
      }
    };

    // Delete session image from Cloudinary
    if (session.session_image) {
      await deleteCloudinaryImage(session.session_image);
      deletedImages.sessionImages++;
    }

    // 1. Find all courses related to this session
    const courses = await Course.find({ session_id: id });
    const courseIds = courses.map(course => course._id);

    // 2. Delete all homework enrollments and their images from Cloudinary
    if (courseIds.length > 0) {
      // Find all homeworks for these courses
      const homeworks = await Homework.find({ course_id: { $in: courseIds } });
      const homeworkIds = homeworks.map(hw => hw._id);

      if (homeworkIds.length > 0) {
        // Find all homework enrollments to delete their images
        const homeworkEnrollments = await HomeworkEnrollment.find({
          homework_id: { $in: homeworkIds }
        });

        // Delete homework submission images from Cloudinary
        for (const enrollment of homeworkEnrollments) {
          if (enrollment.submission_images && enrollment.submission_images.length > 0) {
            for (const imageUrl of enrollment.submission_images) {
              try {
                // Extract public_id from Cloudinary URL
                const urlParts = imageUrl.split('/');
                const fileNameWithExt = urlParts[urlParts.length - 1];
                const fileName = fileNameWithExt.split('.')[0];
                const homeworkId = urlParts[urlParts.length - 3];
                const studentId = urlParts[urlParts.length - 2];
                const publicId = `edtrack/homework_submissions/${homeworkId}/${studentId}/${fileName}`;
                
                await cloudinary.uploader.destroy(publicId);
                deletedImages.homeworkImages++;
              } catch (error) {
                console.error('Error deleting homework image from Cloudinary:', error);
              }
            }
          }
        }

        // Delete homework enrollments
        const deletedHomeworkEnrollments = await HomeworkEnrollment.deleteMany({
          homework_id: { $in: homeworkIds }
        });
        console.log(`Deleted ${deletedHomeworkEnrollments.deletedCount} homework enrollments`);

        // Delete homeworks
        const deletedHomeworks = await Homework.deleteMany({
          course_id: { $in: courseIds }
        });
        console.log(`Deleted ${deletedHomeworks.deletedCount} homeworks`);
      }

      // 3. Delete course enrollments
      const deletedCourseEnrollments = await CourseEnrollment.deleteMany({
        course_id: { $in: courseIds }
      });
      console.log(`Deleted ${deletedCourseEnrollments.deletedCount} course enrollments`);

      // 4. Delete courses
      const deletedCourses = await Course.deleteMany({ session_id: id });
      console.log(`Deleted ${deletedCourses.deletedCount} courses`);
    }

    // 5. Delete session enrollments
    const deletedSessionEnrollments = await SessionEnrollment.deleteMany({
      session_id: id
    });
    console.log(`Deleted ${deletedSessionEnrollments.deletedCount} session enrollments`);

    // 6. Delete announcements related to this session
    const deletedAnnouncements = await Announcement.deleteMany({ session_id: id });
    console.log(`Deleted ${deletedAnnouncements.deletedCount} announcements`);

    // 7. Delete mentor requests for this session
    const deletedRequests = await Request.deleteMany({ session_id: id });
    console.log(`Deleted ${deletedRequests.deletedCount} mentor requests`);

    // 8. Finally, delete the session itself
    await Session.deleteOne({ _id: id });

    res.status(200).json({
      msg: 'Session and all related data deleted successfully',
      deletedData: {
        session: 1,
        courses: courseIds.length,
        sessionEnrollments: deletedSessionEnrollments.deletedCount,
        courseEnrollments: courseIds.length > 0 ? (await CourseEnrollment.countDocuments({ course_id: { $in: courseIds } })) : 0,
        announcements: deletedAnnouncements.deletedCount,
        mentorRequests: deletedRequests.deletedCount,
        images: {
          sessionImages: deletedImages.sessionImages,
          homeworkSubmissionImages: deletedImages.homeworkImages
        }
      }
    });
  } catch (err) {
    console.error('Delete Session Error:', err);
    res.status(500).json({ msg: 'Delete failed', error: err.message });
  }
};


// approve mentor 

exports.ApproveRequest = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ msg: 'ID is required' });

    const request = await Request.findOne({ _id: id });
    if (!request) return res.status(400).json({ msg: 'Request does not exist' });

    // ✅ Fetch mentor's full name
    const mentor = await User.findById(request.mentor_id);
    if (!mentor) return res.status(404).json({ msg: 'Mentor not found' });

    request.isApproved = true;
    await request.save();

    // ✅ Update the session's mentor_id
    await Session.findByIdAndUpdate(
      request.session_id,
      { mentor_id: request.mentor_id },
      { new: true }
    );

    res.status(200).json({
      msg: `Request approved successfully, now '${mentor.full_name}' becomes the session manager`
    });

  } catch (err) {
    res.status(500).json({ msg: 'Approve failed', error: err.message });
  }
};


// reject mentor request

exports.RejectRequest = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ msg: 'ID is required' });

    const request = await Request.findOne({ _id: id })
      .populate('mentor_id', 'full_name')
      .populate('session_id', 'title');

    if (!request) return res.status(400).json({ msg: 'Request does not exist' });

    // Delete the request
    await Request.deleteOne({ _id: id });

    res.status(200).json({
      msg: `Request rejected and deleted successfully`,
      deletedRequest: {
        mentor: request.mentor_id?.full_name,
        session: request.session_id?.title,
        message: request.message
      }
    });

  } catch (err) {
    res.status(500).json({ msg: 'Reject failed', error: err.message });
  }
};





exports.getAllRequests = async (req,res) => {

try{
    const Requests = await Request.find()
      .populate('mentor_id', 'full_name email')
      .populate('session_id', 'title description');

    if (!Requests || Requests.length === 0) {
      return res.status(404).json({ msg: 'No Requests found' });
    }

    res.status(200).json({
      msg: 'Requests found:',
      count: Requests.length,
      Requests: Requests
    });


}catch(err){
    res.status(500).json({ msg: 'Search failed', error: err.message });

}
}




// Get all announcements (for admin dashboard)
exports.getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({})
      .populate('mentor_id', 'full_name') // Populate mentor details
      .populate('session_id', 'title') // Populate session details
      .sort({ published_at: -1 });

    if (!announcements || announcements.length === 0) {
      return res.status(404).json({ 
        msg: 'No announcements found in the system',
        count: 0,
        announcements: []
      });
    }

    res.status(200).json({
      msg: 'All announcements retrieved successfully',
      count: announcements.length,
      announcements
    });

  } catch (err) {
    res.status(500).json({ msg: 'Failed to retrieve announcements', error: err.message });
  }
};


