const User = require('../Models/userModel');
const bcrypt = require('bcryptjs');

// Student Profile Management:

// Get student's own profile
exports.getProfile = async (req, res) => {
  try {
    const studentId = req.user._id;

    const student = await User.findById(studentId);
    
    if (!student) {
      return res.status(404).json({ msg: 'Student profile not found' });
    }

    res.status(200).json({
      msg: 'Profile retrieved successfully',
      student: {
        id: student._id,
        full_name: student.full_name,
        email: student.email,
        phone_number: student.phone_number,
        profile_image_url: student.profile_image_url,
        user_role: student.user_role,
        is_email_verified: student.is_email_verified,
        created_at: student.created_at,
        updated_at: student.updated_at
      }
    });

  } catch (err) {
    res.status(500).json({ msg: 'Failed to retrieve profile', error: err.message });
  }
};




// Update student's profile (basic info)
exports.updateProfile = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { full_name, phone_number } = req.body;

    // Validation
    if (!full_name && !phone_number) {
      return res.status(400).json({ msg: 'At least one field is required to update' });
    }

    if (full_name && full_name.trim().length === 0) {
      return res.status(400).json({ msg: 'Full name cannot be empty' });
    }

    if (phone_number) {
      const phoneStr = phone_number.toString();
      if (!/^(05|06|07)\d{8}$/.test(phoneStr)) {
        return res.status(400).json({ 
          msg: 'Phone number must be 10 digits and start with 05, 06, or 07' 
        });
      }
    }

    // Find and update student
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }

    // Update fields if provided
    if (full_name) student.full_name = full_name.trim();
    if (phone_number) student.phone_number = phone_number;

    await student.save();

    res.status(200).json({
      msg: 'Profile updated successfully',
      student: {
        id: student._id,
        full_name: student.full_name,
        email: student.email,
        phone_number: student.phone_number,
        profile_image_url: student.profile_image_url,
        user_role: student.user_role,
        updated_at: student.updated_at
      }
    });

  } catch (err) {
    res.status(500).json({ msg: 'Profile update failed', error: err.message });
  }
};



// Change password
exports.changePassword = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { current_password, new_password, confirm_password } = req.body;

    // Validation
    if (!current_password || !new_password || !confirm_password) {
      return res.status(400).json({ msg: 'All password fields are required' });
    }

    if (new_password !== confirm_password) {
      return res.status(400).json({ msg: 'New passwords do not match' });
    }

    if (new_password.length < 6) {
      return res.status(400).json({ msg: 'New password must be at least 6 characters' });
    }

    // Find student
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(current_password, student.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ msg: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(new_password, 12);

    // Update password
    student.password = hashedNewPassword;
    student.password_changed_at = new Date();
    await student.save();

    res.status(200).json({
      msg: 'Password changed successfully',
      password_changed_at: student.password_changed_at
    });

  } catch (err) {
    res.status(500).json({ msg: 'Password change failed', error: err.message });
  }
};





// Update profile image
exports.updateProfileImage = async (req, res) => {
  try {
    const studentId = req.user._id;

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ msg: 'Profile image file is required' });
    }

    // Find and update student
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }

    // Get Cloudinary URL from uploaded file
    student.profile_image_url = req.file.path;
    await student.save();

    res.status(200).json({
      msg: 'Profile image updated successfully',
      student: {
        id: student._id,
        full_name: student.full_name,
        profile_image_url: student.profile_image_url,
        updated_at: student.updated_at
      }
    });

  } catch (err) {
    res.status(500).json({ msg: 'Profile image update failed', error: err.message });
  }
};




// Get academic progress (student-specific feature)
