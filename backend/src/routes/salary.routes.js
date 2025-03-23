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

const router = express.Router();

// Create a new salary record
router.post('/', validateSalaryCreation, handleValidationErrors, createSalary);

// Get project bonuses for an employee
router.get('/project-bonuses', validateProjectBonusRetrieval, handleValidationErrors, getEmployeeProjectBonuses);

// Get all salaries
router.get('/', getAllSalaries);

// Filter salaries
router.get('/filter', validateSalaryFilter, handleValidationErrors, filterSalaries);

// Get remaining advance salary amount
router.get('/remaining-advance', validateAdvanceSalaryRetrieval, handleValidationErrors, getRemainingAdvanceSalary);

// Get a specific salary by ID
router.get('/:id', getSalaryById);

// Update a salary record (full update)
router.put('/:id', validateSalaryUpdate, handleValidationErrors, updateSalary);

// Update a salary record (partial update)
router.patch('/:id', validateSalaryPatch, handleValidationErrors, updateSalary);

// Delete a salary record
router.delete('/:id', deleteSalary);

export default router;