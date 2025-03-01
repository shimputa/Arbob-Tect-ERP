
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

// export const getDashboardStats = async (req, res) => {
//   try {
//     // 1. Get active employee count
//     const totalEmployees = await prisma.employee.count({
//       where: { status: 1 }
//     });

//     // 2. Get today's attendance summary
//     const today = new Date();
//     const startOfDay = new Date(today.setHours(0, 0, 0, 0));
//     const endOfDay = new Date(today.setHours(23, 59, 59, 999));

//     const attendance = await prisma.attendance.groupBy({
//       by: ['status'],
//       _count: { employeeId: true },
//       where: {
//         date: { gte: startOfDay, lte: endOfDay }
//       }
//     });

//     // 3. Get current month expenses
//     const currentMonth = new Date().getMonth() + 1;
//     const currentYear = new Date().getFullYear();

//     const expenses = await prisma.expense.aggregate({
//       _sum: { total: true },
//       where: {
//         createdAt: {
//           gte: new Date(currentYear, currentMonth - 1, 1),
//           lt: new Date(currentYear, currentMonth, 1)
//         }
//       }
//     });

//     // 4. Get salary data
//     const salarySumResult = await prisma.$queryRaw`
//       SELECT COALESCE(SUM((summary->>'netSalary')::float), 0) AS totalnetsalary
//       FROM "Salary"
//       WHERE status = 'PAID'
//     `;
//     const totalSalaryPaid = salarySumResult[0]?.totalnetsalary || 0;

//     // 5. Get yearly trends data
//     const yearlySalaryTrend = await prisma.$queryRaw`
//       SELECT year, SUM((summary->>'netSalary')::float) as amount
//       FROM "Salary"
//       WHERE status = 'PAID' AND year >= 2024
//       GROUP BY year
//       ORDER BY year ASC
//     `;

//     const yearlyExpenseTrend = await prisma.$queryRaw`
//       SELECT 
//         EXTRACT(YEAR FROM "createdAt")::integer as year,
//         SUM(total) as amount
//       FROM "Expense"
//       WHERE EXTRACT(YEAR FROM "createdAt") >= 202
//       GROUP BY year
//       ORDER BY year ASC
//     `;

//     // 6. Format response
//     const response = {
//       success: true,
//       data: {
//         employees: { total: totalEmployees },
//         attendance: {
//           present: attendance.find(a => a.status === 'PRESENT')?._count.employeeId || 0,
//           absent: attendance.find(a => a.status === 'ABSENT')?._count.employeeId || 0,
//           leave: attendance.find(a => a.status === 'ONLEAVE')?._count.employeeId || 0
//         },
//         expenses: {
//           total: expenses._sum.total || 0,
//           categories: await getExpenseCategories(currentMonth, currentYear),
//         //   monthlyHistorical: await getExpenseHistory()
//         },
//         salary: {
//           paid: totalSalaryPaid,
//         //   historical: await getSalaryHistory()
//         },
//         yearlyTrends: {
//           salary: yearlySalaryTrend.map(item => ({
//             year: item.year,
//             amount: Number(item.amount)
//           })),
//           expenses: yearlyExpenseTrend.map(item => ({
//             year: item.year,
//             amount: Number(item.amount)
//           }))
//         }
//       }
//     };

//     res.status(200).json(response);

//   } catch (error) {
//     handleError(res, error, 'Error fetching dashboard statistics');
//   }
// };

// // Helper functions
// const getExpenseCategories = async (month, year) => {
//   const categories = await prisma.expenseCategory.findMany({
//     include: {
//       expenses: {
//         where: {
//           createdAt: {
//             gte: new Date(year, month - 1, 1),
//             lt: new Date(year, month, 1)
//           }
//         }
//       }
//     }
//   });

//   return categories.map(category => ({
//     name: category.name,
//     value: category.expenses.reduce((sum, exp) => sum + exp.total, 0),
//     color: category.color || '#EA580C'
//   }));
// };

// const getExpenseHistory = async () => {
//   const history = await prisma.expense.groupBy({
//     by: ['createdAt'],
//     _sum: { total: true },
//     orderBy: { createdAt: 'asc' }
//   });

//   return history.map(h => ({
//     month: new Date(h.createdAt).toLocaleString('default', { month: 'short' }),
//     amount: h._sum.total
//   }));
// };

// // const getSalaryHistory = async () => {
// //   const salaryHistory = await prisma.$queryRaw`
// //     SELECT month, year, COALESCE(SUM((summary->>'netSalary')::float), 0) AS totalnetsalary
// //     FROM "Salary"
// //     WHERE status = 'PAID'
// //     GROUP BY month, year
// //     ORDER BY year DESC, month DESC
// //   `;

// //   return salaryHistory.map(sh => ({
// //     month: sh.month.substring(0, 3),
// //     amount: sh.totalnetsalary
// //   }));
// // };

// const handleError = (res, error, message) => {
//   console.error(`${message}:`, error);
//   res.status(500).json({
//     success: false,
//     message,
//     error: error.message
//   });
// };


import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getDashboardStats = async (req, res) => {
  try {
    // 1. Get active employee count (original structure)
    const totalEmployees = await prisma.employee.count({
      where: { status: 1 }
    });

    // 2. Get today's attendance summary (original structure)
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

    // 3. Get ALL-TIME expenses (original structure)
    const expenses = await prisma.expense.aggregate({
      _sum: { total: true },
    });

    // 4. Get salary data (original structure)
    const salarySumResult = await prisma.$queryRaw`
      SELECT COALESCE(SUM((summary->>'netSalary')::float), 0) AS totalnetsalary
      FROM "Salary"
      WHERE status = 'PAID'
    `;
    const totalSalaryPaid = salarySumResult[0]?.totalnetsalary || 0;

    // 5. Get yearly trends data (original structure)
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

    // 6. Format response (original structure)
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
        }
      }
    };

    // Add 404 check without changing flow
    if (!response.data.employees.total && 
        !response.data.attendance.present &&
        !response.data.expenses.total &&
        !response.data.salary.paid) {
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
