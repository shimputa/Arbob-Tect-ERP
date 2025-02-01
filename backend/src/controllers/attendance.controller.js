import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Mark attendance for multiple employees
export const markAttendance = async (req, res) => {
    try {
        const { attendanceData } = req.body; // Array of { employeeId, status }
        const date = new Date(req.body.date);

        // Create many attendance records at once
        const result = await prisma.attendance.createMany({
            data: attendanceData.map(item => ({
                employeeId: item.employeeId,
                status: item.status,
                date: date
            }))
        });

        res.status(201).json({
            success: true,
            message: 'Attendance marked successfully',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error marking attendance',
            error: error.message
        });
    }
};

// Get attendance by date
export const getAttendanceByDate = async (req, res) => {
    try {
        const date = new Date(req.query.date);
        
        const attendance = await prisma.attendance.findMany({
            where: {
                date: {
                    gte: new Date(date.setHours(0,0,0,0)),
                    lt: new Date(date.setHours(23,59,59,999))
                }
            },
            include: {
                employee: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        res.status(200).json({
            success: true,
            data: attendance
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching attendance',
            error: error.message
        });
    }
};

// Get attendance report (monthly)
export const getAttendanceReport = async (req, res) => {
    try {
        const { year, month, employeeId } = req.query;
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const whereClause = {
            date: {
                gte: startDate,
                lte: endDate
            }
        };

        if (employeeId && employeeId !== 'all') {
            whereClause.employeeId = parseInt(employeeId);
        }
    
        const attendance = await prisma.attendance.findMany({
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
                date: 'asc'
            }
        });

        // Calculate statistics
        const stats = attendance.reduce((acc, curr) => {
            if (!acc[curr.employeeId]) {
                acc[curr.employeeId] = {
                    employeeId: curr.employeeId,
                    present: 0,
                    absent: 0,
                    leave: 0,
                    employeeName: curr.employee.name
                };
            }
            const status = curr.status.toLowerCase();
            if (status === 'onleave') {
                acc[curr.employeeId].leave++;
            } else {
                acc[curr.employeeId][status]++;
            }
            return acc;
        }, {});

        res.status(200).json({
            success: true,
            data: {
                attendance,
                statistics: stats
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error generating attendance report',
            error: error.message
        });
    }
};

// Update attendance status
export const updateAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedAttendance = await prisma.attendance.update({
            where: { id: parseInt(id) },
            data: { status }
        });

        res.status(200).json({
            success: true,
            message: 'Attendance updated successfully',
            data: updatedAttendance
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating attendance',
            error: error.message
        });
    }
};
