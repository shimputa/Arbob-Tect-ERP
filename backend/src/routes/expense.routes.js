import express from 'express';
import {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  patchExpense,
  deleteExpense,
  filterExpenses
} from '../controllers/expense.controller.js';
import {
  createExpenseValidation,
  updateExpenseValidation,
  patchExpenseValidation,
  filterExpensesValidation
} from '../validators/expense.validator.js';
import { handleValidationErrors } from '../middlewares/validation.middleware.js';

const router = express.Router();

router.get('/', getAllExpenses);
router.get('/filter', filterExpensesValidation, handleValidationErrors, filterExpenses);
router.get('/:id', getExpenseById);
router.post('/', createExpenseValidation, handleValidationErrors, createExpense);
router.put('/:id', updateExpenseValidation, handleValidationErrors, updateExpense);
router.patch('/patch/:id', patchExpenseValidation, handleValidationErrors, patchExpense);
router.delete('/:id', deleteExpense);

export default router;