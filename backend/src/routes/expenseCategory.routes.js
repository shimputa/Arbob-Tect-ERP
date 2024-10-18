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

const router = express.Router();

router.post('/', validateExpenseCategoryCreation, handleValidationErrors, createExpenseCategory);
router.get('/', getAllExpenseCategories);
router.get('/:id', getExpenseCategoryById);
router.put('/:id', updateExpenseCategoryValidation, handleValidationErrors, updateExpenseCategory);
router.patch('/patch/:id',patchExpenseCategoryValidation, handleValidationErrors, patchExpenseCategory);
router.delete('/:id/deactivate', softDeleteExpenseCategory);

export default router;
