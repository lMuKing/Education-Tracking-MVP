import React, { useEffect, useState } from 'react';
import { User, Settings, Bell, LogOut, ChevronRight, ClipboardList, CheckCircle2, Users, Edit, XCircle, BookOpen } from 'lucide-react';
import { mentorAPI } from '../../api/mentor';
import { useTheme } from '../../context/ThemeContext';
import LogoutButton from '../../components/LogoutButton';
import { Link } from 'react-router-dom';
import AdminNavbar from '../../components/AdminNavbar';

const Dashboard = () => {
  const { isDarkMode } = useTheme();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        setLoading(true);
        const res = await mentorAPI.getProfile();
        const m = res.mentor || res;
        setMentor({
          full_name: m.full_name,
          email: m.email,
          profile_image_url: m.profile_image_url,
        });
      } catch {
        setMentor({ full_name: 'Mentor', email: 'your@email.com', profile_image_url: '' });
      } finally {
        setLoading(false);
      }
    };
    fetchMentor();
  }, []);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode 
          ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900' 
          : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <p className={`text-xl ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900' 
        : 'bg-gray-50'
    }`}>
    
      <AdminNavbar />
      
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="mb-6">
              <h1 className={`text-2xl md:text-3xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Welcome back, {mentor?.full_name || 'Mentor'}! 👋
              </h1>
              <p className={`${
                isDarkMode ? 'text-blue-200' : 'text-gray-600'
              }`}>
                Manage your sessions and students
              </p>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="mb-8">
            <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                to="/mentor/browseallsessions"
                className={`rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-all ${
                  isDarkMode ? 'bg-white/10 backdrop-blur-sm' : 'bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-blue-500/20 rounded-full">
                    <ClipboardList className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
                <h3 className={`font-bold text-lg mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Browse Sessions
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
                  View available sessions
                </p>
              </Link>

              <Link
                to="/mentor/allrequests"
                className={`rounded-lg shadow-md p-6 border-l-4 border-yellow-500 hover:shadow-lg transition-all ${
                  isDarkMode ? 'bg-white/10 backdrop-blur-sm' : 'bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-yellow-500/20 rounded-full">
                    <ClipboardList className="w-6 h-6 text-yellow-500" />
                  </div>
                </div>
                <h3 className={`font-bold text-lg mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  My Requests
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
                  View your requests
                </p>
              </Link>

              <Link
                to="/mentor/approvedrequests"
                className={`rounded-lg shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-all ${
                  isDarkMode ? 'bg-white/10 backdrop-blur-sm' : 'bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-green-500/20 rounded-full">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  </div>
                </div>
                <h3 className={`font-bold text-lg mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Approved
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
                  Approved requests
                </p>
              </Link>

              <Link
                to="/mentor/getallsessions"
                className={`rounded-lg shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-all ${
                  isDarkMode ? 'bg-white/10 backdrop-blur-sm' : 'bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-purple-500/20 rounded-full">
                    <BookOpen className="w-6 h-6 text-purple-500" />
                  </div>
                </div>
                <h3 className={`font-bold text-lg mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  My Sessions
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
                  All your sessions
                </p>
              </Link>
            </div>
          </div>

          {/* Main Features */}
          <div className="mb-8">
            <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Session Management
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                to="/mentor/updatesession"
                className={`rounded-lg shadow-md p-6 hover:shadow-lg transition-all ${
                  isDarkMode ? 'bg-white/10 backdrop-blur-sm border border-white/20' : 'bg-white'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
                    <Edit className={`w-6 h-6 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Update Session
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
                      Edit details of your sessions
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                to="/mentor/select-session-requests"
                className={`rounded-lg shadow-md p-6 hover:shadow-lg transition-all ${
                  isDarkMode ? 'bg-white/10 backdrop-blur-sm border border-white/20' : 'bg-white'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                    <Users className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Join Requests
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
                      Review student join requests
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                to="/mentor/select-session-students"
                className={`rounded-lg shadow-md p-6 hover:shadow-lg transition-all ${
                  isDarkMode ? 'bg-white/10 backdrop-blur-sm border border-white/20' : 'bg-white'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-green-500/20' : 'bg-green-100'}`}>
                    <Users className={`w-6 h-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Session Students
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
                      View enrolled students
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
