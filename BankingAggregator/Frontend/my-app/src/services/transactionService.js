// services/transactionService.js
import api from './api';

// Mock transactions data
const mockTransactions = [
  {
    id: 1,
    accountNumber: '****1234',
    type: 'Deposit',
    amount: 1000.00,
    currency: 'USD',
    description: 'Initial account deposit',
    date: '2024-01-15T10:30:00Z',
    status: 'Completed',
    balanceAfter: 1000.00
  },
  {
    id: 2,
    accountNumber: '****1234',
    type: 'Withdrawal',
    amount: -250.00,
    currency: 'USD',
    description: 'ATM withdrawal',
    date: '2024-01-16T14:20:00Z',
    status: 'Completed',
    balanceAfter: 750.00
  },
  {
    id: 3,
    accountNumber: '****1234',
    type: 'Transfer',
    amount: -500.00,
    currency: 'USD',
    description: 'Transfer to ****5678',
    date: '2024-01-18T09:15:00Z',
    status: 'Completed',
    balanceAfter: 250.00
  },
  {
    id: 4,
    accountNumber: '****5678',
    type: 'Deposit',
    amount: 500.00,
    currency: 'USD',
    description: 'Transfer from ****1234',
    date: '2024-01-18T09:15:00Z',
    status: 'Completed',
    balanceAfter: 500.00
  },
  {
    id: 5,
    accountNumber: '****1234',
    type: 'Deposit',
    amount: 2000.00,
    currency: 'USD',
    description: 'Salary deposit',
    date: '2024-01-25T08:00:00Z',
    status: 'Completed',
    balanceAfter: 2250.00
  },
  {
    id: 6,
    accountNumber: '****1234',
    type: 'Payment',
    amount: -150.00,
    currency: 'USD',
    description: 'Utility bill payment',
    date: '2024-01-26T16:45:00Z',
    status: 'Completed',
    balanceAfter: 2100.00
  },
  {
    id: 7,
    accountNumber: '****9012',
    type: 'Deposit',
    amount: 5000.00,
    currency: 'USD',
    description: 'Investment return',
    date: '2024-01-20T11:30:00Z',
    status: 'Completed',
    balanceAfter: 5000.00
  },
  {
    id: 8,
    accountNumber: '****9012',
    type: 'Withdrawal',
    amount: -1000.00,
    currency: 'USD',
    description: 'Online purchase',
    date: '2024-01-22T13:20:00Z',
    status: 'Completed',
    balanceAfter: 4000.00
  }
];

export const transactionService = {
  async getTransactions(filters = {}) {
    try {
      const response = await api.get('/Transactions', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Get transactions error:', error);
      // Filter mock data based on filters
      let filteredData = [...mockTransactions];
      
      if (filters.accountNumber) {
        filteredData = filteredData.filter(t => t.accountNumber === filters.accountNumber);
      }
      
      if (filters.type && filters.type !== 'All Types') {
        filteredData = filteredData.filter(t => t.type === filters.type);
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredData = filteredData.filter(t => 
          t.description.toLowerCase().includes(searchLower) ||
          t.accountNumber.includes(searchLower)
        );
      }
      
      return filteredData;
    }
  },

  async getTransactionsByAccount(accountId) {
    try {
      const response = await api.get(`/Transactions?accountId=${accountId}`);
      return response.data;
    } catch (error) {
      console.error('Get account transactions error:', error);
      return mockTransactions.filter(t => t.accountNumber.endsWith(accountId));
    }
  },

  async createTransaction(transactionData) {
    try {
      const response = await api.post('/Transactions', transactionData);
      return response.data;
    } catch (error) {
      console.error('Create transaction error:', error);
      const newTransaction = {
        id: Date.now(),
        ...transactionData,
        date: new Date().toISOString(),
        status: 'Completed'
      };
      mockTransactions.unshift(newTransaction);
      return newTransaction;
    }
  }
};

// Export individual functions for backward compatibility
export const listTransactions = transactionService.getTransactions;
export const getTransactionsByAccount = transactionService.getTransactionsByAccount;
export const createTransaction = transactionService.createTransaction;