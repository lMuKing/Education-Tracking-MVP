import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Search, Calendar, User, ArrowLeft } from 'lucide-react';
import { adminAPI } from '../../api/admin';
import toast from 'react-hot-toast';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    const filtered = announcements.filter(announcement =>
      announcement.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.mentor_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAnnouncements(filtered);
  }, [searchTerm, announcements]);

  const fetchAnnouncements = async () => {
    try {
      const response = await adminAPI.getAllAnnouncements();
      setAnnouncements(response.announcements || []);
      setFilteredAnnouncements(response.announcements || []);
    } catch (error) {
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-xl">Loading announcements...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 relative">
      {/* Back Button */}
      <a
        href="/admin/dashboard"
        className="absolute top-4 left-4 z-20 bg-white text-blue-700 rounded-full p-2 shadow-lg hover:bg-blue-50 transition"
        title="Back to Dashboard"
      >
        <ArrowLeft className="w-6 h-6" />
      </a>

      <div className="max-w-7xl mx-auto pt-8">
        <div className="flex items-center gap-3 mb-8">
          <Bell className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search announcements by title, content, or mentor..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {filteredAnnouncements.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
              No announcements found
            </div>
          ) : (
            filteredAnnouncements.map((announcement) => (
              <div key={announcement.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-900">{announcement.title}</h2>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    Announcement
                  </span>
                </div>

                <p className="text-gray-700 mb-4 leading-relaxed">{announcement.content}</p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  {announcement.mentor_name && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>By: <span className="font-semibold text-gray-700">{announcement.mentor_name}</span></span>
                    </div>
                  )}

                  {announcement.created_at && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(announcement.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Announcements;
