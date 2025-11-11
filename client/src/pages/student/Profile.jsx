import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, Calendar, Shield, Camera, Save, Edit3, ArrowLeft } from 'lucide-react';
import { studentAPI } from '../../api/student';
import StudentNavbar from '../../components/student/StudentNavbar';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user: authUser } = useAuth();
  const { isDarkMode } = useTheme();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: ''
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getProfile();
      setProfile(response.student);
      setFormData({
        full_name: response.student.full_name || '',
        phone_number: response.student.phone_number || ''
      });
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      await studentAPI.updateProfile(formData);
      toast.success('Profile updated successfully');
      setEditing(false);
      fetchProfile(); // Refresh profile data
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setChangingPassword(true);
      await studentAPI.changePassword(passwordData);
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
      await studentAPI.updateProfileImage(imageUrl);
      toast.success('Profile image updated successfully');
      fetchProfile(); // Refresh profile data
    } catch (error) {
      toast.error('Failed to update profile image');
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode 
          ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900' 
          : 'bg-gray-50'
      }`}>
        <div className={`text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Loading profile...
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode 
          ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900' 
          : 'bg-gray-50'
      }`}>
        <div className="text-xl text-red-600">Failed to load profile</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900' 
        : 'bg-gray-50'
    }`}>
      <StudentNavbar />
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/student/dashboard"
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
                    {profile.profile_image_url ? (
                      <img
                        src={profile.profile_image_url}
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
                    {profile.full_name}
                  </h2>
                  <p className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
                    {profile.email}
                  </p>
                  
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      profile.is_email_verified 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {profile.is_email_verified ? 'Verified' : 'Unverified'}
                    </span>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-400">
                      {profile.user_role}
                    </span>
                  </div>

                  <div className={`text-sm ${isDarkMode ? 'text-white/80' : 'text-gray-500'}`}>
                    <p>Member since {new Date(profile.created_at).toLocaleDateString()}</p>
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
                  {!editing ? (
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditing(false);
                          setFormData({
                            full_name: profile.full_name || '',
                            phone_number: profile.phone_number || ''
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
                        onClick={handleSaveProfile}
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
                    {editing ? (
                      <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          isDarkMode 
                            ? 'bg-white/5 border-white/20 text-white placeholder-white/50' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                        {profile.full_name || 'Not provided'}
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
                      <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>{profile.email}</p>
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
                    {editing ? (
                      <input
                        type="tel"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
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
                          {profile.phone_number || 'Not provided'}
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
                        {profile.is_email_verified ? 'Email Verified' : 'Email Not Verified'}
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
                        {new Date(profile.created_at).toLocaleDateString()}
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
