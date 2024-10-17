import express from 'express';
import {
  createExpenseCategory,
  getAllExpenseCategories,
  getExpenseCategoryById,
  updateExpenseCategory,
  softDeleteExpenseCategory,
  patchExpenseCategory
} from '../controllers/expense.category.controller.js';
import { validateExpenseCategoryCreation, validateExpenseCategoryUpdate } from '../validators/expense.category.validator.js';

const router = express.Router();

router.post('/', validateExpenseCategoryCreation, createExpenseCategory);
router.get('/', getAllExpenseCategories);
router.get('/:id', getExpenseCategoryById);
router.put('/:id', validateExpenseCategoryUpdate, updateExpenseCategory);
router.patch('/patch/:id',validateExpenseCategoryUpdate, patchExpenseCategory);
router.delete('/:id/deactivate', softDeleteExpenseCategory);

export default router;
