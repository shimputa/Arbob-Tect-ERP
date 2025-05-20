import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { authenticate } from './middlewares/auth.middleware.js';
import { authLimiter, apiLimiter} from './middlewares/rateLimiter.middleware.js';
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

// Security middleware
app.use(helmet());
// Enable CORS
app.use(cors({
  origin: '*',
  credentials: true
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiters
// Public routes (no authentication needed)
app.use('/auth',authLimiter,authRoutes);


// Apply authentication to all other routes
app.use(authenticate);

// Protected routes with rate limiting
app.use('/api', apiLimiter, employeeRoutes);
app.use('/expense', apiLimiter, expenseRoutes);
app.use('/expense-categories', apiLimiter, expenseCategoryRoutes);
app.use('/salary', apiLimiter, salaryRoutes);
app.use('/attendance', apiLimiter, attendanceRoutes);
app.use('/dashboard', apiLimiter, dashBoardRoutes);
app.use('/project', apiLimiter, projectRoutes);
app.use('/advance-salary', apiLimiter, advanceSalaryRoutes);
app.use('/users', apiLimiter, userRoutes);

export default app;
