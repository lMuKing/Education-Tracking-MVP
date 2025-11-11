import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { authAPI } from '../../api/auth';


const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    try {
      await authAPI.forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h1>
          <p className="text-gray-600">Enter your email and we'll send you a link to reset your password.</p>
        </div>
        {submitted ? (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Mail className="w-12 h-12 text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Check your email</h2>
            <p className="text-gray-600">If an account exists for <span className="font-medium">{email}</span>, you’ll get a password reset link soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Send Reset Link
            </button>
          </form>
        )}
        <div className="mt-8 text-center">
          <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">Back to Login</a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
