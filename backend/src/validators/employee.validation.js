import { check } from 'express-validator';

export const validateEmployeeCreation = [
    check('name')
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a valid string')
    .trim().withMessage('Name must not contain leading or trailing spaces')
    .isLength({ min: 3, max: 100 }).withMessage('Name must be between 3 and 100 characters long')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain letters and spaces'),

  check('email')
   .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail().withMessage('Email must be normalized to a standard format'),

  check('contact')
    .notEmpty().withMessage('Contact is required')
    .isNumeric().withMessage('Contact must only contain numeric digits')
    .isLength({ min: 11, max: 11 }).withMessage('Contact must be exactly 11 digits long')
    .matches(/^\d{11}$/).withMessage('Contact must contain only numeric characters'),

  check('position')
    .notEmpty().withMessage('Position is required')
    .isString().withMessage('Position must be a valid string')
    .isLength({ min: 3, max: 100 }).withMessage('Position must be between 3 and 100 characters long')
    .matches(/^[a-zA-Z0-9\s]+$/).withMessage('Position can only contain letters, numbers, and spaces')
    .trim().withMessage('Position must not contain leading or trailing spaces')
];

export const validateEmployeeUpdate = [
    check('name')
    .isString().withMessage('Name must be a valid string')
    .trim().withMessage('Name must not contain leading or trailing spaces')
    .isLength({ min: 3, max: 100 }).withMessage('Name must be between 3 and 100 characters long')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain letters and spaces'),

  check('email')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail().withMessage('Email must be normalized to a standard format'),

  check('contact')
    .isNumeric().withMessage('Contact must only contain numeric digits')
    .isLength({ min: 11, max: 11 }).withMessage('Contact must be exactly 11 digits long')
    .matches(/^\d{11}$/).withMessage('Contact must contain only numeric characters'),

  check('position')
    .isString().withMessage('Position must be a valid string')
    .isLength({ min: 3, max: 100 }).withMessage('Position must be between 3 and 100 characters long')
    .matches(/^[a-zA-Z0-9\s]+$/).withMessage('Position can only contain letters, numbers, and spaces')
    .trim().withMessage('Position must not contain leading or trailing spaces'),
];

export const validateEmployeePatch = [
    check('name')
    .optional()
    .isString().withMessage('Name must be a valid string')
    .trim().withMessage('Name must not contain leading or trailing spaces')
    .isLength({ min: 3, max: 100 }).withMessage('Name must be between 3 and 100 characters long')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain letters and spaces'),

  check('email')
    .optional()
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail().withMessage('Email must be normalized to a standard format'),

  check('contact')
    .optional()
    .isNumeric().withMessage('Contact must only contain numeric digits')
    .isLength({ min: 11, max: 11 }).withMessage('Contact must be exactly 11 digits long')
    .matches(/^\d{11}$/).withMessage('Contact must contain only numeric characters'),

  check('position')
    .optional()
    .isString().withMessage('Position must be a valid string')
    .isLength({ min: 3, max: 100 }).withMessage('Position must be between 3 and 100 characters long')
    .matches(/^[a-zA-Z0-9\s]+$/).withMessage('Position can only contain letters, numbers, and spaces')
    .trim().withMessage('Position must not contain leading or trailing spaces'),
];


