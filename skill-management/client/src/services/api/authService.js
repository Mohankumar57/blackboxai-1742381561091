import { http } from './axiosConfig';

const authService = {
  // Google OAuth login
  googleLogin: async (credential) => {
    try {
      const response = await http.post('/auth/google', { credential });
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get current user profile
  getCurrentUser: async () => {
    try {
      const response = await http.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await http.patch('/auth/updateMe', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    // Additional cleanup if needed
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Get stored token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Admin only: Update user role
  updateUserRole: async (userId, role) => {
    try {
      const response = await http.patch(`/auth/updateRole/${userId}`, { role });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Admin only: Get all users
  getAllUsers: async () => {
    try {
      const response = await http.get('/auth/users');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Verify email domain
  verifyEmailDomain: (email) => {
    return email.endsWith('@bitsathy.ac.in');
  }
};

export default authService;
