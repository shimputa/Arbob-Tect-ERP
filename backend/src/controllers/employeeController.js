// controllers/employeeController.js
import { prisma } from '../config/db.js';

// 1. Get all employees
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await prisma.employee.findMany();
    if (employees.length === 0) {
      return res.status(404).json({ message: 'No employees found' });
    }
    res.status(201).json({
      message: "Employees retrieved successfully",
      employees
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 2. Get a single employee by ID
export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await prisma.employee.findUnique({
      where: { id: Number(id) },
    });
    if (!employee) {
      return res.status(404).json({ message: `Employee with ID ${id} not found` });
    }
    res.status(200).json({
      message: `Employee with ID ${id} retrieved successfully`,
      employee
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 3. Create a new employee
export const createEmployee = async (req, res) => {
  try {
    const { name, contact, email, position } = req.body;

    // Validate required fields
    if (!name || !contact || !email || !position) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const employee = await prisma.employee.create({
      data: { name, contact, email, position },
    });
    res.status(201).json({
      message: "Employee created successfully",
      employee,
    });
  } catch (error) {
    if (error.code === 'P2002') {
      // Prisma unique constraint violation (for email)
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 4. Update an employee
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact, email, position } = req.body;

    const employee = await prisma.employee.update({
      where: { id: Number(id) },
      data: { name, contact, email, position },
    });

    res.status(200).json({
      message: `Employee with ID ${id} updated successfully`,
      employee
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: `Employee with ID ${id} not found` });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Soft delete employee by setting status to 0 (inactive)
export const softDeleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the employee
    const employee = await prisma.employee.findUnique({ where: { id: Number(id) } });

    if (!employee) {
      return res.status(404).json({ message: `Employee with ID ${id} not found` });
    }

    // Update the employee's status to 0 (inactive)
    const updatedEmployee = await prisma.employee.update({
      where: { id: Number(id) },
      data: { status: 0 }  // Set status to inactive
    });

    res.status(200).json({
      message: `Employee with ID ${id} deactivated successfully`,
      employee: updatedEmployee
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
 
//get only active employees
export const getActiveEmployees = async (req, res) => {
  try {
    const activeEmployees = await prisma.employee.findMany({
      where: { status: 1 }  // Only fetch active employees
    });

    res.status(200).json({
      message: "Active employees retrieved successfully",
      employees: activeEmployees
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// get inactive employees
export const getInactiveEmployees = async (req, res) => {
  try {
    const inactiveEmployees = await prisma.employee.findMany({
      where: { status: 0 }  // Only fetch inactive employees
    });

    res.status(200).json({
      message: "Inactive employees retrieved successfully",
      employees: inactiveEmployees
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


