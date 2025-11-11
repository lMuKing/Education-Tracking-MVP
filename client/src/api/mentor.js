// mentor.js
// Mentor API functions
import axios from './axios';

export const mentorAPI = {
  // Profile
  getProfile: async () => {
    const response = await axios.get('/mentor/profile/getprofile');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await axios.put('/mentor/profile/updateprofile', data);
    return response.data;
  },

  changePassword: async (oldPassword, newPassword) => {
    const response = await axios.put('/mentor/profile/changepassword', { oldPassword, newPassword });
    return response.data;
  },

  updateProfileImage: async (formData) => {
    const response = await axios.put('/mentor/profile/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Session Requests
  sendSessionRequest: async (data) => {
    const response = await axios.post('/session/sessionreq', data);
    return response.data;
  },

  getAllRequests: async () => {
    const response = await axios.get('/session/getAllRequests');
    return response.data;
  },

  getApprovedRequests: async () => {
    const response = await axios.get('/session/getApprovedRequests');
    return response.data;
  },

  cancelRequest: async (requestId) => {
    const response = await axios.delete(`/session/cancelreq/${requestId}`);
    return response.data;
  },

  // Session Management
  getMySessions: async () => {
    // Get only sessions where mentor is assigned (mentor's own sessions)
    const response = await axios.get(`/session/getAllsessions/?t=${Date.now()}`);
    return response.data;
  },

  getAllSessions: async () => {
    // Get ALL sessions in the system (for browsing and requesting to join)
    const response = await axios.get(`/session/browsesessions/?t=${Date.now()}`);
    return response.data;
  },

  updateSession: async (id, data) => {
    const response = await axios.put(`/session/sessionUpdate/${id}`, data);
    return response.data;
  },

  // Join Requests
  getJoinRequests: async (sessionId, params = {}) => {
    const response = await axios.get(`/session/join-requests/${sessionId}`, { params });
    return response.data;
  },

  reviewJoinRequest: async (sessionId, requestId, action, review_message) => {
    const response = await axios.put(`/session/join-request/${sessionId}/${requestId}/review`, {
      action,
      review_message,
    });
    return response.data;
  },

  getSessionStudents: async (sessionId) => {
    const response = await axios.get(`/session/session/${sessionId}/students`);
    return response.data;
  },

  // Course Management
  createCourse: async (sessionId, data) => {
    const response = await axios.post(`/mentor/session/${sessionId}/createcourse/`, data);
    return response.data;
  },

  getCoursesBySession: async (sessionId) => {
    const response = await axios.get(`/mentor/session/${sessionId}/getCoursesBySession/`);
    return response.data;
  },

  getCourseById: async (sessionId, courseId) => {
    const response = await axios.get(`/mentor/session/${sessionId}/getCourseById/${courseId}/`);
    return response.data;
  },

  updateCourse: async (sessionId, courseId, data) => {
    const response = await axios.put(`/mentor/session/${sessionId}/updateCourse/${courseId}/`, data);
    return response.data;
  },

  deleteCourse: async (sessionId, courseId) => {
    const response = await axios.delete(`/mentor/session/${sessionId}/deleteCourse/${courseId}/`);
    return response.data;
  },

  // Announcements
  createAnnouncement: async (sessionId, data) => {
    const response = await axios.post(`/mentor/session/${sessionId}/createannouncement/`, data);
    return response.data;
  },

  getAnnouncementsBySession: async (sessionId) => {
    const response = await axios.get(`/mentor/session/${sessionId}/getannouncementins/`);
    return response.data;
  },

  getAnnouncementById: async (sessionId, announcementId) => {
    const response = await axios.get(`/mentor/session/${sessionId}/${announcementId}/getannouncementbyid/`);
    return response.data;
  },

  updateAnnouncement: async (sessionId, announcementId, data) => {
    const response = await axios.put(`/mentor/session/${sessionId}/${announcementId}/updateannouncement/`, data);
    return response.data;
  },

  deleteAnnouncement: async (sessionId, announcementId) => {
    const response = await axios.delete(`/mentor/session/${sessionId}/${announcementId}/deleteannouncement/`);
    return response.data;
  },

  getUrgentAnnouncements: async (sessionId) => {
    const response = await axios.get(`/mentor/session/${sessionId}/geturgentannouncements/`);
    return response.data;
  },

  // Homework Management
  createHomework: async (courseId, data) => {
    const response = await axios.post(`/mentor/course/${courseId}/createhm`, data);
    return response.data;
  },

  getHomeworkByCourse: async (courseId) => {
    const response = await axios.get(`/mentor/course/${courseId}/getallhm`);
    return response.data;
  },

  getHomeworkById: async (courseId, homeworkId) => {
    const response = await axios.get(`/mentor/course/${courseId}/${homeworkId}/gethomeworkbyid`);
    return response.data;
  },

  updateHomework: async (courseId, homeworkId, data) => {
    const response = await axios.put(`/mentor/course/${courseId}/${homeworkId}/update`, data);
    return response.data;
  },

  deleteHomework: async (courseId, homeworkId) => {
    const response = await axios.delete(`/mentor/course/${courseId}/${homeworkId}/delete`);
    return response.data;
  },

  // Homework Submissions
  getAllHomeworkSubmissions: async (homeworkId) => {
    const response = await axios.get(`/mentor/${homeworkId}/submissions`);
    return response.data;
  },

  getStudentHomeworkSubmission: async (homeworkId, studentId) => {
    const response = await axios.get(`/mentor/${homeworkId}/student/${studentId}/submission`);
    return response.data;
  },
};