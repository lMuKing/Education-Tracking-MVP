import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  BookOpen, 
  FileText, 
  Megaphone, 
  Calendar,
  User,
  CheckCircle,
  Clock,
  ExternalLink,
  Upload
} from 'lucide-react';
import { studentAPI } from '../../api/student';
import { announcementAPI } from '../../api/announcement';
import StudentNavbar from '../../components/student/StudentNavbar';
import SubmitHomework from '../../components/student/SubmitHomework';
import toast from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';

const SessionDetail = () => {
  const { enrollmentId } = useParams();
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [enrollment, setEnrollment] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [homeworks, setHomeworks] = useState([]);
  const [loadingHomeworks, setLoadingHomeworks] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);
  const [activeTab, setActiveTab] = useState('modules'); // modules, homeworks, announcements
  const [selectedHomework, setSelectedHomework] = useState(null);

  useEffect(() => {
    fetchSessionDetails();
  }, [enrollmentId]);

  const fetchSessionDetails = async () => {
    try {
      setLoading(true);
      
      // Get enrollment details
      const enrollmentRes = await studentAPI.getEnrollmentDetails(enrollmentId);
      setEnrollment(enrollmentRes.enrollment);
      
      const sessionId = enrollmentRes.enrollment?.session_id?._id;
      
      if (sessionId) {
        // Get courses (chapters) in this session
        try {
          const coursesRes = await studentAPI.getSessionCourses(sessionId);
          setCourses(coursesRes.courses || []);
        } catch (error) {
          setCourses([]);
        }

        // Get announcements for this session
        try {
          const announcementsRes = await studentAPI.getSessionAnnouncements(sessionId);
          setAnnouncements(announcementsRes.announcements || []);
        } catch (error) {
          // Don't show error toast if it's just a 404 (no announcements)
          setAnnouncements([]);
        }
      }
      
    } catch (error) {
      toast.error('Failed to load session details');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseHomeworks = async (courseId) => {
    try {
      setLoadingHomeworks(true);
      const response = await studentAPI.getHomeworksByCourse(courseId);
      setHomeworks(response.homeworks || []);
    } catch (error) {
      toast.error('Failed to load homeworks');
      setHomeworks([]);
    } finally {
      setLoadingHomeworks(false);
    }
  };

  const handleCourseSelect = async (course) => {
    setSelectedCourse(course);
    setActiveTab('homeworks');
    await fetchCourseHomeworks(course._id);
  };

  const handleEnrollInHomework = async (homeworkId) => {
    try {
      const response = await studentAPI.enrollInHomework(homeworkId);
      toast.success('Enrolled in homework successfully');
      
      // Refresh the homework list to update enrollment status
      if (selectedCourse) {
        await fetchCourseHomeworks(selectedCourse._id);
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Failed to enroll in homework');
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode 
          ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900' 
          : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <p className={`text-xl ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
            Loading session details...
          </p>
        </div>
      </div>
    );
  }

  if (!enrollment) {
    return (
      <div className={`min-h-screen ${
        isDarkMode 
          ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900' 
          : 'bg-gray-50'
      }`}>
        <StudentNavbar />
        <div className="p-8">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Session not found
            </h2>
            <Link
              to="/student/dashboard"
              className="text-blue-600 hover:text-blue-700"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const session = enrollment.session_id;

  return (
    <div className={`min-h-screen ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900' 
        : 'bg-gray-50'
    }`}>
      <StudentNavbar />
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/student/dashboard"
              className={`inline-flex items-center gap-2 mb-4 ${
                isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            
            {/* Session Info Card */}
            <div className={`rounded-lg shadow-md p-6 mb-6 ${
              isDarkMode ? 'bg-white/10 backdrop-blur-sm border border-white/20' : 'bg-white'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {session?.title || 'Session Details'}
                  </h1>
                  <p className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
                    {session?.description || 'No description available'}
                  </p>
                </div>
                <span className="px-4 py-2 text-sm font-semibold rounded-full bg-green-500/20 text-green-400 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Enrolled
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
                  <User className="w-5 h-5" />
                  <div>
                    <p className={`text-xs ${isDarkMode ? 'text-white/80' : 'text-gray-500'}`}>Mentor</p>
                    <p className="font-medium">{session?.mentor_id?.full_name || 'TBD'}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
                  <Calendar className="w-5 h-5" />
                  <div>
                    <p className={`text-xs ${isDarkMode ? 'text-white/80' : 'text-gray-500'}`}>Start Date</p>
                    <p className="font-medium">
                      {session?.start_date ? new Date(session.start_date).toLocaleDateString() : 'TBD'}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
                  <Calendar className="w-5 h-5" />
                  <div>
                    <p className={`text-xs ${isDarkMode ? 'text-white/80' : 'text-gray-500'}`}>Enrolled On</p>
                    <p className="font-medium">
                      {new Date(enrollment.enrolled_at || enrollment.enrollment_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className={`border-b overflow-x-auto ${
              isDarkMode ? 'border-white/20' : 'border-gray-200'
            }`}>
              <nav className="flex gap-4 md:gap-8 min-w-max">
                <button
                  onClick={() => setActiveTab('modules')}
                  className={`flex items-center gap-2 pb-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === 'modules'
                      ? isDarkMode
                        ? 'border-blue-400 text-blue-400'
                        : 'border-blue-600 text-blue-600'
                      : isDarkMode
                        ? 'border-transparent text-gray-400 hover:text-gray-200 hover:border-white/20'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <BookOpen className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="hidden sm:inline">Course Modules</span>
                  <span className="sm:hidden">Modules</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    isDarkMode ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {courses.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('homeworks')}
                  className={`flex items-center gap-2 pb-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === 'homeworks'
                      ? isDarkMode
                        ? 'border-blue-400 text-blue-400'
                        : 'border-blue-600 text-blue-600'
                      : isDarkMode
                        ? 'border-transparent text-gray-400 hover:text-gray-200 hover:border-white/20'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <FileText className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="hidden sm:inline">Module Homeworks</span>
                  <span className="sm:hidden">Homeworks</span>
                  {selectedCourse && (
                    <span className={`hidden md:inline px-2 py-1 rounded-full text-xs max-w-[100px] truncate ${
                      isDarkMode ? 'bg-blue-400/20 text-blue-300' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {selectedCourse.title}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('announcements')}
                  className={`flex items-center gap-2 pb-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === 'announcements'
                      ? isDarkMode
                        ? 'border-blue-400 text-blue-400'
                        : 'border-blue-600 text-blue-600'
                      : isDarkMode
                        ? 'border-transparent text-gray-400 hover:text-gray-200 hover:border-white/20'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Megaphone className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="hidden sm:inline">Announcements</span>
                  <span className="sm:hidden">Announce</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div>
            {/* Course Modules Tab */}
            {activeTab === 'modules' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.length === 0 ? (
                  <div className={`col-span-full text-center py-12 rounded-lg shadow-md ${
                    isDarkMode ? 'bg-white/10 backdrop-blur-sm' : 'bg-white'
                  }`}>
                    <BookOpen className={`w-16 h-16 mx-auto mb-4 ${
                      isDarkMode ? 'text-gray-500' : 'text-gray-300'
                    }`} />
                    <h3 className={`text-lg font-medium mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>No modules yet</h3>
                    <p className={isDarkMode ? 'text-white' : 'text-gray-500'}>
                      Course modules will appear here once they are added to this session
                    </p>
                  </div>
                ) : (
                  courses.map((course) => (
                    <div
                      key={course._id}
                      className={`rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${
                        isDarkMode ? 'bg-white/10 backdrop-blur-sm border border-white/20' : 'bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-4">
                        <div className={`p-3 rounded-lg ${
                          isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'
                        }`}>
                          <BookOpen className={`w-6 h-6 ${
                            isDarkMode ? 'text-blue-400' : 'text-blue-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-bold text-lg mb-1 ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {course.title}
                          </h3>
                          <p className={`text-sm line-clamp-2 ${
                            isDarkMode ? 'text-white' : 'text-gray-600'
                          }`}>
                            {course.description || 'No description'}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        {course.documents_url && (
                          <a
                            href={course.documents_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 text-sm font-medium ${
                              isDarkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-600 hover:text-blue-700'
                            }`}
                          >
                            <ExternalLink className="w-4 h-4" />
                            View Documents
                          </a>
                        )}

                        {course.external_links && (
                          <a
                            href={course.external_links}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 text-sm font-medium ${
                              isDarkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-600 hover:text-blue-700'
                            }`}
                          >
                            <ExternalLink className="w-4 h-4" />
                            External Resources
                          </a>
                        )}
                      </div>

                      <button
                        onClick={() => handleCourseSelect(course)}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        View Homeworks
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Homeworks Tab */}
            {activeTab === 'homeworks' && (
              <div className="space-y-6">
                {!selectedCourse ? (
                  <div className={`rounded-lg shadow-md p-12 text-center ${
                    isDarkMode ? 'bg-white/10 backdrop-blur-sm' : 'bg-white'
                  }`}>
                    <FileText className={`w-16 h-16 mx-auto mb-4 ${
                      isDarkMode ? 'text-gray-500' : 'text-gray-300'
                    }`} />
                    <h3 className={`text-lg font-medium mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>No Module Selected</h3>
                    <p className={`mb-4 ${
                      isDarkMode ? 'text-white' : 'text-gray-500'
                    }`}>
                      Select a course module from the "Course Modules" tab to view its homeworks
                    </p>
                    <button
                      onClick={() => setActiveTab('modules')}
                      className={`font-medium ${
                        isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                      }`}
                    >
                      Go to Course Modules
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Selected Module Header */}
                    <div className={`rounded-lg shadow-md p-6 ${
                      isDarkMode ? 'bg-white/10 backdrop-blur-sm border border-white/20' : 'bg-white'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-lg ${
                            isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'
                          }`}>
                            <BookOpen className={`w-6 h-6 ${
                              isDarkMode ? 'text-blue-400' : 'text-blue-600'
                            }`} />
                          </div>
                          <div>
                            <h2 className={`text-xl font-bold ${
                              isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {selectedCourse.title}
                            </h2>
                            <p className={`text-sm ${
                              isDarkMode ? 'text-white' : 'text-gray-600'
                            }`}>
                              {selectedCourse.description || 'Module homeworks'}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedCourse(null);
                            setActiveTab('modules');
                          }}
                          className={`flex items-center gap-2 ${
                            isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <ArrowLeft className="w-4 h-4" />
                          Back to Modules
                        </button>
                      </div>
                    </div>

                    {/* Homeworks List */}
                    {loadingHomeworks ? (
                      <div className={`rounded-lg shadow-md p-12 text-center ${
                        isDarkMode ? 'bg-white/10 backdrop-blur-sm' : 'bg-white'
                      }`}>
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
                        <p className={isDarkMode ? 'text-white' : 'text-gray-600'}>Loading homeworks...</p>
                      </div>
                    ) : homeworks.length === 0 ? (
                      <div className={`rounded-lg shadow-md p-12 text-center ${
                        isDarkMode ? 'bg-white/10 backdrop-blur-sm' : 'bg-white'
                      }`}>
                        <FileText className={`w-16 h-16 mx-auto mb-4 ${
                          isDarkMode ? 'text-white/50' : 'text-gray-300'
                        }`} />
                        <h3 className={`text-lg font-medium mb-2 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>No Homeworks Yet</h3>
                        <p className={isDarkMode ? 'text-white' : 'text-gray-500'}>
                          No homeworks have been assigned for this module
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {homeworks.map((homework) => (
                          <div
                            key={homework._id}
                            className={`rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${
                              isDarkMode ? 'bg-white/10 backdrop-blur-sm border border-white/20' : 'bg-white'
                            }`}
                          >
                            {/* Header with Title and Type Badge */}
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-2">
                                <FileText className={`w-6 h-6 ${
                                  isDarkMode ? 'text-purple-400' : 'text-purple-600'
                                }`} />
                                <h3 className={`font-bold text-xl ${
                                  isDarkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {homework.title}
                                </h3>
                              </div>
                              {homework.task_type && (
                                <span className="px-3 py-1 text-xs font-semibold bg-green-500/20 text-green-400 rounded-full">
                                  {homework.task_type}
                                </span>
                              )}
                            </div>

                            {/* Description */}
                            <p className={`text-sm mb-4 ${
                              isDarkMode ? 'text-white' : 'text-gray-600'
                            }`}>
                              {homework.description || 'No description'}
                            </p>

                            {/* Instructions */}
                            {homework.instructions && (
                              <div className="mb-4">
                                <p className={`text-sm font-semibold mb-1 ${
                                  isDarkMode ? 'text-white' : 'text-gray-700'
                                }`}>Instructions:</p>
                                <p className={`text-sm whitespace-pre-wrap ${
                                  isDarkMode ? 'text-white' : 'text-gray-600'
                                }`}>
                                  {homework.instructions}
                                </p>
                              </div>
                            )}

                            {/* View Document Link */}
                            {homework.documents_url && (
                              <a
                                href={homework.documents_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center gap-2 text-sm mb-4 font-medium ${
                                  isDarkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-600 hover:text-blue-700'
                                }`}
                              >
                                <ExternalLink className="w-4 h-4" />
                                View Document
                              </a>
                            )}

                            {/* Deadlines and Penalty */}
                            <div className={`space-y-2 mb-4 pt-4 border-t ${
                              isDarkMode ? 'border-white/20' : 'border-gray-200'
                            }`}>
                              {homework.deadline && (
                                <div className={`flex items-center gap-2 text-sm ${
                                  isDarkMode ? 'text-white' : 'text-gray-600'
                                }`}>
                                  <Calendar className="w-4 h-4" />
                                  <div className="flex-1">
                                    <span className={`text-xs ${
                                      isDarkMode ? 'text-white/80' : 'text-gray-500'
                                    }`}>Deadline: </span>
                                    <span className="font-medium">{new Date(homework.deadline).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              )}

                              {homework.extended_deadline && (
                                <div className={`flex items-center gap-2 text-sm ${
                                  isDarkMode ? 'text-white' : 'text-gray-600'
                                }`}>
                                  <Calendar className="w-4 h-4" />
                                  <div className="flex-1">
                                    <span className={`text-xs ${
                                      isDarkMode ? 'text-white/80' : 'text-gray-500'
                                    }`}>Extended Deadline: </span>
                                    <span className="font-medium">{new Date(homework.extended_deadline).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              )}

                              {homework.late_submission_penalty > 0 && (
                                <div className="flex items-center gap-2 text-sm text-orange-400">
                                  <Clock className="w-4 h-4" />
                                  <span>Late Penalty: {homework.late_submission_penalty}%</span>
                                </div>
                              )}
                            </div>

                            {/* Submit Button */}
                            <button
                              onClick={() => setSelectedHomework(homework)}
                              disabled={homework.enrollment_status === 'submitted' || 
                                (!homework.extended_deadline && new Date() > new Date(homework.deadline)) ||
                                (homework.extended_deadline && new Date() > new Date(homework.extended_deadline))
                              }
                              className={`w-full py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                                homework.enrollment_status === 'submitted'
                                  ? isDarkMode
                                    ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                                    : 'bg-green-100 text-green-600 cursor-not-allowed'
                                  : (!homework.extended_deadline && new Date() > new Date(homework.deadline)) ||
                                    (homework.extended_deadline && new Date() > new Date(homework.extended_deadline))
                                    ? isDarkMode
                                      ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                                      : 'bg-gray-100 text-gray-600 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                            >
                              {homework.enrollment_status === 'submitted' ? (
                                <>
                                  <CheckCircle className="w-4 h-4" />
                                  Submitted
                                </>
                              ) : (!homework.extended_deadline && new Date() > new Date(homework.deadline)) ||
                                  (homework.extended_deadline && new Date() > new Date(homework.extended_deadline)) ? (
                                <>
                                  <Clock className="w-4 h-4" />
                                  Deadline Passed
                                </>
                              ) : (
                                <>
                                  <Upload className="w-4 h-4" />
                                  Submit Homework
                                </>
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Submit Homework Modal */}
            {selectedHomework && (
              <SubmitHomework
                homework={selectedHomework}
                onClose={() => setSelectedHomework(null)}
                onSuccess={() => {
                  setSelectedHomework(null);
                  if (selectedCourse) {
                    fetchCourseHomeworks(selectedCourse._id);
                  }
                }}
                isDarkMode={isDarkMode}
              />
            )}

            {/* Announcements Tab */}
            {activeTab === 'announcements' && (
              <div className="space-y-4">
                {announcements.length === 0 ? (
                  <div className={`rounded-lg shadow-md p-12 text-center ${
                    isDarkMode ? 'bg-white/10 backdrop-blur-sm' : 'bg-white'
                  }`}>
                    <Megaphone className={`w-16 h-16 mx-auto mb-4 ${
                      isDarkMode ? 'text-gray-500' : 'text-gray-300'
                    }`} />
                    <h3 className={`text-lg font-medium mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>No Announcements Yet</h3>
                    <p className={isDarkMode ? 'text-white' : 'text-gray-500'}>
                      Announcements will appear here when posted by your mentor
                    </p>
                  </div>
                ) : (
                  announcements.map((announcement) => (
                    <div
                      key={announcement._id}
                      className={`rounded-lg shadow-md p-6 border-l-4 ${
                        isDarkMode 
                          ? announcement.is_urgent
                            ? 'bg-white/10 backdrop-blur-sm border-red-400'
                            : 'bg-white/10 backdrop-blur-sm border-blue-400'
                          : announcement.is_urgent
                            ? 'bg-white border-red-500'
                            : 'bg-white border-blue-500'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            announcement.is_urgent
                              ? isDarkMode ? 'bg-red-500/20' : 'bg-red-100'
                              : isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'
                          }`}>
                            <Megaphone className={`w-5 h-5 ${
                              announcement.is_urgent
                                ? isDarkMode ? 'text-red-400' : 'text-red-600'
                                : isDarkMode ? 'text-blue-400' : 'text-blue-600'
                            }`} />
                          </div>
                          <div>
                            <h3 className={`text-lg font-bold ${
                              isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {announcement.title}
                            </h3>
                            {announcement.is_urgent && (
                              <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold bg-red-500/20 text-red-400 rounded-full">
                                Urgent
                              </span>
                            )}
                          </div>
                        </div>
                        <div className={`text-sm flex items-center gap-2 ${
                          isDarkMode ? 'text-white/80' : 'text-gray-500'
                        }`}>
                          <Calendar className="w-4 h-4" />
                          {new Date(announcement.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <p className={`whitespace-pre-wrap ${
                        isDarkMode ? 'text-white' : 'text-gray-700'
                      }`}>
                        {announcement.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDetail;
