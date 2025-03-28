// routes/employee.routes.js
import express from 'express';
import {
  getAllEmployees,
  getEmployeeById,
  getActiveEmployees,
  getInactiveEmployees,
  createEmployee,
  updateEmployee,
  patchEmployee,
  softDeleteEmployee
} from '../controllers/employeeController.js';

import {
  validateEmployeeCreation,
  validateEmployeeUpdate,
  validateEmployeePatch,
} from '../validators/employee.validation.js';
import { handleValidationErrors } from '../middlewares/validation.middleware.js';
import { authenticate, hasPermission } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// Get all employees
router.get('/employees', hasPermission('employee:view'), getAllEmployees);

// Get active employees
router.get('/activeEmployees', hasPermission('employee:view'), getActiveEmployees);

// Get inactive employees
router.get('/inactiveEmployees', hasPermission('employee:view'), getInactiveEmployees);

// Get employee by ID
router.get('/employee/:id', hasPermission('employee:view'), getEmployeeById);

// Create a new employee
router.post('/employees', hasPermission('employee:create'), validateEmployeeCreation, handleValidationErrors, createEmployee);

// Update an employee
router.put('/employee/:id', hasPermission('employee:edit'), validateEmployeeUpdate, handleValidationErrors, updateEmployee);

// Patch an employee
router.patch('/:id', hasPermission('employee:edit'), validateEmployeePatch, handleValidationErrors, patchEmployee);

// Delete an employee
router.delete('/employee/:id', hasPermission('employee:delete'), softDeleteEmployee);

export default router;