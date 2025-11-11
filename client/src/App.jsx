// App.jsx
// Main App component
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Public Pages
import Landing from './pages/Landing';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import VerifyEmail from './pages/auth/VerifyEmail';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminSessions from './pages/admin/Sessions';
import AdminRequests from './pages/admin/Requests';
import AdminAnnouncements from './pages/admin/Announcements';

// Mentor Pages
import MentorDashboard from './pages/mentor/Dashboard';
import MentorSessions from './pages/mentor/Sessions';
import MentorCourses from './pages/mentor/Courses';
import MentorHomework from './pages/mentor/Homework';
import MentorAnnouncements from './pages/mentor/Announcements';
import MentorProfile from './pages/mentor/Profile';
import MentorChangePassword from './pages/mentor/ChangePassword';
import MentorUpdateProfile from './pages/mentor/UpdateProfile';
import MentorBrowseSessions from './pages/mentor/BrowseSessions';
import MentorAllRequests from './pages/mentor/AllRequests';
import MentorApprovedRequests from './pages/mentor/ApprovedRequests';
import MentorAllSessions from './pages/mentor/AllSessions';
import MentorUpdateSession from './pages/mentor/UpdateSession';
import MentorSelectSessionForRequests from './pages/mentor/SelectSessionForRequests';
import MentorSelectSessionForStudents from './pages/mentor/SelectSessionForStudents';
import MentorJoinRequests from './pages/mentor/JoinRequests';
import MentorSessionStudents from './pages/mentor/SessionStudents';
import MentorSessionDetail from './pages/mentor/SessionDetail';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentSessions from './pages/student/Sessions';
import StudentMyRequests from './pages/student/MyRequests';
import StudentCourses from './pages/student/Courses';
import StudentHomework from './pages/student/Homework';
import StudentProfile from './pages/student/Profile';
import StudentSessionDetail from './pages/student/SessionDetail';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.user_role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
               <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="sessions" element={<AdminSessions />} />
                    <Route path="requests" element={<AdminRequests />} />
                    <Route path="announcements" element={<AdminAnnouncements />} />
                  </Routes>
                </ProtectedRoute>
              }
            />

            {/* Mentor Routes */}
            <Route
              path="/mentor/*"
              element={
                <ProtectedRoute allowedRoles={['Mentor']}>
                  <Routes>
                    <Route path="dashboard" element={<MentorDashboard />} />
                    <Route path="sessions" element={<MentorSessions />} />
                    <Route path="courses/:sessionId" element={<MentorCourses />} />
                    <Route path="homework/:courseId" element={<MentorHomework />} />
                    <Route path="announcements/:sessionId" element={<MentorAnnouncements />} />
                    <Route path="profile" element={<MentorProfile />} />
                    <Route path="profile/changepassword" element={<MentorChangePassword />} />
                    <Route path="profile/updateprofile" element={<MentorUpdateProfile />} />
                    <Route path="browseallsessions" element={<MentorBrowseSessions />} />
                    <Route path="allrequests" element={<MentorAllRequests />} />
                    <Route path="approvedrequests" element={<MentorApprovedRequests />} />
                    <Route path="getallsessions" element={<MentorAllSessions />} />
                    <Route path="updatesession" element={<MentorUpdateSession />} />
                    <Route path="select-session-requests" element={<MentorSelectSessionForRequests />} />
                    <Route path="join-requests/:sessionId" element={<MentorJoinRequests />} />
                    <Route path="select-session-students" element={<MentorSelectSessionForStudents />} />
                    <Route path="session-students/:sessionId" element={<MentorSessionStudents />} />
                    <Route path="session/:sessionId" element={<MentorSessionDetail />} />
                  </Routes>
                </ProtectedRoute>
              }
            />

            {/* Student Routes */}
            <Route
              path="/student/*"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <Routes>
                    <Route path="dashboard" element={<StudentDashboard />} />
                    <Route path="sessions" element={<StudentSessions />} />
                    <Route path="session/:enrollmentId" element={<StudentSessionDetail />} />
                    <Route path="requests" element={<StudentMyRequests />} />
                    <Route path="courses" element={<StudentCourses />} />
                    <Route path="homework" element={<StudentHomework />} />
                    <Route path="profile" element={<StudentProfile />} />
                  </Routes>
                </ProtectedRoute>
              }
            />

            {/* Default Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;