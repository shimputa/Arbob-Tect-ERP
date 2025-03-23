import { prisma } from '../config/db.js';

// Helper function to get month number
const getMonthNumber = (monthName) => {
  const months = {
    'january': 0, 'february': 1, 'march': 2, 'april': 3,
    'may': 4, 'june': 5, 'july': 6, 'august': 7,
    'september': 8, 'october': 9, 'november': 10, 'december': 11
  };
  return months[monthName.toLowerCase()];
};

// Get employee's project bonus shares
export const getEmployeeProjectBonuses = async (req, res) => {
  try {
    const { employeeId, month, year } = req.query;

    if (!employeeId || !month || !year) {
      return res.status(400).json({ 
        message: "Employee ID, month, and year are required" 
      });
    }

    // Get start and end date for the month
    const startDate = new Date(parseInt(year), getMonthNumber(month), 1);
    const endDate = new Date(parseInt(year), getMonthNumber(month) + 1, 0);

    // Get completed projects for the employee in this month
    const projectBonuses = await prisma.projectEmployee.findMany({
      where: {
        employeeId: parseInt(employeeId),
        status: 1,
        project: {
          status: 1,
          projectStatus: 'COMPLETE',  // Only get COMPLETE projects
          updatedAt: {               // Project was marked complete in this month
            gte: startDate,
            lte: endDate
          }
        }
      },
      include: {
        project: {
          select: {
            id: true,
            projectName: true,
            bonus: true,
            sharedBonus: true,
            projectStatus: true,
            startDate: true,
            endDate: true,
            updatedAt: true  // When project was marked as complete
          }
        }
      }
    });

    // Calculate total bonus share only from completed projects
    const totalBonusShare = projectBonuses.reduce((total, pb) => 
      total + (pb.bonusShare || 0), 0
    );

    res.status(200).json({
      message: "Project bonuses retrieved successfully",
      projectBonuses: projectBonuses.map(pb => ({
        projectId: pb.project.id,
        projectName: pb.project.projectName,
        projectStatus: pb.project.projectStatus,
        startDate: pb.project.startDate,
        endDate: pb.project.endDate,
        completedDate: pb.project.updatedAt,
        totalBonus: pb.project.bonus,
        sharedBonus: pb.project.sharedBonus,
        bonusShare: pb.bonusShare
      })),
      totalBonusShare,
      month,
      year
    });

  } catch (error) {
    console.error('Error retrieving project bonuses:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Create salary record
export const createSalary = async (req, res) => {
  try {
    const {
      employee,
      month,
      year,
      bonus,
      projectBonusShare,
      advanceSalary,
      advancePayment,
      basicSalary,
      totalBonus,
      totalDeduction,
      netSalary,
      paymentMethod,
      status
    } = req.body;

    // Step 1: Validate employee existence
    const employeeRecord = await findEmployee(employee);
    if (!employeeRecord) {
      return res.status(400).json({ message: 'Employee not found' });
    }

    // Step 2: Check for existing salary record
    const isDuplicate = await checkDuplicateSalary(employeeRecord.id, month, year);
    if (isDuplicate) {
      return res.status(400).json({ 
        message: `A salary record already exists for ${employee} in ${month} ${year}` 
      });
    }

    // Step 3: Get project bonuses for record keeping
    const projectBonuses = await getEmployeeProjectBonusesForMonth(employeeRecord.id, month, year);

    // Step 4: Process advance payment if any
    const updatedAdvanceRecords = await processAdvancePayment(employeeRecord.id, advancePayment);

    // Step 5: Create the salary record
    const salary = await createSalaryRecord(
      employeeRecord.id,
      month,
      year,
      basicSalary,
      bonus,
      projectBonusShare,
      projectBonuses,
      advanceSalary,
      advancePayment,
      updatedAdvanceRecords,
      totalBonus,
      totalDeduction,
      netSalary,
      paymentMethod,
      status
    );

    // Step 6: Return successful response
    res.status(201).json({
      message: "Salary record created successfully",
      salary,
      updatedAdvanceRecords
    });
  } catch (error) {
    console.error('Error creating salary record:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Helper function to find employee by name
async function findEmployee(employeeName) {
  return await prisma.employee.findFirst({
    where: { name: employeeName }
  });
}

// Helper function to check for duplicate salary record
async function checkDuplicateSalary(employeeId, month, year) {
  const existingSalary = await prisma.salary.findFirst({
    where: {
      employeeId,
      month,
      year: parseInt(year)
    }
  });
  return !!existingSalary;
}

// Helper function to get project bonuses for an employee in a specific month
async function getEmployeeProjectBonusesForMonth(employeeId, month, year) {
  const yearNum = parseInt(year);
  const monthNum = getMonthNumber(month);
  
  return await prisma.projectEmployee.findMany({
    where: {
      employeeId,
      status: 1,
      project: {
        status: 1,
        startDate: {
          lte: new Date(yearNum, monthNum + 1, 0)
        },
        OR: [
          { endDate: null },
          { 
            endDate: { 
              gte: new Date(yearNum, monthNum, 1) 
            } 
          }
        ]
      }
    },
    include: {
      project: {
        select: {
          projectName: true,
          bonus: true,
          sharedBonus: true
        }
      }
    }
  });
}

// Helper function to process advance payment
async function processAdvancePayment(employeeId, advancePayment) {
  const updatedAdvanceRecords = [];
  
  if (!advancePayment || parseFloat(advancePayment) <= 0) {
    return updatedAdvanceRecords;
  }
  
  // Get active advance salary records with remaining amounts
  const advanceSalaries = await prisma.advanceSalary.findMany({
    where: {
      employeeId,
      status: 1,
      remainingAmount: { gt: 0 }
    },
    orderBy: {
      date: 'asc' // Process oldest advances first
    }
  });

  let remainingPayment = parseFloat(advancePayment);
  
  // Update each advance record until the payment is fully allocated
  for (const advance of advanceSalaries) {
    if (remainingPayment <= 0) break;

    const currentRemaining = advance.remainingAmount;
    const amountToDeduct = Math.min(currentRemaining, remainingPayment);
    const newRemaining = currentRemaining - amountToDeduct;
    
    // Update the advance record
    const updatedAdvance = await prisma.advanceSalary.update({
      where: { id: advance.id },
      data: {
        remainingAmount: newRemaining
      }
    });
    
    updatedAdvanceRecords.push({
      id: updatedAdvance.id,
      previousRemaining: currentRemaining,
      amountPaid: amountToDeduct,
      newRemaining: newRemaining
    });
    
    remainingPayment -= amountToDeduct;
  }
  
  return updatedAdvanceRecords;
}

// Helper function to create the salary record
async function createSalaryRecord(
  employeeId,
  month,
  year,
  basicSalary,
  bonus,
  projectBonusShare,
  projectBonuses,
  advanceSalary,
  advancePayment,
  updatedAdvanceRecords,
  totalBonus,
  totalDeduction,
  netSalary,
  paymentMethod,
  status
) {
  return await prisma.salary.create({
    data: {
      employeeId,
      month,
      year: parseInt(year),
      summary: {
        basicSalary: parseFloat(basicSalary),
        bonus: parseFloat(bonus || 0),
        projectBonusShare: parseFloat(projectBonusShare || 0),
        projectBonuses: projectBonuses.map(pb => ({
          projectName: pb.project.projectName,
          bonusShare: pb.bonusShare,
          projectBonus: pb.project.bonus,
          sharedBonus: pb.project.sharedBonus
        })),
        totalAdvance: parseFloat(advanceSalary || 0),
        advancePayment: parseFloat(advancePayment || 0),
        advanceRecords: updatedAdvanceRecords,
        totalBonus: parseFloat(totalBonus),
        totalDeduction: parseFloat(totalDeduction),
        netSalary: parseFloat(netSalary)
      },
      paymentMethod: paymentMethod.toUpperCase().replace(' ', '_'),
      status: status.toUpperCase(),
      active: 1
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
}

export const getAllSalaries = async (req, res) => {
  try {
    const salaries = await prisma.salary.findMany({
      where: {
        active: 1  // Only get active salaries
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

    const formattedSalaries = salaries.map(salary => ({
      id: salary.id,
      employee: salary.employee.name,
      month: salary.month,
      year: salary.year,
      basicSalary: salary.summary.basicSalary,
      totalBonus: salary.summary.totalBonus,
      totalDeduction: salary.summary.totalDeduction,
      netSalary: salary.summary.netSalary,
      paymentMethod: salary.paymentMethod,
      status: salary.status
    }));

    if (formattedSalaries.length === 0) {
      return res.status(404).json({ message: 'No salaries found' });
    }
    
    res.status(200).json({
      message: "Salaries retrieved successfully",
      salaries: formattedSalaries
    });
  } catch (error) {
    console.error('Error retrieving salaries:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getSalaryById = async (req, res) => {
  try {
    const { id } = req.params;
    const salary = await prisma.salary.findUnique({
      where: { id: Number(id) },
      include: {
        employee: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!salary) {
      return res.status(404).json({ message: `Salary with ID ${id} not found` });
    }

    const formattedSalary = {
      id: salary.id,
      employee: salary.employee.name,
      month: salary.month,
      year: salary.year,
      ...salary.summary,
      paymentMethod: salary.paymentMethod,
      status: salary.status
    };

    res.status(200).json({
      message: `Salary with ID ${id} retrieved successfully`,
      salary: formattedSalary
    });
  } catch (error) {
    console.error('Error retrieving salary:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateSalary = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      employee,
      month,
      year,
      bonus,
      advanceSalary,
      advancePayment,
      basicSalary,
      totalBonus,
      totalDeduction,
      netSalary,
      paymentMethod,
      status
    } = req.body;

    const employeeRecord = await prisma.employee.findFirst({
      where: { name: employee }
    });

    if (!employeeRecord) {
      return res.status(400).json({ message: 'Employee not found' });
    }

    // Get existing salary record to check for advance payment changes
    const existingSalary = await prisma.salary.findUnique({
      where: { id: Number(id) }
    });

    if (!existingSalary) {
      return res.status(404).json({ message: `Salary with ID ${id} not found` });
    }

    // Handle advance payment changes if needed
    // Note: Updating advance payments is complex and might require additional logic
    // to handle cases where advances were already paid off

    const updatedSalary = await prisma.salary.update({
      where: { id: Number(id) },
      data: {
        employeeId: employeeRecord.id,
        month,
        year: parseInt(year),
        summary: {
          basicSalary: parseFloat(basicSalary),
          bonus: parseFloat(bonus),
          totalAdvance: parseFloat(advanceSalary || 0),
          advancePayment: parseFloat(advancePayment || 0),
          totalBonus: parseFloat(totalBonus),
          totalDeduction: parseFloat(totalDeduction),
          netSalary: parseFloat(netSalary)
        },
        paymentMethod: paymentMethod.toUpperCase().replace(' ', '_'),
        status: status.toUpperCase()
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

    res.status(200).json({
      message: `Salary with ID ${id} updated successfully`,
      salary: updatedSalary
    });
  } catch (error) {
    console.error('Error updating salary:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: `Salary with ID ${id} not found` });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteSalary = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if salary exists
    const salary = await prisma.salary.findUnique({
      where: { id: Number(id) }
    });

    if (!salary) {
      return res.status(404).json({ message: `Salary with ID ${id} not found` });
    }

    // Soft delete by setting active to 0 instead of deleting the record
    await prisma.salary.update({
      where: { id: Number(id) },
      data: { active: 0 }
    });

    res.status(200).json({
      message: `Salary with ID ${id} deleted successfully`,
    });
  } catch (error) {
    console.error('Error deleting salary:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: `Salary with ID ${id} not found` });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const filterSalaries = async (req, res) => {
    try {
      const { month, year, employeeName, status, paymentMethod } = req.query;
  
      let whereClause = {};
  
      if (month) whereClause.month = month;
      if (year) whereClause.year = parseInt(year);
      if (employeeName) {
        whereClause.employee = {
          name: {
            contains: employeeName,
            mode: 'insensitive'
          }
        };
      }
      if (status) whereClause.status = status.toUpperCase();
      if (paymentMethod) whereClause.paymentMethod = paymentMethod.toUpperCase().replace(' ', '_');
  
      const salaries = await prisma.salary.findMany({
        where: whereClause,
        include: {
          employee: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });
  
      const formattedSalaries = salaries.map(salary => ({
        id: salary.id,
        employee: salary.employee.name,
        month: salary.month,
        year: salary.year,
        basicSalary: salary.summary.basicSalary,
        totalBonus: salary.summary.totalBonus,
        totalDeduction: salary.summary.totalDeduction,
        netSalary: salary.summary.netSalary,
        paymentMethod: salary.paymentMethod,
        status: salary.status
      }));
  
      res.status(200).json({
        message: "Filtered salaries retrieved successfully",
        salaries: formattedSalaries
      });
    } catch (error) {
      console.error('Error filtering salaries:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

// Get employee's remaining advance salary amount
export const getRemainingAdvanceSalary = async (req, res) => {
  try {
    const { employeeId } = req.query;

    if (!employeeId) {
      return res.status(400).json({ 
        message: "Employee ID is required" 
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

    // Get active advance salary records with remaining amounts
    const advanceSalaries = await prisma.advanceSalary.findMany({
      where: {
        employeeId: Number(employeeId),
        status: 1,  // Only active records
        remainingAmount: { gt: 0 }  // Only records with remaining amount
      },
      select: {
        id: true,
        amount: true,
        remainingAmount: true,
        date: true,
        description: true
      },
      orderBy: {
        date: 'asc'  // Oldest advances first
      }
    });

    // Calculate total remaining amount
    const totalRemainingAmount = advanceSalaries.reduce(
      (total, advance) => total + advance.remainingAmount, 
      0
    );

    res.status(200).json({
      message: "Remaining advance salary retrieved successfully",
      totalRemainingAmount,
      advanceSalaries
    });

  } catch (error) {
    console.error('Error retrieving remaining advance salary:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};