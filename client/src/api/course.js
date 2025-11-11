// course.js
// Course API functions
import axios from './axios';

export const courseAPI = {
  createCourse: async (sessionId, data) => {
    const response = await axios.post(`/course/session/${sessionId}/createcourse`, data);
    return response.data;
  },

  getCoursesBySession: async (sessionId) => {
    const response = await axios.get(`/course/session/${sessionId}/getCoursesBySession`);
    return response.data;
  },

  getCourseById: async (sessionId, courseId) => {
    const response = await axios.get(`/course/session/${sessionId}/getCourseById/${courseId}`);
    return response.data;
  },

  updateCourse: async (sessionId, courseId, data) => {
    const response = await axios.put(`/course/session/${sessionId}/updateCourse/${courseId}`, data);
    return response.data;
  },

  deleteCourse: async (sessionId, courseId) => {
    const response = await axios.delete(`/course/session/${sessionId}/deleteCourse/${courseId}`);
    return response.data;
  },
};