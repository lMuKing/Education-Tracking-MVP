import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { mentorAPI } from '../../api/mentor';
import toast from 'react-hot-toast';
import { Mail, Phone, Calendar, User, Upload, Shield, CheckCircle, XCircle, Edit3, Save, ArrowLeft, Camera } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import AdminNavbar from '../../components/AdminNavbar';

const Profile = () => {
  const { isDarkMode } = useTheme();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ full_name: '', phone: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await mentorAPI.getProfile();
      // Map backend mentor object to frontend profile
      const mentor = res.mentor || res;
      setProfile({
        id: mentor.id,
        full_name: mentor.full_name,
        email: mentor.email,
        phone: mentor.phone_number,
        profile_image_url: mentor.profile_image_url,
        user_role: mentor.user_role,
        is_email_verified: mentor.is_email_verified,
        createdAt: mentor.created_at,
        updatedAt: mentor.updated_at,
      });
      setForm({
        full_name: mentor.full_name || '',
        phone: mentor.phone_number || '',
      });
      setImagePreview(mentor.profile_image_url);
    } catch (e) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => setEditMode(true);
  
  const handleCancel = () => {
    setEditMode(false);
    setForm({
      full_name: profile.full_name,
      phone: profile.phone,
    });
    setImageFile(null);
    setImagePreview(profile.profile_image_url);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      // Send update profile request
      const updateData = {
        full_name: form.full_name
      };
      
      // Only include phone_number if it has a value
      if (form.phone) {
        updateData.phone_number = form.phone;
      }
      
      await mentorAPI.updateProfile(updateData);
      
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        await mentorAPI.updateProfileImage(formData);
      }
      toast.success('Profile updated successfully!');
      setEditMode(false);
      fetchProfile();
    } catch (e) {
      console.error('Update error:', e.response?.data || e.message);
      toast.error(e.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setChangingPassword(true);
      await mentorAPI.changePassword(passwordData);
      toast.success('Password changed successfully');
      setShowPasswordForm(false);
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleImageUpdate = async (imageUrl) => {
    try {
      await mentorAPI.updateProfileImage(imageUrl);
      toast.success('Profile image updated successfully');
      fetchProfile();
    } catch (error) {
      toast.error('Failed to update profile image');
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900' : 'bg-gray-50'
      }`}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
          <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>Loading profile...</p>
        </div>
      </div>
    );
  }

  // Defensive: If profile is null, show error and retry
  if (!profile) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900' : 'bg-gray-50'
      }`}>
        <div className={`${
          isDarkMode ? 'bg-white/10 backdrop-blur-sm border border-white/20' : 'bg-white'
        } border border-red-400 text-red-700 rounded-lg shadow p-8 text-center`}>
          <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Error</h2>
          <p className={isDarkMode ? 'text-white/80' : 'text-gray-700'}>
            Could not load profile. Backend route may be missing or misconfigured.<br/>Check your backend and try again.
          </p>
          <button
            className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold shadow hover:bg-blue-700"
            onClick={fetchProfile}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${
      isDarkMode ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900' : 'bg-gray-50'
    }`}>
      <AdminNavbar />
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/mentor/dashboard"
              className={`inline-flex items-center gap-2 mb-4 ${
                isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              My Profile
            </h1>
            <p className={isDarkMode ? 'text-white' : 'text-gray-600'}>
              Manage your account information and settings
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className={`rounded-lg shadow-md p-6 ${
                isDarkMode ? 'bg-white/10 backdrop-blur-sm border border-white/20' : 'bg-white'
              }`}>
                <div className="text-center">
                  <div className="relative inline-block">
                    {imagePreview || profile?.profile_image_url ? (
                      <img
                        src={imagePreview || profile?.profile_image_url}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                      />
                    ) : (
                      <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${
                        isDarkMode ? 'bg-white/20' : 'bg-gray-200'
                      }`}>
                        <User className={`w-12 h-12 ${isDarkMode ? 'text-white/50' : 'text-gray-400'}`} />
                      </div>
                    )}
                    <button
                      onClick={() => {
                        const url = prompt('Enter image URL:');
                        if (url) handleImageUpdate(url);
                      }}
                      className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <h2 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {profile?.full_name}
                  </h2>
                  <p className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
                    {profile?.email}
                  </p>
                  
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      profile?.is_email_verified 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {profile?.is_email_verified ? 'Verified' : 'Unverified'}
                    </span>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-400">
                      {profile?.user_role || 'Mentor'}
                    </span>
                  </div>

                  <div className={`text-sm ${isDarkMode ? 'text-white/80' : 'text-gray-500'}`}>
                    <p>Member since {new Date(profile?.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="lg:col-span-2">
              <div className={`rounded-lg shadow-md p-6 ${
                isDarkMode ? 'bg-white/10 backdrop-blur-sm border border-white/20' : 'bg-white'
              }`}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Profile Information
                  </h3>
                  {!editMode ? (
                    <button
                      onClick={handleEdit}
                      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancel}
                        className={`px-4 py-2 border rounded-lg transition-colors ${
                          isDarkMode 
                            ? 'text-white border-white/20 hover:bg-white/10' 
                            : 'text-gray-600 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-700'
                    }`}>Full Name</label>
                    {editMode ? (
                      <input
                        type="text"
                        name="full_name"
                        value={form.full_name}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          isDarkMode 
                            ? 'bg-white/5 border-white/20 text-white placeholder-white/50' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                        {profile?.full_name || 'Not provided'}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-700'
                    }`}>Email Address</label>
                    <div className="flex items-center gap-2">
                      <Mail className={`w-4 h-4 ${isDarkMode ? 'text-white/50' : 'text-gray-400'}`} />
                      <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>{profile?.email}</p>
                      <span className={`text-xs ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>
                        (Cannot be changed)
                      </span>
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-700'
                    }`}>Phone Number</label>
                    {editMode ? (
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          isDarkMode 
                            ? 'bg-white/5 border-white/20 text-white placeholder-white/50' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="05XXXXXXXX"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <Phone className={`w-4 h-4 ${isDarkMode ? 'text-white/50' : 'text-gray-400'}`} />
                        <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                          {profile?.phone || 'Not provided'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Account Status */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-700'
                    }`}>Account Status</label>
                    <div className="flex items-center gap-2">
                      <Shield className={`w-4 h-4 ${isDarkMode ? 'text-white/50' : 'text-gray-400'}`} />
                      <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                        {profile?.is_email_verified ? 'Email Verified' : 'Email Not Verified'}
                      </p>
                    </div>
                  </div>

                  {/* Member Since */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-700'
                    }`}>Member Since</label>
                    <div className="flex items-center gap-2">
                      <Calendar className={`w-4 h-4 ${isDarkMode ? 'text-white/50' : 'text-gray-400'}`} />
                      <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                        {new Date(profile?.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Password Section */}
              <div className={`rounded-lg shadow-md p-6 mt-6 ${
                isDarkMode ? 'bg-white/10 backdrop-blur-sm border border-white/20' : 'bg-white'
              }`}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Security
                  </h3>
                  {!showPasswordForm && (
                    <button
                      onClick={() => setShowPasswordForm(true)}
                      className={`font-medium ${
                        isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                      }`}
                    >
                      Change Password
                    </button>
                  )}
                </div>

                {showPasswordForm ? (
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-white' : 'text-gray-700'
                      }`}>Current Password</label>
                      <input
                        type="password"
                        name="current_password"
                        value={passwordData.current_password}
                        onChange={handlePasswordChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          isDarkMode 
                            ? 'bg-white/5 border-white/20 text-white placeholder-white/50' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="Enter current password"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-white' : 'text-gray-700'
                      }`}>New Password</label>
                      <input
                        type="password"
                        name="new_password"
                        value={passwordData.new_password}
                        onChange={handlePasswordChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          isDarkMode 
                            ? 'bg-white/5 border-white/20 text-white placeholder-white/50' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="Enter new password"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-white' : 'text-gray-700'
                      }`}>Confirm New Password</label>
                      <input
                        type="password"
                        name="confirm_password"
                        value={passwordData.confirm_password}
                        onChange={handlePasswordChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          isDarkMode 
                            ? 'bg-white/5 border-white/20 text-white placeholder-white/50' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="Confirm new password"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setShowPasswordForm(false);
                          setPasswordData({
                            current_password: '',
                            new_password: '',
                            confirm_password: ''
                          });
                        }}
                        className={`px-4 py-2 border rounded-lg transition-colors ${
                          isDarkMode 
                            ? 'text-white border-white/20 hover:bg-white/10' 
                            : 'text-gray-600 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleChangePassword}
                        disabled={changingPassword}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {changingPassword ? 'Changing...' : 'Change Password'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className={isDarkMode ? 'text-white' : 'text-gray-600'}>
                    Click "Change Password" to update your password
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
