import { body, query } from 'express-validator';

export const validateAttendance = [
    body('date')
        .isISO8601()
        .withMessage('Invalid date format'),
    
    body('attendanceData')
        .isArray()
        .withMessage('Attendance data must be an array'),
    
    body('attendanceData.*.employeeId')
        .isInt()
        .withMessage('Employee ID must be an integer'),
    
    body('attendanceData.*.status')
        .isIn(['PRESENT', 'ABSENT', 'ONLEAVE'])
        .withMessage('Invalid attendance status'),
];

export const validateGetAttendanceReport = [
    query('year')
        .isInt({ min: 2000, max: 2100 })
        .withMessage('Year must be an integer between 2000 and 2100'),
    
    query('month')
        .isInt({ min: 1, max: 12 })
        .withMessage('Month must be an integer between 1 and 12'),
    
    // query('employeeId')
    //     .optional()
    //     .isInt()
        // .withMessage('Employee ID must be an integer if provided'),
];
