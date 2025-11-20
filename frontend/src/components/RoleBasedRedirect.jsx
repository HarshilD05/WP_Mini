import React from 'react';
import { Navigate } from 'react-router-dom';

const RoleBasedRedirect = () => {
  const userRole = sessionStorage.getItem('userRole');

  // Redirect based on user role
  switch (userRole?.toLowerCase()) {
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'student':
      return <Navigate to="/dashboard" replace />;
    case 'teacher':
      return <Navigate to="/teacher-dashboard" replace />;
    default:
      // If role is not recognized, redirect to login
      return <Navigate to="/login" replace />;
  }
};

export default RoleBasedRedirect;
