import { query } from 'express-validator';

export const validateDashboardRequest = [
  query('year')
    .optional()
    .isInt({ min: 2000, max: 2100 })
    .withMessage('Year must be a valid year between 2000-2100'),
  
  query('month')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('Month must be between 1-12')
];