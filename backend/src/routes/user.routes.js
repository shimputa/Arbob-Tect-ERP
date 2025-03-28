import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/user.controller.js';
import { 
  validateUserCreation, 
  validateUserUpdate,
} from '../validators/user.validation.js';
import { handleValidationErrors } from '../middlewares/validation.middleware.js';
import { authenticate, hasPermission } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

router.post('/', hasPermission('user:create'), validateUserCreation, handleValidationErrors, createUser);
router.delete('/:id', hasPermission('user:delete'), deleteUser);
router.get('/', hasPermission('user:view'), getAllUsers);
router.get('/:id', hasPermission('user:view'), getUserById);
router.put('/:id', hasPermission('user:edit'), validateUserUpdate, handleValidationErrors, updateUser);

export default router;