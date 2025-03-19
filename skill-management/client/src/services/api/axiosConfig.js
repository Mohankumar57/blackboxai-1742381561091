import axios from 'axios';
import { toast } from 'react-toastify';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    
    // Handle network errors
    if (!error.response) {
      toast.error('Network error. Please check your internet connection.');
      return Promise.reject(error);
    }

    // Handle different error status codes
    switch (error.response.status) {
      case 401:
        // Unauthorized - clear local storage and redirect to login
        if (!originalRequest._retry) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        break;
      
      case 403:
        // Forbidden
        toast.error('You do not have permission to perform this action');
        break;
      
      case 404:
        // Not Found
        toast.error('Resource not found');
        break;
      
      case 422:
        // Validation Error
        const validationErrors = error.response.data.errors;
        if (validationErrors) {
          Object.values(validationErrors).forEach(error => {
            toast.error(error);
          });
        } else {
          toast.error('Validation error occurred');
        }
        break;
      
      case 429:
        // Too Many Requests
        toast.error('Too many requests. Please try again later.');
        break;
      
      case 500:
        // Server Error
        toast.error('An internal server error occurred. Please try again later.');
        break;
      
      default:
        // Other errors
        toast.error(error.response.data.message || 'An error occurred');
    }

    return Promise.reject(error);
  }
);

// Helper functions for common HTTP methods
export const http = {
  get: async (url, config = {}) => {
    try {
      const response = await api.get(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  post: async (url, data = {}, config = {}) => {
    try {
      const response = await api.post(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  put: async (url, data = {}, config = {}) => {
    try {
      const response = await api.put(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  patch: async (url, data = {}, config = {}) => {
    try {
      const response = await api.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (url, config = {}) => {
    try {
      const response = await api.delete(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default api;
