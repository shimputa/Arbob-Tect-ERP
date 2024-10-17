import express from 'express';
import cors from 'cors';
import employeeRoutes from './routes/employee.routes.js';
import expenseCategoryRoutes from './routes/expenseCategory.routes.js';

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
app.use('/api', employeeRoutes);  // Prefix with '/api' for all employee routes
app.use('/expense-categories', expenseCategoryRoutes);  // Prefix with '/api' for all expense category routes
// app.use('/api/employees', employeeRoutes); // Employee routes
// app.use('/api/expenses', expenseRoutes);  // Expense routes

export default app;
