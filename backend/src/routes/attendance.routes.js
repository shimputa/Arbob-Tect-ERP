import express from 'express';
import {
    markAttendance,
    getAttendanceReport,
    // updateAttendance
} from '../controllers/attendance.controller.js';
import { validateAttendance, validateGetAttendanceReport } from '../validators/attendance.validator.js';
import { handleValidationErrors } from '../middlewares/validation.middleware.js';
import { authenticate, hasPermission } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// Mark attendance for multiple employees
router.post('/mark', 
  hasPermission('attendance:create'),
  validateAttendance, 
  handleValidationErrors, 
  markAttendance
);

// Get attendance report (monthly)
router.get('/report', 
  hasPermission('attendance:view'),
  validateGetAttendanceReport, 
  handleValidationErrors, 
  getAttendanceReport
);

// Update attendance status
// router.patch('/:id', hasPermission('attendance:edit'), validateAttendance, handleValidationErrors, updateAttendance);

export default router;
