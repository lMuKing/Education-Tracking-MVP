// auth.js
// Authentication API functions
import axios from './axios';

export const authAPI = {
  signup: async (data) => {
    const response = await axios.post('/auth/signup', data);
    return response.data;
  },

  login: async (credentials) => {
    const response = await axios.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  verifyEmail: async (token) => {
    const response = await axios.get(`/auth/verify-email?token=${token}`);
    return response.data;
  },

  resendVerification: async (email) => {
    const response = await axios.post('/auth/resend-verification', { email });
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await axios.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token, newPassword) => {
    const response = await axios.post(`/auth/reset-password/${token}`, { newPassword });
    return response.data;
  },

    logout: async () => {
      try {
        await axios.post('/auth/logout');
      } finally {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
  },
};