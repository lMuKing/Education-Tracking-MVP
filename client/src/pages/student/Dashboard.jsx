import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  XCircle, 
  User, 
  Calendar, 
  TrendingUp,
  Award,
  ArrowRight
} from 'lucide-react';
import { studentAPI } from '../../api/student';
import StudentNavbar from '../../components/student/StudentNavbar';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Dashboard = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [enrollments, setEnrollments] = useState([]);
  const [requests, setRequests] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEnrollments: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch each endpoint separately to handle errors individually
      let enrollmentsData = [];
      let requestsData = [];
      let profileData = null;
      
      // Fetch enrollments
      try {
        const enrollmentsRes = await studentAPI.getMyEnrollments();
        // Filter out enrollments where session_id is null (deleted sessions)
        enrollmentsData = (enrollmentsRes.enrollments || []).filter(enrollment => 
          enrollment.session_id && Object.keys(enrollment.session_id).length > 0
        );
      } catch (error) {
        toast.error('Failed to load enrollments');
      }
      
      // Fetch join requests
      try {
        const requestsRes = await studentAPI.getMyJoinRequests();
        requestsData = requestsRes.requests || [];
      } catch (error) {
        toast.error('Failed to load join requests');
      }
      
      // Fetch profile (optional - use user from context if this fails)
      try {
        const profileRes = await studentAPI.getProfile();
        console.log('✅ Profile:', profileRes);
        profileData = profileRes.student || profileRes.user || null;
      } catch (error) {
        console.error('❌ Error fetching profile:', error);
        console.log('ℹ️ Using user data from auth context instead');
        // Don't show error toast for profile - we can use context user
        profileData = user;
      }
      
      setEnrollments(enrollmentsData);
      setRequests(requestsData);
      setProfile(profileData);
      
      // Calculate stats
      setStats({
        totalEnrollments: enrollmentsData.length,
        pendingRequests: requestsData.filter(r => r.isApproved === null || r.isApproved === undefined).length,
        approvedRequests: requestsData.filter(r => r.isApproved === true).length,
        rejectedRequests: requestsData.filter(r => r.isApproved === false).length
      });
      
    } catch (error) {
      console.error('❌ Error in fetchDashboardData:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (isApproved) => {
    if (isApproved === true) {
      return 'bg-green-100 text-green-800 border-green-200';
    } else if (isApproved === false) {
      return 'bg-red-100 text-red-800 border-red-200';
    } else if (isApproved === null || isApproved === undefined) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
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
    if (isApproved === true) return 'approved';
    if (isApproved === false) return 'rejected';
    if (isApproved === null || isApproved === undefined) return 'pending';
    return 'pending';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <StudentNavbar />
        <div className="p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
            <p className="text-xl text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900' 
        : 'bg-gray-50'
    }`}>
      <StudentNavbar />
      
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <div>
              <h1 className={`text-2xl md:text-3xl font-bold mb-2 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Welcome , {profile?.full_name || user?.full_name || 'Student'}! 👋
              </h1>
              <p className={`transition-colors duration-300 ${
                isDarkMode ? 'text-blue-200' : 'text-gray-600'
              }`}>
                Here's what's happening with your learning journey
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Available Sessions Card - Links to all sessions */}
            <Link
              to="/student/sessions"
              className={`rounded-lg shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-all cursor-pointer ${
                isDarkMode ? 'bg-white/10 backdrop-blur-sm' : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
                    Available Sessions
                  </p>
                  <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {stats.totalEnrollments}
                  </p>
                </div>
                <div className="p-3 bg-green-500/20 rounded-full">
                  <BookOpen className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </Link>

            {/* Pending Requests Card - Links to pending requests */}
            <Link
              to="/student/requests?status=pending"
              className={`rounded-lg shadow-md p-6 border-l-4 border-yellow-500 hover:shadow-lg transition-all cursor-pointer ${
                isDarkMode ? 'bg-white/10 backdrop-blur-sm' : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
                    Pending Requests
                  </p>
                  <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {stats.pendingRequests}
                  </p>
                </div>
                <div className="p-3 bg-yellow-500/20 rounded-full">
                  <Clock className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
            </Link>

            {/* Approved Requests Card */}
            <div className={`rounded-lg shadow-md p-6 border-l-4 border-blue-500 ${
              isDarkMode ? 'bg-white/10 backdrop-blur-sm' : 'bg-white'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
                    Approved Requests
                  </p>
                  <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {stats.approvedRequests}
                  </p>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-full">
                  <CheckCircle className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </div>

            {/* Rejected Requests Card - Links to rejected requests */}
            <Link
              to="/student/requests?status=rejected"
              className={`rounded-lg shadow-md p-6 border-l-4 border-red-500 hover:shadow-lg transition-all cursor-pointer ${
                isDarkMode ? 'bg-white/10 backdrop-blur-sm' : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
                    Rejected Requests
                  </p>
                  <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {stats.rejectedRequests}
                  </p>
                </div>
                <div className="p-3 bg-red-500/20 rounded-full">
                  <XCircle className="w-6 h-6 text-red-500" />
                </div>
              </div>
            </Link>
          </div>

          {/* My Enrolled Courses - Full Width */}
          <div className={`rounded-lg shadow-md p-6 ${isDarkMode ? 'bg-white/10 backdrop-blur-sm' : 'bg-white'}`}>
            <div className="mb-6">
              <h2 className={`text-2xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <BookOpen className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                My Enrolled Courses
              </h2>
            </div>

            {enrollments.length === 0 ? (
              <div className={`text-center py-12 ${isDarkMode ? 'text-white' : 'text-gray-500'}`}>
                <BookOpen className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-white/50' : 'text-gray-300'}`} />
                <p className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  No enrollments yet
                </p>
                <p className="text-sm mb-4">Start your learning journey by joining a course</p>
                <Link
                  to="/student/sessions"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  Browse Courses
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrollments
                  .filter(enrollment => enrollment.session_id) // Filter out enrollments with deleted sessions
                  .map((enrollment) => (
                    <div 
                      key={enrollment._id} 
                      className={`rounded-lg p-4 transition-all ${
                        isDarkMode 
                          ? 'border border-white/20 hover:border-blue-400 bg-white/5' 
                          : 'border border-gray-200 hover:border-blue-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className={`font-bold text-lg mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {enrollment.session_id.title}
                          </h3>
                          <p className={`text-sm line-clamp-2 ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
                            {enrollment.session_id.description}
                          </p>
                        </div>
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-400 flex items-center gap-1 ml-2">
                          <CheckCircle className="w-3 h-3" />
                          Enrolled
                        </span>
                      </div>

                      <div className={`flex items-center gap-4 text-sm mb-3 ${isDarkMode ? 'text-white' : 'text-gray-500'}`}>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{enrollment.session_id?.mentor_id?.full_name || 'TBD'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Enrolled: {new Date(enrollment.enrollment_date || enrollment.enrolled_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          to={`/student/session/${enrollment._id}`}
                          className="flex-1 text-center bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          View Course Details
                        </Link>
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

export default Dashboard;
