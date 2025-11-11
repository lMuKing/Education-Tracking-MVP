// admin.js
// Admin API functions
import axios, { publicAxios } from './axios';

export const adminAPI = {
  // Users
  getAllUsers: async () => {
    const response = await axios.get('/admin/findusers_all/');
    return response.data;
  },

  getUserById: async (id) => {
    const response = await axios.get(`/admin/finduser_id/${id}`);
    return response.data;
  },

  updateUserRole: async (id, role) => {
    const response = await axios.put(`/admin/update_role/${id}`, { role });
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await axios.delete(`/admin/deleteuser/${id}`);
    return response.data;
  },

  // Sessions
  createSession: async (data) => {
    // Check if data is FormData (for image uploads)
    const config = data instanceof FormData 
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    const response = await axios.post('/admin/create_session/', data, config);
    return response.data;
  },

  getAllSessions: async () => {
    const response = await axios.get('/admin/findsessions_all/');
    return response.data;
  },

  getSessionById: async (id) => {
    const response = await axios.get(`/admin/findsession_byid/${id}`);
    return response.data;
  },

  updateSession: async (id, data) => {
    // Check if data is FormData (for image uploads)
    const config = data instanceof FormData 
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    const response = await axios.put(`/admin/updatesession/${id}`, data, config);
    return response.data;
  },

  deleteSession: async (id) => {
    const response = await axios.delete(`/admin/deletesession/${id}`);
    return response.data;
  },

  // Requests
  getAllRequests: async () => {
    const response = await axios.get('/admin/getallrequests/');
    return response.data;
  },

  approveRequest: async (id) => {
    const response = await axios.put(`/admin/approverequest/${id}`);
    return response.data;
  },

  rejectRequest: async (id) => {
    const response = await axios.delete(`/admin/rejectrequest/${id}`);
    return response.data;
  },

  // Announcements
  getAllAnnouncements: async () => {
    const response = await axios.get('/admin/announcements/');
    return response.data;
  },

  // Public API (no authentication required)
  getPublicSessions: async () => {
    const response = await publicAxios.get('/admin/findsessions_all/');
    return response.data;
  },
};