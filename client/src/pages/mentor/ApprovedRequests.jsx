import React, { useEffect, useState } from 'react';
import { mentorAPI } from '../../api/mentor';
import toast from 'react-hot-toast';
import { ArrowLeft, CheckCircle, ClipboardList } from 'lucide-react';

const ApprovedRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApprovedRequests();
  }, []);

  const fetchApprovedRequests = async () => {
    try {
      const res = await mentorAPI.getApprovedRequests();
      setRequests(res.requests || []);
    } catch (error) {
      console.error('Fetch approved requests error:', error);
      toast.error('Failed to load approved requests');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-blue-900 to-blue-700 flex items-center justify-center">
        <div className="text-white text-xl">Loading approved requests...</div>
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
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

      {/* Requests List */}
      <div className="relative z-10 max-w-4xl mx-auto pt-16 md:pt-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Approved Requests</h1>
          <p className="text-blue-200">Your approved session requests</p>
        </div>

        {requests.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <ClipboardList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No approved requests found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="bg-white rounded-2xl shadow-xl p-6 border border-green-200">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <h3 className="text-lg font-bold text-gray-900">Session ID: {request.session_id}</h3>
                  </div>
                  <p className="text-gray-600">{request.message}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Mentor ID: {request.mentorId}</span>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                      ✓ Approved
                    </span>
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

export default ApprovedRequests;
