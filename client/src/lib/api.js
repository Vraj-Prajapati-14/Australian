import axios from 'axios';

export const API_BASE = 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('aes_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.response?.data, error.message);
    return Promise.reject(error);
  }
);

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export const servicesApi = {
  list: () => api.get('/services').then(r => r.data),
  bySlug: (slug) => api.get(`/services/${slug}`).then(r => r.data),
};

export const serviceCategoriesApi = {
  tree: () => api.get('/service-categories/tree').then(r => r.data),
  list: () => api.get('/service-categories').then(r => r.data),
  bySlug: (slug) => api.get(`/service-categories/${slug}`).then(r => r.data),
};

