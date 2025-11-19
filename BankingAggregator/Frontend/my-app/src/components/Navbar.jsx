import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../Store/useAuthStore';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          🏦 BankAggregator
        </Link>
        
        <div className="navbar-nav ms-auto">
          {isAuthenticated ? (
            <>
              <span className="navbar-text me-3">
                Welcome, {user?.fullName || user?.email}
              </span>
              <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/login">Login</Link>
              <Link className="nav-link" to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;