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

import {validateEmployeeCreation,validateEmployeeUpdate} from '../middlewares/employee.validatio.middleware.js'

const router = express.Router();

// Define employee routes
router.get('/employees', getAllEmployees);      
router.get('/employee/:id', getEmployeeById);     
router.get('/activeEmployees', getActiveEmployees);      
router.get('/inactiveEmployees', getInactiveEmployees);      
router.post('/employees',validateEmployeeCreation, createEmployee);        
router.put('/employees/:id',validateEmployeeUpdate, updateEmployee);      
router.patch('/employee/:id',validateEmployeeUpdate, patchEmployee);     
router.delete('/employee/:id/deactivate', softDeleteEmployee);

export default router;
