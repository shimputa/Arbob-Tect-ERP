import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getDashboardStats = async (req, res) => {
  try {
    // Get the allowed components for this user's role (set by filterDashboardAccess middleware)
    const allowedComponents = req.allowedComponents || [];
    const userRole = req.userRole;
    
    // Initialize the response data object
    const data = {};
    
    // Only fetch data for components the user is allowed to see
    
    // 1. Employees data - if allowed
    if (allowedComponents.includes('employees')) {
      const totalEmployees = await prisma.employee.count({
        where: { status: 1 }
      });
      
      data.employees = { total: totalEmployees };
    }
    
    // 2. Attendance data - if allowed
    if (allowedComponents.includes('attendance')) {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));

      const attendance = await prisma.attendance.groupBy({
        by: ['status'],
        _count: { employeeId: true },
        where: {
          date: { gte: startOfDay, lte: endOfDay }
        }
      });
      
      data.attendance = {
        present: attendance.find(a => a.status === 'PRESENT')?._count.employeeId || 0,
        absent: attendance.find(a => a.status === 'ABSENT')?._count.employeeId || 0,
        leave: attendance.find(a => a.status === 'ONLEAVE')?._count.employeeId || 0
      };
    }
    
    // 3. Expenses data - if allowed
    if (allowedComponents.includes('expenses')) {
      const expenses = await prisma.expense.aggregate({
        _sum: { total: true },
      });
      
      // FINANCE_MANAGER only sees total expenses, not categories
      if (userRole === 'FINANCE_MANAGER') {
        data.expenses = {
          total: expenses._sum.total || 0
        };
      } else {
        // SUPER_ADMIN and ADMIN see full expense data with categories
        data.expenses = {
          total: expenses._sum.total || 0,
          categories: await getExpenseCategories(),
        };
      }
    }
    
    // 4. Projects data - if allowed (now separate from expenses)
    if (allowedComponents.includes('projects')) {
      // Project data is now its own component
      const projectFilter = { status: 1 };
      
      // Total projects count
      const totalProjects = await prisma.project.count({
        where: projectFilter
      });

      // Ongoing projects count
      const ongoingProjects = await prisma.project.count({
        where: { 
          status: 1,
          projectStatus: 'ONGOING'
        }
      });

      // Completed projects count
      const completedProjects = await prisma.project.count({
        where: { 
          status: 1,
          projectStatus: 'COMPLETE'
        }
      });

      // Project financials
      const projectFinancials = await prisma.project.aggregate({
        where: projectFilter,
        _sum: {
          amount: true,
          paidAmount: true,
          remainingAmount: true
        }
      });

      // Get platform distribution
      const platformCounts = await prisma.project.groupBy({
        by: ['platform'],
        _count: {
          id: true
        },
        where: projectFilter
      });

      // Map platform distribution to the expected format
      const platformDistribution = platformCounts.map(platform => ({
        name: platform.platform === 'FIVER' ? 'Fiverr' : 
              platform.platform === 'WHATSAPP' ? 'WhatsApp' : 
              platform.platform === 'UPWORK' ? 'Upwork' : 
              platform.platform === 'LINKEDIN' ? 'LinkedIn' : 'Other',
        value: platform._count.id
      }));
      
      data.projects = {
        total: totalProjects,
        ongoing: ongoingProjects,
        completed: completedProjects,
        financials: {
          totalValue: Number(projectFinancials._sum.amount || 0),
          received: Number(projectFinancials._sum.paidAmount || 0),
          pending: Number(projectFinancials._sum.amount || 0) - Number(projectFinancials._sum.paidAmount || 0)
        },
        platformDistribution: platformDistribution
      };
    }
    
    // 5. Salary data - if allowed
    if (allowedComponents.includes('salary')) {
      const salarySumResult = await prisma.$queryRaw`
        SELECT COALESCE(SUM((summary->>'netSalary')::float), 0) AS totalnetsalary
        FROM "Salary"
        WHERE status = 'PAID'
      `;
      const totalSalaryPaid = salarySumResult[0]?.totalnetsalary || 0;
      
      data.salary = {
        paid: totalSalaryPaid,
      };
    }
    
    // 6. Yearly trends data - if allowed
    if (allowedComponents.includes('yearlyTrends')) {
      const yearlySalaryTrend = await prisma.$queryRaw`
        SELECT year, SUM((summary->>'netSalary')::float) as amount
        FROM "Salary"
        WHERE status = 'PAID' AND year >= 2024
        GROUP BY year
        ORDER BY year ASC
      `;

      const yearlyExpenseTrend = await prisma.$queryRaw`
        SELECT 
          EXTRACT(YEAR FROM "createdAt")::integer as year,
          SUM(total) as amount
        FROM "Expense"
        WHERE EXTRACT(YEAR FROM "createdAt") >= 2024
        GROUP BY year
        ORDER BY year ASC
      `;
      
      data.yearlyTrends = {
        salary: yearlySalaryTrend.map(item => ({
          year: item.year,
          amount: Number(item.amount)
        })),
        expenses: yearlyExpenseTrend.map(item => ({
          year: item.year,
          amount: Number(item.amount)
        }))
      };
    }
    
    // 7. User statistics - only for SUPER_ADMIN
    if (req.userRole === 'SUPER_ADMIN') {
      // Count total users
      const totalUsers = await prisma.user.count();
      
      // Count active users (status = 1)
      const activeUsers = await prisma.user.count({
        where: { status: 1 }
      });
      
      // Count inactive users (status = 0)
      const inactiveUsers = await prisma.user.count({
        where: { status: 0 }
      });
      
      // Get user role distribution
      const userRoleCounts = await prisma.user.groupBy({
        by: ['role'],
        _count: {
          id: true
        },
        where: { status: 1 } // Only count active users in role distribution
      });
      
      // Format role distribution for the frontend
      const roleDistribution = userRoleCounts.map(role => {
        // Convert enum values to display names
        let displayName;
        switch (role.role) {
          case 'SUPER_ADMIN':
            displayName = 'Super Admin';
            break;
          case 'ADMIN':
            displayName = 'Admin';
            break;
          case 'FINANCE_MANAGER':
            displayName = 'Finance Manager';
            break;
          case 'HR':
            displayName = 'HR';
            break;
          default:
            displayName = 'User';
        }
        
        return {
          name: displayName,
          value: role._count.id
        };
      });
      
      data.users = {
        total: totalUsers,
        active: activeUsers,
        inactive: inactiveUsers,
        roleDistribution: roleDistribution
      };
    }
    
    // Check if any data is available
    if (Object.keys(data).length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No dashboard data available for your role'
      });
    }
    
    // Return the dashboard data with role-based filtering applied
    return res.status(200).json({
      success: true,
      data: data,
      allowedComponents: allowedComponents  // For debugging/frontend use
    });
    
  } catch (error) {
    // Error handling
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Requested data not found'
      });
    }
    console.error(`Dashboard error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Helper functions remain unchanged
const getExpenseCategories = async () => {
  const categories = await prisma.expenseCategory.findMany({
    include: {
      expenses: true
    }
  });

  return categories.map(category => ({
    name: category.name,
    value: category.expenses.reduce((sum, exp) => sum + exp.total, 0),
    color: category.color
  }));
};
