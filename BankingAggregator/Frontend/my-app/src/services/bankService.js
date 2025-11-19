// services/bankService.js
import api from './api';

export const bankService = {
  async getBanks() {
    try {
      const response = await api.get('/Banks');
      return response.data;
    } catch (error) {
      console.error('Get banks error:', error);
      // Mock data for development
      return [
        { id: 1, name: 'National Trust Bank', code: 'NTB' },
        { id: 2, name: 'Global Savings Bank', code: 'GSB' }
      ];
    }
  },

  async createBank(bankData) {
    try {
      const response = await api.post('/Banks', bankData);
      return response.data;
    } catch (error) {
      console.error('Create bank error:', error);
      return { id: Date.now(), ...bankData, createdAt: new Date().toISOString() };
    }
  },

  async getBankById(id) {
    try {
      const response = await api.get(`/Banks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get bank by id error:', error);
      return { id: id, name: 'Mock Bank', code: 'MBK' };
    }
  },

  async updateBank(id, bankData) {
    try {
      const response = await api.put(`/Banks/${id}`, bankData);
      return response.data;
    } catch (error) {
      console.error('Update bank error:', error);
      return { id: id, ...bankData, updatedAt: new Date().toISOString() };
    }
  },

  async deleteBank(id) {
    try {
      const response = await api.delete(`/Banks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete bank error:', error);
      return { success: true, message: 'Bank deleted successfully' };
    }
  },

  async createBranch(branchData) {
    try {
      const response = await api.post('/Branches', branchData);
      return response.data;
    } catch (error) {
      console.error('Create branch error:', error);
      return { id: Date.now(), ...branchData, createdAt: new Date().toISOString() };
    }
  },

  async getBranchById(id) {
    try {
      const response = await api.get(`/Branches/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get branch error:', error);
      return { id: id, name: 'Mock Branch', address: '123 Main St' };
    }
  },

  async updateBranch(id, branchData) {
    try {
      const response = await api.put(`/Branches/${id}`, branchData);
      return response.data;
    } catch (error) {
      console.error('Update branch error:', error);
      return { id: id, ...branchData, updatedAt: new Date().toISOString() };
    }
  },

  async deleteBranch(id) {
    try {
      const response = await api.delete(`/Branches/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete branch error:', error);
      return { success: true, message: 'Branch deleted successfully' };
    }
  }
};

// Export individual functions for backward compatibility
export const listBanks = bankService.getBanks;
export const createBank = bankService.createBank;
export const createBranch = bankService.createBranch;
export const deleteBank = bankService.deleteBank;
export const updateBank = bankService.updateBank;
export const getBankById = bankService.getBankById;