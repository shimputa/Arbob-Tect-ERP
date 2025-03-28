import express from 'express';
import {
  getEmployeeProjectBonuses,
    createSalary,
    getAllSalaries,
    filterSalaries,
    getSalaryById,
    updateSalary,
    deleteSalary,
    getRemainingAdvanceSalary
  }from '../controllers/salary.controller.js';
import { 
  validateSalaryCreation, 
  validateSalaryUpdate, 
  validateSalaryPatch, 
  validateProjectBonusRetrieval, 
  validateAdvanceSalaryRetrieval, 
  validateSalaryFilter 
} from '../validators/salary.validation.js';
import { handleValidationErrors } from '../middlewares/validation.middleware.js';
import { authenticate, hasPermission } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// Create a new salary record
router.post('/', hasPermission('salary:create'), validateSalaryCreation, handleValidationErrors, createSalary);

// Get project bonuses for an employee
router.get('/project-bonuses', hasPermission('salary:view'), validateProjectBonusRetrieval, handleValidationErrors, getEmployeeProjectBonuses);

// Get all salaries
router.get('/', hasPermission('salary:view'), getAllSalaries);

// Filter salaries
router.get('/filter', hasPermission('salary:view'), validateSalaryFilter, handleValidationErrors, filterSalaries);

// Get remaining advance salary amount
router.get('/remaining-advance', hasPermission('salary:view'), validateAdvanceSalaryRetrieval, handleValidationErrors, getRemainingAdvanceSalary);

// Get a specific salary by ID
router.get('/:id', hasPermission('salary:view'), getSalaryById);

// Update a salary record (full update)
router.put('/:id', hasPermission('salary:edit'), validateSalaryUpdate, handleValidationErrors, updateSalary);

// Update a salary record (partial update)
router.patch('/:id', validateSalaryPatch, handleValidationErrors, updateSalary);

// Delete a salary record
router.delete('/:id', hasPermission('salary:delete'), deleteSalary);

export default router;