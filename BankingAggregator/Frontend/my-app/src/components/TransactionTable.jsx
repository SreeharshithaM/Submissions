// components/TransactionTable.jsx
import React from 'react';

const TransactionTable = ({ items }) => {
  if (!items || items.length === 0) {
    return (
      <div className="alert alert-info text-center">
        <h5>No Transactions Found</h5>
        <p>No transaction history available for the selected filters.</p>
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

  // Function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Function to get transaction type badge color
  const getTypeBadge = (type) => {
    switch (type) {
      case 'Deposit': return 'bg-success';
      case 'Withdrawal': return 'bg-warning';
      case 'Transfer': return 'bg-info';
      case 'Payment': return 'bg-primary';
      case 'Account Creation': return 'bg-secondary';
      case 'Account Closed': return 'bg-dark';
      default: return 'bg-secondary';
    }
  };

  // Function to get status badge color
  const getStatusBadge = (status) => {
    return status === 'Completed' ? 'bg-success' : 'bg-secondary';
  };

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Date & Time</th>
            <th>Transaction ID</th>
            <th>Account Number</th>
            <th>Type</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Balance After</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((transaction) => (
            <tr key={transaction.id} className="align-middle">
              <td>
                <small>{formatDate(transaction.date)}</small>
              </td>
              <td>
                <strong>{transaction.id}</strong>
              </td>
              <td>
                <strong>{transaction.accountNumber}</strong>
              </td>
              <td>
                <span className={`badge ${getTypeBadge(transaction.type)}`}>
                  {transaction.type}
                </span>
              </td>
              <td>
                {transaction.description}
              </td>
              <td className={transaction.amount >= 0 ? 'text-success' : 'text-danger'}>
                <strong>{formatCurrency(transaction.amount, transaction.currency)}</strong>
              </td>
              <td>
                <strong>{formatCurrency(transaction.balanceAfter, transaction.currency)}</strong>
              </td>
              <td>
                <span className={`badge ${getStatusBadge(transaction.status)}`}>
                  {transaction.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;