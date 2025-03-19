const jwt = require('jsonwebtoken');
const { APIError } = require('./errorHandler');
const User = require('../models/User');

// Middleware to verify JWT token
const protect = async (req, res, next) => {
  try {
    let token;
    
    // Get token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return next(new APIError('Not authorized to access this route', 401));
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      const user = await User.findById(decoded.id);
      if (!user) {
        return next(new APIError('User not found', 404));
      }

      // Add user to request object
      req.user = user;
      next();
    } catch (err) {
      return next(new APIError('Not authorized to access this route', 401));
    }
  } catch (error) {
    next(error);
  }
};

// Middleware to restrict access based on user roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new APIError(
        `User role ${req.user.role} is not authorized to access this route`,
        403
      ));
    }
    next();
  };
};

// Middleware to check if user is a faculty member
const isFaculty = (req, res, next) => {
  if (req.user.role !== 'faculty') {
    return next(new APIError('Only faculty members can access this route', 403));
  }
  next();
};

// Middleware to check if user is a student
const isStudent = (req, res, next) => {
  if (req.user.role !== 'student') {
    return next(new APIError('Only students can access this route', 403));
  }
  next();
};

// Middleware to check if user is a skill team member
const isSkillTeam = (req, res, next) => {
  if (req.user.role !== 'skillTeam') {
    return next(new APIError('Only skill team members can access this route', 403));
  }
  next();
};

// Middleware to check if user owns the resource or is admin
const isOwnerOrAdmin = (model) => async (req, res, next) => {
  try {
    const resource = await model.findById(req.params.id);
    
    if (!resource) {
      return next(new APIError('Resource not found', 404));
    }

    // Check if user is owner or admin
    const isOwner = resource.user && resource.user.toString() === req.user.id;
    const isAdmin = req.user.role === 'skillTeam';

    if (!isOwner && !isAdmin) {
      return next(new APIError('Not authorized to access this resource', 403));
    }

    req.resource = resource;
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware to validate student type for skill registration
const validateStudentType = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.skillId);
    if (!skill) {
      return next(new APIError('Skill not found', 404));
    }

    const student = req.user;
    if (student.studentType === 'dayScholar' && skill.type !== 'day') {
      return next(new APIError('Day scholars can only register for day skills', 403));
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  protect,
  authorize,
  isFaculty,
  isStudent,
  isSkillTeam,
  isOwnerOrAdmin,
  validateStudentType
};
