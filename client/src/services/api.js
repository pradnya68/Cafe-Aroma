import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cafe_aroma_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 unauthorized and token was present, handle cleanup
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect on login failure attempts
      if (!error.config.url.includes('/auth/login') && !error.config.url.includes('/auth/register')) {
        localStorage.removeItem('cafe_aroma_token');
        localStorage.removeItem('cafe_aroma_user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

// Menu endpoints
export const menuAPI = {
  getAll: (params) => api.get('/menu', { params }),
  getById: (id) => api.get(`/menu/${id}`),
  create: (itemData) => api.post('/menu', itemData),
  update: (id, itemData) => api.put(`/menu/${id}`, itemData),
  delete: (id) => api.delete(`/menu/${id}`),
};

// Category endpoints
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Order endpoints
export const orderAPI = {
  create: (orderData) => api.post('/orders', orderData),
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

// Reservation endpoints
export const reservationAPI = {
  create: (data) => api.post('/reservations', data),
  getAll: () => api.get('/reservations'),
  getById: (id) => api.get(`/reservations/${id}`),
  updateStatus: (id, status) => api.put(`/reservations/${id}/status`, { status }),
  delete: (id) => api.delete(`/reservations/${id}`),
};

// Contact endpoints
export const contactAPI = {
  send: (data) => api.post('/contact', data),
  getAll: () => api.get('/contact'),
};

// Newsletter endpoints
export const newsletterAPI = {
  subscribe: (email) => api.post('/newsletter', { email }),
  getAll: () => api.get('/newsletter'),
};

// Testimonials endpoints
export const testimonialAPI = {
  getAll: (all = false) => api.get('/testimonials', { params: { all } }),
  create: (data) => api.post('/testimonials', data),
  updateStatus: (id, approved) => api.put(`/testimonials/${id}/approve`, { approved }),
  delete: (id) => api.delete(`/testimonials/${id}`),
};

// Admin endpoints
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
};

export default api;
