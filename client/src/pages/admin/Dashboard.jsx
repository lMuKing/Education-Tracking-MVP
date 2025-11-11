import React, { useState, useEffect } from 'react';
import { Users, BookOpen, MessageSquare, Bell } from 'lucide-react';
import { adminAPI } from '../../api/admin';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import LogoutButton from '../../components/LogoutButton';

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    sessions: 0,
    requests: 0,
    announcements: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch data with individual error handling
      const [usersRes, sessionsRes, requestsRes, announcementsRes] = await Promise.all([
        adminAPI.getAllUsers().catch(err => {
          console.warn('Users fetch failed:', err.response?.status);
          return { users: [] };
        }),
        adminAPI.getAllSessions().catch(err => {
          console.warn('Sessions fetch failed:', err.response?.status);
          return { sessions: [] };
        }),
        adminAPI.getAllRequests().catch(err => {
          console.warn('Requests fetch failed:', err.response?.status);
          return { Requests: [] };
        }),
        adminAPI.getAllAnnouncements().catch(err => {
          console.warn('Announcements fetch failed:', err.response?.status);
          return { announcements: [], count: 0 };
        }),
      ]);

      console.log('Dashboard API Responses:', { usersRes, sessionsRes, requestsRes, announcementsRes }); // Debug log

      setStats({
        users: usersRes.users?.length || 0,
        sessions: sessionsRes.sessions?.length || 0,
        requests: (requestsRes.Requests || requestsRes.requests || []).length,
        announcements: announcementsRes.count || announcementsRes.announcements?.length || 0,
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Users', value: stats.users, icon: Users, color: 'bg-blue-500', link: '/admin/users?view=readonly' },
    { title: 'Total Sessions', value: stats.sessions, icon: BookOpen, color: 'bg-green-500', link: '/admin/sessions?view=readonly' },
    { title: 'Total Requests', value: stats.requests, icon: MessageSquare, color: 'bg-yellow-500', link: '/admin/requests?view=readonly' },
    { title: 'Announcements', value: stats.announcements, icon: Bell, color: 'bg-purple-500', link: '/admin/announcements?view=readonly' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8 relative overflow-hidden">
      {/* Logout button */}
      <LogoutButton />
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-sm md:text-base text-gray-600">Welcome back! Here's what's happening today.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-4 rounded-xl shadow-lg transform transition-transform hover:rotate-12`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 md:p-6 border border-gray-100">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Link
            to="/admin/users"
            className="group p-5 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900">Manage Users</h3>
            </div>
            <p className="text-sm text-gray-600">View, edit, and delete users</p>
          </Link>
          <Link
            to="/admin/sessions"
            className="group p-5 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-gradient-to-br hover:from-green-50 hover:to-green-100 transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900">Manage Sessions</h3>
            </div>
            <p className="text-sm text-gray-600">Create and manage sessions</p>
          </Link>
          <Link
            to="/admin/requests"
            className="group p-5 border-2 border-gray-200 rounded-xl hover:border-yellow-500 hover:bg-gradient-to-br hover:from-yellow-50 hover:to-yellow-100 transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-5 h-5 text-yellow-600 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900">Review Mentor Requests</h3>
            </div>
            <p className="text-sm text-gray-600">Review mentor requests</p>
          </Link>
          <Link
            to="/admin/announcements"
            className="group p-5 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-gradient-to-br hover:from-purple-50 hover:to-purple-100 transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900">View Announcements</h3>
            </div>
            <p className="text-sm text-gray-600">See all announcements</p>
          </Link>
        </div>
      </div>
      </div>
    </div>
    </>
  );
};

export default Dashboard;
