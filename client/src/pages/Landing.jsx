import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Calendar, Users, Star, BarChart2, Shield, UserCheck, Award, Search, ChevronDown, ChevronUp, Mail, Phone, MapPin, Clock, Facebook, Instagram, Linkedin, Smartphone, Repeat, FileEdit } from "lucide-react";
import { publicAxios } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Landing = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  // Always use dark mode for landing page
  const darkMode = true;
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('name'); // 'name' or 'category'
  const [expandedCourse, setExpandedCourse] = useState(null); // Track which course details are shown
  const [categories, setCategories] = useState([]); // Available categories
  const [expandedCard, setExpandedCard] = useState(null); // Track which feature card is expanded

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      
      // Try public endpoint first, fallback to admin endpoint
      let response;
      try {
        // Option 1: Try dedicated public endpoint
        response = await publicAxios.get('/public/sessions');
      } catch (error) {
        // Option 2: Fallback to admin endpoint (if made public)
        try {
          response = await publicAxios.get('/admin/findsessions_all/');
        } catch (adminError) {
          // If both endpoints fail (404 = no sessions), treat as empty
          if (adminError.response?.status === 404) {
            response = { data: { sessions: [] } };
          } else {
            throw adminError;
          }
        }
      }
      
      // Check all possible response structures
      let sessionsArray = response.data?.sessions || response.data?.data?.sessions || response.data;
      
      if (sessionsArray && Array.isArray(sessionsArray) && sessionsArray.length > 0) {
        // Transform sessions to course format for landing page
        const transformedCourses = sessionsArray.map((session) => {
          return {
            id: session._id || session.id,
            title: session.title,
            description: session.description,
            students: session.current_enrolled_count || session.enrolled_students || session.students || 0,
            maxStudents: session.max_students || 0,
            price: session.price > 0 ? `$${session.price}` : "Free",
            priceValue: session.price || 0,
            oldPrice: null,
            image: session.session_image, // Only use admin uploaded images, or null
            date: new Date(session.createdAt || session.created_at || session.start_date).toLocaleDateString(),
            category: session.session_category || 'Uncategorized', // Use session_category from backend
            status: session.status,
            mentor: session.mentor_name || session.mentor_id?.full_name || 'TBD',
            duration: session.duration ? `${session.duration} hours` : 'N/A'
          };
        });
        
        setCourses(transformedCourses);
        
        // Use predefined categories
        const predefinedCategories = ['Maths', 'Physics', 'Science', 'Arabic', 'English', 'French'];
        setCategories(predefinedCategories);
      } else {
        setCourses([]);
        // Still set predefined categories even if no courses
        const predefinedCategories = ['Maths', 'Physics', 'Science', 'Arabic', 'English', 'French'];
        setCategories(predefinedCategories);
      }
    } catch (error) {
      // Don't show error toast on landing page for guests
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCourse = async (courseId, courseStatus) => {
    if (courseStatus !== 'active') {
      toast('This course is coming soon!', {
        icon: 'ℹ️',
      });
      return;
    }

    // Always redirect to login page with session info
    // The login page will handle the join request after authentication
    navigate('/login', { 
      state: { 
        sessionId: courseId, 
        returnTo: '/student/dashboard' 
      } 
    });
  };

  const bgColor = darkMode ? "bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900" : "bg-gray-50";
  const textColor = darkMode ? "text-white" : "text-gray-900";
  const cardBg = darkMode ? "bg-white/10 backdrop-blur-sm border border-white/20" : "bg-white";
  const cardText = darkMode ? "text-white" : "text-gray-600";
  const headingColor = darkMode ? "text-white" : "text-gray-900";
  const navBg = darkMode ? "bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900" : "bg-white shadow-sm";
  const footerBg = darkMode ? "bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900" : "bg-gray-100";
  const allText = darkMode ? "text-white" : "text-gray-900";

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
      
    <div className={`min-h-screen ${bgColor} ${allText} transition-colors duration-300`}>
      {/* Navbar */}
      <nav className={`flex flex-col md:flex-row justify-between items-center px-4 md:px-8 py-4 md:py-6 space-y-4 md:space-y-0 ${navBg}`}>
        <div className={`flex items-center gap-2 ${allText} w-full md:w-auto justify-center md:justify-start`}>
          <BookOpen className="h-6 md:h-8 w-6 md:w-8" />
          <span className="font-bold text-xl md:text-2xl tracking-tight">Vedcets E-learning Platform</span>
        </div>
        <div className={`flex gap-4 md:gap-8 text-base md:text-lg font-medium ${allText} w-full md:w-auto justify-center`}>
          <Link to="/" className="text-[#ff6a2f]">Home</Link>
          <a href="#courses" className="hover:text-[#ff6a2f]">Courses</a>
          <a href="#about" className="hover:text-orange-500 transition-colors">About Us</a>
        </div>
        <div className="flex gap-3 md:gap-4 items-center w-full md:w-auto justify-center">
          <Link to="/login" className="bg-white/10 text-white border border-white/20 px-4 md:px-6 py-2 rounded-lg text-sm md:text-base font-semibold shadow hover:bg-white/20 transition-all">LOG IN</Link>
          <Link to="/signup" className="bg-orange-500 text-white px-4 md:px-6 py-2 rounded-lg text-sm md:text-base font-semibold shadow hover:bg-orange-600 transition-all">SIGN UP</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-start justify-between px-4 md:px-8 py-8 md:py-12 gap-8">
        <div className="flex-1 w-full min-w-0">
          <span className={`inline-block ${cardBg} ${allText} px-3 md:px-4 py-2 rounded-full font-semibold mb-4 shadow text-sm md:text-base`}>Never stop learning</span>
          <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 ${headingColor}`}>Professional Teachers, Flexible Learning, Proven Results</h1>
          <div className="flex items-center gap-4 mb-6">
            <a href="#courses" className="w-full md:w-auto bg-[#ff6a2f] text-white px-4 md:px-6 py-3 rounded-lg font-bold text-base md:text-lg shadow hover:bg-[#ff8a4f] text-center">EXPLORE COURSES</a>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-fr">
            {/* Available Courses Card */}
            <div 
              onClick={() => setExpandedCard(expandedCard === 'courses' ? null : 'courses')}
              className={`flex flex-col ${cardBg} ${cardText} rounded-lg px-4 md:px-6 py-3 md:py-4 shadow hover:scale-105 transition-all duration-300 min-w-0 cursor-pointer ${expandedCard === 'courses' ? 'col-span-2' : 'col-span-1'}`}
            >
              <div className="flex items-center gap-3 md:gap-4 mb-2">
                <Calendar className="h-5 md:h-6 w-5 md:w-6 text-orange-500 flex-shrink-0" />
                <span className="font-bold text-lg md:text-xl">{courses.length}</span>
              </div>
              <div className={`text-xs md:text-sm ${allText}`}>Available Courses</div>
            </div>

            {/* Quality Content Card */}
            <div 
              onClick={() => setExpandedCard(expandedCard === 'quality' ? null : 'quality')}
              className={`flex flex-col ${cardBg} ${cardText} rounded-lg px-4 md:px-6 py-3 md:py-4 shadow hover:scale-105 transition-all duration-300 min-w-0 cursor-pointer ${expandedCard === 'quality' ? 'col-span-2' : 'col-span-1'}`}
            >
              <div className="flex items-center gap-3 md:gap-4 mb-2">
                <Star className="h-5 md:h-6 w-5 md:w-6 text-orange-500 flex-shrink-0" />
                <span className={`font-bold text-sm md:text-xl ${expandedCard === 'quality' ? '' : 'whitespace-nowrap overflow-hidden text-ellipsis'}`}>Courses Quality</span>
              </div>
              <div className={`text-xs md:text-sm ${allText}`}>High Quality Of Content</div>
            </div>

            {/* 24/7 Access Card */}
            <div 
              onClick={() => setExpandedCard(expandedCard === '24/7' ? null : '24/7')}
              className={`flex flex-col ${cardBg} ${cardText} rounded-lg px-4 md:px-6 py-3 md:py-4 shadow hover:scale-105 transition-all duration-300 min-w-0 cursor-pointer ${expandedCard === '24/7' ? 'col-span-2' : 'col-span-1'}`}
            >
              <div className="flex items-center gap-3 md:gap-4 mb-2">
                <Clock className="h-5 md:h-6 w-5 md:w-6 text-orange-500 flex-shrink-0" />
                <span className="font-bold text-lg md:text-xl">24/7</span>
              </div>
              <div className={`text-xs md:text-sm ${allText}`}>Study Anytime, Anywhere</div>
            </div>

            {/* Multi-Device Card */}
            <div 
              onClick={() => setExpandedCard(expandedCard === 'device' ? null : 'device')}
              className={`flex flex-col ${cardBg} ${cardText} rounded-lg px-4 md:px-6 py-3 md:py-4 shadow hover:scale-105 transition-all duration-300 min-w-0 cursor-pointer ${expandedCard === 'device' ? 'col-span-2' : 'col-span-1'}`}
            >
              <div className="flex items-center gap-3 md:gap-4 mb-2">
                <Smartphone className="h-5 md:h-6 w-5 md:w-6 text-orange-500 flex-shrink-0" />
                <span className={`font-bold text-sm md:text-xl ${expandedCard === 'device' ? '' : 'whitespace-nowrap overflow-hidden text-ellipsis'}`}>Any Device</span>
              </div>
              <div className={`text-xs md:text-sm ${allText}`}>Learn From Anywhere</div>
            </div>

            {/* Revisit Courses Card */}
            <div 
              onClick={() => setExpandedCard(expandedCard === 'review' ? null : 'review')}
              className={`flex flex-col ${cardBg} ${cardText} rounded-lg px-4 md:px-6 py-3 md:py-4 shadow hover:scale-105 transition-all duration-300 cursor-pointer ${expandedCard === 'review' ? 'col-span-2' : 'col-span-1'}`}
            >
              <div className="flex items-center gap-3 md:gap-4 mb-2">
                <Repeat className="h-5 md:h-6 w-5 md:w-6 text-orange-500 flex-shrink-0" />
                <span className="font-bold text-base md:text-xl">Review</span>
              </div>
              <div className={`text-xs md:text-sm ${allText}`}>Revisit Your Courses</div>
            </div>

            {/* Interactive Assignments Card */}
            <div 
              onClick={() => setExpandedCard(expandedCard === 'interactive' ? null : 'interactive')}
              className={`flex flex-col ${cardBg} ${cardText} rounded-lg px-4 md:px-6 py-3 md:py-4 shadow hover:scale-105 transition-all duration-300 cursor-pointer ${expandedCard === 'interactive' ? 'col-span-2' : 'col-span-1'}`}
            >
              <div className="flex items-center gap-3 md:gap-4 mb-2">
                <FileEdit className="h-5 md:h-6 w-5 md:w-6 text-orange-500 flex-shrink-0" />
                <span className={`font-bold text-base md:text-xl ${expandedCard === 'interactive' ? '' : 'whitespace-nowrap overflow-hidden text-ellipsis'}`}>Interactive</span>
              </div>
              <div className={`text-xs md:text-sm ${allText}`}>Engaging Assignments</div>
            </div>

            {/* 1-on-1 Support Card */}
            <div 
              onClick={() => setExpandedCard(expandedCard === '1on1' ? null : '1on1')}
              className={`flex flex-col ${cardBg} ${cardText} rounded-lg px-4 md:px-6 py-3 md:py-4 shadow hover:scale-105 transition-all duration-300 cursor-pointer ${expandedCard === '1on1' ? 'col-span-2' : 'col-span-1'}`}
            >
              <div className="flex items-center gap-3 md:gap-4 mb-2">
                <UserCheck className="h-5 md:h-6 w-5 md:w-6 text-orange-500 flex-shrink-0" />
                <span className="font-bold text-base md:text-xl">1-on-1</span>
              </div>
              <div className={`text-xs md:text-sm ${allText}`}>Personal Mentoring</div>
            </div>

            {/* Success Tracking Card */}
            <div 
              onClick={() => setExpandedCard(expandedCard === 'analytics' ? null : 'analytics')}
              className={`flex flex-col ${cardBg} ${cardText} rounded-lg px-4 md:px-6 py-3 md:py-4 shadow hover:scale-105 transition-all duration-300 cursor-pointer ${expandedCard === 'analytics' ? 'col-span-2' : 'col-span-1'}`}
            >
              <div className="flex items-center gap-3 md:gap-4 mb-2">
                <BarChart2 className="h-5 md:h-6 w-5 md:w-6 text-orange-500 flex-shrink-0" />
                <span className="font-bold text-base md:text-xl">Analytics</span>
              </div>
              <div className={`text-xs md:text-sm ${allText}`}>Track Your Progress</div>
            </div>


          </div>
        </div>

        {/* Image Section - Isolated with flex-shrink-0 to prevent compression */}
        <div className="flex-1 flex justify-center items-center flex-shrink-0">
          <div className="overflow-hidden rounded-3xl shadow-lg">
            <img src="/images/learn.jpg" alt="Student" className="w-full max-w-[520px] h-[280px] sm:h-[320px] md:h-[360px] lg:h-[400px] object-cover transition-transform duration-500 hover:scale-110" />
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section id="courses" className="px-4 md:px-8 py-8 md:py-12">
        <h2 className={`text-3xl md:text-4xl font-bold text-center mb-6 md:mb-8 ${darkMode ? "text-white" : "text-[#ff6a2f]"}`}>Available Courses</h2>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-lg">Loading courses...</div>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row justify-center items-stretch gap-4 mb-8 w-full px-4 md:px-0">
              <div className="relative w-full md:max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                {filterBy === 'category' ? (
                  <select
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all cursor-pointer appearance-none"
                  >
                    <option value="" className="bg-slate-900">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-slate-900">
                        {cat}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                  />
                )}
              </div>
              <select
                value={filterBy}
                onChange={(e) => {
                  setFilterBy(e.target.value);
                  setSearchTerm('');
                }}
                className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all cursor-pointer"
              >
                <option value="name" className="bg-slate-900">Search by Name</option>
                <option value="category" className="bg-slate-900">Search by Category</option>
              </select>
            </div>
            
            {courses.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No courses available yet</h3>
                <p className="text-gray-500 mb-6">Check back later for new courses created by administrators.</p>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 bg-[#ff6a2f] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#ff8a4f] transition-colors"
                >
                  <BookOpen className="w-5 h-5" />
                  Join Our Platform
                </Link>
              </div>
            ) : (
              <>
                {courses
                  .filter(course => {
                    if (!searchTerm) return true;
                    if (filterBy === 'name') {
                      return course.title.toLowerCase().startsWith(searchTerm.toLowerCase());
                    } else if (filterBy === 'category') {
                      return course.category === searchTerm;
                    }
                    return true;
                  }).length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No courses found</h3>
                    <p className="text-gray-400 mb-6">Try searching with different keywords</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                    {courses
                      .filter(course => {
                        if (!searchTerm) return true;
                        if (filterBy === 'name') {
                          return course.title.toLowerCase().startsWith(searchTerm.toLowerCase());
                        } else if (filterBy === 'category') {
                          return course.category === searchTerm;
                        }
                        return true;
                      })
                      .map((course, index) => {
                      const isExpanded = expandedCourse === course.id;
                      return (
                    <div 
                      key={course.id} 
                      className={`${cardBg} rounded-2xl shadow-lg p-6 flex flex-col justify-between transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:-translate-y-2`}
                      style={{
                        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                      }}
                    >
                      {/* Only show image if admin uploaded one */}
                      {course.image && (
                        <div className="overflow-hidden rounded-xl mb-4 group">
                          <img 
                            src={course.image} 
                            alt={course.title} 
                            className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                              // Hide the image container if image fails to load
                              e.target.parentElement.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      
                      {/* Always visible: Title, Description, Status */}
                      <h3 className={`font-bold text-xl mb-3 ${allText}`}>{course.title}</h3>
                      <p className={`mb-4 text-sm ${allText} ${isExpanded ? '' : 'line-clamp-2'}`}>{course.description}</p>
                      
                      <div className={`text-sm mb-4 ${allText}`}>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          course.status === 'active' 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : course.status === 'Pending'
                            ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                            : course.status === 'completed'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : course.status === 'cancelled'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                        }`}>
                          ● {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                        </span>
                      </div>
                      
                      {/* Expandable Details */}
                      {isExpanded && (
                        <div className="space-y-3 mb-4 border-t border-white/10 pt-4 animate-fadeIn">
                          <div className={`flex items-center gap-2 text-sm ${allText}`}>
                            <Users className="h-4 w-4 text-orange-500" />
                            <span>Enrolled: <strong>{course.students}</strong> / <strong>{course.maxStudents}</strong> students</span>
                          </div>
                          
                          <div className={`text-sm ${allText}`}>
                            <span className="text-blue-300">Mentor: <strong>{course.mentor || 'TBD'}</strong></span>
                          </div>
                          
                          <div className={`flex items-center gap-2 text-sm ${allText}`}>
                            <Calendar className="h-4 w-4 text-orange-500" />
                            <span>Duration: <strong>{course.duration}</strong></span>
                          </div>
                          
                          <div className={`text-sm ${allText}`}>
                            <span className="font-semibold text-orange-500 text-lg">{course.price}</span>
                          </div>
                        </div>
                      )}
                      
                      {/* See Details / Hide Details Button */}
                      <button
                        onClick={() => setExpandedCourse(isExpanded ? null : course.id)}
                        className="flex items-center justify-center gap-2 w-full py-2 mb-3 bg-white/5 hover:bg-white/10 rounded-lg text-white text-sm font-medium transition-all duration-300"
                      >
                        {isExpanded ? (
                          <>
                            Hide Details <ChevronUp className="h-4 w-4" />
                          </>
                        ) : (
                          <>
                            See Details <ChevronDown className="h-4 w-4" />
                          </>
                        )}
                      </button>
                      
                      {/* Join Button - Always visible */}
                      <button
                        onClick={() => handleJoinCourse(course.id, course.status)}
                        className={`w-full px-4 py-3 rounded-lg font-semibold shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                          darkMode 
                            ? "bg-orange-500 text-white hover:bg-orange-600" 
                            : "bg-orange-500 text-white hover:bg-orange-600"
                        } ${course.status !== 'active' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={course.status !== 'active'}
                      >
                        {course.status === 'active' ? 'Join Now' : 'Coming Soon'}
                      </button>
                  </div>
                );
              })}
              </div>
                )}
              </>
            )}


          </>
        )}
      </section>

      {/* Benefits & Training */}
      <section id="about" className="px-4 md:px-8 py-8 md:py-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <div>
          <h3 className={`text-2xl md:text-3xl font-bold mb-4 md:mb-6 ${headingColor} transition-all duration-300`}>
            <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Why Students will Achieve More, Learn Faster</span>
          </h3>
          <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
            <li className={`flex items-start gap-3 transition-all duration-300 hover:translate-x-2 ${allText}`}>
              <Shield className="h-5 md:h-6 w-5 md:w-6 text-orange-500 mt-1 flex-shrink-0" /> 
              <div>
                <strong className="block mb-1 text-sm md:text-base">Expert Mentors & Personalized Learning</strong>
                <span className="text-xs md:text-sm opacity-90">Get one-on-one guidance from experienced teachers.</span>
              </div>
            </li>
            <li className={`flex items-start gap-3 transition-all duration-300 hover:translate-x-2 ${allText}`}>
              <UserCheck className="h-5 md:h-6 w-5 md:w-6 text-orange-500 mt-1 flex-shrink-0" /> 
              <div>
                <strong className="block mb-1 text-sm md:text-base">Real-Time Progress Tracking</strong>
                <span className="text-xs md:text-sm opacity-90">Monitor your performance with detailed analytics, grades, and improvement insights</span>
              </div>
            </li>
            <li className={`flex items-start gap-3 transition-all duration-300 hover:translate-x-2 ${allText}`}>
              <Calendar className="h-5 md:h-6 w-5 md:w-6 text-orange-500 mt-1 flex-shrink-0" /> 
              <div>
                <strong className="block mb-1 text-sm md:text-base">Flexible Learning Schedule</strong>
                <span className="text-xs md:text-sm opacity-90">Study at your own pace with 24/7 access to course materials and resources</span>
              </div>
            </li>
            <li className={`flex items-start gap-3 transition-all duration-300 hover:translate-x-2 ${allText}`}>
              <Users className="h-5 md:h-6 w-5 md:w-6 text-orange-500 mt-1 flex-shrink-0" /> 
              <div>
                <strong className="block mb-1 text-sm md:text-base">Interactive Learning Community</strong>
                <span className="text-xs md:text-sm opacity-90">Connect with teammates, join study groups, and collaborate on assignments</span>
              </div>
            </li>
          </ul>
          <div className={`${cardBg} ${cardText} rounded-2xl shadow-lg p-4 md:p-8 flex flex-col items-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer min-h-[300px] md:min-h-[380px]`}>
            <div className="overflow-hidden rounded-xl mb-4">
                <img 
                  src="/images/onlineed.jpg" 
                  alt="Student ID" 
                  className="w-48 h-48 md:w-72 md:h-72 object-cover transition-transform duration-500 hover:scale-110" 
                />
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-white transition-all duration-300">
            <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Powerful Tools for Educators</span>
          </h3>
          <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
            <li className={`flex items-start gap-3 transition-all duration-300 hover:translate-x-2 ${allText}`}>
              <Shield className="h-5 md:h-6 w-5 md:w-6 text-orange-500 mt-1 flex-shrink-0" /> 
              <div>
                <strong className="block mb-1 text-sm md:text-base">Intuitive Class Management</strong>
                <span className="text-xs md:text-sm opacity-90">Organize sessions, manage enrollments, and track attendance effortlessly</span>
              </div>
            </li>
            <li className={`flex items-start gap-3 transition-all duration-300 hover:translate-x-2 ${allText}`}>
              <UserCheck className="h-5 md:h-6 w-5 md:w-6 text-orange-500 mt-1 flex-shrink-0" /> 
              <div>
                <strong className="block mb-1 text-sm md:text-base">Easy Content Creation & Sharing</strong>
                <span className="text-xs md:text-sm opacity-90">Upload materials, create assignments, and share resources with students instantly</span>
              </div>
            </li>
            <li className={`flex items-start gap-3 transition-all duration-300 hover:translate-x-2 ${allText}`}>
              <BarChart2 className="h-5 md:h-6 w-5 md:w-6 text-orange-500 mt-1 flex-shrink-0" /> 
              <div>
                <strong className="block mb-1 text-sm md:text-base">Automated Grading & Feedback</strong>
                <span className="text-xs md:text-sm opacity-90">Save time with smart grading tools and provide instant feedback to students</span>
              </div>
            </li>
            <li className={`flex items-start gap-3 transition-all duration-300 hover:translate-x-2 ${allText}`}>
              <BookOpen className="h-5 md:h-6 w-5 md:w-6 text-orange-500 mt-1 flex-shrink-0" /> 
              <div>
                <strong className="block mb-1 text-sm md:text-base">Seamless Communication</strong>
                <span className="text-xs md:text-sm opacity-90">Connect with Students through announcements, messaging, and request management</span>
              </div>
            </li>
          </ul>
          <div className={`${cardBg} ${cardText} rounded-2xl shadow-lg p-4 md:p-8 flex flex-col items-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer min-h-[300px] md:min-h-[380px]`}>
            <div className="overflow-hidden rounded-xl mb-4">
              <img 
                src="/images/teacher.jpg" 
                alt="Teacher Platform" 
                className="w-48 h-48 md:w-72 md:h-72 object-cover transition-transform duration-500 hover:scale-110" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${footerBg} py-8 md:py-10 mt-8 md:mt-12 border-t ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className={`flex items-center gap-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                <div className="bg-gradient-to-br from-orange-500 to-pink-500 p-2 rounded-lg">
                  <BookOpen className="h-6 w-6 text-white" /><span className="sr-only">Vedcets E-learning</span>
                </div>
                <span className="font-bold text-xl md:text-2xl tracking-tight">Vedcets E-learning</span>
              </div>
              <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-sm leading-relaxed`}>
                Empowering students with quality education and expert mentorship. Join thousands of learners on their journey to success.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className={`font-bold text-base md:text-lg mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#about" className={`${darkMode ? "text-gray-300 hover:text-orange-400" : "text-gray-600 hover:text-orange-500"} text-sm transition-colors duration-300 flex items-center gap-2 group`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    About us
                  </a>
                </li>
                <li>
                  <a href="#courses" className={`${darkMode ? "text-gray-300 hover:text-orange-400" : "text-gray-600 hover:text-orange-500"} text-sm transition-colors duration-300 flex items-center gap-2 group`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Courses
                  </a>
                </li>
                <li>
                  <Link to="/login" className={`${darkMode ? "text-gray-300 hover:text-orange-400" : "text-gray-600 hover:text-orange-500"} text-sm transition-colors duration-300 flex items-center gap-2 group`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Student Portal
                  </Link>
                </li>
                <li>
                  <Link to="/login" className={`${darkMode ? "text-gray-300 hover:text-orange-400" : "text-gray-600 hover:text-orange-500"} text-sm transition-colors duration-300 flex items-center gap-2 group`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Mentor Portal
                  </Link>
                </li>
                <li>
                  <a href="#" className={`${darkMode ? "text-gray-300 hover:text-orange-400" : "text-gray-600 hover:text-orange-500"} text-sm transition-colors duration-300 flex items-center gap-2 group`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className={`font-bold text-lg mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>Categories</h4>
              <ul className="space-y-2">
                {['Maths', 'Physics', 'Science', 'Arabic', 'English', 'French'].map((category) => (
                  <li key={category}>
                    <span className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-sm flex items-center gap-2`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                      {category}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Newsletter */}
            <div className="space-y-4">
              <div>
                <h4 className={`font-bold text-lg mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>Contact Us</h4>
                <ul className="space-y-2">
                  <li className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-sm flex items-start gap-3`}>
                    <MapPin className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span>Constantine, 25 Algeria</span>
                  </li>
                  <li className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-sm flex items-center gap-3`}>
                    <Phone className="h-4 w-4 text-orange-500 flex-shrink-0" />
                    <a href="tel:+213798518260" className="hover:text-orange-500 transition-colors">+213 798518260</a>
                  </li>
                  <li className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-sm flex items-center gap-3`}>
                    <Mail className="h-4 w-4 text-orange-500 flex-shrink-0" />
                    <a href="mailto:vedcets.agency@gmail.com" className="hover:text-orange-500 transition-colors break-all">vedcets.agency@gmail.com</a>
                  </li>
                </ul>
                {/* Social Media Icons */}
                <div className="flex gap-3 mt-4">
                  <a href="https://www.facebook.com/profile.php?id=61580134173839" target="_blank" rel="noopener noreferrer" className={`${darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'} p-2.5 rounded-full transition-all duration-300 hover:scale-110 group`}>
                    <Facebook className={`h-4 w-4 ${darkMode ? 'text-white' : 'text-gray-700'} group-hover:text-blue-500`} />
                  </a>
                  <a href="https://www.instagram.com/vedcets/" target="_blank" rel="noopener noreferrer" className={`${darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'} p-2.5 rounded-full transition-all duration-300 hover:scale-110 group`}>
                    <Instagram className={`h-4 w-4 ${darkMode ? 'text-white' : 'text-gray-700'} group-hover:text-pink-500`} />
                  </a>
                  <a href="https://www.linkedin.com/in/vedcets/" target="_blank" rel="noopener noreferrer" className={`${darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'} p-2.5 rounded-full transition-all duration-300 hover:scale-110 group`}>
                    <Linkedin className={`h-4 w-4 ${darkMode ? 'text-white' : 'text-gray-700'} group-hover:text-blue-600`} />
                  </a>
                </div>
              </div>

              
            </div>
          </div>


          {/* Bottom Bar */}
          <div className={`pt-6 border-t ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                © {new Date().getFullYear()} <a href="https://mouadam.dev/" target="_blank" rel="noopener noreferrer" className="font-semibold text-orange-500 hover:text-orange-600 transition-colors">Mouad</a> , <a href="https://vedcets.dev/" target="_blank" rel="noopener noreferrer" className="font-semibold text-orange-500 hover:text-orange-600 transition-colors">Vedcets</a>. All rights reserved.
              </p>
              <div className="flex gap-6">
                <a href="#" className={`text-sm ${darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"} transition-colors`}>
                  Terms of Service
                </a>
                <a href="#" className={`text-sm ${darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"} transition-colors`}>
                  Privacy Policy
                </a>
                <a href="#" className={`text-sm ${darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"} transition-colors`}>
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
};

export default Landing;