import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, Calendar, User, BookOpen, ArrowLeft, Send } from 'lucide-react';
import { studentAPI } from '../../api/student';
import StudentNavbar from '../../components/student/StudentNavbar';
import toast from 'react-hot-toast';

const MyRequests = () => {
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('status'); // 'pending', 'rejected', or null for all
  
  const [requests, setRequests] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelingRequest, setCancelingRequest] = useState(null);
  const [resendingRequest, setResendingRequest] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [requestsRes, enrollmentsRes] = await Promise.all([
        studentAPI.getMyJoinRequests(),
        studentAPI.getMyEnrollments()
      ]);
      
      setRequests(requestsRes.requests || []);
      setEnrollments(enrollmentsRes.enrollments || []);
    } catch (error) {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async (requestId) => {
    try {
      setCancelingRequest(requestId);
      await studentAPI.cancelJoinRequest(requestId);
      toast.success('Request cancelled successfully');
      fetchData(); // Refresh data
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Failed to cancel request');
    } finally {
      setCancelingRequest(null);
    }
  };

  const handleResendRequest = async (sessionId, oldRequestId) => {
    try {
      setResendingRequest(oldRequestId);
      // First cancel the old rejected request
      await studentAPI.cancelJoinRequest(oldRequestId);
      // Then send a new request
      await studentAPI.sendJoinRequest(sessionId);
      toast.success('Request resent successfully');
      fetchData(); // Refresh data
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Failed to resend request');
    } finally {
      setResendingRequest(null);
    }
  };

  // Filter requests based on URL parameter
  const getFilteredRequests = () => {
    if (statusFilter === 'pending') {
      return requests.filter(r => r.isApproved === null || r.isApproved === undefined);
    } else if (statusFilter === 'rejected') {
      return requests.filter(r => r.isApproved === false);
    } else if (statusFilter === 'approved') {
      return requests.filter(r => r.isApproved === true);
    }
    return requests; // Show all if no filter
  };

  const filteredRequests = getFilteredRequests();

  const getPageTitle = () => {
    if (statusFilter === 'pending') return 'Pending Requests';
    if (statusFilter === 'rejected') return 'Rejected Requests';
    if (statusFilter === 'approved') return 'Approved Requests';
    return 'My Requests & Enrollments';
  };

  const getPageDescription = () => {
    if (statusFilter === 'pending') return 'Cancel your pending session requests';
    if (statusFilter === 'rejected') return 'Review rejected requests and resend if available';
    if (statusFilter === 'approved') return 'View your approved session requests';
    return 'Track your session requests and current enrollments';
  };

  const getStatusColor = (isApproved) => {
    if (isApproved === true) {
      return 'bg-green-100 text-green-800';
    } else if (isApproved === false) {
      return 'bg-red-100 text-red-800';
    } else if (isApproved === null || isApproved === undefined) {
      return 'bg-yellow-100 text-yellow-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (isApproved) => {
    if (isApproved === true) {
      return <CheckCircle className="w-4 h-4" />;
    } else if (isApproved === false) {
      return <XCircle className="w-4 h-4" />;
    } else if (isApproved === null || isApproved === undefined) {
      return <Clock className="w-4 h-4" />;
    }
    return <Clock className="w-4 h-4" />;
  };
  
  const getStatusText = (isApproved) => {
    if (isApproved === true) return 'Approved';
    if (isApproved === false) return 'Rejected';
    if (isApproved === null || isApproved === undefined) return 'Pending';
    return 'Pending';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading requests...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentNavbar />
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/student/dashboard"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{getPageTitle()}</h1>
              <p className="text-gray-600">{getPageDescription()}</p>
            </div>
          </div>

          {/* Filter Tabs - Only show if no specific filter */}
          {!statusFilter && (
            <div className="mb-6">
              <div className="flex gap-2 border-b border-gray-200">
                <Link
                  to="/student/requests"
                  className="px-4 py-2 font-medium text-blue-600 border-b-2 border-blue-600"
                >
                  All Requests
                </Link>
                <Link
                  to="/student/requests?status=pending"
                  className="px-4 py-2 font-medium text-gray-600 hover:text-gray-900"
                >
                  Pending
                </Link>
                <Link
                  to="/student/requests?status=rejected"
                  className="px-4 py-2 font-medium text-gray-600 hover:text-gray-900"
                >
                  Rejected
                </Link>
                <Link
                  to="/student/requests?status=approved"
                  className="px-4 py-2 font-medium text-gray-600 hover:text-gray-900"
                >
                  Approved
                </Link>
              </div>
            </div>
          )}

          {/* Join Requests - Full Width */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {statusFilter ? `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Requests` : 'Join Requests'}
            </h2>
            
            {filteredRequests.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p>No {statusFilter || ''} requests found</p>
                <p className="text-sm">
                  {statusFilter === 'pending' && 'You have no pending requests at the moment'}
                  {statusFilter === 'rejected' && 'You have no rejected requests'}
                  {statusFilter === 'approved' && 'You have no approved requests'}
                  {!statusFilter && 'Go to Sessions to request to join a session'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRequests.map((request) => (
                    <div key={request._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{request.session_id?.title}</h3>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${getStatusColor(request.isApproved)}`}>
                          {getStatusIcon(request.isApproved)}
                          {getStatusText(request.isApproved)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{request.session_id?.description}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Requested: {new Date(request.requested_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>Mentor: {request.session_id?.mentor_id?.full_name || 'TBD'}</span>
                        </div>
                      </div>

                      {request.review_message && (
                        <div className="bg-gray-50 rounded p-2 mb-3">
                          <p className="text-xs text-gray-600">
                            <strong>Message:</strong> {request.review_message}
                          </p>
                        </div>
                      )}

                      {/* Rejection Count Warning */}
                      {request.isApproved === false && request.rejection_count > 0 && (
                        <div className={`rounded p-3 mb-3 ${request.rejection_count >= 2 ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                          <p className={`text-xs font-semibold ${request.rejection_count >= 2 ? 'text-red-800' : 'text-yellow-800'}`}>
                            {request.rejection_count >= 2 ? (
                              <>⚠️ Maximum rejections reached ({request.rejection_count}/2). You cannot request this session again.</>
                            ) : (
                              <>⚠️ Rejected {request.rejection_count} time(s). You have {2 - request.rejection_count} more attempt(s) remaining.</>
                            )}
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {/* Cancel button for pending requests */}
                        {(request.isApproved === null || request.isApproved === undefined) && (
                          <button
                            onClick={() => handleCancelRequest(request._id)}
                            disabled={cancelingRequest === request._id}
                            className="flex-1 text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50 bg-red-50 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            {cancelingRequest === request._id ? 'Canceling...' : 'Cancel Request'}
                          </button>
                        )}

                        {/* Resend button for rejected requests (if not max rejections) */}
                        {request.isApproved === false && request.rejection_count < 2 && (
                          <button
                            onClick={() => handleResendRequest(request.session_id._id, request._id)}
                            disabled={resendingRequest === request._id}
                            className="flex-1 text-white bg-blue-600 hover:bg-blue-700 text-sm font-medium disabled:opacity-50 px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                          >
                            <Send className="w-4 h-4" />
                            {resendingRequest === request._id ? 'Resending...' : 'Resend Request'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default MyRequests;
