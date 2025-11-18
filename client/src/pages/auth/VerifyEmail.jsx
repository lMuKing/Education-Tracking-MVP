import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../api/auth';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    // Check if redirected from backend with status
    const urlStatus = searchParams.get('status');
    const urlMessage = searchParams.get('message');
    
    if (urlStatus === 'success') {
      setStatus('success');
      setMessage('Email verified successfully! You can now login.');
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } else if (urlStatus === 'error') {
      setStatus('error');
      setMessage(urlMessage || 'Email verification failed');
    } else {
      // Old flow - direct API call (shouldn't happen anymore)
      const verifyEmail = async () => {
        const token = searchParams.get('token');
        
        if (!token) {
          setStatus('error');
          setMessage('Verification token is missing');
          return;
        }

        try {
          const response = await authAPI.verifyEmail(token);
          setStatus('success');
          setMessage(response.msg || 'Email verified successfully!');
          
          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } catch (error) {
          setStatus('error');
          setMessage(error.response?.data?.msg || 'Email verification failed');
        }
      };

      verifyEmail();
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        {status === 'loading' && (
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Verifying Email...</h1>
            <p className="text-gray-600">Please wait while we verify your email address</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2 text-green-600">Email Verified!</h1>
            <p className="text-gray-600 mb-4">{message}</p>
            <p className="text-sm text-gray-500">Redirecting to login page...</p>
            <Link 
              to="/login" 
              className="inline-block mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Go to Login Now
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2 text-red-600">Verification Failed</h1>
            <p className="text-gray-600 mb-4">{message}</p>
            <div className="space-y-2">
              <Link 
                to="/login" 
                className="block w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Go to Login
              </Link>
              <Link 
                to="/signup" 
                className="block w-full border border-indigo-600 text-indigo-600 py-2 rounded-lg hover:bg-indigo-50 transition"
              >
                Sign Up Again
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
