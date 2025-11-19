// pages/Transactions.jsx
import React, { useState, useEffect } from 'react';
import TransactionTable from '../components/TransactionTable';
import { transactionService } from '../services/transactionService';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    type: 'All Types',
    fromDate: '',
    toDate: '',
    minAmount: '',
    maxAmount: '',
    accountNumber: 'All Accounts'
  });

  // Load transactions when component loads and set up storage listener
  useEffect(() => {
    loadTransactions();
    
    // Listen for storage events (when transactions are added from other pages)
    const handleStorageChange = () => {
      loadTransactions();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also check for new transactions periodically
    const interval = setInterval(loadTransactions, 2000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const loadTransactions = async (filterParams = {}) => {
    setLoading(true);
    try {
      // Try to get from localStorage first (for demo purposes)
      const storedTransactions = localStorage.getItem('bankTransactions');
      let allTransactions = [];
      
      if (storedTransactions) {
        allTransactions = JSON.parse(storedTransactions);
      } else {
        // Fallback to API service
        allTransactions = await transactionService.getTransactions(filterParams);
        // Store in localStorage for persistence
        localStorage.setItem('bankTransactions', JSON.stringify(allTransactions));
      }
      
      // Apply filters
      let filteredTransactions = allTransactions;
      
      if (filters.search) {
        filteredTransactions = filteredTransactions.filter(t => 
          t.description.toLowerCase().includes(filters.search.toLowerCase()) ||
          t.accountNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
          t.id.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
      
      if (filters.type !== 'All Types') {
        filteredTransactions = filteredTransactions.filter(t => t.type === filters.type);
      }
      
      if (filters.accountNumber !== 'All Accounts') {
        filteredTransactions = filteredTransactions.filter(t => t.accountNumber === filters.accountNumber);
      }
      
      if (filters.fromDate) {
        filteredTransactions = filteredTransactions.filter(t => new Date(t.date) >= new Date(filters.fromDate));
      }
      
      if (filters.toDate) {
        const toDate = new Date(filters.toDate);
        toDate.setHours(23, 59, 59, 999);
        filteredTransactions = filteredTransactions.filter(t => new Date(t.date) <= toDate);
      }
      
      if (filters.minAmount) {
        filteredTransactions = filteredTransactions.filter(t => Math.abs(t.amount) >= parseFloat(filters.minAmount));
      }
      
      if (filters.maxAmount) {
        filteredTransactions = filteredTransactions.filter(t => Math.abs(t.amount) <= parseFloat(filters.maxAmount));
      }
      
      // Sort by date (newest first)
      filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setTransactions(filteredTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
      // Load demo transactions if nothing exists
      loadDemoTransactions();
    } finally {
      setLoading(false);
    }
  };

  const loadDemoTransactions = () => {
    const demoTransactions = [
      {
        id: 'TXN001',
        date: new Date().toISOString(),
        accountNumber: 'ACC1763539817837',
        type: 'Account Creation',
        description: 'New Checking Account Opened',
        amount: 10000.00,
        balanceAfter: 10000.00,
        currency: 'USD',
        status: 'Completed'
      },
      {
        id: 'TXN002',
        date: new Date().toISOString(),
        accountNumber: 'ACC1763539860222',
        type: 'Account Creation',
        description: 'New Settings Account Opened',
        amount: 10000.00,
        balanceAfter: 10000.00,
        currency: 'EUR',
        status: 'Completed'
      }
    ];
    setTransactions(demoTransactions);
    localStorage.setItem('bankTransactions', JSON.stringify(demoTransactions));
  };

  const handleFilterChange = (filterName, value) => {
    setFilters({
      ...filters,
      [filterName]: value
    });
  };

  const applyFilters = () => {
    loadTransactions();
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: 'All Types',
      fromDate: '',
      toDate: '',
      minAmount: '',
      maxAmount: '',
      accountNumber: 'All Accounts'
    });
    loadTransactions();
  };

  const applyQuickDateFilter = (days) => {
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);
    
    setFilters({
      ...filters,
      fromDate: fromDate.toISOString().split('T')[0],
      toDate: toDate.toISOString().split('T')[0]
    });
  };

  // Get unique account numbers for filter dropdown
  const getUniqueAccountNumbers = () => {
    const allTransactions = JSON.parse(localStorage.getItem('bankTransactions') || '[]');
    const accountNumbers = [...new Set(allTransactions.map(t => t.accountNumber))];
    return accountNumbers;
  };

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Transaction History</h2>
        <button 
          className="btn btn-outline-secondary"
          onClick={clearFilters}
          disabled={loading}
        >
          Clear All Filters
        </button>
      </div>

      {/* Transaction Filters Section */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Transaction Filters</h5>
          <div className="row g-3 align-items-end">
            {/* Search */}
            <div className="col-md-3">
              <label className="form-label">Search</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search transactions..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            
            {/* Account Number */}
            <div className="col-md-2">
              <label className="form-label">Account Number</label>
              <select 
                className="form-select"
                value={filters.accountNumber}
                onChange={(e) => handleFilterChange('accountNumber', e.target.value)}
              >
                <option value="All Accounts">All Accounts</option>
                {getUniqueAccountNumbers().map(accountNumber => (
                  <option key={accountNumber} value={accountNumber}>
                    {accountNumber}
                  </option>
                ))}
              </select>
            </div>

            {/* Transaction Type */}
            <div className="col-md-2">
              <label className="form-label">Transaction Type</label>
              <select 
                className="form-select"
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <option>All Types</option>
                <option>Deposit</option>
                <option>Withdrawal</option>
                <option>Transfer</option>
                <option>Payment</option>
                <option>Account Creation</option>
                <option>Account Closed</option>
              </select>
            </div>

            {/* Date Range */}
            <div className="col-md-2">
              <label className="form-label">From Date</label>
              <input 
                type="date" 
                className="form-control" 
                value={filters.fromDate}
                onChange={(e) => handleFilterChange('fromDate', e.target.value)}
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">To Date</label>
              <input 
                type="date" 
                className="form-control" 
                value={filters.toDate}
                onChange={(e) => handleFilterChange('toDate', e.target.value)}
              />
            </div>

            {/* Amount Range */}
            <div className="col-md-2">
              <label className="form-label">Min Amount</label>
              <input 
                type="number" 
                className="form-control" 
                placeholder="Min"
                value={filters.minAmount}
                onChange={(e) => handleFilterChange('minAmount', e.target.value)}
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">Max Amount</label>
              <input 
                type="number" 
                className="form-control" 
                placeholder="Max"
                value={filters.maxAmount}
                onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
              />
            </div>

            {/* Quick Date Filters */}
            <div className="col-12">
              <label className="form-label">Quick Date Filters</label>
              <div className="btn-group btn-group-sm" role="group">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary"
                  onClick={() => applyQuickDateFilter(1)}
                >
                  Today
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline-secondary"
                  onClick={() => applyQuickDateFilter(7)}
                >
                  Last 7 Days
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline-secondary"
                  onClick={() => applyQuickDateFilter(30)}
                >
                  Last 30 Days
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline-secondary"
                  onClick={() => applyQuickDateFilter(90)}
                >
                  Last 90 Days
                </button>
              </div>
            </div>

            {/* Apply Filters Button */}
            <div className="col-12 mt-3">
              <button 
                className="btn btn-primary me-2"
                onClick={applyFilters}
                disabled={loading}
              >
                Apply Filters
              </button>
              <button 
                className="btn btn-outline-secondary"
                onClick={clearFilters}
                disabled={loading}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title mb-0">Transaction History | {transactions.length} transactions</h5>
            <small className="text-muted">
              Showing {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
            </small>
          </div>
          
          {/* Loading Spinner */}
          {loading && (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          
          {/* Transaction Table */}
          {!loading && (
            <TransactionTable items={transactions} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;