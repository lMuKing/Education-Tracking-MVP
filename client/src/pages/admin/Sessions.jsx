import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, Edit2, Trash2, X, Search, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { adminAPI } from '../../api/admin';
import toast from 'react-hot-toast';

const Sessions = () => {
  const location = useLocation();
  const isReadOnly = new URLSearchParams(location.search).get('view') === 'readonly';
  
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentSession, setCurrentSession] = useState({
    title: '',
    description: '',
    status: 'active',
    price: 0,
    session_image: '',
    session_category: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    const filtered = sessions.filter(session =>
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSessions(filtered);
  }, [searchTerm, sessions]);

  const fetchSessions = async () => {
    try {
      const response = await adminAPI.getAllSessions();
      console.log('Raw response:', response);
      console.log('Fetched sessions:', response.sessions);
      const sessionsData = response.sessions || [];
      // Ensure each session has a valid ID
      const validSessions = sessionsData.map(session => ({
        ...session,
        _id: session._id || session.id  // Normalize ID field
      })).filter(session => session._id); // Only keep sessions with valid IDs
      
      console.log('Processed sessions:', validSessions);
      setSessions(validSessions);
      setFilteredSessions(validSessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      // If it's a 404 error (no sessions found), just set empty arrays instead of showing error
      if (error.response?.status === 404) {
        console.log('ℹ️ No sessions found in database');
        setSessions([]);
        setFilteredSessions([]);
      } else {
        // Only show error toast for actual errors (not 404)
        toast.error('Failed to load sessions');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (session = null) => {
    if (session) {
      setEditMode(true);
      console.log('Opening edit modal with session:', session);
      const sessionWithId = {
        id: session._id || session.id,
        title: session.title || '',
        description: session.description || '',
        status: session.status || 'active',
        price: session.price || 0,
        session_image: session.session_image || '',
        session_category: session.session_category || ''
      };
      console.log('Session with ID:', sessionWithId);
      setCurrentSession(sessionWithId);
      setImagePreview(session.session_image || null);
      setImageFile(null);
    } else {
      setEditMode(false);
      setCurrentSession({ title: '', description: '', status: 'active', price: 0, session_image: '', session_category: '' });
      setImagePreview(null);
      setImageFile(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentSession({ title: '', description: '', status: 'active', price: 0, session_image: '', session_category: '' });
    setImagePreview(null);
    setImageFile(null);
    setEditMode(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentSession.title || !currentSession.description) {
      toast.error('Please fill in all fields');
      return;
    }

    // Check if image is required for new sessions
    if (!editMode && !imageFile) {
      toast.error('Please upload a session image');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', currentSession.title);
      formData.append('description', currentSession.description);
      formData.append('status', currentSession.status);
      formData.append('price', currentSession.price || 0);
      formData.append('session_category', currentSession.session_category || '');
      
      // Add image file if exists (multer expects field name to match backend)
      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (editMode) {
        const sessionId = currentSession.id || currentSession._id;
        console.log('Updating session with ID:', sessionId);
        
        if (!sessionId) {
          toast.error('Session ID is missing');
          return;
        }
        
        await adminAPI.updateSession(sessionId, formData);
        toast.success('Session updated successfully');
      } else {
        await adminAPI.createSession(formData);
        toast.success('Session created successfully');
      }
      fetchSessions();
      handleCloseModal();
    } catch (error) {
      console.error('Session save error:', error);
      toast.error(error.response?.data?.msg || 'Failed to save session');
    }
  };

  const handleDeleteSession = async (id) => {
    if (!window.confirm('Are you sure you want to delete this session?')) return;
    
    try {
      console.log('Deleting session with ID:', id);
      await adminAPI.deleteSession(id);
      toast.success('Session deleted successfully');
      fetchSessions();
    } catch (error) {
      console.error('Delete session error:', error.response || error);
      const errorMessage = error.response?.data?.msg || 
                          error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Failed to delete session';
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-xl">Loading sessions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 relative">
      {/* Back Button */}
      <a
        href="/admin/dashboard"
        className="fixed md:absolute top-4 left-4 z-20 bg-white text-blue-700 rounded-full p-2 shadow-lg hover:bg-blue-50 transition"
        title="Back to Dashboard"
      >
        <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
      </a>

      <div className="max-w-7xl mx-auto pt-12 md:pt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Sessions Management</h1>
          {!isReadOnly && (
            <button
              onClick={() => handleOpenModal()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 md:w-5 md:h-5" />
              Create Session
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-3 md:p-4 mb-4 md:mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
            <input
              type="text"
              placeholder="Search sessions..."
              className="w-full pl-8 md:pl-10 pr-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Sessions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredSessions.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-8">No sessions found</div>
          ) : (
            filteredSessions.map((session) => (
              <div key={session._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Session Image */}
                {session.session_image && (
                  <div className="h-40 md:h-48 overflow-hidden bg-gray-100">
                    <img 
                      src={session.session_image} 
                      alt={session.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Failed to load image:', session.session_image);
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="p-4 md:p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-base md:text-xl font-bold text-gray-900">{session.title}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                      session.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : session.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : session.status === 'completed'
                        ? 'bg-blue-100 text-blue-800'
                        : session.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {session.status}
                    </span>
                  </div>
                  <p className="text-sm md:text-base text-gray-600 mb-2 line-clamp-3">{session.description}</p>
                  <p className="text-base md:text-lg font-bold text-blue-600 mb-4">
                    {session.price ? `$${session.price}` : 'Free'}
                  </p>
                  {!isReadOnly && (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handleOpenModal(session)}
                        className="flex-1 flex items-center justify-center gap-2 text-blue-600 border border-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm md:text-base"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          const sessionId = session._id || session.id;
                          console.log('Session to delete:', session);
                          console.log('Session ID:', sessionId);
                          if (!sessionId) {
                            toast.error('Invalid session ID');
                            return;
                          }
                          handleDeleteSession(sessionId);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 text-red-600 border border-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors text-sm md:text-base"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create/Edit Session Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-4 md:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg md:text-xl font-bold">{editMode ? 'Edit Session' : 'Create New Session'}</h2>
                <button onClick={handleCloseModal} type="button">
                  <X className="w-5 h-5 md:w-6 md:h-6 text-gray-500 hover:text-gray-700" />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                {/* Image Upload */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Image {!editMode && <span className="text-red-500">*</span>}
                  </label>
                  <div className="w-full">
                    <label className="block cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 md:p-4 text-center hover:border-blue-500 transition-colors">
                        {imagePreview ? (
                          <div className="relative">
                            <img 
                              src={imagePreview} 
                              alt="Preview" 
                              className="w-full h-48 md:h-64 object-contain rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setImageFile(null);
                                setImagePreview(editMode ? currentSession.session_image : null);
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1.5 md:p-2 rounded-full hover:bg-red-600"
                            >
                              <X className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                          </div>
                        ) : (
                          <div className="py-8 md:py-12">
                            <ImageIcon className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-2 md:mb-3" />
                            <p className="text-xs md:text-sm font-medium text-gray-700">Click to upload image</p>
                            <p className="text-xs text-gray-500 mt-1 md:mt-2">PNG, JPG, GIF up to 5MB</p>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {!editMode && !imageFile && (
                    <p className="text-xs text-red-500 mt-2 font-medium">⚠️ Image is required for new sessions</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={currentSession.title}
                    onChange={(e) => setCurrentSession({...currentSession, title: e.target.value})}
                    className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter session title"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={currentSession.description}
                    onChange={(e) => setCurrentSession({...currentSession, description: e.target.value})}
                    className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="4"
                    placeholder="Enter session description"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={currentSession.price}
                    onChange={(e) => setCurrentSession({...currentSession, price: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave as 0 for free sessions</p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={currentSession.status}
                    onChange={(e) => setCurrentSession({...currentSession, status: e.target.value})}
                    className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={currentSession.session_category}
                    onChange={(e) => setCurrentSession({...currentSession, session_category: e.target.value})}
                    className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    <option value="Maths">Maths</option>
                    <option value="Physics">Physics</option>
                    <option value="Science">Science</option>
                    <option value="Arabic">Arabic</option>
                    <option value="English">English</option>
                    <option value="French">French</option>
                    <option value="Historic">Historic</option>
                    <option value="Geographi">Geographi</option>
                  </select>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
                  >
                    {editMode ? 'Update Session' : 'Create Session'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm md:text-base"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sessions;
