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
import { authenticate, hasPermission } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

router.get('/', hasPermission('expense:view'), getAllExpenses);
router.get('/filter', hasPermission('expense:view'), filterExpensesValidation, handleValidationErrors, filterExpenses);
router.get('/:id', hasPermission('expense:view'), getExpenseById);
router.post('/', hasPermission('expense:create'), createExpenseValidation, handleValidationErrors, createExpense);
router.put('/:id', hasPermission('expense:edit'), updateExpenseValidation, handleValidationErrors, updateExpense);
router.patch('/patch/:id', hasPermission('expense:edit'), patchExpenseValidation, handleValidationErrors, patchExpense);
router.delete('/:id', hasPermission('expense:delete'), deleteExpense);

export default router;