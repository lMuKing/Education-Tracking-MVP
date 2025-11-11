import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Menu, X, LayoutDashboard, User, Moon, Sun } from 'lucide-react';
import { authAPI } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const AdminNavbar = () => {
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
    { path: '/mentor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/mentor/profile', label: 'Profile', icon: User },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`shadow-2xl sticky top-0 z-50 ${
      isDarkMode 
        ? 'bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900' 
        : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to="/mentor/dashboard" className={`text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-blue-600'
            }`}>
              Vedcets E-learn Mentor
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
                        ? 'bg-white/20 text-white font-semibold'
                        : 'bg-blue-100 text-blue-700 font-semibold'
                      : isDarkMode
                        ? 'text-white/80 hover:bg-white/10 hover:text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* User Info, Theme Toggle & Logout */}
          <div className="hidden md:flex items-center gap-4">
            <div className="text-right">
              <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {user?.full_name}
              </p>
              <p className={`text-xs ${isDarkMode ? 'text-white/70' : 'text-gray-500'}`}>
                {user?.user_role}
              </p>
            </div>
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

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
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-white/10 text-white'
                : 'hover:bg-gray-100 text-gray-700'
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
                          ? 'bg-white/20 text-white font-semibold'
                          : 'bg-blue-100 text-blue-700 font-semibold'
                        : isDarkMode
                          ? 'text-white/80 hover:bg-white/10 hover:text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
              <div className={`pt-4 mt-4 ${
                isDarkMode ? 'border-t border-white/20' : 'border-t border-gray-200'
              }`}>
                <div className="px-4 mb-3">
                  <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {user?.full_name}
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-white/70' : 'text-gray-500'}`}>
                    {user?.user_role}
                  </p>
                </div>
                
                {/* Theme Toggle Button Mobile */}
                <button
                  onClick={toggleTheme}
                  className={`flex items-center gap-2 w-full px-4 py-2 rounded-lg transition-colors mb-2 ${
                    isDarkMode
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </button>

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

export default AdminNavbar;
