import express from 'express';
import {
  getAllAdvances,
  getAdvanceById,
  createAdvance,
  updateAdvance,
  deleteAdvance,
  filterAdvances
} from '../controllers/advanceSalary.controller.js';

import {
  validateAdvanceCreation,
  validateAdvanceUpdate,
  validateAdvancePatch
} from '../validators/advanceSalary.validation.js';
import { handleValidationErrors } from '../middlewares/validation.middleware.js';
import { authenticate, hasPermission } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// Base URL: /api/salary/advances
router.get('/', hasPermission('advance:view'), getAllAdvances);
router.get('/filter', hasPermission('advance:view'), filterAdvances);
router.get('/:id', hasPermission('advance:view'), getAdvanceById);
router.post('/', 
  hasPermission('advance:create'),
  validateAdvanceCreation, 
  handleValidationErrors, 
  createAdvance
);

router.put('/:id', 
  hasPermission('advance:edit'),
  validateAdvanceUpdate, 
  handleValidationErrors, 
  updateAdvance
);
router.patch('/:id', 
  hasPermission('advance:edit'),
  validateAdvancePatch, 
  handleValidationErrors, 
  updateAdvance
);

router.delete('/:id', hasPermission('advance:delete'), deleteAdvance);

export default router;