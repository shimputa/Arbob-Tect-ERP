import express from 'express';
import cors from 'cors';
import { authenticate } from './middlewares/auth.middleware.js';
import employeeRoutes from './routes/employee.routes.js';
import expenseRoutes from './routes/expense.routes.js';
import expenseCategoryRoutes from './routes/expenseCategory.routes.js';
import salaryRoutes from './routes/salary.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import dashBoardRoutes from './routes/dashBoard.routes.js';
import projectRoutes from './routes/project.routes.js'; 
import advanceSalaryRoutes from './routes/advanceSalary.routes.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express();

// Enable CORS
app.use(cors({
  origin: '*',
  credentials: true
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Public routes (no authentication needed)
app.use('/auth', authRoutes);

// Apply authentication to all other routes
app.use(authenticate);

// Protected routes
app.use('/api', employeeRoutes);
app.use('/expense', expenseRoutes);
app.use('/expense-categories', expenseCategoryRoutes);
app.use('/salary', salaryRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/dashboard', dashBoardRoutes);
app.use('/project', projectRoutes);
app.use('/advance-salary', advanceSalaryRoutes);
app.use('/users', userRoutes);

export default app;
