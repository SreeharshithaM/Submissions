import React, { useState, useEffect } from 'react';
import AccountTable from '../components/AccountTable';
import { accountService } from '../services/accountService';

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    accountType: 'All Types',
    status: 'All Status',
    currency: 'All Currencies'
  });
  
  const [newAccount, setNewAccount] = useState({
    accountNumber: '',
    type: 'Checking',
    bankName: 'National Trust Bank',
    ownerName: 'John Doe',
    balance: 100,
    currency: 'USD'
  });

  // Load accounts when component loads
  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    setLoading(true);
    try {
      const userAccounts = await accountService.getUserAccounts();
      setAccounts(userAccounts);
    } catch (error) {
      console.error('Error loading accounts:', error);
      // Fallback to mock data if API fails
      setAccounts([
        {
          id: 1,
          accountNumber: 'ACC1763539817837',
          type: 'Checking',
          bankName: 'National Trust Bank',
          ownerName: 'John Doe',
          balance: 10000.00,
          currency: 'USD',
          status: 'Active'
        },
        {
          id: 2,
          accountNumber: 'ACC1763539860222',
          type: 'Settings',
          bankName: 'National Trust Bank',
          ownerName: 'Sriram',
          balance: 10000.00,
          currency: 'EUR',
          status: 'Active'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format currency
  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create account data
      const accountData = {
        id: Date.now(), // Temporary ID for local state
        accountNumber: newAccount.accountNumber || `ACC${Date.now()}`,
        type: newAccount.type,
        bankName: newAccount.bankName,
        ownerName: newAccount.ownerName,
        balance: parseFloat(newAccount.balance) || 0,
        currency: newAccount.currency,
        status: 'Active'
      };

      console.log('Creating account:', accountData);
      
      // Add to local state immediately
      setAccounts(prevAccounts => [...prevAccounts, accountData]);
      
      // Try to create via API
      try {
        await accountService.createAccount(accountData);
      } catch (apiError) {
        console.log('API creation failed, but account added locally');
      }
      
      // Close modal and reset form
      setShowCreateModal(false);
      setNewAccount({
        accountNumber: '',
        type: 'Checking',
        bankName: 'National Trust Bank',
        ownerName: 'John Doe',
        balance: 100,
        currency: 'USD'
      });
      
      alert('Account created successfully!');
    } catch (error) {
      console.error('Error creating account:', error);
      alert('Error creating account');
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async (account) => {
    const amount = prompt(`Enter deposit amount for account ${account.accountNumber}:`);
    if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
      const depositAmount = parseFloat(amount);
      
      // Update local state immediately
      const updatedAccounts = accounts.map(acc => 
        acc.id === account.id 
          ? { ...acc, balance: acc.balance + depositAmount }
          : acc
      );
      setAccounts(updatedAccounts);

      // Try API call
      try {
        await accountService.deposit({
          accountId: account.id,
          amount: depositAmount
        });
      } catch (error) {
        console.log('API deposit failed, but local update succeeded');
      }
      
      alert(`Successfully deposited ${formatCurrency(depositAmount, account.currency)}! New balance: ${formatCurrency(account.balance + depositAmount, account.currency)}`);
    } else if (amount && parseFloat(amount) <= 0) {
      alert('Deposit amount must be greater than 0');
    }
  };

  const handleWithdraw = async (account) => {
    const amount = prompt(`Enter withdrawal amount for account ${account.accountNumber}:`);
    if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
      const withdrawAmount = parseFloat(amount);
      
      // Check if sufficient balance
      if (withdrawAmount > account.balance) {
        alert(`Insufficient funds! Available balance: ${formatCurrency(account.balance, account.currency)}`);
        return;
      }

      // Update local state immediately
      const updatedAccounts = accounts.map(acc => 
        acc.id === account.id 
          ? { ...acc, balance: acc.balance - withdrawAmount }
          : acc
      );
      setAccounts(updatedAccounts);

      // Try API call
      try {
        await accountService.withdraw({
          accountId: account.id,
          amount: withdrawAmount
        });
      } catch (error) {
        console.log('API withdrawal failed, but local update succeeded');
      }
      
      alert(`Successfully withdrew ${formatCurrency(withdrawAmount, account.currency)}! New balance: ${formatCurrency(account.balance - withdrawAmount, account.currency)}`);
    } else if (amount && parseFloat(amount) <= 0) {
      alert('Withdrawal amount must be greater than 0');
    }
  };

  const handleTransfer = (account) => {
    alert(`Transfer from account: ${account.accountNumber}\nThis feature will be implemented later.`);
  };

  const handleClose = async (account) => {
    if (account.balance !== 0) {
      alert('Cannot close account with non-zero balance. Please withdraw all funds first.');
      return;
    }

    if (window.confirm(`Are you sure you want to close account ${account.accountNumber}?`)) {
      // Update local state immediately
      const updatedAccounts = accounts.map(acc => 
        acc.id === account.id 
          ? { ...acc, status: 'Closed' }
          : acc
      );
      setAccounts(updatedAccounts);

      // Try API call
      try {
        await accountService.closeAccount({
          accountId: account.id
        });
      } catch (error) {
        console.log('API close failed, but local update succeeded');
      }
      
      alert('Account closed successfully!');
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters({
      ...filters,
      [filterName]: value
    });
  };

  const applyFilters = () => {
    alert('Filters applied: ' + JSON.stringify(filters));
    // Note: You can implement actual filtering logic here
  };

  // Filter accounts based on current filters
  const filteredAccounts = accounts.filter(account => {
    if (filters.search && !account.accountNumber.toLowerCase().includes(filters.search.toLowerCase()) && 
        !account.bankName.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.accountType !== 'All Types' && account.type !== filters.accountType) {
      return false;
    }
    if (filters.status !== 'All Status' && account.status !== filters.status) {
      return false;
    }
    if (filters.currency !== 'All Currencies' && account.currency !== filters.currency) {
      return false;
    }
    return true;
  });

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Bank Accounts</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
          disabled={loading}
        >
          + Create New Account
        </button>
      </div>

      {/* Filters & Search Section */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Filters & Search</h5>
          <div className="row g-3 align-items-end">
            <div className="col-md-3">
              <label className="form-label">Search</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Account number or bank..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">Account Type</label>
              <select 
                className="form-select"
                value={filters.accountType}
                onChange={(e) => handleFilterChange('accountType', e.target.value)}
              >
                <option>All Types</option>
                <option>Checking</option>
                <option>Savings</option>
                <option>Credit</option>
                <option>Execute</option>
                <option>Settings</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Status</label>
              <select 
                className="form-select"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
                <option>Closed</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Currency</label>
              <select 
                className="form-select"
                value={filters.currency}
                onChange={(e) => handleFilterChange('currency', e.target.value)}
              >
                <option>All Currencies</option>
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
              </select>
            </div>
            <div className="col-md-2">
              <button 
                className="btn btn-outline-primary w-100"
                onClick={applyFilters}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Accounts Section */}
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title mb-0">My Bank Accounts | {filteredAccounts.length} accounts</h5>
            <small className="text-muted">Showing {filteredAccounts.length} of {accounts.length} accounts</small>
          </div>
          
          {/* Loading Spinner */}
          {loading && (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          
          {/* Account Table */}
          {!loading && (
            <AccountTable 
              items={filteredAccounts}
              onDeposit={handleDeposit}
              onWithdraw={handleWithdraw}
              onTransfer={handleTransfer}
              onClose={handleClose}
            />
          )}
        </div>
      </div>

      {/* Create Account Modal */}
      {showCreateModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create New Bank Account</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowCreateModal(false)}
                  disabled={loading}
                ></button>
              </div>
              <form onSubmit={handleCreateAccount}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Account Number (Optional)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Leave empty for auto-generate"
                      value={newAccount.accountNumber}
                      onChange={(e) => setNewAccount({...newAccount, accountNumber: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Account Type</label>
                    <select
                      className="form-select"
                      value={newAccount.type}
                      onChange={(e) => setNewAccount({...newAccount, type: e.target.value})}
                      required
                    >
                      <option value="Checking">Checking</option>
                      <option value="Savings">Savings</option>
                      <option value="Credit">Credit</option>
                      <option value="Execute">Execute</option>
                      <option value="Settings">Settings</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Bank Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newAccount.bankName}
                      onChange={(e) => setNewAccount({...newAccount, bankName: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Owner Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newAccount.ownerName}
                      onChange={(e) => setNewAccount({...newAccount, ownerName: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Initial Balance</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newAccount.balance}
                      onChange={(e) => setNewAccount({...newAccount, balance: e.target.value})}
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Currency</label>
                    <select
                      className="form-select"
                      value={newAccount.currency}
                      onChange={(e) => setNewAccount({...newAccount, currency: e.target.value})}
                      required
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowCreateModal(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;