import express from 'express';
import { login, getCurrentUser } from '../controllers/auth.controller.js';
import { validateLogin } from '../validators/auth.validation.js';
import { handleValidationErrors } from '../middlewares/validation.middleware.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/login', validateLogin, handleValidationErrors, login);

router.get('/me', authenticate, getCurrentUser);

export default router; 