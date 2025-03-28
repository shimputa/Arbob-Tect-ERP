import React from 'react';
import { usePermission } from '../../contexts/PermissionContext';

// Only renders children if user has the required permission
export const PermissionGate = ({ permission, children }) => {
  const { hasPermission } = usePermission();
  
  if (!hasPermission(permission)) {
    return null;
  }
  
  return <>{children}</>;
};

// Only renders children if user has any of the required permissions
export const AnyPermissionGate = ({ permissions, children }) => {
  const { hasAnyPermission } = usePermission();
  
  if (!hasAnyPermission(permissions)) {
    return null;
  }
  
  return <>{children}</>;
};

// Renders one of two components based on permission
export const PermissionSwitch = ({ permission, allowed, denied = null }) => {
  const { hasPermission } = usePermission();
  
  return hasPermission(permission) ? allowed : denied;
}; 