import React, { useEffect, useState } from 'react';
import { mentorAPI } from '../../api/mentor';
import toast from 'react-hot-toast';
import { ArrowLeft, Edit, Save } from 'lucide-react';

const UpdateSession = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  const [formData, setFormData] = useState({
    max_students: '',
    status: 'pending',
    meeting_schedule: '',
    meeting_platform: '',
    meeting_link: '',
    duration: ''
  });

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await mentorAPI.getMySessions();
      setSessions(res.sessions || []);
    } catch (error) {
      console.error('Fetch sessions error:', error);
      // If it's a 404, it means no sessions are found - this is normal
      if (error.response?.status === 404) {
        setSessions([]);
      } else {
        // Only show error toast for non-404 errors
        toast.error('Failed to load sessions');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSessionSelect = (sessionId) => {
    setSelectedSessionId(sessionId);
    const session = sessions.find(s => (s._id || s.id) === sessionId);
    if (session) {
      setFormData({
        max_students: session.max_students || '',
        status: session.status || 'pending',
        meeting_schedule: session.meeting_schedule 
          ? new Date(session.meeting_schedule).toISOString().slice(0, 16) 
          : '',
        meeting_platform: session.meeting_platform || '',
        meeting_link: session.meeting_link || '',
        duration: session.duration || ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedSessionId) {
      toast.error('Please select a session');
      return;
    }

    setUpdating(true);
    try {
      console.log('Updating session with ID:', selectedSessionId);
      console.log('Form data:', formData);
      
      // Prepare data - convert meeting_schedule to ISO date if provided
      const updateData = {
        ...formData,
        meeting_schedule: formData.meeting_schedule 
          ? new Date(formData.meeting_schedule).toISOString() 
          : null
      };
      
      console.log('Sending data:', updateData);
      
      await mentorAPI.updateSession(selectedSessionId, updateData);
      toast.success('Session updated successfully!');
      // Refresh sessions list
      await fetchSessions();
      setSelectedSessionId('');
      setFormData({
        max_students: '',
        status: 'pending',
        meeting_schedule: '',
        meeting_platform: '',
        meeting_link: '',
        duration: ''
      });
    } catch (error) {
      console.error('Update session error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      toast.error(error.response?.data?.msg || 'Failed to update session');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-blue-900 to-blue-700 flex items-center justify-center">
        <div className="text-white text-xl">Loading sessions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-blue-900 to-blue-700 p-4 md:p-8 relative overflow-hidden">
      {/* Back button */}
      <a
        href="/mentor/dashboard"
        className="absolute top-4 left-4 z-20 bg-white text-blue-700 rounded-full p-2 shadow-lg hover:bg-blue-50 transition"
        title="Back to Dashboard"
      >
        <ArrowLeft className="w-6 h-6" />
      </a>

      {/* Decorative Blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

      {/* Form */}
      <div className="relative z-10 max-w-2xl mx-auto pt-16 md:pt-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Update Session</h1>
          <p className="text-blue-200">Modify your session details</p>
        </div>

        {sessions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <Edit className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No sessions available to update.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            {/* Select Session */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Select Session</label>
              <select
                value={selectedSessionId}
                onChange={(e) => handleSessionSelect(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">-- Choose a session --</option>
                {sessions.map((session) => (
                  <option key={session._id || session.id} value={session._id || session.id}>
                    {session.title} ({session.status})
                  </option>
                ))}
              </select>
            </div>

            {selectedSessionId && (
              <>
                {/* Max Students */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">Max Students</label>
                  <input
                    type="number"
                    value={formData.max_students}
                    onChange={(e) => setFormData({ ...formData, max_students: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    min="1"
                  />
                </div>

                {/* Status */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="canceled">Canceled</option>
                  </select>
                </div>

                {/* Meeting Schedule */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">Meeting Schedule</label>
                  <input
                    type="datetime-local"
                    value={formData.meeting_schedule}
                    onChange={(e) => setFormData({ ...formData, meeting_schedule: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Select the date and time for the meeting</p>
                </div>

                {/* Meeting Platform */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">Meeting Platform</label>
                  <input
                    type="text"
                    value={formData.meeting_platform}
                    onChange={(e) => setFormData({ ...formData, meeting_platform: e.target.value })}
                    placeholder="e.g., Zoom, Google Meet"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Meeting Link */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">Meeting Link</label>
                  <input
                    type="url"
                    value={formData.meeting_link}
                    onChange={(e) => setFormData({ ...formData, meeting_link: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Duration */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">Duration (in Days)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g., 30"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Duration of the session in days</p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={updating}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {updating ? 'Updating...' : 'Update Session'}
                </button>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdateSession;
