import React from 'react';
import { Navigate } from 'react-router-dom';
import { getDashboardPath } from '../utils/roleHelper';

const RoleBasedRedirect = () => {
  const userRole = sessionStorage.getItem('userRole');

  // If no role, redirect to login
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  // Get the appropriate dashboard path for this role
  const dashboardPath = getDashboardPath(userRole);
  
  return <Navigate to={dashboardPath} replace />;
};

export default RoleBasedRedirect;
