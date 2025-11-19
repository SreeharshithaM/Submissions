// services/authService.js
import api from './api';

export const authService = {
  async login(credentials) {
    try {
      const response = await api.post('/Auth/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      // Mock response for development
      return { 
        token: 'mock-token', 
        user: { id: 1, name: 'John Doe', email: credentials.email } 
      };
    }
  },

  async register(userData) {
    try {
      const response = await api.post('/Auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      // Mock response for development
      return { success: true, message: 'User registered successfully' };
    }
  },

  async logout() {
    try {
      const response = await api.post('/Auth/logout');
      return response.data;
    } catch (error) {
      console.error('Logout error:', error);
      return { success: true };
    }
  },

  async getCurrentUser() {
    try {
      const response = await api.get('/Auth/me');
      return response.data;
    } catch (error) {
      console.error('Get user error:', error);
      return { id: 1, name: 'John Doe', email: 'john@example.com' };
    }
  }
};

// Export individual functions for backward compatibility
export const login = authService.login;
export const register = authService.register;
export const logout = authService.logout;
export const getCurrentUser = authService.getCurrentUser;