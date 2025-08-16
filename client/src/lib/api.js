import axios from 'axios';

export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api/v1';

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

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

