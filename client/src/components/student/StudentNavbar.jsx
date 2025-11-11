import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Menu, X, LayoutDashboard, User, Moon, Sun } from 'lucide-react';
import { authAPI } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';

const StudentNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout: contextLogout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      contextLogout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const navLinks = [
    { path: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/student/profile', label: 'Profile', icon: User },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`shadow-md sticky top-0 z-50 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 border-b border-blue-800/50' 
        : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to="/student/dashboard" className={`text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-blue-600'
            }`}>
              Vedcets E-learn Student
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive(link.path)
                      ? isDarkMode 
                        ? 'bg-white/20 text-white font-semibold backdrop-blur-sm' 
                        : 'bg-blue-100 text-blue-700 font-semibold'
                      : isDarkMode
                        ? 'text-white hover:bg-white/10'
                        : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-white/10 text-yellow-300 hover:bg-white/20' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          {/* User Info & Logout */}
          <div className="hidden md:flex items-center gap-4">
            <div className="text-right">
              <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {user?.first_name} {user?.last_name}
              </p>
              <p className={`text-xs ${isDarkMode ? 'text-white/80' : 'text-gray-500'}`}>Student</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 rounded-lg ${
              isDarkMode ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100'
            }`}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isActive(link.path)
                        ? isDarkMode 
                          ? 'bg-white/20 text-white font-semibold backdrop-blur-sm' 
                          : 'bg-blue-100 text-blue-700 font-semibold'
                        : isDarkMode
                          ? 'text-white hover:bg-white/10'
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
              
              {/* Mobile Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'bg-white/10 text-yellow-300 hover:bg-white/20' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isDarkMode ? (
                  <>
                    <Sun className="w-4 h-4" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
              
              <div className={`border-t pt-4 mt-4 ${isDarkMode ? 'border-white/20' : 'border-gray-200'}`}>
                <div className="px-4 mb-3">
                  <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-white/80' : 'text-gray-500'}`}>Student</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default StudentNavbar;
