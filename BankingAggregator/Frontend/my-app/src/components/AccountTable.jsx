import React from 'react';

const AccountTable = ({ items, onDeposit, onWithdraw, onTransfer, onClose }) => {
  if (!items || items.length === 0) {
    return (
      <div className="alert alert-info text-center">
        <h5>No Accounts Found</h5>
        <p>You don't have any bank accounts yet. Contact your bank to open an account.</p>
      </div>
    );
  }

  // Function to format currency
  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  // Function to get account type badge color
  const getAccountTypeBadge = (type) => {
    switch (type) {
      case 'Checking': return 'bg-primary';
      case 'Savings': return 'bg-success';
      case 'Credit': return 'bg-warning';
      case 'Execute': return 'bg-info';
      case 'Settings': return 'bg-secondary';
      default: return 'bg-secondary';
    }
  };

  // Function to get status badge color
  const getStatusBadge = (status) => {
    return status === 'Active' ? 'bg-success' : 'bg-danger';
  };

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Account Number</th>
            <th>Account Type</th>
            <th>Bank Name</th>
            <th>Account Holder</th>
            <th>Balance</th>
            <th>Currency</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((account, index) => (
            <tr key={account.id || index} className="align-middle">
              <td>
                <strong>{account.accountNumber}</strong>
              </td>
              <td>
                <span className={`badge ${getAccountTypeBadge(account.type)}`}>
                  {account.type}
                </span>
              </td>
              <td>
                {account.bankName || 'National Trust Bank'}
              </td>
              <td>
                {account.ownerName || 'Account Holder'}
              </td>
              <td className={account.balance >= 0 ? 'text-success' : 'text-danger'}>
                <strong>{formatCurrency(account.balance, account.currency)}</strong>
              </td>
              <td>
                <span className="badge bg-info">{account.currency}</span>
              </td>
              <td>
                <span className={`badge ${getStatusBadge(account.status)}`}>
                  {account.status}
                </span>
              </td>
              <td>
                <div className="btn-group btn-group-sm" role="group">
                  <button 
                    className="btn btn-outline-success"
                    onClick={() => onDeposit(account)}
                    title="Deposit Money"
                  >
                    <i className="bi bi-arrow-down-circle"></i> Deposit
                  </button>
                  <button 
                    className="btn btn-outline-warning"
                    onClick={() => onWithdraw(account)}
                    disabled={account.balance <= 0}
                    title="Withdraw Money"
                  >
                    <i className="bi bi-arrow-up-circle"></i> Withdraw
                  </button>
                  <button 
                    className="btn btn-outline-info"
                    onClick={() => onTransfer(account)}
                    title="Transfer Money"
                  >
                    <i className="bi bi-arrow-left-right"></i> Transfer
                  </button>
                  <button 
                    className="btn btn-outline-danger"
                    onClick={() => onClose(account)}
                    disabled={account.balance !== 0}
                    title="Close Account"
                  >
                    <i className="bi bi-x-circle"></i> Close
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccountTable;