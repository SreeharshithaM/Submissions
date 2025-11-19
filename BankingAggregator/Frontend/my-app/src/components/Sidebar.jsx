import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuthStore from '../Store/useAuthStore';

const Sidebar = () => {
  const { user } = useAuthStore();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar">
      <div className="position-sticky pt-3">
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link 
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              to="/dashboard"
            >
              📊 Home
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              to="/dashboard"
            >
              📊 Dashboard
            </Link>
          </li>
          
          <li className="nav-item">
            <Link 
              className={`nav-link ${isActive('/accounts') ? 'active' : ''}`}
              to="/accounts"
            >
              💳 Accounts
            </Link>
          </li>
          
          <li className="nav-item">
            <Link 
              className={`nav-link ${isActive('/transactions') ? 'active' : ''}`}
              to="/transactions"
            >
              📈 Transactions
            </Link>
          </li>

          {user?.role === 'SysAdmin' && (
            <>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActive('/manage-users') ? 'active' : ''}`}
                  to="/manage-users"
                >
                  👥 Manage Users
                </Link>
              </li>
              
              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActive('/manage-banks') ? 'active' : ''}`}
                  to="/manage-banks"
                >
                  🏦 Manage Banks
                </Link>
              </li>
            </>
          )}

          <li className="nav-item">
            <Link 
              className={`nav-link ${isActive('/about') ? 'active' : ''}`}
              to="/about"
            >
              ℹ️ About Us
            </Link>
          </li>
          
          <li className="nav-item">
            <Link 
              className={`nav-link ${isActive('/plans') ? 'active' : ''}`}
              to="/plans"
            >
              💰 Plans
            </Link>
          </li>
          
          <li className="nav-item">
            <Link 
              className={`nav-link ${isActive('/faq') ? 'active' : ''}`}
              to="/faq"
            >
              ❓ FAQ
            </Link>
          </li>
          
          <li className="nav-item">
            <Link 
              className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
              to="/contact"
            >
              📞 Contact
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;