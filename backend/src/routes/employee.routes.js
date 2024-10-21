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

const router = express.Router();

// Define employee routes
router.get('/employees', getAllEmployees);      
router.get('/employee/:id', getEmployeeById);     
router.get('/activeEmployees', getActiveEmployees);      
router.get('/inactiveEmployees', getInactiveEmployees);      
router.post('/employees',validateEmployeeCreation, handleValidationErrors,  createEmployee);        
router.put('/employees/:id',validateEmployeeUpdate, handleValidationErrors, updateEmployee);      
router.patch('/employee/:id',validateEmployeePatch, handleValidationErrors, patchEmployee);     
router.delete('/employee/:id/deactivate', softDeleteEmployee);

export default router;