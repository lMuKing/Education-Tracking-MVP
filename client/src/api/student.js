// student.js
// Student API functions
import axios from './axios';

export const studentAPI = {
  // Profile
  getProfile: async () => {
    const response = await axios.get('/student/profile/getprofile/');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await axios.put('/student/profile/updateprofile/', data);
    return response.data;
  },

  changePassword: async (data) => {
    const response = await axios.put('/student/profile/changepassword/', data);
    return response.data;
  },

  updateProfileImage: async (url) => {
    const response = await axios.put('/student/profile/image/', { profile_image_url: url });
    return response.data;
  },

  // Session Enrollment - MATCHING BACKEND ROUTES EXACTLY
  getAllSessions: async () => {
    const response = await axios.get('/student/getallsessions/');
    return response.data;
  },

  sendJoinRequest: async (sessionId) => {
    const response = await axios.post(`/student/join-request/${sessionId}`);
    return response.data;
  },

  getMyJoinRequests: async () => {
    const response = await axios.get('/student/join-requests');
    return response.data;
  },

  cancelJoinRequest: async (requestId) => {
    const response = await axios.delete(`/student/join-request/${requestId}/delete`);
    return response.data;
  },

  getMyEnrollments: async () => {
    const response = await axios.get('/student/enrollments');
    return response.data;
  },

  getEnrollmentDetails: async (enrollmentId) => {
    const response = await axios.get(`/student/enrollment/${enrollmentId}`);
    return response.data;
  },

  unenrollFromSession: async (enrollmentId) => {
    const response = await axios.delete(`/student/unenrolls/${enrollmentId}`);
    return response.data;
  },

  // Courses
  getMyCourses: async () => {
    try {
      // Try different possible endpoints
      try {
        const response = await axios.get('/course/my-courses');
        return response.data;
      } catch (error) {
        const response = await axios.get('/cenrollment/my-courses');
        return response.data;
      }
    } catch (error) {
      return { courses: [] };
    }
  },

  // Get all courses in a session (chapters)
  getSessionCourses: async (sessionId) => {
    const response = await axios.get(`/student/session/${sessionId}/courses`);
    return response.data;
  },

  getCourseEnrollmentDetails: async (enrollmentId) => {
    const response = await axios.get(`/cenrollment/courseenrollment/${enrollmentId}`);
    return response.data;
  },

  // Homework
  getHomeworksByCourse: async (courseId) => {
    const response = await axios.get(`/student/course/${courseId}/homeworks`);
    return response.data;
  },

  enrollInHomework: async (homeworkId) => {
    const response = await axios.post(`/student/enroll/${homeworkId}`);
    return response.data;
  },

  getMyHomeworks: async () => {
    const response = await axios.get('/student/my-homeworks');
    return response.data;
  },

  getMyHomeworkById: async (homeworkId) => {
    const response = await axios.get(`/student/my-homework/${homeworkId}`);
    return response.data;
  },

  submitHomework: async (homeworkId, formData) => {
    const response = await axios.post(`/student/submit/${homeworkId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Announcements
  getSessionAnnouncements: async (sessionId) => {
    const response = await axios.get(`/student/session/${sessionId}/announcements/`);
    return response.data;
  },
};