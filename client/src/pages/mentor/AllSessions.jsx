import React, { useEffect, useState } from 'react';
import { mentorAPI } from '../../api/mentor';
import toast from 'react-hot-toast';
import { ArrowLeft, BookOpen, Users, Calendar, Clock } from 'lucide-react';

const AllSessions = () => {
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
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

      {/* Sessions List */}
      <div className="relative z-10 max-w-6xl mx-auto pt-16 md:pt-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">My Sessions</h1>
          <p className="text-blue-200">All your sessions</p>
        </div>

        {sessions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No sessions found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <div key={session.id} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition">
                {/* Session Image */}
                {session.session_image && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={session.session_image}
                      alt={session.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{session.title}</h3>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        session.status === 'active' ? 'bg-green-100 text-green-700' :
                        session.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {session.status}
                      </span>
                      {session.price !== undefined && session.price > 0 && (
                        <span className="text-blue-600 font-bold text-sm">
                          ${session.price}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">{session.description}</p>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span>{session.current_enrolled_count} / {session.max_students} students</span>
                    </div>
                    {session.duration && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span>{session.duration}</span>
                      </div>
                    )}
                    {session.createdAt && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span>Created: {new Date(session.createdAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <a
                      href={`/mentor/session/${session.id}`}
                      className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                    >
                      Open the session →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllSessions;
