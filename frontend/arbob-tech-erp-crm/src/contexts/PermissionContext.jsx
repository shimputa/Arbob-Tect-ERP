import React, { createContext, useContext, useMemo, useCallback } from 'react';

// Import the permissions from a shared location
export const PERMISSIONS = {
  // User Management
  'user:view': ['SUPER_ADMIN'],
  'user:create': ['SUPER_ADMIN'],
  'user:edit': ['SUPER_ADMIN'],
  'user:delete': ['SUPER_ADMIN'],
  
  // Employee Management
  'employee:view': ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER', 'HR'],
  'employee:create': ['SUPER_ADMIN', 'ADMIN', 'HR'],
  'employee:edit': ['SUPER_ADMIN', 'ADMIN', 'HR'],
  'employee:delete': ['SUPER_ADMIN', 'ADMIN', 'HR'],
  
  // Salary Management
  'salary:view': ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER'],
  'salary:create': ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER'],
  'salary:edit': ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER'],
  'salary:delete': ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER'],
  
  // Advance Salary
  'advance:view': ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER'],
  'advance:create': ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER'],
  'advance:edit': ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER'],
  'advance:delete': ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER'],
  
  // Attendance
  'attendance:view': ['SUPER_ADMIN', 'ADMIN', 'HR'],
  'attendance:create': ['SUPER_ADMIN', 'ADMIN', 'HR'],
  'attendance:edit': ['SUPER_ADMIN', 'ADMIN', 'HR'],
  'attendance:delete': ['SUPER_ADMIN', 'ADMIN', 'HR'],
  
  // Expense Management
  'expense:view': ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER', 'HR'],
  'expense:create': ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER'],
  'expense:edit': ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER'],
  'expense:delete': ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER'],
  
  // Expense Categories
  'expenseCategory:view': ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER', 'HR'],
  'expenseCategory:create': ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER'],
  'expenseCategory:edit': ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER'],
  'expenseCategory:delete': ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER'],
  
  // Project Management
  'project:view': ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER', 'HR'],
  'project:create': ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER'],
  'project:edit': ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER'],
  'project:delete': ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER'],
  
  // Dashboard
  'dashboard:view': ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER', 'HR'],
  'dashboard:view:users': ['SUPER_ADMIN'],
  'dashboard:view:projects': ['SUPER_ADMIN', 'ADMIN'],
  'dashboard:view:expenses:categories': ['SUPER_ADMIN', 'ADMIN'],
  'dashboard:view:yearly_trends': ['SUPER_ADMIN', 'ADMIN'],
  'dashboard:view:attendance': ['SUPER_ADMIN', 'ADMIN', 'HR']
};

const PermissionContext = createContext(null);

export const usePermission = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermission must be used within a PermissionProvider');
  }
  return context;
};

export const PermissionProvider = ({ children, user }) => {
  // Check if user has a specific permission
  const hasPermission = useCallback((permission) => {
    if (!user || !user.role) return false;
    
    const allowedRoles = PERMISSIONS[permission];
    return allowedRoles?.includes(user.role) || false;
  }, [user]);
  
  // Check if user has any of the provided permissions
  const hasAnyPermission = useCallback((permissions) => {
    return permissions.some(permission => hasPermission(permission));
  }, [hasPermission]);
  
  // Check if user has all of the provided permissions
  const hasAllPermissions = useCallback((permissions) => {
    return permissions.every(permission => hasPermission(permission));
  }, [hasPermission]);
  
  const value = useMemo(() => ({
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    userRole: user?.role || null
  }), [hasPermission, hasAnyPermission, hasAllPermissions, user]);
  
  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
}; 