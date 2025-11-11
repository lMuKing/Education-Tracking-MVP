import React, { useEffect, useState } from 'react';
import { mentorAPI } from '../../api/mentor';
import toast from 'react-hot-toast';
import { ArrowLeft, Users, Calendar, Clock, ChevronRight } from 'lucide-react';

const SelectSessionForRequests = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

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

      {/* Sessions List */}
      <div className="relative z-10 max-w-4xl mx-auto pt-16 md:pt-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Select Session</h1>
          <p className="text-blue-200">Choose a session to view join requests</p>
        </div>

        {sessions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No sessions found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <a
                key={session.id}
                href={`/mentor/join-requests/${session.id}`}
                className="block bg-white rounded-2xl shadow-xl p-4 md:p-6 border border-gray-100 hover:shadow-2xl hover:border-blue-300 transition"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900">{session.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        session.status === 'active' ? 'bg-green-100 text-green-700' :
                        session.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {session.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm md:text-base line-clamp-2 mb-3">{session.description}</p>
                    <div className="flex flex-wrap gap-4 text-xs md:text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span>{session.current_enrolled_count || 0} / {session.max_students} students</span>
                      </div>
                      {session.createdAt && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span>{new Date(session.createdAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-blue-600 flex-shrink-0" />
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectSessionForRequests;
