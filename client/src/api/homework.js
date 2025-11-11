// homework.js
// Homework API functions
import axios from './axios';

export const homeworkAPI = {
  createHomework: async (courseId, data) => {
    const response = await axios.post(`/homework/course/${courseId}/createhm`, data);
    return response.data;
  },

  getHomeworkByCourse: async (courseId) => {
    const response = await axios.get(`/homework/course/${courseId}/getallhm`);
    return response.data;
  },

  getHomeworkById: async (courseId, homeworkId) => {
    const response = await axios.get(`/homework/course/${courseId}/${homeworkId}/gethomeworkbyid`);
    return response.data;
  },

  updateHomework: async (courseId, homeworkId, data) => {
    const response = await axios.put(`/homework/course/${courseId}/${homeworkId}/update`, data);
    return response.data;
  },

  deleteHomework: async (courseId, homeworkId) => {
    const response = await axios.delete(`/homework/course/${courseId}/${homeworkId}/delete`);
    return response.data;
  },

  getUpcomingHomework: async (courseId) => {
    const response = await axios.get(`/homework/course/${courseId}/upcoming/list`);
    return response.data;
  },

  getHomeworkByType: async (courseId, taskType) => {
    const response = await axios.get(`/homework/course/${courseId}/type/${taskType}`);
    return response.data;
  },

  gradeHomework: async (homeworkEnrollmentId, grade) => {
    const response = await axios.put(`/homework/mentor/grade-homework/${homeworkEnrollmentId}`, { grade });
    return response.data;
  },

  getAllHomeworkEnrollments: async () => {
    const response = await axios.get('/homework/mentor/homework-enrollments');
    return response.data;
  },

  getHomeworkEnrollmentById: async (enrollmentId) => {
    const response = await axios.get(`/homework/mentor/homework-enrollments/${enrollmentId}`);
    return response.data;
  },
};