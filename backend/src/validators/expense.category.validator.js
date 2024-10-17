import { check, validationResult } from 'express-validator';

// Validation for creating an expense category
export const validateExpenseCategoryCreation = [
  check('name').notEmpty().withMessage('Name is required'),
  check('description').optional().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation errors', errors: errors.array() });
    }
    next();
  },
];

// Validation for updating an expense category
export const validateExpenseCategoryUpdate = [
  check('name').optional().notEmpty().withMessage('Name is required if provided'),
  check('description').optional().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation errors', errors: errors.array() });
    }
    next();
  },
];
