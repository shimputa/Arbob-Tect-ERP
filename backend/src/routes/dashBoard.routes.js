import express from 'express';
import { getDashboardStats } from '../controllers/dashBoard.controller.js';
import { validateDashboardRequest } from '../validators/dashBoard.validation.js';
import { handleValidationErrors } from '../middlewares/validation.middleware.js';

const router = express.Router();

// GET /api/dashboard
router.get(
  '/',
  validateDashboardRequest,
  handleValidationErrors,
  getDashboardStats
);

export default router;