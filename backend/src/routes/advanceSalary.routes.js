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

const router = express.Router();

// Base URL: /api/salary/advances
router.get('/', getAllAdvances);
router.get('/filter', filterAdvances);
router.get('/:id', getAdvanceById);
router.post('/', 
  validateAdvanceCreation, 
  handleValidationErrors, 
  createAdvance
);

router.put('/:id', 
  validateAdvanceUpdate, 
  handleValidationErrors, 
  updateAdvance
);
router.patch('/:id', 
  validateAdvancePatch, 
  handleValidationErrors, 
  updateAdvance
);

router.delete('/:id', deleteAdvance);

export default router;