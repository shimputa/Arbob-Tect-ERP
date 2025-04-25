import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getDashboardStats = async (req, res) => {
  try {
    // 1. Get active employee count
    const totalEmployees = await prisma.employee.count({
      where: { status: 1 }
    });

    // 2. Get today's attendance summary
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

    // 3. Get ALL-TIME expenses
    const expenses = await prisma.expense.aggregate({
      _sum: { total: true },
    });

    // 4. Get salary data
    const salarySumResult = await prisma.$queryRaw`
      SELECT COALESCE(SUM((summary->>'netSalary')::float), 0) AS totalnetsalary
      FROM "Salary"
      WHERE status = 'PAID'
    `;
    const totalSalaryPaid = salarySumResult[0]?.totalnetsalary || 0;

    // 5. Get yearly trends data
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

    // 6. Get project statistics - only active projects
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

    // 7. Get user statistics for the dashboard
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

    // 8. Format response with project data
    const response = {
      success: true,
      data: {
        employees: { total: totalEmployees },
        attendance: {
          present: attendance.find(a => a.status === 'PRESENT')?._count.employeeId || 0,
          absent: attendance.find(a => a.status === 'ABSENT')?._count.employeeId || 0,
          leave: attendance.find(a => a.status === 'ONLEAVE')?._count.employeeId || 0
        },
        expenses: {
          total: expenses._sum.total || 0,
          categories: await getExpenseCategories(),
        },
        salary: {
          paid: totalSalaryPaid,
        },
        yearlyTrends: {
          salary: yearlySalaryTrend.map(item => ({
            year: item.year,
            amount: Number(item.amount)
          })),
          expenses: yearlyExpenseTrend.map(item => ({
            year: item.year,
            amount: Number(item.amount)
          }))
        },
        // Add project data to match frontend expectations
        projects: {
          total: totalProjects,
          ongoing: ongoingProjects,
          completed: completedProjects,
          financials: {
            totalValue: Number(projectFinancials._sum.amount || 0),
            received: Number(projectFinancials._sum.paidAmount || 0),
            // Calculate pending as the difference between total value and received amount
            pending: Number(projectFinancials._sum.amount || 0) - Number(projectFinancials._sum.paidAmount || 0)
          },
          platformDistribution: platformDistribution
        },
        // Add user data to match frontend expectations
        users: {
          total: totalUsers,
          active: activeUsers,
          inactive: inactiveUsers,
          roleDistribution: roleDistribution
        }
      }
    };

    // Add 404 check without changing flow
    if (!response.data.employees.total && 
        !response.data.attendance.present &&
        !response.data.expenses.total &&
        !response.data.salary.paid &&
        !response.data.projects.total &&
        !response.data.users.total) {
      return res.status(404).json({
        success: false,
        message: 'No dashboard data available'
      });
    }

    // Maintain original success response structure
    res.status(200).json(response);

  } catch (error) {
    // Add error handling without changing flow structure
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Requested data not found'
      });
    }
    // Maintain original error handling structure
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
