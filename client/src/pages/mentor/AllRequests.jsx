import React, { useEffect, useState } from 'react';
import { mentorAPI } from '../../api/mentor';
import toast from 'react-hot-toast';
import { ArrowLeft, ClipboardList, CheckCircle, XCircle, Trash2 } from 'lucide-react';

const AllRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await mentorAPI.getAllRequests();
      setRequests(res.Requests || res.requests || []);
    } catch (error) {
      console.error('Fetch requests error:', error);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to cancel this request?')) return;

    setDeletingId(requestId);
    try {
      await mentorAPI.cancelRequest(requestId);
      toast.success('Request canceled successfully!');
      // Remove from list
      setRequests(requests.filter(req => req.id !== requestId));
    } catch (error) {
      console.error('Cancel request error:', error);
      toast.error(error.response?.data?.msg || 'Failed to cancel request');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-blue-900 to-blue-700 flex items-center justify-center">
        <div className="text-white text-xl">Loading requests...</div>
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

      {/* Requests List */}
      <div className="relative z-10 max-w-4xl mx-auto pt-16 md:pt-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">All Requests</h1>
          <p className="text-blue-200">View all your session requests</p>
        </div>

        {requests.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <ClipboardList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No requests found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">Session ID: {request.session_id}</h3>
                      {request.isApproved ? (
                        <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                          <CheckCircle className="w-4 h-4" />
                          Approved
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                          <XCircle className="w-4 h-4" />
                          Pending
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{request.message}</p>
                    <p className="text-sm text-gray-500">Mentor ID: {request.mentorId}</p>
                  </div>
                  
                  {!request.isApproved && (
                    <button
                      onClick={() => handleCancelRequest(request.id)}
                      disabled={deletingId === request.id}
                      className="inline-flex items-center gap-2 bg-red-600 text-white py-2 px-4 rounded-lg font-semibold shadow hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                      {deletingId === request.id ? 'Canceling...' : 'Cancel Request'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllRequests;
