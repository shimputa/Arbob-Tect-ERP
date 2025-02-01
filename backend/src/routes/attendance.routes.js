import express from 'express';
import {
    markAttendance,
    getAttendanceReport,
    // updateAttendance
} from '../controllers/attendance.controller.js';
import { validateAttendance, validateGetAttendanceReport } from '../validators/attendance.validator.js';
import { handleValidationErrors } from '../middlewares/validation.middleware.js';

const router = express.Router();

// Mark attendance for multiple employees
router.post('/mark', validateAttendance, handleValidationErrors, markAttendance);

// Get attendance report (monthly)
router.get('/report', validateGetAttendanceReport, handleValidationErrors, getAttendanceReport);

// Update attendance status
// router.patch('/:id', validateAttendance, handleValidationErrors, updateAttendance);

export default router;
