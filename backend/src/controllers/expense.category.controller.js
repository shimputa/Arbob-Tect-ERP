
import { prisma } from '../config/db.js';

// Get all expense categories
export const getAllExpenseCategories = async (req, res) => {
  try {
    const categories = await prisma.expenseCategory.findMany();
    if (categories.length === 0) {
      return res.status(404).json({ message: 'No expense categories found' });
    }
    res.status(200).json({
      message: "Expense categories retrieved successfully",
      categories
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a single expense category by ID
export const getExpenseCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await prisma.expenseCategory.findUnique({
      where: { id: Number(id) },
    });
    if (!category) {
      return res.status(404).json({ message: `Expense category with ID ${id} not found` });
    }
    res.status(200).json({
      message: `Expense category with ID ${id} retrieved successfully`,
      category
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new expense category
export const createExpenseCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Check if a category with the same name already exists
    const existingCategory = await prisma.expenseCategory.findUnique({
      where: { name: name }
    });

    if (existingCategory) {
      return res.status(400).json({ message: 'An expense category with this name already exists' });
    }

    // If no existing category, create a new one
    const category = await prisma.expenseCategory.create({
      data: { name, description },
    });

    res.status(201).json({
      message: "Expense category created successfully",
      category,
    });
  } catch (error) {
    if (error.code === 'P2002') {
      // Prisma unique constraint violation (for name)
      return res.status(400).json({ message: 'Category name already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update an expense category
export const updateExpenseCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await prisma.expenseCategory.update({
      where: { id: Number(id) },
      data: { name, description },
    });

    res.status(200).json({
      message: `Expense category with ID ${id} updated successfully`,
      category
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: `Expense category with ID ${id} not found` });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Patch method for updating expense category
export const patchExpenseCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No fields provided for update" });
    }

    const updatedCategory = await prisma.expenseCategory.update({
      where: { id: Number(id) },
      data: updateData,
    });

    res.status(200).json({
      message: `Expense category with ID ${id} updated successfully`,
      category: updatedCategory,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: `Expense category with ID ${id} not found` });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/// Soft delete expense category by setting status to 0 (inactive)
export const softDeleteExpenseCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await prisma.expenseCategory.findUnique({ where: { id: Number(id) } });

    if (!category) {
      return res.status(404).json({ message: `Expense category with ID ${id} not found` });
    }

    const updatedCategory = await prisma.expenseCategory.update({
      where: { id: Number(id) },
      data: { status: 0 }  // Set status to 0 for inactive
    });

    res.status(200).json({
      message: `Expense category with ID ${id} deactivated successfully`,
      category: updatedCategory
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};