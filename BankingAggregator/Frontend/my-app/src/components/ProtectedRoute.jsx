import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../Store/useAuthStore';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (adminOnly && user?.role !== 'SysAdmin') {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

export default ProtectedRoute;