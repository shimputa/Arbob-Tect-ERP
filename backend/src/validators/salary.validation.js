import { check } from 'express-validator';

export const validateSalaryCreation = [
  check('employee')
    .notEmpty().withMessage('Employee name is required')
    .isString().withMessage('Employee name must be a valid string')
    .trim().withMessage('Employee name must not contain leading or trailing spaces'),
  
  check('month')
    .notEmpty().withMessage('Month is required')
    .isString().withMessage('Month must be a valid string')
    .isIn([
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]).withMessage('Month must be a valid month name'),
  
  check('year')
    .notEmpty().withMessage('Year is required')
    .isInt({ min: 2000, max: 2100 }).withMessage('Year must be a valid year between 2000 and 2100')
    .toInt(),
  
  check('bonus')
    .optional({ nullable: true })
    .isFloat({ min: 0 }).withMessage('Bonus must be a positive number or zero')
    .toFloat(),
  
  check('projectBonusShare')
    .optional({ nullable: true })
    .isFloat({ min: 0 }).withMessage('Project bonus share must be a positive number or zero')
    .toFloat(),
  
  check('advanceSalary')
    .optional({ nullable: true })
    .isFloat({ min: 0 }).withMessage('Advance salary must be a positive number or zero')
    .toFloat(),
  
  check('advancePayment')
    .optional({ nullable: true })
    .isFloat({ min: 0 }).withMessage('Advance payment must be a positive number or zero')
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.advanceSalary !== undefined && value > req.body.advanceSalary) {
        throw new Error('Advance payment cannot be greater than total advance salary');
      }
      return true;
    }),
  
  check('basicSalary')
    .notEmpty().withMessage('Basic salary is required')
    .isFloat({ min: 0 }).withMessage('Basic salary must be a positive number')
    .toFloat(),
  
  check('totalBonus')
    .notEmpty().withMessage('Total bonus is required')
    .isFloat({ min: 0 }).withMessage('Total bonus must be a positive number or zero')
    .toFloat(),
  
  check('totalDeduction')
    .notEmpty().withMessage('Total deduction is required')
    .isFloat({ min: 0 }).withMessage('Total deduction must be a positive number or zero')
    .toFloat(),
  
  check('netSalary')
    .notEmpty().withMessage('Net salary is required')
    .isFloat().withMessage('Net salary must be a valid number')
    .toFloat(),
  
  check('paymentMethod')
    .notEmpty().withMessage('Payment method is required')
    .isString().withMessage('Payment method must be a string')
    .isIn(['Bank Transfer', 'Cash', 'Easypaisa']).withMessage('Payment method must be Bank Transfer, Cash, or Easypaisa'),
  
  check('status')
    .notEmpty().withMessage('Status is required')
    .isString().withMessage('Status must be a string')
    .isIn(['Paid', 'Unpaid']).withMessage('Status must be either Paid or Unpaid')
];

export const validateSalaryUpdate = [
  check('employee')
    .notEmpty().withMessage('Employee name is required')
    .isString().withMessage('Employee name must be a valid string')
    .trim().withMessage('Employee name must not contain leading or trailing spaces'),
  
  check('month')
    .notEmpty().withMessage('Month is required')
    .isString().withMessage('Month must be a valid string')
    .isIn([
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]).withMessage('Month must be a valid month name'),
  
  check('year')
    .notEmpty().withMessage('Year is required')
    .isInt({ min: 2000, max: 2100 }).withMessage('Year must be a valid year between 2000 and 2100')
    .toInt(),
  
  check('bonus')
    .optional({ nullable: true })
    .isFloat({ min: 0 }).withMessage('Bonus must be a positive number or zero')
    .toFloat(),
  
  check('advanceSalary')
    .optional({ nullable: true })
    .isFloat({ min: 0 }).withMessage('Advance salary must be a positive number or zero')
    .toFloat(),
  
  check('advancePayment')
    .optional({ nullable: true })
    .isFloat({ min: 0 }).withMessage('Advance payment must be a positive number or zero')
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.advanceSalary !== undefined && value > req.body.advanceSalary) {
        throw new Error('Advance payment cannot be greater than total advance salary');
      }
      return true;
    }),
  
  check('basicSalary')
    .notEmpty().withMessage('Basic salary is required')
    .isFloat({ min: 0 }).withMessage('Basic salary must be a positive number')
    .toFloat(),
  
  check('totalBonus')
    .notEmpty().withMessage('Total bonus is required')
    .isFloat({ min: 0 }).withMessage('Total bonus must be a positive number or zero')
    .toFloat(),
  
  check('totalDeduction')
    .notEmpty().withMessage('Total deduction is required')
    .isFloat({ min: 0 }).withMessage('Total deduction must be a positive number or zero')
    .toFloat(),
  
  check('netSalary')
    .notEmpty().withMessage('Net salary is required')
    .isFloat().withMessage('Net salary must be a valid number')
    .toFloat(),
  
  check('paymentMethod')
    .notEmpty().withMessage('Payment method is required')
    .isString().withMessage('Payment method must be a string')
    .isIn(['Bank Transfer', 'Cash', 'Easypaisa']).withMessage('Payment method must be Bank Transfer, Cash, or Easypaisa'),
  
  check('status')
    .notEmpty().withMessage('Status is required')
    .isString().withMessage('Status must be a string')
    .isIn(['Paid', 'Unpaid']).withMessage('Status must be either Paid or Unpaid')
];

export const validateSalaryPatch = [
  check('employee')
    .optional()
    .isString().withMessage('Employee name must be a valid string')
    .trim().withMessage('Employee name must not contain leading or trailing spaces'),
  
  check('month')
    .optional()
    .isString().withMessage('Month must be a valid string')
    .isIn([
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]).withMessage('Month must be a valid month name'),
  
  check('year')
    .optional()
    .isInt({ min: 2000, max: 2100 }).withMessage('Year must be a valid year between 2000 and 2100')
    .toInt(),
  
  check('bonus')
    .optional()
    .isFloat({ min: 0 }).withMessage('Bonus must be a positive number or zero')
    .toFloat(),
  
  check('advanceSalary')
    .optional()
    .isFloat({ min: 0 }).withMessage('Advance salary must be a positive number or zero')
    .toFloat(),
  
  check('advancePayment')
    .optional()
    .isFloat({ min: 0 }).withMessage('Advance payment must be a positive number or zero')
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.advanceSalary !== undefined && value > req.body.advanceSalary) {
        throw new Error('Advance payment cannot be greater than total advance salary');
      }
      return true;
    }),
  
  check('basicSalary')
    .optional()
    .isFloat({ min: 0 }).withMessage('Basic salary must be a positive number')
    .toFloat(),
  
  check('totalBonus')
    .optional()
    .isFloat({ min: 0 }).withMessage('Total bonus must be a positive number or zero')
    .toFloat(),
  
  check('totalDeduction')
    .optional()
    .isFloat({ min: 0 }).withMessage('Total deduction must be a positive number or zero')
    .toFloat(),
  
  check('netSalary')
    .optional()
    .isFloat().withMessage('Net salary must be a valid number')
    .toFloat(),
  
  check('paymentMethod')
    .optional()
    .isString().withMessage('Payment method must be a string')
    .isIn(['Bank Transfer', 'Cash', 'Easypaisa']).withMessage('Payment method must be Bank Transfer, Cash, or Easypaisa'),
  
  check('status')
    .optional()
    .isString().withMessage('Status must be a string')
    .isIn(['Paid', 'Unpaid']).withMessage('Status must be either Paid or Unpaid')
];

// Validation for project bonus retrieval endpoint
export const validateProjectBonusRetrieval = [
  check('employeeId')
    .notEmpty().withMessage('Employee ID is required')
    .isInt().withMessage('Employee ID must be a valid integer')
    .toInt(),
  
  check('month')
    .notEmpty().withMessage('Month is required')
    .isString().withMessage('Month must be a valid string')
    .isIn([
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]).withMessage('Month must be a valid month name'),
  
  check('year')
    .notEmpty().withMessage('Year is required')
    .isInt({ min: 2000, max: 2100 }).withMessage('Year must be a valid year between 2000 and 2100')
    .toInt()
];

// Validation for remaining advance salary retrieval
export const validateAdvanceSalaryRetrieval = [
  check('employeeId')
    .notEmpty().withMessage('Employee ID is required')
    .isInt().withMessage('Employee ID must be a valid integer')
    .toInt()
];

// Validation for filtering salaries
export const validateSalaryFilter = [
  check('month')
    .optional()
    .isString().withMessage('Month must be a valid string')
    .isIn([
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]).withMessage('Month must be a valid month name'),
  
  check('year')
    .optional()
    .isInt({ min: 2000, max: 2100 }).withMessage('Year must be a valid year between 2000 and 2100')
    .toInt(),
  
  check('employeeName')
    .optional()
    .isString().withMessage('Employee name must be a valid string')
    .trim(),
  
  check('status')
    .optional()
    .isString().withMessage('Status must be a string')
    .isIn(['Paid', 'Unpaid']).withMessage('Status must be either Paid or Unpaid'),
  
  check('paymentMethod')
    .optional()
    .isString().withMessage('Payment method must be a string')
    .isIn(['Bank Transfer', 'Cash', 'Easypaisa']).withMessage('Payment method must be Bank Transfer, Cash, or Easypaisa'),
  
  check('active')
    .optional()
    .isInt({ min: 0, max: 1 }).withMessage('Active status must be 0 or 1')
    .toInt()
]; 