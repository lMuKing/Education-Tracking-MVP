import React, { useEffect, useState } from 'react';
import { mentorAPI } from '../../api/mentor';
import toast from 'react-hot-toast';
import { ArrowLeft, Calendar, Clock, Users, Send, Loader, CheckCircle } from 'lucide-react';

const BrowseSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingRequest, setSendingRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch both sessions and mentor's existing requests
      const [sessionsRes, requestsRes] = await Promise.all([
        mentorAPI.getAllSessions().catch(err => {
          if (err.response?.status === 404) return { sessions: [] };
          throw err;
        }),
        mentorAPI.getAllRequests().catch(err => {
          if (err.response?.status === 404) return { Requests: [] };
          throw err;
        })
      ]);
      
      setSessions(sessionsRes.sessions || sessionsRes || []);
      setMyRequests(requestsRes.Requests || requestsRes.requests || []);
    } catch (error) {
      console.error('Fetch data error:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Check if mentor already sent a request for this session
  const hasRequestedSession = (sessionId) => {
    return myRequests.some(req => req.session_id === sessionId);
  };

  const handleOpenModal = (session) => {
    setSelectedSession(session);
    setMessage('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSession(null);
    setMessage('');
  };

  const handleSendRequest = async () => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    if (!selectedSession) return;

    // Use _id or id depending on what backend returns
    const sessionId = selectedSession._id || selectedSession.id;
    console.log('Selected Session:', selectedSession);
    console.log('Session ID to send:', sessionId);

    setSendingRequest(sessionId);
    try {
      await mentorAPI.sendSessionRequest({
        session_id: sessionId,
        message: message
      });
      toast.success('Request sent to admin successfully!');
      handleCloseModal();
      // Refresh requests list to update button states
      const requestsRes = await mentorAPI.getAllRequests();
      setMyRequests(requestsRes.Requests || requestsRes.requests || []);
    } catch (error) {
      console.error('Send request error:', error);
      toast.error(error.response?.data?.msg || error.response?.data?.message || 'Failed to send request');
    } finally {
      setSendingRequest(null);
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

      {/* Sessions Grid */}
      <div className="relative z-10 max-w-6xl mx-auto pt-16 md:pt-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Browse Sessions</h1>
          <p className="text-blue-200">View all available sessions and send requests to admin</p>
        </div>

        {sessions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <p className="text-gray-600 text-lg">No sessions available at the moment.</p>
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
                      alt={session.title || 'Session'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{session.title || session.session_title || `Session #${session.id}`}</h3>
                    <div className="flex flex-col items-end gap-1">
                      {session.status && (
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          session.status === 'active' ? 'bg-green-100 text-green-700' :
                          session.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {session.status}
                        </span>
                      )}
                      {session.price !== undefined && session.price > 0 && (
                        <span className="text-blue-600 font-bold text-sm">
                          ${session.price}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    {session.description && (
                      <p className="text-gray-600 text-sm line-clamp-3">{session.description}</p>
                    )}
                    
                    {session.start_date && (
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span>{new Date(session.start_date).toLocaleDateString()}</span>
                      </div>
                    )}
                    
                    {session.start_time && (
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span>{session.start_time}</span>
                      </div>
                    )}
                    
                    {session.capacity && (
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span>Capacity: {session.capacity}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-6 pb-6">
                  {hasRequestedSession(session.id) ? (
                    <button
                      disabled
                      className="w-full inline-flex items-center justify-center gap-2 bg-gray-400 text-white py-2 px-4 rounded-lg font-semibold shadow-lg cursor-not-allowed"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Request Already Sent
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenModal(session)}
                      disabled={sendingRequest === session.id}
                      className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sendingRequest === session.id ? (
                        <Loader className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                      Send Session Request
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for sending request */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Send Session Request</h2>
            <p className="text-gray-600 mb-4">
              Session: <span className="font-semibold">{selectedSession?.title || selectedSession?.session_title || `Session #${selectedSession?.id}`}</span>
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Message to Admin
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                placeholder="Describe why you want to participate in this session..."
                required
              ></textarea>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSendRequest}
                disabled={sendingRequest}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold shadow hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendingRequest ? 'Sending...' : 'Send Request'}
              </button>
              <button
                onClick={handleCloseModal}
                className="bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold shadow hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseSessions;
