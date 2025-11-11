// announcement.js
// Announcement API functions
import axios from './axios';

export const announcementAPI = {
  createAnnouncement: async (sessionId, data) => {
    const response = await axios.post(`/announcements/session/${sessionId}/createannouncement`, data);
    return response.data;
  },

  getAnnouncementsBySession: async (sessionId) => {
    const response = await axios.get(`/announcements/session/${sessionId}/getannouncementbys`);
    return response.data;
  },

  getAnnouncementById: async (sessionId, announcementId) => {
    const response = await axios.get(`/announcements/session/${sessionId}/${announcementId}/getannouncementbyid`);
    return response.data;
  },

  updateAnnouncement: async (sessionId, announcementId, data) => {
    const response = await axios.put(`/announcements/session/${sessionId}/${announcementId}/updateannouncement`, data);
    return response.data;
  },

  deleteAnnouncement: async (sessionId, announcementId) => {
    const response = await axios.delete(`/announcements/session/${sessionId}/${announcementId}/deleteannouncement`);
    return response.data;
  },

  getUrgentAnnouncements: async (sessionId) => {
    const response = await axios.get(`/announcements/session/${sessionId}/geturgentannouncements`);
    return response.data;
  },
};