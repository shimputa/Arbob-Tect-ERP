import { check } from 'express-validator';

export const validateUserCreation = [
  check('name')
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a valid string')
    .trim().withMessage('Name must not contain leading or trailing spaces')
    .isLength({ min: 3, max: 100 }).withMessage('Name must be between 3 and 100 characters long'),

  check('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail().withMessage('Email must be normalized to a standard format'),

  check('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8, max: 30 }).withMessage('Password must be between 8 and 30 characters long'),

  check('role')
    .notEmpty().withMessage('Role is required')
    .isIn(['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER', 'HR']).withMessage('Invalid role')
];

export const validateUserUpdate = [
  check('name')
    .optional()
    .isString().withMessage('Name must be a valid string')
    .trim().withMessage('Name must not contain leading or trailing spaces')
    .isLength({ min: 3, max: 100 }).withMessage('Name must be between 3 and 100 characters long'),

  check('email')
    .optional()
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail().withMessage('Email must be normalized to a standard format'),

  check('role')
    .optional()
    .isIn(['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER', 'HR']).withMessage('Invalid role'),

    check('password')
    .optional()
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 8, max: 30 }).withMessage('New password must be between 8 and 30 characters long'),
];
