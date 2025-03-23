import { prisma } from '../config/db.js';

// Get all advance salary records
export const getAllAdvances = async (req, res) => {
  try {
    const advances = await prisma.advanceSalary.findMany({
      where: {
        status: 1  // Only active records
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
            position: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const formattedAdvances = advances.map(advance => ({
      id: advance.id,
      employeeId: advance.employeeId,
      employeeName: advance.employee.name,
      amount: advance.amount,
      remainingAmount: advance.remainingAmount,
      date: advance.date,
      description: advance.description,
      status: advance.status,
      createdAt: advance.createdAt
    }));

    res.status(200).json({
      message: "Advance salary records retrieved successfully",
      advances: formattedAdvances
    });
  } catch (error) {
    console.error('Error retrieving advance records:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get advance by ID
export const getAdvanceById = async (req, res) => {
  try {
    const { id } = req.params;

    const advance = await prisma.advanceSalary.findUnique({
      where: { 
        id: Number(id),
        status: 1
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    if (!advance) {
      return res.status(404).json({ 
        message: `Advance record with ID ${id} not found` 
      });
    }

    const formattedAdvance = {
      id: advance.id,
      employeeId: advance.employeeId,
      employeeName: advance.employee.name,
      amount: advance.amount,
      remainingAmount: advance.remainingAmount,
      date: advance.date,
      description: advance.description,
      status: advance.status,
      createdAt: advance.createdAt
    };

    res.status(200).json({
      message: "Advance record retrieved successfully",
      advance: formattedAdvance
    });
  } catch (error) {
    console.error('Error retrieving advance record:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Create new advance salary record
export const createAdvance = async (req, res) => {
  try {
    const { 
      employeeId, 
      amount, 
      date, 
      description 
    } = req.body;

    // Validate input
    if (!employeeId || !amount || !date) {
      return res.status(400).json({
        message: "Employee ID, amount, and date are required"
      });
    }

    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: Number(employeeId) }
    });

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found"
      });
    }

    // Create advance record
    const advance = await prisma.advanceSalary.create({
      data: {
        employeeId: Number(employeeId),
        amount: parseFloat(amount),
        remainingAmount: parseFloat(amount), // Initially same as amount
        date: new Date(date),
        description: description || "",
        status: 1 // Active
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    const formattedAdvance = {
      ...advance
        };

    res.status(201).json({
      message: "Advance salary record created successfully",
      advance: formattedAdvance
    });
  } catch (error) {
    console.error('Error creating advance record:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Update advance salary record
export const updateAdvance = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      employeeId, 
      amount, 
      remainingAmount,
      date, 
      description 
    } = req.body;

    // Validate input
    if (!employeeId || amount === undefined || !date) {
      return res.status(400).json({
        message: "Employee ID, amount, and date are required"
      });
    }

    // Check if advance exists
    const existingAdvance = await prisma.advanceSalary.findUnique({
      where: { id: Number(id) }
    });

    if (!existingAdvance) {
      return res.status(404).json({
        message: `Advance record with ID ${id} not found`
      });
    }

    // Calculate new remaining amount if not provided
    const newRemainingAmount = remainingAmount !== undefined 
      ? parseFloat(remainingAmount)
      : parseFloat(amount);

    // Validate remaining amount
    if (newRemainingAmount > parseFloat(amount)) {
      return res.status(400).json({
        message: "Remaining amount cannot be greater than total amount"
      });
    }

    // Update advance record
    const updatedAdvance = await prisma.advanceSalary.update({
      where: { id: Number(id) },
      data: {
        employeeId: Number(employeeId),
        amount: parseFloat(amount),
        remainingAmount: newRemainingAmount,
        date: new Date(date),
        description: description || "",
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    const formattedAdvance = {
      ...updatedAdvance,
    };

    res.status(200).json({
      message: "Advance salary record updated successfully",
      advance: formattedAdvance
    });
  } catch (error) {
    console.error('Error updating advance record:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Soft delete advance salary record
export const deleteAdvance = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if advance exists
    const advance = await prisma.advanceSalary.findUnique({
      where: { id: Number(id) }
    });

    if (!advance) {
      return res.status(404).json({
        message: `Advance record with ID ${id} not found`
      });
    }

    // Soft delete by updating status
    await prisma.advanceSalary.update({
      where: { id: Number(id) },
      data: { status: 0 }  // Inactive
    });

    res.status(200).json({
      message: "Advance salary record deleted successfully"
    });
  } catch (error) {
    console.error('Error deleting advance record:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Filter advances
export const filterAdvances = async (req, res) => {
  try {
    const { employeeName, startDate, endDate, status } = req.query;

    let whereClause = {
      status: 1  // Default to active records
    };

    if (employeeName) {
      whereClause.employee = {
        name: {
          contains: employeeName,
          mode: 'insensitive'
        }
      };
    }

    if (startDate && endDate) {
      whereClause.date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    if (status) {
      whereClause.status = Number(status);
    }

    const advances = await prisma.advanceSalary.findMany({
      where: whereClause,
      include: {
        employee: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    const formattedAdvances = advances.map(advance => ({
      id: advance.id,
      employeeId: advance.employeeId,
      employeeName: advance.employee.name,
      amount: advance.amount,
      remainingAmount: advance.remainingAmount,
      date: advance.date,
      description: advance.description,
      status: advance.status
    }));

    res.status(200).json({
      message: "Filtered advance records retrieved successfully",
      advances: formattedAdvances
    });
  } catch (error) {
    console.error('Error filtering advance records:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};