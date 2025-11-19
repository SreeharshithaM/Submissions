// services/accountService.js
import api from './api';

// Mock data for testing - remove this when your backend works
const mockAccounts = [];

export const accountService = {
  // Get all accounts
  async getUserAccounts() {
    try {
      // Try real API first
      const response = await api.get('/Accounts');
      return response.data;
    } catch (error) {
      console.log('Using mock data due to API error');
      // Return mock data if API fails
      return mockAccounts;
    }
  },

  // Create a new account
  async createAccount(accountData) {
    try {
      // Try real API first
      const response = await api.post('/Accounts', accountData);
      return response.data;
    } catch (error) {
      console.log('Using mock data due to API error');
      // Create mock account if API fails
      const newAccount = {
        id: Date.now(),
        ...accountData,
        accountNumber: accountData.accountNumber || `****${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'Active',
        createdAt: new Date().toISOString()
      };
      mockAccounts.push(newAccount);
      return newAccount;
    }
  },

  // Deposit money
  async deposit(depositData) {
    try {
      const response = await api.post('/Accounts/deposit', depositData);
      return response.data;
    } catch (error) {
      console.log('Mock deposit');
      return { success: true };
    }
  },

  // Withdraw money
  async withdraw(withdrawData) {
    try {
      const response = await api.post('/Accounts/withdraw', withdrawData);
      return response.data;
    } catch (error) {
      console.log('Mock withdraw');
      return { success: true };
    }
  },

  // Close account
  async closeAccount(closeData) {
    try {
      const response = await api.post('/Accounts/close', closeData);
      return response.data;
    } catch (error) {
      console.log('Mock close account');
      return { success: true };
    }
  }
};