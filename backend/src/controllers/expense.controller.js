import { prisma } from '../config/db.js';

export const getAllExpenses = async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany({
       include: {
        expenseCategory: {
          select: {
            id: true,
            name: true
          }
        }
      },
      where: {
        expenseCategory: {
          status: 1
      }
    }
    });
    if (expenses.length === 0) {
      return res.status(404).json({ message: 'No expenses found' });
    }
    res.status(200).json({
      message: "Expenses retrieved successfully",
      expenses
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await prisma.expense.findUnique({
      where: { id: Number(id) },
      include: {
        expenseCategory: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    if (!expense) {
      return res.status(404).json({ message: `Expense with ID ${id} not found` });
    }
    res.status(200).json({
      message: `Expense with ID ${id} retrieved successfully`,
      expense
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createExpense = async (req, res) => {
  try {
    const { name, expenseCategoryId, currency, total, description, reference } = req.body;

    // Check if the expense category exists and has status 1
    const expenseCategory = await prisma.expenseCategory.findFirst({
      where: {
        id: Number(expenseCategoryId),
        status: 1
      }
    });

    if (!expenseCategory) {
      return res.status(400).json({ message: 'Invalid or inactive expense category ID' });
    }

    const expense = await prisma.expense.create({
      data: { 
        name, 
        expenseCategoryId: Number(expenseCategoryId), 
        currency, 
        total: parseFloat(total), 
        description, 
        reference 
      },
      include: {
        expenseCategory: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    res.status(201).json({
      message: "Expense created successfully",
      expense,
    });
  } catch (error) {
    if (error.code === 'P2003') {
      return res.status(400).json({ message: 'Invalid expense category ID' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, expenseCategoryId, currency, total, description, reference } = req.body;

    const expense = await prisma.expense.update({
      where: { id: Number(id) },
      data: { 
        name, 
        expenseCategoryId: Number(expenseCategoryId), 
        currency, 
        total: parseFloat(total), 
        description, 
        reference 
      },
      include: {
        expenseCategory: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.status(200).json({
      message: `Expense with ID ${id} updated successfully`,
      expense
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: `Expense with ID ${id} not found` });
    }
    if (error.code === 'P2003') {
      return res.status(400).json({ message: 'Invalid expense category ID' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const patchExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.expenseCategoryId) {
      updateData.expenseCategoryId = Number(updateData.expenseCategoryId);
    }
    if (updateData.total) {
      updateData.total = parseFloat(updateData.total);
    }

    const expense = await prisma.expense.update({
      where: { id: Number(id) },
      data: updateData,
      include: {
        expenseCategory: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.status(200).json({
      message: `Expense with ID ${id} patched successfully`,
      expense
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: `Expense with ID ${id} not found` });
    }
    if (error.code === 'P2003') {
      return res.status(400).json({ message: 'Invalid expense category ID' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.expense.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({
      message: `Expense with ID ${id} deleted successfully`,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: `Expense with ID ${id} not found` });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const filterExpenses = async (req, res) => {
  try {
    const { startDate, endDate, minAmount, maxAmount, currency, categoryId } = req.query;

    let whereClause = {};

    if (startDate && endDate) {
      whereClause.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    if (minAmount || maxAmount) {
      whereClause.total = {};
      if (minAmount) whereClause.total.gte = parseFloat(minAmount);
      if (maxAmount) whereClause.total.lte = parseFloat(maxAmount);
    }

    if (currency) {
      whereClause.currency = currency;
    }

    if (categoryId) {
      whereClause.expenseCategoryId = Number(categoryId);
    }

    const expenses = await prisma.expense.findMany({
      where: whereClause,
      include: { expenseCategory: true }
    });

    res.status(200).json({
      message: "Filtered expenses retrieved successfully",
      expenses
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
