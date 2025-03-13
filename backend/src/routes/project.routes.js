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

const router = express.Router();

// Define project routes
router.get('/projects', getAllProjects);
router.get('/project/:id', getProjectById);
router.get('/filter', validateProjectFilter, handleValidationErrors, filterProjects);
router.post('/projects', validateProjectCreation, handleValidationErrors, createProject);
router.put('/project/:id', validateProjectUpdate, handleValidationErrors, updateProject);
router.delete('/project/:id', deleteProject);

export default router;
