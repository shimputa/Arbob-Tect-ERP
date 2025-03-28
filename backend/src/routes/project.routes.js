import express from 'express';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  filterProjects
} from '../controllers/project.controller.js';

import {
  validateProjectCreation,
  validateProjectUpdate,
  validateProjectFilter
} from '../validators/project.validation.js';
import { handleValidationErrors } from '../middlewares/validation.middleware.js';
import { authenticate, hasPermission } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// Define project routes
router.get('/projects', hasPermission('project:view'), getAllProjects);
router.get('/project/:id', hasPermission('project:view'), getProjectById);
router.get('/filter', hasPermission('project:view'), validateProjectFilter, handleValidationErrors, filterProjects);
router.post('/projects', hasPermission('project:create'), validateProjectCreation, handleValidationErrors, createProject);
router.put('/project/:id', hasPermission('project:edit'), validateProjectUpdate, handleValidationErrors, updateProject);
router.delete('/project/:id', hasPermission('project:delete'), deleteProject);

export default router;
