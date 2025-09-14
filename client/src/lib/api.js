import axios from 'axios';

export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

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

// Site Settings API
export const getSiteSettings = () => api.get('/settings').then(r => r.data);

// Services API
export const getServices = (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.type) queryParams.append('type', params.type);
  if (params.category) queryParams.append('category', params.category);
  if (params.featured) queryParams.append('featured', params.featured);
  
  return api.get(`/services?${queryParams.toString()}`).then(r => r.data);
};

export const getServiceBySlug = (slug) => api.get(`/services/${slug}`).then(r => r.data);

// Service Categories API
export const getServiceCategories = () => api.get('/service-categories').then(r => r.data);
export const getServiceCategoryTree = () => api.get('/service-categories/tree').then(r => r.data);
export const getServiceCategoryBySlug = (slug) => api.get(`/service-categories/${slug}`).then(r => r.data);

// Testimonials API
export const getTestimonials = (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.featured) queryParams.append('featured', params.featured);
  if (params.limit) queryParams.append('limit', params.limit);
  
  return api.get(`/testimonials?${queryParams.toString()}`).then(r => r.data);
};

// Team API
export const getTeam = (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.department) queryParams.append('department', params.department);
  if (params.limit) queryParams.append('limit', params.limit);
  
  return api.get(`/team?${queryParams.toString()}`).then(r => r.data);
};

// Projects API
export const getProjects = (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.featured) queryParams.append('featured', params.featured);
  if (params.category) queryParams.append('category', params.category);
  if (params.limit) queryParams.append('limit', params.limit);
  
  return api.get(`/projects?${queryParams.toString()}`).then(r => r.data);
};

export const getProjectBySlug = (slug) => api.get(`/projects/${slug}`).then(r => r.data);

// Case Studies API
export const getCaseStudies = (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.featured) queryParams.append('featured', params.featured);
  if (params.category) queryParams.append('category', params.category);
  if (params.limit) queryParams.append('limit', params.limit);
  
  return api.get(`/case-studies?${queryParams.toString()}`).then(r => r.data);
};

export const getCaseStudyBySlug = (slug) => api.get(`/case-studies/${slug}`).then(r => r.data);

// Inspiration Gallery API
export const getInspiration = (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.category) queryParams.append('category', params.category);
  if (params.limit) queryParams.append('limit', params.limit);
  
  return api.get(`/inspiration?${queryParams.toString()}`).then(r => r.data);
};

// Departments API
export const getDepartments = () => api.get('/departments').then(r => r.data);

// Analytics API
export const getAnalyticsStats = () => api.get('/analytics/stats').then(r => r.data);

// Contact API
export const submitContact = (data) => api.post('/contact', data).then(r => r.data);

// Testimonial Submission API
export const submitTestimonial = (data) => api.post('/testimonials', data).then(r => r.data);

// Legacy API functions for backward compatibility
export const servicesApi = {
  list: () => api.get('/services').then(r => r.data),
  bySlug: (slug) => api.get(`/services/${slug}`).then(r => r.data),
};

export const serviceCategoriesApi = {
  tree: () => api.get('/service-categories/tree').then(r => r.data),
  list: () => api.get('/service-categories').then(r => r.data),
  bySlug: (slug) => api.get(`/service-categories/${slug}`).then(r => r.data),
};

