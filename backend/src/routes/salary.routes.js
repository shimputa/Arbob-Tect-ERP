import express from 'express';
import {
    createSalary,
    getAllSalaries,
    filterSalaries,
    getSalaryById,
    updateSalary,
    deleteSalary
  }from '../controllers/salary.controller.js';

const router = express.Router();

// Create a new salary record
router.post('/', createSalary);

// Get all salaries
router.get('/', getAllSalaries);

// Filter salaries
router.get('/filter', filterSalaries);

// Get a specific salary by ID
router.get('/:id',getSalaryById);

// Update a salary record
router.put('/:id', updateSalary);

// Delete a salary record
router.delete('/:id', deleteSalary);

export default router;