// routes/employee.routes.js
import express from 'express';
import {
  getAllEmployees,
  getEmployeeById,
  getActiveEmployees,
  getInactiveEmployees,
  createEmployee,
  updateEmployee,
  softDeleteEmployee
} from '../controllers/employeeController.js';

const router = express.Router();

// Define employee routes
router.get('/employees', getAllEmployees);          // Get all employees
router.get('/employees/:id', getEmployeeById);      // Get an employee by ID
router.get('/activeEmployees', getActiveEmployees);      // Get only active employee 
router.get('/inactiveEmployees', getInactiveEmployees);      // Get only inactive employee 
router.post('/employees', createEmployee);          // Create a new employee
router.put('/employees/:id', updateEmployee);       // Update an employee by ID
router.delete('/employees/:id/deactivate', softDeleteEmployee);

export default router;
