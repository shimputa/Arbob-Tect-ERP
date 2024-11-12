import { prisma } from '../config/db.js';

export const createSalary = async (req, res) => {
    try {
      const {
        employee,
        month,
        year,
        bonus,
        advanceSalary,
        otherDeduction,
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
  
      // Check if a salary record already exists for this employee in the given month and year
      const existingSalary = await prisma.salary.findFirst({
        where: {
          employeeId: employeeRecord.id,
          month,
          year: parseInt(year)
        }
      });
  
      if (existingSalary) {
        return res.status(400).json({ 
          message: `A salary record already exists for ${employee} in ${month} ${year}`
        });
      }
  
      const salary = await prisma.salary.create({
        data: {
          employeeId: employeeRecord.id,
          month,
          year: parseInt(year),
          summary: {
            basicSalary: parseFloat(basicSalary),
            bonus: parseFloat(bonus),
            advanceSalary: parseFloat(advanceSalary),
            otherDeduction: parseFloat(otherDeduction),
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
  
      res.status(201).json({
        message: "Salary record created successfully",
        salary,
      });
    } catch (error) {
      console.error('Error creating salary record:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

export const getAllSalaries = async (req, res) => {
  try {
    const salaries = await prisma.salary.findMany({
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
    // console.log('Salaries being sent:', salaries);
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
      otherDeduction,
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

    const updatedSalary = await prisma.salary.update({
      where: { id: Number(id) },
      data: {
        employeeId: employeeRecord.id,
        month,
        year: parseInt(year),
        summary: {
          basicSalary: parseFloat(basicSalary),
          bonus: parseFloat(bonus),
          advanceSalary: parseFloat(advanceSalary),
          otherDeduction: parseFloat(otherDeduction),
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

    await prisma.salary.delete({
      where: { id: Number(id) },
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