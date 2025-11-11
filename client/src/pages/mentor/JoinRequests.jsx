import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { mentorAPI } from '../../api/mentor';
import toast from 'react-hot-toast';
import { ArrowLeft, UserCheck, UserX, Calendar, Mail, Phone, User, MessageSquare } from 'lucide-react';

const JoinRequests = () => {
  const { sessionId } = useParams();
  const [allRequests, setAllRequests] = useState([]);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [reviewingId, setReviewingId] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reviewMessage, setReviewMessage] = useState('');

  useEffect(() => {
    fetchJoinRequests();
  }, [sessionId]);

  // Client-side filtering
  const requests = allRequests.filter((request) => {
    if (filter === 'all') return true;
    // Check for both null and undefined for pending
    if (filter === 'pending') return request.isApproved === null || request.isApproved === undefined;
    if (filter === 'approved') return request.isApproved === true;
    if (filter === 'rejected') return request.isApproved === false;
    return true;
  });

  const fetchJoinRequests = async () => {
    setLoading(true);
    try {
      const res = await mentorAPI.getJoinRequests(sessionId);
      setAllRequests(res.requests || []);
      setSessionInfo(res.session);
    } catch (error) {
      console.error('Fetch join requests error:', error);
      toast.error(error.response?.data?.msg || 'Failed to load join requests');
    } finally {
      setLoading(false);
    }
  };

  const openReviewModal = (request) => {
    setSelectedRequest(request);
    setReviewMessage('');
    setShowReviewModal(true);
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedRequest(null);
    setReviewMessage('');
  };

  const handleReview = async (action, request = null) => {
    const requestToReview = request || selectedRequest;
    if (!requestToReview) return;

    setReviewingId(requestToReview._id);
    try {
      const response = await mentorAPI.reviewJoinRequest(sessionId, requestToReview._id, action, reviewMessage);
      
      if (action === 'approve') {
        toast.success('Student approved and enrolled successfully!');
      } else {
        // Show rejection message with warning if applicable
        const rejectionCount = response.data?.rejection_count || 0;
        const warning = response.data?.warning;
        
        if (warning) {
          toast.error(`Request rejected. ${warning}`, { duration: 5000 });
        } else if (rejectionCount > 0) {
          toast.success(`Request rejected. Student has been rejected ${rejectionCount} time(s).`, { duration: 4000 });
        } else {
          toast.success('Join request rejected');
        }
      }
      
      closeReviewModal();
      fetchJoinRequests(); // Refresh the list
    } catch (error) {
      console.error('Review join request error:', error);
      toast.error(error.response?.data?.msg || 'Failed to review request');
    } finally {
      setReviewingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-blue-900 to-blue-700 flex items-center justify-center">
        <div className="text-white text-xl">Loading join requests...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-blue-900 to-blue-700 p-4 md:p-8 relative overflow-hidden">
      {/* Back button */}
      <a
        href="/mentor/select-session-requests"
        className="absolute top-4 left-4 z-20 bg-white text-blue-700 rounded-full p-2 shadow-lg hover:bg-blue-50 transition"
        title="Back to Sessions"
      >
        <ArrowLeft className="w-6 h-6" />
      </a>

      {/* Decorative Blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

      {/* Requests List */}
      <div className="relative z-10 max-w-5xl mx-auto pt-16 md:pt-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Join Requests</h1>
          {sessionInfo && (
            <p className="text-blue-200 text-lg">Session: {sessionInfo.title}</p>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center gap-2 md:gap-4 mb-6 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 md:px-6 py-2 rounded-lg font-semibold transition text-sm md:text-base ${
              filter === 'all'
                ? 'bg-white text-blue-700 shadow-lg'
                : 'bg-blue-800 text-white hover:bg-blue-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 md:px-6 py-2 rounded-lg font-semibold transition text-sm md:text-base ${
              filter === 'pending'
                ? 'bg-white text-blue-700 shadow-lg'
                : 'bg-blue-800 text-white hover:bg-blue-700'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 md:px-6 py-2 rounded-lg font-semibold transition text-sm md:text-base ${
              filter === 'approved'
                ? 'bg-white text-blue-700 shadow-lg'
                : 'bg-blue-800 text-white hover:bg-blue-700'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 md:px-6 py-2 rounded-lg font-semibold transition text-sm md:text-base ${
              filter === 'rejected'
                ? 'bg-white text-blue-700 shadow-lg'
                : 'bg-blue-800 text-white hover:bg-blue-700'
            }`}
          >
            Rejected
          </button>
        </div>

        {requests.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No join requests found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request._id} className="bg-white rounded-2xl shadow-xl p-4 md:p-6 border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                  {/* Student Info */}
                  <div className="flex items-start gap-3 md:gap-4 flex-1">
                    <img
                      src={request.student_id?.profile_image_url || '/default-avatar.png'}
                      alt={request.student_id?.full_name}
                      className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 border-blue-200 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                        {request.student_id?.full_name}
                      </h3>
                      <div className="space-y-1 text-xs md:text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3 md:w-4 md:h-4 text-blue-600 flex-shrink-0" />
                          <span className="truncate">{request.student_id?.email}</span>
                        </div>
                        {request.student_id?.phone_number && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3 md:w-4 md:h-4 text-blue-600 flex-shrink-0" />
                            <span>{request.student_id.phone_number}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 md:w-4 md:h-4 text-blue-600 flex-shrink-0" />
                          <span>Requested: {new Date(request.requested_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      {request.message && (
                        <div className="mt-3 text-xs md:text-sm">
                          <div className="flex items-start gap-2 text-gray-700 bg-gray-50 p-3 rounded-lg">
                            <MessageSquare className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <strong>Message:</strong> {request.message}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Rejection Count Warning */}
                      {request.rejection_count > 0 && (
                        <div className="mt-3 text-xs md:text-sm">
                          <div className={`flex items-start gap-2 p-3 rounded-lg ${
                            request.rejection_count >= 1 ? 'bg-orange-50 border border-orange-200' : 'bg-yellow-50 border border-yellow-200'
                          }`}>
                            <MessageSquare className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            <div className="text-orange-800">
                              <strong>Warning:</strong> This student has been rejected {request.rejection_count} time(s). 
                              {request.rejection_count >= 1 && <span className="font-semibold"> One more rejection will permanently block them from this session.</span>}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex flex-col items-end gap-3">
                    <span
                      className={`px-3 md:px-4 py-1 rounded-full text-xs md:text-sm font-semibold ${
                        request.isApproved === true
                          ? 'bg-green-100 text-green-700'
                          : request.isApproved === false
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {request.isApproved === true
                        ? 'Approved'
                        : request.isApproved === false
                        ? 'Rejected'
                        : 'Pending'}
                    </span>

                    {(request.isApproved === null || request.isApproved === undefined) && (
                      <div className="flex flex-col gap-2 w-full">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReview('approve', request)}
                            disabled={reviewingId === request._id}
                            className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg font-semibold shadow hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 text-xs md:text-sm"
                          >
                            <UserCheck className="w-3 h-3 md:w-4 md:h-4" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleReview('reject', request)}
                            disabled={reviewingId === request._id}
                            className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg font-semibold shadow hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 text-xs md:text-sm"
                          >
                            <UserX className="w-3 h-3 md:w-4 md:h-4" />
                            <span>Reject</span>
                          </button>
                        </div>
                        <button
                          onClick={() => openReviewModal(request)}
                          className="bg-blue-600 text-white px-3 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition text-xs md:text-sm"
                        >
                          Add Review Message
                        </button>
                      </div>
                    )}

                    {request.reviewed_at && (
                      <div className="text-xs text-gray-500 text-right">
                        <div>Reviewed: {new Date(request.reviewed_at).toLocaleDateString()}</div>
                        {request.review_message && (
                          <div className="mt-1 bg-gray-50 p-2 rounded max-w-xs">
                            <strong>Note:</strong> {request.review_message}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Review Join Request</h2>
            <p className="text-gray-600 mb-4">
              Student: <strong>{selectedRequest.student_id?.full_name}</strong>
            </p>

            {/* Review Message */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2 text-sm">
                Review Message (Optional)
              </label>
              <textarea
                value={reviewMessage}
                onChange={(e) => setReviewMessage(e.target.value)}
                placeholder="Add a note about your decision..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] text-sm"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => handleReview('approve')}
                disabled={reviewingId !== null}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-semibold shadow hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
              >
                <UserCheck className="w-4 h-4" />
                {reviewingId ? 'Processing...' : 'Approve'}
              </button>
              <button
                onClick={() => handleReview('reject')}
                disabled={reviewingId !== null}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-semibold shadow hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
              >
                <UserX className="w-4 h-4" />
                {reviewingId ? 'Processing...' : 'Reject'}
              </button>
            </div>

            <button
              onClick={closeReviewModal}
              disabled={reviewingId !== null}
              className="w-full mt-3 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50 text-sm"
            >
              Cancel
            </button>

            {/* Info Box */}
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> Approving will automatically enroll the student in the session and all its courses.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinRequests;
