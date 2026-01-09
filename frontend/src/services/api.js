import axios from 'axios';

const API_URL = 'http://localhost:5050/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
};

// Pet API
export const petAPI = {
  getAll: () => api.get('/pets'),
  getById: (id) => api.get(`/pets/${id}`),
  search: (params) => api.get('/pets/search', { params }),
  create: (formData) => api.post('/pets', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, data) => api.put(`/pets/${id}`, data),
  delete: (id) => api.delete(`/pets/${id}`),
};

// Adoption API
export const adoptionAPI = {
  request: (petId, message) => api.post(`/adoptions/${petId}`, { message }),
  getAll: () => api.get('/adoptions'),
  getMy: () => api.get('/adoptions/my'),
  updateStatus: (id, status) => api.put(`/adoptions/${id}`, { status }),
};

// Favorites API
export const favoriteAPI = {
  getAll: () => api.get('/favorites'),
  add: (petId) => api.post(`/favorites/${petId}`),
  remove: (petId) => api.delete(`/favorites/${petId}`),
};

// Admin API
export const adminAPI = {
  getShelters: () => api.get('/admin/shelters'),
  approveShelter: (id) => api.put(`/admin/shelters/${id}/approve`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

export default api;
