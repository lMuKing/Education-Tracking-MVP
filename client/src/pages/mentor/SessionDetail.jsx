import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { mentorAPI } from '../../api/mentor';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, 
  Plus, 
  BookOpen, 
  Edit, 
  Trash2, 
  ExternalLink,
  FileText,
  X,
  Save,
  Users,
  Calendar,
  Bell,
  AlertCircle,
  MessageSquare,
  ClipboardList
} from 'lucide-react';

const SessionDetail = () => {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [courses, setCourses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses'); // 'courses' or 'announcements'
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showEditAnnouncementModal, setShowEditAnnouncementModal] = useState(false);
  const [showHomeworkModal, setShowHomeworkModal] = useState(false);
  const [showCreateHomeworkModal, setShowCreateHomeworkModal] = useState(false);
  const [showEditHomeworkModal, setShowEditHomeworkModal] = useState(false);
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [selectedHomework, setSelectedHomework] = useState(null);
  const [homeworks, setHomeworks] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    external_links: [''],
    documents_url: ['']
  });

  const [announcementFormData, setAnnouncementFormData] = useState({
    title: '',
    content: '',
    announcement_type: 'general',
    expires_at: ''
  });

  const [homeworkFormData, setHomeworkFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    documents_url: '',
    task_type: 'quiz',
    deadline: '',
    extended_deadline: '',
    late_submission_penalty: 0
  });

  useEffect(() => {
    fetchSessionAndCourses();
    if (activeTab === 'announcements') {
      fetchAnnouncements();
    }
  }, [sessionId, activeTab]);

  const fetchSessionAndCourses = async () => {
    setLoading(true);
    try {
      const coursesRes = await mentorAPI.getCoursesBySession(sessionId);
      setCourses(coursesRes.courses || []);
      
      // Optionally fetch session details if you have an endpoint
      // const sessionRes = await mentorAPI.getSessionById(sessionId);
      // setSession(sessionRes.session);
    } catch (error) {
      console.error('Fetch error:', error);
      if (error.response?.status !== 404) {
        toast.error('Failed to load data');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await mentorAPI.getAnnouncementsBySession(sessionId);
      setAnnouncements(res.announcements || []);
    } catch (error) {
      console.error('Fetch announcements error:', error);
      if (error.response?.status !== 404) {
        toast.error('Failed to load announcements');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      external_links: [''],
      documents_url: ['']
    });
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openEditModal = (course) => {
    setSelectedCourse(course);
    
    // Handle documents_url - it's a string from backend
    const docsArray = course.documents_url ? [course.documents_url] : [''];
    
    // Handle external_links - ensure it's an array
    const linksArray = Array.isArray(course.external_links) && course.external_links.length > 0 
      ? course.external_links 
      : [''];
    
    setFormData({
      title: course.title || '',
      description: course.description || '',
      external_links: linksArray,
      documents_url: docsArray
    });
    setShowEditModal(true);
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setSelectedCourse(null);
    resetForm();
  };

  const handleAddField = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], '']
    });
  };

  const handleRemoveField = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [field]: newArray.length > 0 ? newArray : ['']
    });
  };

  const handleFieldChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({
      ...formData,
      [field]: newArray
    });
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Please enter a course title');
      return;
    }

    // Validate documents_url (required)
    const filteredDocs = formData.documents_url.filter(doc => doc.trim() !== '');
    if (filteredDocs.length === 0) {
      toast.error('At least one document URL is required');
      return;
    }

    try {
      // Filter out empty strings
      const courseData = {
        title: formData.title,
        description: formData.description,
        external_links: formData.external_links.filter(link => link.trim() !== ''),
        documents_url: filteredDocs
      };

      await mentorAPI.createCourse(sessionId, courseData);
      toast.success('Course created successfully!');
      closeModals();
      fetchSessionAndCourses();
    } catch (error) {
      console.error('Create course error:', error);
      toast.error(error.response?.data?.msg || 'Failed to create course');
    }
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();

    try {
      const filteredDocs = formData.documents_url.filter(doc => doc.trim() !== '');
      const filteredLinks = formData.external_links.filter(link => link.trim() !== '');
      
      const courseData = {
        external_links: filteredLinks,
        documents_url: filteredDocs // Backend will convert array to string if needed
      };

      await mentorAPI.updateCourse(sessionId, selectedCourse._id, courseData);
      toast.success('Course updated successfully!');
      closeModals();
      fetchSessionAndCourses();
    } catch (error) {
      console.error('Update course error:', error);
      toast.error(error.response?.data?.msg || 'Failed to update course');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    setDeletingId(courseId);
    try {
      await mentorAPI.deleteCourse(sessionId, courseId);
      toast.success('Course deleted successfully!');
      setCourses(courses.filter(c => c._id !== courseId));
    } catch (error) {
      console.error('Delete course error:', error);
      toast.error(error.response?.data?.msg || 'Failed to delete course');
    } finally {
      setDeletingId(null);
    }
  };

  // Announcement Handlers
  const resetAnnouncementForm = () => {
    setAnnouncementFormData({
      title: '',
      content: '',
      announcement_type: 'general',
      expires_at: ''
    });
  };

  const openAnnouncementModal = () => {
    resetAnnouncementForm();
    setShowAnnouncementModal(true);
  };

  const openEditAnnouncementModal = (announcement) => {
    setSelectedAnnouncement(announcement);
    setAnnouncementFormData({
      title: announcement.title || '',
      content: announcement.content || '',
      announcement_type: announcement.announcement_type || 'general',
      expires_at: announcement.expires_at ? new Date(announcement.expires_at).toISOString().split('T')[0] : ''
    });
    setShowEditAnnouncementModal(true);
  };

  const closeAnnouncementModals = () => {
    setShowAnnouncementModal(false);
    setShowEditAnnouncementModal(false);
    setSelectedAnnouncement(null);
    resetAnnouncementForm();
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    
    if (!announcementFormData.title.trim() || !announcementFormData.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    try {
      const data = {
        title: announcementFormData.title,
        content: announcementFormData.content,
        announcement_type: announcementFormData.announcement_type,
        expires_at: announcementFormData.expires_at || null
      };

      await mentorAPI.createAnnouncement(sessionId, data);
      toast.success('Announcement created successfully!');
      closeAnnouncementModals();
      fetchAnnouncements();
    } catch (error) {
      console.error('Create announcement error:', error);
      toast.error(error.response?.data?.msg || 'Failed to create announcement');
    }
  };

  const handleUpdateAnnouncement = async (e) => {
    e.preventDefault();

    try {
      const data = {
        title: announcementFormData.title,
        content: announcementFormData.content,
        announcement_type: announcementFormData.announcement_type
      };

      await mentorAPI.updateAnnouncement(sessionId, selectedAnnouncement._id, data);
      toast.success('Announcement updated successfully!');
      closeAnnouncementModals();
      fetchAnnouncements();
    } catch (error) {
      console.error('Update announcement error:', error);
      toast.error(error.response?.data?.msg || 'Failed to update announcement');
    }
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;

    setDeletingId(announcementId);
    try {
      await mentorAPI.deleteAnnouncement(sessionId, announcementId);
      toast.success('Announcement deleted successfully!');
      setAnnouncements(announcements.filter(a => a._id !== announcementId));
    } catch (error) {
      console.error('Delete announcement error:', error);
      toast.error(error.response?.data?.msg || 'Failed to delete announcement');
    } finally {
      setDeletingId(null);
    }
  };

  // Homework Handlers
  const openHomeworkModal = async (course) => {
    setSelectedCourse(course);
    setShowHomeworkModal(true);
    // Fetch homework for this course
    try {
      const res = await mentorAPI.getHomeworkByCourse(course._id);
      setHomeworks(res.homework || []);
    } catch (error) {
      console.error('Fetch homework error:', error);
      if (error.response?.status !== 404) {
        toast.error('Failed to load homework');
      }
      setHomeworks([]);
    }
  };

  const closeHomeworkModal = () => {
    setShowHomeworkModal(false);
    setSelectedCourse(null);
    setHomeworks([]);
  };

  const resetHomeworkForm = () => {
    setHomeworkFormData({
      title: '',
      description: '',
      instructions: '',
      documents_url: '',
      task_type: 'quiz',
      deadline: '',
      extended_deadline: '',
      late_submission_penalty: 0
    });
  };

  const openCreateHomeworkModal = () => {
    resetHomeworkForm();
    setShowCreateHomeworkModal(true);
  };

  const openEditHomeworkModal = (homework) => {
    setSelectedHomework(homework);
    setHomeworkFormData({
      title: homework.title || '',
      description: homework.description || '',
      instructions: homework.instructions || '',
      documents_url: homework.documents_url || '',
      task_type: homework.task_type || 'assignment',
      deadline: homework.deadline ? new Date(homework.deadline).toISOString().split('T')[0] : '',
      extended_deadline: homework.extended_deadline ? new Date(homework.extended_deadline).toISOString().split('T')[0] : '',
      late_submission_penalty: homework.late_submission_penalty || 0
    });
    setShowEditHomeworkModal(true);
  };

  const closeHomeworkFormModals = () => {
    setShowCreateHomeworkModal(false);
    setShowEditHomeworkModal(false);
    setSelectedHomework(null);
    resetHomeworkForm();
  };

  const handleCreateHomework = async (e) => {
    e.preventDefault();
    
    if (!homeworkFormData.title.trim() || !homeworkFormData.task_type || !homeworkFormData.deadline) {
      toast.error('Title, task type, and deadline are required');
      return;
    }

    try {
      const data = {
        title: homeworkFormData.title,
        description: homeworkFormData.description,
        instructions: homeworkFormData.instructions,
        documents_url: homeworkFormData.documents_url,
        task_type: homeworkFormData.task_type,
        deadline: homeworkFormData.deadline,
        extended_deadline: homeworkFormData.extended_deadline || null,
        late_submission_penalty: homeworkFormData.late_submission_penalty
      };

      console.log('Creating homework with data:', data);
      console.log('Course ID:', selectedCourse._id);

      await mentorAPI.createHomework(selectedCourse._id, data);
      toast.success('Homework created successfully!');
      closeHomeworkFormModals();
      // Refresh homework list
      const res = await mentorAPI.getHomeworkByCourse(selectedCourse._id);
      setHomeworks(res.homework || []);
    } catch (error) {
      console.error('Create homework error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error data:', error.response?.data);
      toast.error(error.response?.data?.msg || 'Failed to create homework');
    }
  };

  const handleUpdateHomework = async (e) => {
    e.preventDefault();

    try {
      const data = {
        title: homeworkFormData.title,
        description: homeworkFormData.description,
        instructions: homeworkFormData.instructions,
        documents_url: homeworkFormData.documents_url,
        extended_deadline: homeworkFormData.extended_deadline || null,
        late_submission_penalty: homeworkFormData.late_submission_penalty
      };

      await mentorAPI.updateHomework(selectedCourse._id, selectedHomework._id, data);
      toast.success('Homework updated successfully!');
      closeHomeworkFormModals();
      // Refresh homework list
      const res = await mentorAPI.getHomeworkByCourse(selectedCourse._id);
      setHomeworks(res.homework || []);
    } catch (error) {
      console.error('Update homework error:', error);
      toast.error(error.response?.data?.msg || 'Failed to update homework');
    }
  };

  const handleDeleteHomework = async (homeworkId) => {
    if (!window.confirm('Are you sure you want to delete this homework?')) return;

    setDeletingId(homeworkId);
    try {
      await mentorAPI.deleteHomework(selectedCourse._id, homeworkId);
      toast.success('Homework deleted successfully!');
      setHomeworks(homeworks.filter(h => h._id !== homeworkId));
    } catch (error) {
      console.error('Delete homework error:', error);
      toast.error(error.response?.data?.msg || 'Failed to delete homework');
    } finally {
      setDeletingId(null);
    }
  };

  // View submissions handler
  const handleViewSubmissions = async (homework) => {
    try {
      setSelectedHomework(homework);
      setShowSubmissionsModal(true);
      const data = await mentorAPI.getAllHomeworkSubmissions(homework._id);
      setSubmissions(data.submissions || []);
    } catch (error) {
      console.error('Fetch submissions error:', error);
      toast.error(error.response?.data?.msg || 'Failed to load submissions');
      setSubmissions([]);
    }
  };

  const closeSubmissionsModal = () => {
    setShowSubmissionsModal(false);
    setSelectedHomework(null);
    setSubmissions([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-blue-900 to-blue-700 flex items-center justify-center">
        <div className="text-white text-xl">Loading session details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-blue-900 to-blue-700 p-4 md:p-8 relative overflow-hidden">
      {/* Back button */}
      <a
        href="/mentor/getallsessions"
        className="absolute top-4 left-4 z-20 bg-white text-blue-700 rounded-full p-2 shadow-lg hover:bg-blue-50 transition"
        title="Back to All Sessions"
      >
        <ArrowLeft className="w-6 h-6" />
      </a>

      {/* Decorative Blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto pt-16 md:pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Session Management</h1>
          <p className="text-blue-200">Manage courses and announcements for this session</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 justify-center">
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'courses'
                ? 'bg-white text-blue-700 shadow-lg'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            Courses
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'announcements'
                ? 'bg-white text-blue-700 shadow-lg'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Bell className="w-5 h-5" />
            Announcements
          </button>
        </div>

        {/* Create Button */}
        <div className="mb-6 flex justify-end">
          {activeTab === 'courses' ? (
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-green-700 hover:to-emerald-700 transition"
            >
              <Plus className="w-5 h-5" />
              Create New Course
            </button>
          ) : (
            <button
              onClick={openAnnouncementModal}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-indigo-700 transition"
            >
              <Plus className="w-5 h-5" />
              Create New Announcement
            </button>
          )}
        </div>

        {/* Content based on active tab */}
        {activeTab === 'courses' ? (
          /* Courses Grid */
          courses.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-2">No courses yet</p>
              <p className="text-gray-500 text-sm">Create your first course to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course._id} className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{course.title}</h3>
                  </div>
                </div>

                {course.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p>
                )}

                {/* External Links */}
                {course.external_links?.length > 0 && Array.isArray(course.external_links) && (
                  <div className="mb-3">
                    <div className="flex items-center gap-1 text-xs font-semibold text-gray-700 mb-2">
                      <ExternalLink className="w-3 h-3" />
                      <span>External Links ({course.external_links.length})</span>
                    </div>
                    <div className="space-y-1">
                      {course.external_links.slice(0, 2).map((link, idx) => (
                        <a
                          key={idx}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-xs truncate block"
                        >
                          {link}
                        </a>
                      ))}
                      {course.external_links.length > 2 && (
                        <span className="text-xs text-gray-500">+{course.external_links.length - 2} more</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Documents */}
                {course.documents_url && (
                  <div className="mb-4">
                    <div className="flex items-center gap-1 text-xs font-semibold text-gray-700 mb-2">
                      <FileText className="w-3 h-3" />
                      <span>Document</span>
                    </div>
                    <div className="space-y-1">
                      <a
                        href={typeof course.documents_url === 'string' ? course.documents_url : course.documents_url[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700 text-xs truncate block"
                      >
                        {typeof course.documents_url === 'string' ? course.documents_url : course.documents_url[0]}
                      </a>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(course)}
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course._id)}
                      disabled={deletingId === course._id}
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-red-600 text-white py-2 px-3 rounded-lg font-semibold shadow hover:bg-red-700 transition disabled:opacity-50 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      {deletingId === course._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                  <button
                    onClick={() => openHomeworkModal(course)}
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 px-3 rounded-lg font-semibold shadow hover:from-purple-700 hover:to-indigo-700 transition text-sm"
                  >
                    <ClipboardList className="w-4 h-4" />
                    View Homework
                  </button>
                </div>
              </div>
            ))}
            </div>
          )
        ) : (
          /* Announcements Grid */
          announcements.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-2">No announcements yet</p>
              <p className="text-gray-500 text-sm">Create your first announcement to notify students</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {announcements.map((announcement) => (
                <div key={announcement._id} className={`bg-white rounded-2xl shadow-xl overflow-hidden border-l-4 ${
                  announcement.announcement_type === 'urgent' ? 'border-red-500' : 
                  announcement.announcement_type === 'important' ? 'border-yellow-500' : 
                  'border-blue-500'
                } hover:shadow-2xl transition`}>
                  {/* Header */}
                  <div className={`p-4 ${
                    announcement.announcement_type === 'urgent' ? 'bg-red-50' : 
                    announcement.announcement_type === 'important' ? 'bg-yellow-50' : 
                    'bg-blue-50'
                  }`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1">
                        {announcement.announcement_type === 'urgent' ? (
                          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        ) : announcement.announcement_type === 'important' ? (
                          <Bell className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                        ) : (
                          <MessageSquare className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        )}
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{announcement.title}</h3>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        announcement.announcement_type === 'urgent' ? 'bg-red-200 text-red-800' : 
                        announcement.announcement_type === 'important' ? 'bg-yellow-200 text-yellow-800' : 
                        'bg-blue-200 text-blue-800'
                      }`}>
                        {announcement.announcement_type}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-gray-600 text-sm mb-4 line-clamp-4">{announcement.content}</p>
                    
                    {/* Date Info */}
                    <div className="space-y-2 text-xs text-gray-500 mb-4">
                      {announcement.published_at && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          <span>Published: {new Date(announcement.published_at).toLocaleDateString()}</span>
                        </div>
                      )}
                      {announcement.expires_at && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          <span>Expires: {new Date(announcement.expires_at).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4 border-t">
                      <button
                        onClick={() => openEditAnnouncementModal(announcement)}
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition text-sm"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAnnouncement(announcement._id)}
                        disabled={deletingId === announcement._id}
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-red-600 text-white py-2 px-3 rounded-lg font-semibold shadow hover:bg-red-700 transition disabled:opacity-50 text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        {deletingId === announcement._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* Create Course Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 md:p-8 my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create New Course</h2>
              <button onClick={closeModals} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Course Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter course title"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                  placeholder="Enter course description"
                />
              </div>

              {/* External Links */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-gray-700 font-semibold">External Links (Optional)</label>
                  <button
                    type="button"
                    onClick={() => handleAddField('external_links')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
                  >
                    + Add Link
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.external_links.map((link, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="url"
                        value={link}
                        onChange={(e) => handleFieldChange('external_links', index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://example.com"
                      />
                      {formData.external_links.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveField('external_links', index)}
                          className="text-red-600 hover:text-red-700 p-2"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents URL */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-gray-700 font-semibold">Document URLs *</label>
                  <button
                    type="button"
                    onClick={() => handleAddField('documents_url')}
                    className="text-green-600 hover:text-green-700 text-sm font-semibold"
                  >
                    + Add Document
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.documents_url.map((doc, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="url"
                        value={doc}
                        onChange={(e) => handleFieldChange('documents_url', index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="https://example.com/document.pdf (Required)"
                      />
                      {formData.documents_url.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveField('documents_url', index)}
                          className="text-red-600 hover:text-red-700 p-2"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold shadow hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Create Course
                </button>
                <button
                  type="button"
                  onClick={closeModals}
                  className="bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {showEditModal && selectedCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 md:p-8 my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit Course</h2>
              <button onClick={closeModals} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUpdateCourse} className="space-y-6">
              {/* Title - Read Only */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Course Title</label>
                <input
                  type="text"
                  value={selectedCourse.title}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">Title cannot be changed</p>
              </div>

              {/* Description - Read Only */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Description</label>
                <textarea
                  value={selectedCourse.description}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed min-h-[100px]"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">Description cannot be changed</p>
              </div>

              {/* External Links */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-gray-700 font-semibold">External Links (Optional)</label>
                  <button
                    type="button"
                    onClick={() => handleAddField('external_links')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
                  >
                    + Add Link
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.external_links.map((link, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="url"
                        value={link}
                        onChange={(e) => handleFieldChange('external_links', index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://example.com"
                      />
                      {formData.external_links.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveField('external_links', index)}
                          className="text-red-600 hover:text-red-700 p-2"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents URL */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-gray-700 font-semibold">Document URLs</label>
                  <button
                    type="button"
                    onClick={() => handleAddField('documents_url')}
                    className="text-green-600 hover:text-green-700 text-sm font-semibold"
                  >
                    + Add Document
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.documents_url.map((doc, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="url"
                        value={doc}
                        onChange={(e) => handleFieldChange('documents_url', index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="https://example.com/document.pdf"
                      />
                      {formData.documents_url.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveField('documents_url', index)}
                          className="text-red-600 hover:text-red-700 p-2"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold shadow hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Update Course
                </button>
                <button
                  type="button"
                  onClick={closeModals}
                  className="bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Announcement Modal */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 md:p-8 my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create New Announcement</h2>
              <button onClick={closeAnnouncementModals} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Announcement Title *</label>
                <input
                  type="text"
                  value={announcementFormData.title}
                  onChange={(e) => setAnnouncementFormData({ ...announcementFormData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter announcement title"
                  required
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Content *</label>
                <textarea
                  value={announcementFormData.content}
                  onChange={(e) => setAnnouncementFormData({ ...announcementFormData, content: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[150px]"
                  placeholder="Enter announcement content"
                  required
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Announcement Type</label>
                <select
                  value={announcementFormData.announcement_type}
                  onChange={(e) => setAnnouncementFormData({ ...announcementFormData, announcement_type: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="general">General</option>
                  <option value="important">Important</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              {/* Expires At */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Expiration Date (Optional)</label>
                <input
                  type="date"
                  value={announcementFormData.expires_at}
                  onChange={(e) => setAnnouncementFormData({ ...announcementFormData, expires_at: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold shadow hover:from-purple-700 hover:to-indigo-700 transition flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Create Announcement
                </button>
                <button
                  type="button"
                  onClick={closeAnnouncementModals}
                  className="bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Announcement Modal */}
      {showEditAnnouncementModal && selectedAnnouncement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 md:p-8 my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit Announcement</h2>
              <button onClick={closeAnnouncementModals} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUpdateAnnouncement} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Announcement Title *</label>
                <input
                  type="text"
                  value={announcementFormData.title}
                  onChange={(e) => setAnnouncementFormData({ ...announcementFormData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter announcement title"
                  required
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Content *</label>
                <textarea
                  value={announcementFormData.content}
                  onChange={(e) => setAnnouncementFormData({ ...announcementFormData, content: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[150px]"
                  placeholder="Enter announcement content"
                  required
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Announcement Type</label>
                <select
                  value={announcementFormData.announcement_type}
                  onChange={(e) => setAnnouncementFormData({ ...announcementFormData, announcement_type: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="general">General</option>
                  <option value="important">Important</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold shadow hover:from-blue-700 hover:to-indigo-700 transition flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Update Announcement
                </button>
                <button
                  type="button"
                  onClick={closeAnnouncementModals}
                  className="bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Homework List Modal */}
      {showHomeworkModal && selectedCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-6 md:p-8 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-white pb-4 border-b">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Homework for {selectedCourse.title}</h2>
                <p className="text-sm text-gray-500 mt-1">{homeworks.length} homework assignment(s)</p>
              </div>
              <button onClick={closeHomeworkModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <button
              onClick={openCreateHomeworkModal}
              className="w-full mb-6 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-green-700 hover:to-emerald-700 transition"
            >
              <Plus className="w-5 h-5" />
              Create New Homework
            </button>

            {homeworks.length === 0 ? (
              <div className="text-center py-12">
                <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No homework assignments yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {homeworks.map((homework) => (
                  <div key={homework._id} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-purple-300 transition">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{homework.title}</h3>
                        {homework.description && (
                          <p className="text-gray-600 text-sm mb-3">{homework.description}</p>
                        )}
                      </div>
                      <span className={`ml-4 px-3 py-1 text-xs font-semibold rounded-full ${
                        homework.task_type === 'quiz' ? 'bg-green-100 text-green-800' :
                        homework.task_type === 'project' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {homework.task_type}
                      </span>
                    </div>

                    {homework.instructions && (
                      <div className="mb-4 p-3 bg-white rounded-lg">
                        <p className="text-xs font-semibold text-gray-700 mb-1">Instructions:</p>
                        <p className="text-sm text-gray-600">{homework.instructions}</p>
                      </div>
                    )}

                    {homework.documents_url && (
                      <div className="mb-4">
                        <a
                          href={homework.documents_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          <FileText className="w-4 h-4" />
                          View Document
                        </a>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <div>
                          <p className="text-xs text-gray-500">Deadline</p>
                          <p className="font-semibold">{new Date(homework.deadline).toLocaleDateString()}</p>
                        </div>
                      </div>
                      {homework.extended_deadline && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <div>
                            <p className="text-xs text-gray-500">Extended Deadline</p>
                            <p className="font-semibold">{new Date(homework.extended_deadline).toLocaleDateString()}</p>
                          </div>
                        </div>
                      )}
                      {homework.late_submission_penalty > 0 && (
                        <div className="col-span-2 text-orange-600 text-xs">
                          ⚠️ Late submission penalty: {homework.late_submission_penalty}%
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-4 border-t">
                      <button
                        onClick={() => handleViewSubmissions(homework)}
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-purple-600 text-white py-2 px-4 rounded-lg font-semibold shadow hover:bg-purple-700 transition text-sm"
                      >
                        <Users className="w-4 h-4" />
                        View Submissions
                      </button>
                      <button
                        onClick={() => openEditHomeworkModal(homework)}
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold shadow hover:bg-blue-700 transition text-sm"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteHomework(homework._id)}
                        disabled={deletingId === homework._id}
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-red-600 text-white py-2 px-4 rounded-lg font-semibold shadow hover:bg-red-700 transition disabled:opacity-50 text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        {deletingId === homework._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Homework Modal */}
      {showCreateHomeworkModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-8 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-gray-200">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-1">Create New Homework</h2>
                <p className="text-sm text-gray-500">Add a new homework assignment for {selectedCourse?.title}</p>
              </div>
              <button onClick={closeHomeworkFormModals} className="text-gray-400 hover:text-gray-600 transition">
                <X className="w-7 h-7" />
              </button>
            </div>

            <form onSubmit={handleCreateHomework} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-red-500">*</span>
                  Homework Title
                </label>
                <input
                  type="text"
                  value={homeworkFormData.title}
                  onChange={(e) => setHomeworkFormData({ ...homeworkFormData, title: e.target.value })}
                  className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-gray-900 font-medium placeholder-gray-400"
                  placeholder="e.g., Chapter 5 Exercises"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-3">
                  Description
                </label>
                <textarea
                  value={homeworkFormData.description}
                  onChange={(e) => setHomeworkFormData({ ...homeworkFormData, description: e.target.value })}
                  className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition resize-none text-gray-700 placeholder-gray-400"
                  rows="3"
                  placeholder="Brief description of the homework..."
                />
              </div>

              {/* Instructions */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-3">
                  Instructions
                </label>
                <textarea
                  value={homeworkFormData.instructions}
                  onChange={(e) => setHomeworkFormData({ ...homeworkFormData, instructions: e.target.value })}
                  className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition resize-none text-gray-700 placeholder-gray-400"
                  rows="5"
                  placeholder="Detailed instructions for students..."
                />
              </div>

              {/* Document URL */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-600" />
                  Document URL
                </label>
                <input
                  type="url"
                  value={homeworkFormData.documents_url}
                  onChange={(e) => setHomeworkFormData({ ...homeworkFormData, documents_url: e.target.value })}
                  className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-gray-700 placeholder-gray-400"
                  placeholder="https://example.com/document.pdf"
                />
                <p className="text-xs text-gray-500 mt-2">💡 Optional: Add a link to reference materials or resources</p>
              </div>

              {/* Task Type and Deadline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="text-red-500">*</span>
                    Task Type
                  </label>
                  <select
                    value={homeworkFormData.task_type}
                    onChange={(e) => setHomeworkFormData({ ...homeworkFormData, task_type: e.target.value })}
                    className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-gray-700 font-medium cursor-pointer"
                    required
                  >
                    <option value="quiz">❓ Quiz</option>
                    <option value="project">🎯 Project</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="text-red-500">*</span>
                    <Calendar className="w-4 h-4 text-purple-600" />
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={homeworkFormData.deadline}
                    onChange={(e) => setHomeworkFormData({ ...homeworkFormData, deadline: e.target.value })}
                    className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-gray-700 font-medium"
                    required
                  />
                </div>
              </div>

              {/* Extended Deadline and Late Penalty */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-600" />
                    Extended Deadline
                  </label>
                  <input
                    type="date"
                    value={homeworkFormData.extended_deadline}
                    onChange={(e) => setHomeworkFormData({ ...homeworkFormData, extended_deadline: e.target.value })}
                    className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition text-gray-700 font-medium"
                  />
                  <p className="text-xs text-gray-500 mt-2">Optional: Allow late submissions</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">
                    Late Penalty (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={homeworkFormData.late_submission_penalty}
                    onChange={(e) => setHomeworkFormData({ ...homeworkFormData, late_submission_penalty: Number(e.target.value) })}
                    className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-gray-700 font-medium"
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-2">Deduction for late submissions</p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-6 border-t-2 border-gray-200">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl font-bold shadow-lg hover:shadow-xl hover:from-green-700 hover:to-emerald-700 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 text-lg"
                >
                  <Save className="w-5 h-5" />
                  Create Homework
                </button>
                <button
                  type="button"
                  onClick={closeHomeworkFormModals}
                  className="bg-gray-100 text-gray-700 py-4 px-8 rounded-xl font-bold hover:bg-gray-200 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Homework Modal */}
      {showEditHomeworkModal && selectedHomework && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 md:p-8 my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit Homework</h2>
              <button onClick={closeHomeworkFormModals} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUpdateHomework} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Title *</label>
                <input
                  type="text"
                  value={homeworkFormData.title}
                  onChange={(e) => setHomeworkFormData({ ...homeworkFormData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Description</label>
                <textarea
                  value={homeworkFormData.description}
                  onChange={(e) => setHomeworkFormData({ ...homeworkFormData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Instructions</label>
                <textarea
                  value={homeworkFormData.instructions}
                  onChange={(e) => setHomeworkFormData({ ...homeworkFormData, instructions: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="4"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Document URL</label>
                <input
                  type="url"
                  value={homeworkFormData.documents_url}
                  onChange={(e) => setHomeworkFormData({ ...homeworkFormData, documents_url: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Task Type (Read Only)</label>
                <input
                  type="text"
                  value={selectedHomework.task_type}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  disabled
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Deadline (Read Only)</label>
                <input
                  type="text"
                  value={new Date(selectedHomework.deadline).toLocaleDateString()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  disabled
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Extended Deadline</label>
                  <input
                    type="date"
                    value={homeworkFormData.extended_deadline}
                    onChange={(e) => setHomeworkFormData({ ...homeworkFormData, extended_deadline: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Late Penalty (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={homeworkFormData.late_submission_penalty}
                    onChange={(e) => setHomeworkFormData({ ...homeworkFormData, late_submission_penalty: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
                >
                  Update Homework
                </button>
                <button
                  type="button"
                  onClick={closeHomeworkFormModals}
                  className="bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submissions Modal */}
      {showSubmissionsModal && selectedHomework && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full p-6 md:p-8 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-white pb-4 border-b">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Submissions for: {selectedHomework.title}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {submissions.length} submission(s)
                </p>
              </div>
              <button onClick={closeSubmissionsModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            {submissions.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No submissions yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <div key={submission.enrollmentId} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-purple-300 transition">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {submission.student.firstName} {submission.student.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">{submission.student.email}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                          submission.status === 'graded' ? 'bg-green-100 text-green-800' :
                          submission.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {submission.status}
                        </span>
                        {submission.grade !== null && (
                          <p className="text-2xl font-bold text-purple-600 mt-2">
                            {submission.grade}/20
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-2">
                        Submitted: {new Date(submission.submittedAt).toLocaleString()}
                      </p>
                    </div>

                    {/* Submitted Images */}
                    {submission.images && submission.images.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-700 mb-3">Submitted Images:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {submission.images.map((imageUrl, idx) => (
                            <a
                              key={idx}
                              href={imageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-purple-500 transition"
                            >
                              <img
                                src={imageUrl}
                                alt={`Submission ${idx + 1}`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                <ExternalLink className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Grade Input (if not graded yet) */}
                    {submission.status === 'submitted' && (
                      <div className="pt-4 border-t">
                        <button
                          onClick={() => {
                            // TODO: Add grade functionality
                            toast.info('Grading feature coming soon!');
                          }}
                          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg font-semibold shadow hover:shadow-lg transition"
                        >
                          Grade Submission
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionDetail;
