import React, { useEffect, useState } from 'react';
import { mentorAPI } from '../../api/mentor';
import toast from 'react-hot-toast';
import { ChevronLeft, Upload, User, Phone } from 'lucide-react';

const UpdateProfile = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ full_name: '', phone: '', profile_image_url: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await mentorAPI.getProfile();
      const mentor = res.mentor || res;
      setProfile({
        id: mentor.id,
        full_name: mentor.full_name,
        email: mentor.email,
        phone: mentor.phone_number,
        profile_image_url: mentor.profile_image_url,
        user_role: mentor.user_role,
      });
      setForm({
        full_name: mentor.full_name || '',
        phone: mentor.phone_number || '',
        profile_image_url: mentor.profile_image_url || '',
      });
      setImagePreview(mentor.profile_image_url);
    } catch (e) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await mentorAPI.updateProfile({ full_name: form.full_name, phone: form.phone });
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        await mentorAPI.updateProfileImage(formData);
      }
      toast.success('Profile updated successfully!');
      setTimeout(() => {
        window.location.href = '/mentor/profile';
      }, 1000);
    } catch (e) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 p-4 md:p-8 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Back button */}
      <a
        href="/mentor/profile"
        className="absolute top-4 left-4 z-20 bg-white text-blue-700 rounded-full p-2 shadow-lg hover:bg-blue-50 transition"
        title="Back to Profile"
      >
        <ChevronLeft className="w-6 h-6" />
      </a>

      {/* Decorative Blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Update Profile Card */}
      <div className="relative z-10 w-full max-w-2xl mx-auto">
        <div className="bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl p-10 w-full border border-gray-100">
          <h3 className="text-3xl font-bold text-gray-900 mb-2">Update Profile</h3>
          <p className="text-gray-600 mb-8">Edit your personal information and profile picture.</p>
          
          <form onSubmit={handleSave} className="space-y-8">
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <img
                  src={imagePreview || '/default-avatar.png'}
                  alt="Profile Preview"
                  className="w-40 h-40 rounded-full object-cover border-4 border-blue-400 shadow-xl"
                />
                <label htmlFor="image-upload" className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer">
                  <Upload className="w-10 h-10 text-white" />
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              <p className="text-sm text-gray-500 mt-3">Click on the image to upload a new photo</p>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-sm text-blue-800">
                  <strong>Email:</strong> {profile?.email}
                </p>
                <p className="text-xs text-blue-600 mt-1">Email cannot be changed from this form</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end pt-4">
              <a
                href="/mentor/profile"
                className="bg-gray-200 text-gray-800 py-3 px-8 rounded-lg font-semibold shadow hover:bg-gray-300 transition"
              >
                Cancel
              </a>
              <button 
                type="submit" 
                disabled={saving}
                className="bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold shadow hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
