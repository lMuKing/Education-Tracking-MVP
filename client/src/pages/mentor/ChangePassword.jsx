import React, { useState } from 'react';
import { mentorAPI } from '../../api/mentor';
import toast from 'react-hot-toast';
import { ChevronLeft } from 'lucide-react';

const ChangePassword = () => {
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword.length < 8 || !/[a-zA-Z]/.test(passwords.newPassword) || !/[0-9]/.test(passwords.newPassword)) {
      toast.error('Password must be at least 8 characters and contain letters and numbers');
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await mentorAPI.changePassword(passwords.oldPassword, passwords.newPassword);
      toast.success('Password changed successfully');
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (e) {
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

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

      {/* Change Password Card */}
      <div className="relative z-10 w-full max-w-lg mx-auto">
        <div className="bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl p-10 w-full border border-gray-100">
          <h3 className="text-3xl font-bold text-gray-900 mb-2">Change Password</h3>
          <p className="text-gray-600 mb-8">Update your password to keep your account secure.</p>
          <form onSubmit={handlePasswordChange} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
              <input
                type="password"
                value={passwords.oldPassword}
                onChange={e => setPasswords({ ...passwords, oldPassword: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
                placeholder="Enter your current password"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                value={passwords.newPassword}
                onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                required
                placeholder="Enter your new password"
              />
              <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters with letters and numbers</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
              <input
                type="password"
                value={passwords.confirmPassword}
                onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                required
                placeholder="Confirm your new password"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 px-8 rounded-lg font-semibold shadow hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Changing Password...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
