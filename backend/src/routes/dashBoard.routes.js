import express from 'express';
import { getDashboardStats } from '../controllers/dashBoard.controller.js';
import { validateDashboardRequest } from '../validators/dashBoard.validation.js';
import { handleValidationErrors } from '../middlewares/validation.middleware.js';
import { authenticate, hasPermission, filterDashboardAccess } from '../middlewares/auth.middleware.js';

const router = express.Router();

// GET /api/dashboard
router.get(
  '/',
  authenticate,
  hasPermission('dashboard:view'),
  // filterDashboardAccess,
  validateDashboardRequest,
  handleValidationErrors,
  getDashboardStats
);

export default router;