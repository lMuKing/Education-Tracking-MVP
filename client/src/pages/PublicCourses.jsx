import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Users, Star, Search, Filter } from 'lucide-react';
import { adminAPI } from '../api/admin';

const PublicCourses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.classList.add('dark');
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await adminAPI.getPublicSessions();
      setCourses(response.sessions || []);
    } catch (error) {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'active', 'inactive'];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.status === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
  <div className="min-h-screen transition-colors duration-500 relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Abstract SVG background */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <svg width="100%" height="100%" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <ellipse cx="900" cy="200" rx="400" ry="180" fill="#312e81" fillOpacity="0.25" />
          <ellipse cx="300" cy="700" rx="350" ry="120" fill="#6366f1" fillOpacity="0.15" />
          <ellipse cx="1200" cy="800" rx="200" ry="80" fill="#a5b4fc" fillOpacity="0.10" />
        </svg>
      </div>
      {/* Header */}
      <header className="shadow-sm bg-gray-900 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-indigo-400" />
              <h1 className="text-2xl font-bold text-white">EdTrack</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 font-medium text-gray-200 hover:text-white"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-lg font-medium transition-colors bg-indigo-700 text-white hover:bg-indigo-800"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative py-16 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white z-10">
        <div className="absolute inset-0 pointer-events-none select-none opacity-30">
          <svg width="100%" height="100%" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="#312e81" fillOpacity="0.3" d="M0,160L48,165.3C96,171,192,181,288,165.3C384,149,480,107,576,117.3C672,128,768,192,864,218.7C960,245,1056,235,1152,197.3C1248,160,1344,96,1392,64L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-5xl font-extrabold mb-4 tracking-tight drop-shadow-lg">Discover Amazing Courses</h2>
          <p className="text-xl mb-8 opacity-90">Learn from expert mentors and advance your skills</p>
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:ring-indigo-700"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        <div className="flex items-center space-x-4 overflow-x-auto pb-2">
          <Filter className="h-5 w-5 flex-shrink-0 text-indigo-400" />
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors shadow ${
                selectedCategory === category
                  ? 'bg-indigo-700 text-white'
                  : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="mb-4">
          <p className="text-gray-300">
            Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => {
            return (
              <div
                key={course._id}
                className="rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 bg-gray-900 border border-gray-800"
              >
                {/* Only show image if admin uploaded one */}
                {course.session_image && (
                  <div className="h-48 overflow-hidden bg-gray-800">
                    <img 
                      src={course.session_image} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-900 text-indigo-300">
                    {course.status}
                  </span>
                  {course.price > 0 && (
                    <span className="text-lg font-bold text-indigo-400">
                      ${course.price}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">{course.title}</h3>
                <p className="mb-4 line-clamp-2 text-gray-400">{course.description}</p>
                <div className="flex items-center text-sm mb-4 space-x-4 text-gray-400">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{course.current_enrolled_count || 0} students</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <div>
                    <p className="text-sm text-gray-400">Created by</p>
                    <p className="font-medium text-white">
                      {course.mentor_id?.full_name || 'Admin'}
                    </p>
                  </div>
                  <Link
                    to="/login"
                    state={{ sessionId: course._id, returnTo: '/student/dashboard' }}
                    className="px-4 py-2 rounded-lg font-semibold transition-colors bg-indigo-700 text-white hover:bg-indigo-800"
                  >
                    {course.price > 0 ? 'Enroll' : 'Join Free'}
                  </Link>
                </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-700" />
            <p className="text-lg text-gray-400">No courses found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 bg-gray-900 text-gray-400 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="font-semibold tracking-wide">&copy; 2025 EdTrack. All rights reserved.</p>
            <div className="mt-2 flex justify-center space-x-4">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicCourses;
