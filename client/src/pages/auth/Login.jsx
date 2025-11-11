import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { studentAPI } from '../../api/student';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get sessionId from location state if user came from landing page
  const sessionId = location.state?.sessionId;
  const returnTo = location.state?.returnTo;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Login first
      const result = await login(data);
      const role = result.user.user_role;
      
      console.log('✅ Login successful, role:', role);
      console.log('📝 Session ID from state:', sessionId);
      
      // If user is a student and came from public courses with sessionId, send join request
      if (role === 'student' && sessionId) {
        // Wait a bit to ensure token is set in localStorage and axios interceptor picks it up
        await new Promise(resolve => setTimeout(resolve, 200));
        
        try {
          console.log('🚀 Attempting to send join request for session:', sessionId);
          const token = localStorage.getItem('token');
          console.log('🔑 Token available:', !!token);
          
          const joinResponse = await studentAPI.sendJoinRequest(sessionId);
          console.log('✅ Join request response:', joinResponse);
          
          toast.success('Join request sent successfully! 🎉');
          navigate('/student/dashboard');
          return;
        } catch (enrollError) {
          console.error('❌ Error sending join request:', enrollError);
          console.error('Error response:', enrollError.response);
          console.error('Error data:', enrollError.response?.data);
          
          const errorMsg = enrollError.response?.data?.msg || enrollError.response?.data?.message;
          
          console.log('📝 Error message:', errorMsg);
          console.log('📝 Status code:', enrollError.response?.status);
          
          // Check if it's a duplicate request or already enrolled
          if (enrollError.response?.status === 400) {
            // Use toast() with custom styling for info message
            toast(errorMsg || 'You already have a request for this session', {
              icon: 'ℹ️',
              style: {
                background: '#3B82F6',
                color: '#fff',
              },
            });
          } else {
            toast.error(errorMsg || 'Failed to send join request. You can try again from Sessions page.');
          }
          
          // Still redirect to dashboard
          navigate('/student/dashboard');
          return;
        }
      }
      
      // Redirect based on role (for users who didn't come from public courses)
      if (role === 'Admin') {
        toast.success('Welcome back, Admin!');
        navigate('/admin/dashboard');
      } else if (role === 'Mentor') {
        toast.success('Welcome back, Mentor!');
        navigate('/mentor/dashboard');
      } else if (role === 'student') {
        toast.success('Welcome back, Student!');
        navigate('/student/dashboard');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      const errorMsg = error.response?.data?.msg || error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4" style={{ backgroundImage: "url('/images/auth-bg.jpg')" }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-xl w-full max-w-md p-8">
        {/* Back to Landing Page Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Home Page</span>
        </Link>

        {/* Show info banner if coming from session join */}
        {sessionId && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 font-medium">
              🎓 You'll be joining a session after login!
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Your join request will be sent automatically after successful login.
            </p>
          </div>
        )}
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to continue to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="you@example.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              sessionId ? 'Signing in & Joining Session...' : 'Signing in...'
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}