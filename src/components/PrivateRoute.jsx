import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdmin } from '@/context/AdminContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAdmin();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;