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
  'expense:view': ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER','HR'],
  'expense:create': ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER'],
  'expense:edit': ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER'],
  'expense:delete': ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER'],
  
  // Expense Categories
  'expenseCategory:view': ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER','HR'],
  'expenseCategory:create': ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER'],
  'expenseCategory:edit': ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER'],
  'expenseCategory:delete': ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER'],
  
  // Project Management
  'project:view': ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER','HR'],
  'project:create': ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER'],
  'project:edit': ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER'],
  'project:delete': ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER'],
  
  // Dashboard
  'dashboard:view': ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER', 'HR']
};

// Dashboard component access by role
export const DASHBOARD_ACCESS = {
  'SUPER_ADMIN': ['employees', 'attendance', 'expenses', 'projects', 'salary', 'yearlyTrends'],
  'ADMIN': ['employees', 'attendance', 'expenses', 'projects', 'salary', 'yearlyTrends'],
  'FINANCE_MANAGER': ['employees', 'expenses', 'salary'],
  'HR': ['employees', 'attendance']
};