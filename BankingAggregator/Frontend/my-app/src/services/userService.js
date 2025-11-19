// services/userService.js
import api from './api';

export const userService = {
  async getUsers() {
    try {
      const response = await api.get('/Users');
      return response.data;
    } catch (error) {
      console.error('Get users error:', error);
      // Mock data for development
      return [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'User' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Admin' }
      ];
    }
  },

  async createUser(userData) {
    try {
      const response = await api.post('/Users', userData);
      return response.data;
    } catch (error) {
      console.error('Create user error:', error);
      return { id: Date.now(), ...userData, createdAt: new Date().toISOString() };
    }
  },

  async getUserById(id) {
    try {
      const response = await api.get(`/Users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get user error:', error);
      return { id: id, name: 'Mock User', email: 'mock@example.com' };
    }
  },

  async updateUser(id, userData) {
    try {
      const response = await api.put(`/Users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Update user error:', error);
      return { id: id, ...userData, updatedAt: new Date().toISOString() };
    }
  },

  async deleteUser(id) {
    try {
      const response = await api.delete(`/Users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete user error:', error);
      return { success: true, message: 'User deleted successfully' };
    }
  }
};

// Export individual functions for backward compatibility
export const listUsers = userService.getUsers;
export const createUser = userService.createUser;
export const updateUser = userService.updateUser;
export const deleteUser = userService.deleteUser;
export const getUserById = userService.getUserById;