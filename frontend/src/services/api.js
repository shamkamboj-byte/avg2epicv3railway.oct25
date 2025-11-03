import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Get JWT token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Video APIs
export const videoAPI = {
  getAll: async (page = 1, limit = 12, tag = null) => {
    const params = { page, limit };
    if (tag && tag !== 'All') {
      params.tag = tag;
    }
    const response = await axios.get(`${API}/videos`, { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`${API}/videos/${id}`);
    return response.data;
  },

  create: async (video) => {
    const response = await axios.post(`${API}/videos`, video, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  update: async (id, video) => {
    const response = await axios.put(`${API}/videos/${id}`, video, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`${API}/videos/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  getTags: async () => {
    const response = await axios.get(`${API}/videos/tags/all`);
    return response.data;
  }
};

// Contact API
export const contactAPI = {
  submit: async (contact) => {
    const response = await axios.post(`${API}/contact`, contact);
    return response.data;
  }
};

// Admin APIs
export const adminAPI = {
  login: async (credentials) => {
    const response = await axios.post(`${API}/admin/login`, credentials);
    return response.data;
  },

  verify: async () => {
    const response = await axios.post(`${API}/admin/verify`, {}, {
      headers: getAuthHeader()
    });
    return response.data;
  }
};
