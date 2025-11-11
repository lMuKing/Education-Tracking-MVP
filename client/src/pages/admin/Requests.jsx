import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Search, User, BookOpen, Calendar, ArrowLeft, X } from 'lucide-react';
import { adminAPI } from '../../api/admin';
import toast from 'react-hot-toast';

const Requests = () => {
  const location = useLocation();
  const isReadOnly = new URLSearchParams(location.search).get('view') === 'readonly';
  
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [rejectedCount, setRejectedCount] = useState(0);

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    const filtered = requests.filter(request => {
      const searchLower = searchTerm.toLowerCase();
      const status = request.isApproved ? 'approved' : 'pending';
      return (
        request.mentor_name?.toLowerCase().includes(searchLower) ||
        request.session_title?.toLowerCase().includes(searchLower) ||
        request.message?.toLowerCase().includes(searchLower) ||
        status.includes(searchLower)
      );
    });
    setFilteredRequests(filtered);
  }, [searchTerm, requests]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllRequests();
      
      // Handle multiple possible response structures
      let requestsData = [];
      
      if (response.Requests) {
        requestsData = response.Requests;
      } else if (response.requests) {
        requestsData = response.requests;
      } else if (response.data) {
        requestsData = response.data.Requests || response.data.requests || response.data;
      } else if (Array.isArray(response)) {
        requestsData = response;
      }
      
      // Map the populated data from backend to frontend format
      const formattedRequests = requestsData.map((request) => {
        return {
          id: request._id || request.id,
          mentorId: request.mentor_id?._id || request.mentorId,
          session_id: request.session_id?._id || request.session_id,
          mentor_name: request.mentor_id?.full_name || request.mentor_id?.name || 'Unknown Mentor',
          session_title: request.session_id?.title || 'Unknown Session',
          message: request.message,
          isApproved: request.isApproved,
          created_at: request.created_at || request.createdAt
        };
      });
      
      setRequests(formattedRequests);
      setFilteredRequests(formattedRequests);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (id) => {
    if (!window.confirm('Are you sure you want to approve this mentor request?')) return;
    
    try {
      await adminAPI.approveRequest(id);
      toast.success('Request approved successfully');
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Failed to approve request');
    }
  };

  const handleRejectRequest = async (id) => {
    if (!window.confirm('Are you sure you want to reject and delete this request? This action cannot be undone.')) return;
    
    try {
      await adminAPI.rejectRequest(id);
      toast.success('Request rejected and deleted successfully');
      setRejectedCount(prev => prev + 1); // Increment rejected count
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Failed to reject request');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mb-4"></div>
          <p className="text-xl text-gray-600 font-semibold">Loading requests...</p>
          <p className="text-sm text-gray-400 mt-2">Please wait while we fetch the data</p>
        </div>
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
        {/* Header with Stats */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Mentor Requests Management</h1>
          
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Requests</p>
                  <p className="text-3xl font-bold mt-1">{requests.length}</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-full p-3">
                  <BookOpen className="w-8 h-8" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Pending</p>
                  <p className="text-3xl font-bold mt-1">{requests.filter(r => !r.isApproved).length}</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-full p-3">
                  <Calendar className="w-8 h-8" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Approved</p>
                  <p className="text-3xl font-bold mt-1">{requests.filter(r => r.isApproved).length}</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-full p-3">
                  <CheckCircle className="w-8 h-8" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">Rejected</p>
                  <p className="text-3xl font-bold mt-1">{rejectedCount}</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-full p-3">
                  <X className="w-8 h-8" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-100">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by mentor name, session title, message, or status..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Requests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="bg-white rounded-lg shadow-md p-8">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-gray-500">No requests found</p>
                <p className="text-sm text-gray-400 mt-2">Try adjusting your search criteria</p>
              </div>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                {/* Status Badge Header */}
                <div className={`px-6 py-3 ${
                  request.isApproved ? 'bg-gradient-to-r from-green-50 to-green-100' : 'bg-gradient-to-r from-yellow-50 to-yellow-100'
                }`}>
                  <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                    request.isApproved ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                  }`}>
                    {request.isApproved ? '✓ Approved' : '⏳ Pending'}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Mentor Info */}
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Mentor</p>
                      <p className="font-semibold text-gray-900 text-lg truncate">{request.mentor_name}</p>
                    </div>
                  </div>

                  {/* Session Info */}
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Session</p>
                      <p className="font-semibold text-gray-900 truncate">{request.session_title}</p>
                    </div>
                  </div>

                  {/* Message */}
                  {request.message && (
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <p className="text-xs text-gray-500 font-medium mb-1">MESSAGE</p>
                      <p className="text-sm text-gray-700">{request.message}</p>
                    </div>
                  )}

                  {/* Date */}
                  {request.created_at && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>Requested on {new Date(request.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                {!isReadOnly && (
                  <div className="px-6 pb-6">
                    {!request.isApproved ? (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApproveRequest(request.id)}
                          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                          <CheckCircle className="w-5 h-5" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request.id)}
                          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                          <X className="w-5 h-5" />
                          Reject
                        </button>
                      </div>
                    ) : (
                      <div className="w-full text-center py-3 bg-green-50 text-green-700 font-semibold rounded-lg border-2 border-green-200">
                        ✓ Already Approved
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Requests;
