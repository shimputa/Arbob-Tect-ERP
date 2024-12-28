import { prisma } from '../config/db.js';  // Adjust the path as needed
import { body, check } from 'express-validator';

// Explicitly define the Currency enum
const Currency = {
  USD: 'USD',
  PKR: 'PKR',
  EUR: 'EUR',
  GBP: 'GBP',
  INR: 'INR',
  JPY: 'JPY',
  AUD: 'AUD',
  CAD: 'CAD',
  CNY: 'CNY'
};

const VALID_CURRENCIES = Object.values(Currency);

const validateExpenseCategoryExists = async (value) => {
  const category = await prisma.expenseCategory.findUnique({
    where: { id: Number(value) }
  });
  if (!category) {
    throw new Error('Expense category does not exist');
  }
  return true;
};

export const createExpenseValidation = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a string')
    .isLength({ min: 3, max: 100 }).withMessage('Name must be between 3 and 100 characters'),
  
  // body('expenseCategoryName')
  //   .notEmpty().withMessage('Expense category Name is required')
  //   .isInt().withMessage('Expense category Name must be an string')
  //   .custom(validateExpenseCategoryExists),

    body('expenseCategoryName')
    .notEmpty().withMessage('expenseCategoryName is required')
    .isString().withMessage('expenseCategoryName must be a string')
    .isLength({ min: 3, max: 100 }).withMessage('expenseCategoryName must be between 3 and 100 characters'),
  
  body('currency')
    .notEmpty().withMessage('Currency is required')
    .isIn(VALID_CURRENCIES).withMessage('Invalid currency'),
  
  body('total')
    .notEmpty().withMessage('Total is required')
    .isFloat({ min: 0.01 }).withMessage('Total must be a positive number with at least two decimal places')
    .custom((value) => {
      if (!/^\d+(\.\d{1,2})?$/.test(value)) {
        throw new Error('Total must have at most two decimal places');
      }
      return true;
    }),
  
  body('description')
    .notEmpty().withMessage('Description is required')
    .isString().withMessage('Description must be a string')
    .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),
  
  body('reference')
    .notEmpty().withMessage('Reference is required')
    .isString().withMessage('Reference must be a string')
    .isLength({ max: 50 }).withMessage('Reference must not exceed 50 characters')
    .matches(/^[a-zA-Z0-9-_]+$/).withMessage('Reference must contain only alphanumeric characters, hyphens, and underscores'),
];

export const updateExpenseValidation = createExpenseValidation;

export const patchExpenseValidation = [
  body('name')
    .optional()
    .notEmpty().withMessage('Name cannot be empty')
    .isString().withMessage('Name must be a string')
    .isLength({ min: 3, max: 100 }).withMessage('Name must be between 3 and 100 characters'),
  
  body('expenseCategoryId')
    .optional()
    .isInt().withMessage('Expense category ID must be an integer')
    .custom(validateExpenseCategoryExists),
  
  body('currency')
    .optional()
    .isIn(VALID_CURRENCIES).withMessage('Invalid currency'),
  
  body('total')
    .optional()
    .isFloat({ min: 0.01 }).withMessage('Total must be a positive number with at least two decimal places')
    .custom((value) => {
      if (!/^\d+(\.\d{1,2})?$/.test(value)) {
        throw new Error('Total must have at most two decimal places');
      }
      return true;
    }),
  
  body('description')
    .optional()
    .notEmpty().withMessage('Description cannot be empty')
    .isString().withMessage('Description must be a string')
    .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),
  
  body('reference')
    .optional()
    .notEmpty().withMessage('Reference cannot be empty')
    .isString().withMessage('Reference must be a string')
    .isLength({ max: 50 }).withMessage('Reference must not exceed 50 characters')
    .matches(/^[a-zA-Z0-9-_]+$/).withMessage('Reference must contain only alphanumeric characters, hyphens, and underscores'),
];

export const filterExpensesValidation = [
  check('startDate')
    .optional()
    .isISO8601().toDate().withMessage('Start date must be a valid date'),
  check('endDate')
    .optional()
    .isISO8601().toDate().withMessage('End date must be a valid date')
    .custom((endDate, { req }) => {
      if (req.query.startDate && new Date(endDate) <= new Date(req.query.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  check('minAmount')
    .optional()
    .isFloat({ min: 0 }).withMessage('Minimum amount must be a positive number'),
  check('maxAmount')
    .optional()
    .isFloat({ min: 0 }).withMessage('Maximum amount must be a positive number')
    .custom((maxAmount, { req }) => {
      if (req.query.minAmount && parseFloat(maxAmount) <= parseFloat(req.query.minAmount)) {
        throw new Error('Maximum amount must be greater than minimum amount');
      }
      return true;
    }),
  check('currency')
    .optional()
    .isIn(VALID_CURRENCIES).withMessage('Invalid currency'),
  check('categoryId')
    .optional()
    .isInt().withMessage('Category ID must be an integer')
    .custom(validateExpenseCategoryExists),
];