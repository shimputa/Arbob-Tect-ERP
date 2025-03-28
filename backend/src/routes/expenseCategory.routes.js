import express from 'express';
import {
  createExpenseCategory,
  getAllExpenseCategories,
  getExpenseCategoryById,
  updateExpenseCategory,
  softDeleteExpenseCategory,
  patchExpenseCategory
} from '../controllers/expense.category.controller.js';
import { validateExpenseCategoryCreation, updateExpenseCategoryValidation ,patchExpenseCategoryValidation} from '../validators/expense.category.validator.js';
import { handleValidationErrors } from '../middlewares/validation.middleware.js';
import { authenticate, hasPermission } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

router.post('/', 
  hasPermission('expenseCategory:create'),
  validateExpenseCategoryCreation, 
  handleValidationErrors, 
  createExpenseCategory
);
router.get('/', hasPermission('expenseCategory:view'), getAllExpenseCategories);
router.get('/:id', hasPermission('expenseCategory:view'), getExpenseCategoryById);
router.put('/:id', 
  hasPermission('expenseCategory:edit'),
  updateExpenseCategoryValidation, 
  handleValidationErrors, 
  updateExpenseCategory
);
router.patch('/patch/:id',
  hasPermission('expenseCategory:edit'),
  patchExpenseCategoryValidation, 
  handleValidationErrors, 
  patchExpenseCategory
);
router.delete('/:id/deactivate', hasPermission('expenseCategory:delete'), softDeleteExpenseCategory);

export default router;
