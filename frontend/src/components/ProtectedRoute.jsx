import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const userId = sessionStorage.getItem('userId');
  const userRole = sessionStorage.getItem('userRole');

  // If no user credentials found, redirect to login
  if (!userId || !userRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
