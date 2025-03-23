import { check } from 'express-validator';

export const validateAdvanceCreation = [
    check('employeeId')
      .notEmpty().withMessage('Employee ID is required')
      .isInt().withMessage('Employee ID must be a valid integer')
      .toInt(),
      
    check('amount')
      .notEmpty().withMessage('Amount is required')
      .isFloat({ min: 0 }).withMessage('Amount must be a positive number')
      .toFloat(),
  
    check('date')
      .notEmpty().withMessage('Date is required')
      .isISO8601().withMessage('Date must be a valid date')
      .toDate(),
  
    check('description')
      .optional()
      .isString().withMessage('Description must be a string')
      .trim()
      .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters')
  ];

export const validateAdvanceUpdate = [
  check('employeeId')
    .notEmpty().withMessage('Employee ID is required')
    .isInt().withMessage('Employee ID must be a valid integer')
    .toInt(),

  check('amount')
    .notEmpty().withMessage('Amount is required')
    .isFloat({ min: 0, allow_zero: true }).withMessage('Amount must be zero or a positive number')
    .toFloat(),

  check('remainingAmount')
    .optional()
    .isFloat({ min: 0, allow_zero: true }).withMessage('Remaining amount must be zero or a positive number')
    .toFloat()
    .custom((value, { req }) => {
      if (value > req.body.amount) {
        throw new Error('Remaining amount cannot be greater than total amount');
      }
      return true;
    }),

  check('date')
    .notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Date must be a valid date')
    .toDate(),

  check('description')
    .optional()
    .isString().withMessage('Description must be a string')
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters')
];

export const validateAdvancePatch = [
  check('employeeId')
    .optional()
    .isInt().withMessage('Employee ID must be a valid integer')
    .toInt(),

  check('amount')
    .optional()
    .isFloat({ min: 0, allow_zero: true }).withMessage('Amount must be zero or a positive number')
    .toFloat(),

  check('remainingAmount')
    .optional()
    .isFloat({ min: 0, allow_zero: true }).withMessage('Remaining amount must be zero or a positive number')
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.amount !== undefined && value > req.body.amount) {
        throw new Error('Remaining amount cannot be greater than total amount');
      }
      return true;
    }),

  check('date')
    .optional()
    .isISO8601().withMessage('Date must be a valid date')
    .toDate(),

  check('description')
    .optional()
    .isString().withMessage('Description must be a string')
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters')
];