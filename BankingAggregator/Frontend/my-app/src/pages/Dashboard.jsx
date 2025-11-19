import React from 'react';
import useAuthStore from '../Store/useAuthStore';

const Dashboard = () => {
  const { user } = useAuthStore();

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Dashboard</h1>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Welcome to BankAggregator</h5>
              <p className="card-text">
                Hello, <strong>{user?.fullName || user?.email}</strong>! 
                {user?.role === 'SysAdmin' ? ' You have administrator privileges.' : ' Welcome to your banking dashboard.'}
              </p>
              
              <div className="row mt-4">
                <div className="col-md-4">
                  <div className="card text-white bg-primary mb-3">
                    <div className="card-body">
                      <h5 className="card-title">Accounts</h5>
                      <p className="card-text">View and manage your bank accounts</p>
                      <a href="/accounts" className="btn btn-light">Go to Accounts</a>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-4">
                  <div className="card text-white bg-success mb-3">
                    <div className="card-body">
                      <h5 className="card-title">Transactions</h5>
                      <p className="card-text">View your transaction history</p>
                      <a href="/transactions" className="btn btn-light">View Transactions</a>
                    </div>
                  </div>
                </div>

                {user?.role === 'SysAdmin' && (
                  <div className="col-md-4">
                    <div className="card text-white bg-warning mb-3">
                      <div className="card-body">
                        <h5 className="card-title">Admin Panel</h5>
                        <p className="card-text">Manage users and banks</p>
                        <a href="/manage-users" className="btn btn-light">Admin Tools</a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;