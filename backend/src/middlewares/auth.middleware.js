import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { PERMISSIONS } from '../config/permission.js';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed: No token provided'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if user exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user || user.status !== 1) {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed: User not found'
      });
    }
    
    // Add user ID to request
    req.userId = user.id;
    req.userRole = user.role;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      message: 'Authentication failed: Invalid token',
      error: error.message
    });
  }
};

// Permission-based middleware
export const hasPermission = (permission) => {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.userRole) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check if permission exists in the permission map
    const allowedRoles = PERMISSIONS[permission];
    if (!allowedRoles) {
      console.error(`Permission '${permission}' is not defined in the permission map`);
      return res.status(403).json({
        success: false,
        message: 'Access denied: Invalid permission configuration'
      });
    }

    // Check if user's role is allowed
    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Insufficient privileges'
      });
    }

    // User has permission, proceed
    next();
  };
};

// Middleware to check if user is super admin
export const isSuperAdmin = (req, res, next) => {
  if (req.userRole !== 'SUPER_ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Super admin privileges required'
    });
  }
  next();
};

// Middleware to check if user is admin or higher
export const isAdmin = (req, res, next) => {
  if (!['SUPER_ADMIN', 'ADMIN'].includes(req.userRole)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Admin privileges required'
    });
  }
  next();
};

// Add middleware for dashboard component filtering
export const filterDashboardAccess = (req, res, next) => {
  const { DASHBOARD_ACCESS } = require('../config/permission.js');
  req.allowedDashboardComponents = DASHBOARD_ACCESS[req.userRole] || [];
  next();
}; 