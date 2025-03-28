import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePermission } from '../../contexts/PermissionContext';

const PermissionRoute = ({ permissions, redirectPath = "/dashboard", children }) => {
  const { hasAnyPermission } = usePermission();
  
  // If user lacks all required permissions, redirect to specified path
  if (!hasAnyPermission(permissions)) {
    return <Navigate to={redirectPath} replace />;
  }
  
  return children;
};

export default PermissionRoute; 