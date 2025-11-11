// AuthContext.jsx
// React context for authentication
import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/auth';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const data = await authAPI.login(credentials);
      setUser(data.user);
      // Don't show toast here - let the Login component handle it
      // toast.success('Login successful!');
      return data;
    } catch (error) {
      const apiMsg =
        error.response?.data?.msg ||
        error.response?.data?.message ||
        (Array.isArray(error.response?.data?.errors) && error.response.data.errors[0]?.msg) ||
        'Login failed';
      // Don't show toast here - let the Login component handle it
      // toast.error(apiMsg);
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      const data = await authAPI.signup(userData);
      toast.success('Signup successful! Please verify your email.');
      return data;
    } catch (error) {
      const apiMsg =
        error.response?.data?.msg ||
        error.response?.data?.message ||
        (Array.isArray(error.response?.data?.errors) && error.response.data.errors[0]?.msg) ||
        'Signup failed';
      toast.error(apiMsg);
      throw error;
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.user_role === 'Admin',
    isMentor: user?.user_role === 'Mentor',
    isStudent: user?.user_role === 'student',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};