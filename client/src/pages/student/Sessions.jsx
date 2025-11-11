import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Calendar, Users, BookOpen, Clock, CheckCircle, XCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { studentAPI } from '../../api/student';
import StudentNavbar from '../../components/student/StudentNavbar';
import toast from 'react-hot-toast';

const Sessions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sessions, setSessions] = useState([]);
  const [myEnrollments, setMyEnrollments] = useState([]);
  const [myJoinRequests, setMyJoinRequests] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [joiningSession, setJoiningSession] = useState(null);
  
  // Check if redirected from landing page with session intent
  const intendedSessionId = location.state?.sessionId;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = sessions.filter(session =>
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSessions(filtered);
  }, [searchTerm, sessions]);

  // Auto-join if came from landing page
  useEffect(() => {
    if (intendedSessionId && sessions.length > 0 && !joiningSession) {
      const session = sessions.find(s => s._id === intendedSessionId);
      if (session) {
        const status = getSessionStatus(session._id);
        if (status.type === 'available') {
          toast('Sending join request for the session you selected...', {
            icon: 'ℹ️',
          });
          handleJoinSession(intendedSessionId);
        }
      }
      // Clear the state so it doesn't auto-join again
      window.history.replaceState({}, document.title);
    }
  }, [intendedSessionId, sessions, joiningSession]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [sessionsRes, enrollmentsRes, requestsRes] = await Promise.all([
        studentAPI.getAllSessions().catch(err => {
          if (err.response?.status === 404) return { sessions: [] };
          throw err;
        }),
        studentAPI.getMyEnrollments().catch(err => {
          if (err.response?.status === 404) return { enrollments: [] };
          throw err;
        }),
        studentAPI.getMyJoinRequests().catch(err => {
          if (err.response?.status === 404) return { requests: [] };
          throw err;
        })
      ]);
      
      setSessions(sessionsRes.sessions || []);
      setFilteredSessions(sessionsRes.sessions || []);
      setMyEnrollments(enrollmentsRes.enrollments || []);
      setMyJoinRequests(requestsRes.requests || []);
    } catch (error) {
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSession = async (sessionId) => {
    try {
      setJoiningSession(sessionId);
      
      await studentAPI.sendJoinRequest(sessionId);
      toast.success('Join request sent successfully! Your request is pending mentor approval.');
      
      // Refresh data to update status
      await fetchData();
    } catch (error) {
      
      // Handle specific error cases
      if (error.response?.status === 403) {
        // Maximum rejections reached
        const rejectionCount = error.response?.data?.rejection_count || 2;
        const reason = error.response?.data?.reason || 'No reason provided';
        toast.error(
          `You have been rejected ${rejectionCount} times for this session and cannot request again. Reason: ${reason}`,
          { duration: 6000 }
        );
      } else {
        toast.error(error.response?.data?.msg || error.response?.data?.message || 'Failed to send join request');
      }
    } finally {
      setJoiningSession(null);
    }
  };

  const handleCancelRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to cancel this join request?')) return;
    
    try {
      await studentAPI.cancelJoinRequest(requestId);
      toast.success('Join request cancelled');
      fetchData(); // Refresh data
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Failed to cancel request');
    }
  };

  const getSessionStatus = (sessionId) => {
    // Check if already enrolled
    const enrollment = myEnrollments.find(e => e.session_id?._id === sessionId);
    if (enrollment) {
      return { type: 'enrolled', status: 'Enrolled', color: 'green' };
    }

    // Check if join request exists
    const request = myJoinRequests.find(r => r.session_id?._id === sessionId);
    if (request) {
      if (request.isApproved === true) {
        return { type: 'approved', status: 'Approved', color: 'green' };
      } else if (request.isApproved === false) {
        return { type: 'rejected', status: 'Rejected', color: 'red' };
      } else if (request.isApproved === null || request.isApproved === undefined) {
        return { type: 'pending', status: 'Request Pending', color: 'yellow' };
      }
    }

    return { type: 'available', status: 'Available', color: 'blue' };
  };

  const getStatusIcon = (statusType) => {
    switch (statusType) {
      case 'enrolled':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-blue-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <StudentNavbar />
        <div className="p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
            <p className="text-xl text-gray-600">Loading sessions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentNavbar />
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Link
              to="/student/dashboard"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Sessions</h1>
            <p className="text-gray-600">Browse and join sessions created by administrators</p>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search sessions by title or description..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                  <p className="text-2xl font-bold text-gray-900">{sessions.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Enrolled</p>
                  <p className="text-2xl font-bold text-gray-900">{myEnrollments.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {myJoinRequests.filter(r => r.isApproved === null || r.isApproved === undefined).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sessions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions available</h3>
                <p className="text-gray-500 mb-4">Check back later for new sessions.</p>
              </div>
            ) : (
              filteredSessions.map((session) => {
                const status = getSessionStatus(session._id);
                const currentRequest = myJoinRequests.find(r => r.session_id?._id === session._id);
                
                return (
                  <div key={session._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
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
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{session.title}</h3>
                        <div className="flex flex-col items-end gap-1 ml-2">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full flex items-center gap-1 whitespace-nowrap ${
                            status.color === 'green' ? 'bg-green-100 text-green-800' :
                            status.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                            status.color === 'red' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {getStatusIcon(status.type)}
                            {status.status}
                          </span>
                          {session.price !== undefined && session.price > 0 && (
                            <span className="text-blue-600 font-bold text-sm">
                              ${session.price}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">{session.description}</p>
                      
                      <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{session.start_date ? new Date(session.start_date).toLocaleDateString() : 'TBD'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{session.mentor_id?.full_name || 'TBD'}</span>
                        </div>
                      </div>

                      {/* Review message if rejected */}
                      {currentRequest?.review_message && status.type === 'rejected' && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-xs font-semibold text-red-900 mb-1">Rejection Reason:</p>
                          <p className="text-sm text-red-700">{currentRequest.review_message}</p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        {status.type === 'enrolled' ? (
                          <button
                            disabled
                            className="flex-1 flex items-center justify-center gap-2 bg-green-100 text-green-800 px-3 py-2 rounded-lg font-medium cursor-not-allowed"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Already Enrolled
                          </button>
                        ) : status.type === 'approved' ? (
                          <button
                            disabled
                            className="flex-1 flex items-center justify-center gap-2 bg-green-100 text-green-800 px-3 py-2 rounded-lg font-medium cursor-not-allowed"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Request Approved
                          </button>
                        ) : status.type === 'pending' ? (
                          <button
                            onClick={() => handleCancelRequest(currentRequest._id)}
                            className="flex-1 flex items-center justify-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg font-medium hover:bg-yellow-200 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                            Cancel Request
                          </button>
                        ) : (
                          <button
                            onClick={() => handleJoinSession(session._id)}
                            disabled={joiningSession === session._id}
                            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {joiningSession === session._id ? (
                              <>
                                <Clock className="w-4 h-4 animate-spin" />
                                Sending Request...
                              </>
                            ) : (
                              <>
                                <BookOpen className="w-4 h-4" />
                                {status.type === 'rejected' ? 'Request Again' : 'Join Session'}
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sessions;