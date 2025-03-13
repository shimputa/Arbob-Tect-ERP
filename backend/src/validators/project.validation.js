import { check } from 'express-validator';

// Validate project creation
export const validateProjectCreation = [
  check('projectName')
    .notEmpty().withMessage('Project name is required')
    .isString().withMessage('Project name must be a valid string')
    .trim().withMessage('Project name must not contain leading or trailing spaces')
    .isLength({ min: 3, max: 100 }).withMessage('Project name must be between 3 and 100 characters long'),

  check('ownerName')
    .notEmpty().withMessage('Owner name is required')
    .isString().withMessage('Owner name must be a valid string')
    .trim().withMessage('Owner name must not contain leading or trailing spaces')
    .isLength({ min: 3, max: 100 }).withMessage('Owner name must be between 3 and 100 characters long'),

  check('ownerEmail')
    .notEmpty().withMessage('Owner email is required')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail().withMessage('Email must be normalized to a standard format'),

  check('ownerNumber')
    .notEmpty().withMessage('Owner number is required')
    .isString().withMessage('Owner number must be a valid string')
    .matches(/^[0-9+\s-]+$/).withMessage('Owner number can only contain digits, +, -, and spaces'),

  check('startDate')
    .notEmpty().withMessage('Start date is required')
    .isISO8601().withMessage('Start date must be a valid date'),

  check('endDate')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601().withMessage('End date must be a valid date')
    .custom((endDate, { req }) => {
      if (endDate && endDate !== '' && new Date(endDate) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),

  check('amount')
    .notEmpty().withMessage('Amount is required')
    .isFloat({ min: 0 }).withMessage('Amount must be a positive number'),

  check('tax')
    .notEmpty().withMessage('Tax is required')
    .isFloat({ min: 0 }).withMessage('Tax must be a positive number'),

  check('paidAmount')
    .notEmpty().withMessage('Paid amount is required')
    .isFloat({ min: 0 }).withMessage('Paid amount must be a positive number'),

  check('platform')
    .notEmpty().withMessage('Platform is required')
    .isIn(['upwork', 'fiver', 'linkedin', 'whatsapp', 'other']).withMessage('Invalid platform'),

  check('projectStatus')
    .notEmpty().withMessage('Project status is required')
    .isIn(['ongoing', 'complete']).withMessage('Invalid project status'),

  check('paidStatus')
    .notEmpty().withMessage('Paid status is required')
    .isIn(['not paid', 'partial', 'paid']).withMessage('Invalid paid status'),

  check('collaborators')
    .optional()
    .isString().withMessage('Collaborators must be a valid string')
];

// Validate project update
export const validateProjectUpdate = [
  check('projectName')
    .isString().withMessage('Project name must be a valid string')
    .trim().withMessage('Project name must not contain leading or trailing spaces')
    .isLength({ min: 3, max: 100 }).withMessage('Project name must be between 3 and 100 characters long'),

  check('ownerName')
    .isString().withMessage('Owner name must be a valid string')
    .trim().withMessage('Owner name must not contain leading or trailing spaces')
    .isLength({ min: 3, max: 100 }).withMessage('Owner name must be between 3 and 100 characters long'),

  check('ownerEmail')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail().withMessage('Email must be normalized to a standard format'),

  check('ownerNumber')
    .isString().withMessage('Owner number must be a valid string')
    .matches(/^[0-9+\s-]+$/).withMessage('Owner number can only contain digits, +, -, and spaces'),

  check('startDate')
    .isISO8601().withMessage('Start date must be a valid date'),

  check('endDate')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601().withMessage('End date must be a valid date')
    .custom((endDate, { req }) => {
      if (endDate && endDate !== '' && new Date(endDate) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),

  check('amount')
    .isFloat({ min: 0 }).withMessage('Amount must be a positive number'),

  check('tax')
    .isFloat({ min: 0 }).withMessage('Tax must be a positive number'),

  check('paidAmount')
    .isFloat({ min: 0 }).withMessage('Paid amount must be a positive number'),

  check('platform')
    .isIn(['upwork', 'fiver', 'linkedin', 'whatsapp', 'other']).withMessage('Invalid platform'),

  check('projectStatus')
    .isIn(['ongoing', 'complete']).withMessage('Invalid project status'),

  check('paidStatus')
    .isIn(['not paid', 'partial', 'paid']).withMessage('Invalid paid status'),

  check('collaborators')
    .optional()
    .isString().withMessage('Collaborators must be a valid string')
];

// Validate project filtering
export const validateProjectFilter = [
  check('status')
    .optional()
    .isIn(['ONGOING', 'COMPLETE', 'ongoing', 'complete']).withMessage('Invalid project status'),

  check('platform')
    .optional()
    .isIn(['UPWORK', 'FIVER', 'LINKEDIN', 'WHATSAPP', 'OTHER', 'upwork', 'fiver', 'linkedin', 'whatsapp', 'other']).withMessage('Invalid platform'),

  check('search')
    .optional()
    .isString().withMessage('Search term must be a string')
    .trim().withMessage('Search term must not contain leading or trailing spaces')
];
