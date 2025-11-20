import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
  const userId = sessionStorage.getItem('userId');
  const userRole = sessionStorage.getItem('userRole');

  // If no token or user credentials found, redirect to login
  if (!token || !userId || !userRole) {
    // Clear any partial session data
    sessionStorage.clear();
    localStorage.removeItem('authToken');
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
