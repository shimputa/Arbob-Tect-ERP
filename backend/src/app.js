import express from 'express';
import cors from 'cors';
import employeeRoutes from './routes/employee.routes.js';
import expenseRoutes from './routes/expense.routes.js';
import expenseCategoryRoutes from './routes/expenseCategory.routes.js';
import salaryRoutes from './routes/salary.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import dashBoardRoutes from './routes/dashBoard.routes.js';
import projectRoutes from './routes/project.routes.js'; 

const app = express();

// Enable CORS
app.use(cors({
  origin: '*',
  credentials: true
}));

// Parse incoming JSON and URL-encoded payloads
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ limit: '18kb', extended: true }));

// Routes
app.use('/dashboard', dashBoardRoutes);  // Prefix with '/api' for all dashboard routes
app.use('/api', employeeRoutes);  // Prefix with '/api' for all employee routes
app.use('/expense', expenseRoutes);  // Prefix with '/api' for all expense routes
app.use('/expense-categories', expenseCategoryRoutes);  // Prefix with '/api' for all expense category routes
app.use('/salary', salaryRoutes);  // Prefix with '/api' for all salary routes
app.use('/attendance', attendanceRoutes);  // Prefix with '/api' for all attendance routes
app.use('/project', projectRoutes); 
export default app;
