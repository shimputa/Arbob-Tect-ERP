import { prisma } from '../config/db.js';

// Helper function to map frontend status values to Prisma enum values
const getPaidStatusEnum = (status) => {
    const statusMap = {
      'not paid': 'NOT_PAID',
      'partial': 'PARTIAL_PAID',
      'paid': 'PAID'
    };
    
    return statusMap[status.toLowerCase()] || 'NOT_PAID';
  };

// Get all projects
export const getAllProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { status: 1 },  // Only get active projects
      include: {
        projectEmployees: {
          where: { status: 1 },  // Only active project employees
          include: {
            employee: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'  // Most recent projects first
      }
    });
    
    if (projects.length === 0) {
      return res.status(404).json({ message: 'No projects found' });
    }
    
    // Format the response to include all required fields
    const formattedProjects = projects.map(project => {
      // Get collaborator names as a comma-separated string
      const collaborators = project.projectEmployees
        .map(pe => pe.employee.name)  
        .join(', ');
      
      return {
        id: project.id,
        projectName: project.projectName,
        ownerName: project.ownerName,
        ownerEmail: project.ownerEmail,
        ownerNumber: project.ownerNumber,
        note: project.note,
        startDate: project.startDate,
        endDate: project.endDate,
        amount: project.amount,
        tax: project.tax,
        taxPercentage: project.taxPercentage,
        amountAfterTax: project.amountAfterTax,
        paidAmount: project.paidAmount,
        remainingAmount: project.remainingAmount,
        bonus: project.bonus,
        sharedBonus: project.sharedBonus,
        platform: project.platform,
        projectStatus: project.projectStatus,
        paidStatus: project.paidStatus,
        collaborators: collaborators,
        projectEmployees: project.projectEmployees,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt
      };
    });
    
    res.status(200).json({
      message: "Projects retrieved successfully",
      projects: formattedProjects
    });
  } catch (error) {
    console.error('Error retrieving projects:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a single project by ID
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: { id: Number(id) },
      include: {
        projectEmployees: {
          include: {
            employee: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });
    
    if (!project) {
      return res.status(404).json({ message: `Project with ID ${id} not found` });
    }
    
    // Format the response to include all required fields
    const collaborators = project.projectEmployees
      .map(pe => pe.employee.name)  // Use name instead of email
      .join(', ');
    
    const formattedProject = {
      id: project.id,
      projectName: project.projectName,
      ownerName: project.ownerName,
      ownerEmail: project.ownerEmail,
      ownerNumber: project.ownerNumber,
      note: project.note,
      startDate: project.startDate,
      endDate: project.endDate,
      amount: project.amount,
      tax: project.tax,
      taxPercentage: project.taxPercentage,
      amountAfterTax: project.amountAfterTax,
      paidAmount: project.paidAmount,
      remainingAmount: project.remainingAmount,
      bonus: project.bonus,
      sharedBonus: project.sharedBonus,
      platform: project.platform,
      projectStatus: project.projectStatus,
      paidStatus: project.paidStatus,
      collaborators: collaborators,
      projectEmployees: project.projectEmployees,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt
    };
    
    res.status(200).json({
      message: `Project with ID ${id} retrieved successfully`,
      project: formattedProject
    });
  } catch (error) {
    console.error('Error retrieving project:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new project
export const createProject = async (req, res) => {
  try {
    const {
      projectName,
      ownerName,
      ownerEmail,
      ownerNumber,
      note,
      startDate,
      endDate,
      amount,
      tax,
      amountAfterTax,
      paidAmount,
      remainingAmount,
      bonus,
      sharedBonus,
      platform,
      projectStatus,
      paidStatus,
      collaborators
    } = req.body;

    // Create the project with values directly from frontend
    const project = await prisma.project.create({
      data: {
        projectName,
        ownerName,
        ownerEmail,
        ownerNumber,
        note,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        amount: parseFloat(amount),
        tax: parseFloat(tax),
        taxPercentage: parseFloat(req.body.taxPercentage || 0),
        amountAfterTax: parseFloat(amountAfterTax),
        paidAmount: parseFloat(paidAmount),
        remainingAmount: parseFloat(remainingAmount),
        bonus: parseFloat(bonus || 0),
        sharedBonus: parseFloat(sharedBonus || 0),
        platform: platform.toUpperCase(),
        projectStatus: projectStatus.toUpperCase(),
        paidStatus: getPaidStatusEnum(paidStatus)
      }
    });

    // Handle collaborators
    if (collaborators) {
      const collaboratorNames = collaborators.split(',').filter(name => name.trim() !== '');
      
      for (const name of collaboratorNames) {
        const trimmedName = name.trim();
        if (trimmedName) {
          // Find employee by name
          const employee = await prisma.employee.findFirst({
            where: { 
              name: {
                contains: trimmedName,
                mode: 'insensitive'
              },
              status: 1  // Only active employees
            }
          });

          if (employee) {
            // Create project employee relationship
            await prisma.projectEmployee.create({
              data: {
                projectId: project.id,
                employeeId: employee.id,
                bonusShare: parseFloat(sharedBonus || 0)
              }
            });
          }
        }
      }
    }

    // Get the complete project with collaborators
    const completeProject = await prisma.project.findUnique({
      where: { id: project.id },
      include: {
        projectEmployees: {
          include: {
            employee: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    // Format the response
    const formattedCollaborators = completeProject.projectEmployees
      .map(pe => pe.employee.name)
      .join(', ');
    
    const formattedProject = {
      ...completeProject,
      collaborators: formattedCollaborators
    };

    res.status(201).json({
      message: "Project created successfully",
      project: formattedProject
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a project
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      projectName,
      ownerName,
      ownerEmail,
      ownerNumber,
      note,
      startDate,
      endDate,
      amount,
      tax,
      amountAfterTax,
      paidAmount,
      remainingAmount,
      bonus,
      sharedBonus,
      platform,
      projectStatus,
      paidStatus,
      collaborators
    } = req.body;

    // Update the project with values directly from frontend
    const project = await prisma.project.update({
      where: { id: Number(id) },
      data: {
        projectName,
        ownerName,
        ownerEmail,
        ownerNumber,
        note,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        amount: parseFloat(amount),
        tax: parseFloat(tax),
        taxPercentage: parseFloat(req.body.taxPercentage || 0),
        amountAfterTax: parseFloat(amountAfterTax),
        paidAmount: parseFloat(paidAmount),
        remainingAmount: parseFloat(remainingAmount),
        bonus: parseFloat(bonus || 0),
        sharedBonus: parseFloat(sharedBonus || 0),
        platform: platform.toUpperCase(),
        projectStatus: projectStatus.toUpperCase(),
        paidStatus: getPaidStatusEnum(paidStatus)
      }
    });

    // Remove existing project employees
    await prisma.projectEmployee.deleteMany({
      where: { projectId: Number(id) }
    });

    // Add updated collaborators
    if (collaborators) {
      const collaboratorNames = collaborators.split(',').filter(name => name.trim() !== '');
      
      for (const name of collaboratorNames) {
        const trimmedName = name.trim();
        if (trimmedName) {
          // Find employee by name
          const employee = await prisma.employee.findFirst({
            where: { 
              name: {
                contains: trimmedName,
                mode: 'insensitive'
              },
              status: 1  // Only active employees
            }
          });

          if (employee) {
            // Create project employee relationship
            await prisma.projectEmployee.create({
              data: {
                projectId: project.id,
                employeeId: employee.id,
                bonusShare: parseFloat(sharedBonus || 0)
              }
            });
          }
        }
      }
    }

    // Get the complete updated project with collaborators
    const updatedProject = await prisma.project.findUnique({
      where: { id: Number(id) },
      include: {
        projectEmployees: {
          include: {
            employee: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    // Format the response
    const formattedCollaborators = updatedProject.projectEmployees
      .map(pe => pe.employee.name)
      .join(', ');
    
    const formattedProject = {
      ...updatedProject,
      collaborators: formattedCollaborators
    };

    res.status(200).json({
      message: `Project with ID ${id} updated successfully`,
      project: formattedProject
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: `Project with ID ${id} not found` });
    }
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Soft delete a project and its project employees
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const projectId = Number(id);

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return res.status(404).json({ message: `Project with ID ${id} not found` });
    }

    // Start a transaction to ensure both operations succeed or fail together
    const result = await prisma.$transaction([
      // Soft delete all project employees by setting status to 0
      prisma.projectEmployee.updateMany({
        where: { projectId: projectId },
        data: { status: 0 }  // Set status to inactive
      }),
      
      // Soft delete the project by setting status to 0
      prisma.project.update({
        where: { id: projectId },
        data: { status: 0 }  // Set status to inactive
      })
    ]);

    res.status(200).json({
      message: `Project with ID ${id} and its collaborators deleted successfully`,
      project: result[1]  // Return the updated project
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Filter projects
export const filterProjects = async (req, res) => {
  try {
    const { status, platform, search } = req.query;
    
    let whereClause = { status: 1 };
    
    if (status) {
      whereClause.projectStatus = status.toUpperCase();
    }
    
    if (platform) {
      whereClause.platform = platform.toUpperCase();
    }
    
    if (search) {
      whereClause.OR = [
        { projectName: { contains: search, mode: 'insensitive' } },
        { ownerName: { contains: search, mode: 'insensitive' } },
        { ownerEmail: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    const projects = await prisma.project.findMany({
      where: whereClause,
      include: {
        projectEmployees: {
          include: {
            employee: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Format the response
    const formattedProjects = projects.map(project => {
      const collaborators = project.projectEmployees
        .map(pe => pe.employee.name)
        .join(', ');
      
      return {
        ...project,
        collaborators
      };
    });
    
    res.status(200).json({
      message: "Filtered projects retrieved successfully",
      projects: formattedProjects
    });
  } catch (error) {
    console.error('Error filtering projects:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
