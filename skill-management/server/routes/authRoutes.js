const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { catchAsync } = require('../middleware/errorHandler');
const { protect } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Helper function to generate JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Helper function to send response with token
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  catchAsync(async (req, res, next) => {
    // Passport will have already created/updated the user
    createSendToken(req.user, 200, res);
  })
);

// Get current user
router.get('/me', protect, catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
}));

// Update user profile
router.patch('/updateMe', protect, catchAsync(async (req, res, next) => {
  // 1) Create error if user tries to update password
  if (req.body.password) {
    return next(new APIError('This route is not for password updates.', 400));
  }

  // 2) Filter unwanted fields that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'studentType');

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
}));

// Helper function to filter objects
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// Logout (client-side only - just for completeness)
router.get('/logout', (req, res) => {
  res.status(200).json({ status: 'success' });
});

// Check email domain middleware
const checkEmailDomain = (req, res, next) => {
  const { email } = req.body;
  if (!email.endsWith('@bitsathy.ac.in')) {
    return next(new APIError('Only @bitsathy.ac.in email addresses are allowed', 400));
  }
  next();
};

// Update user role (admin only)
router.patch('/updateRole/:userId', 
  protect, 
  authorize('skillTeam'),
  catchAsync(async (req, res, next) => {
    const { role } = req.body;
    
    if (!['student', 'faculty', 'skillTeam'].includes(role)) {
      return next(new APIError('Invalid role', 400));
    }

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { role },
      { new: true, runValidators: true }
    );

    if (!user) {
      return next(new APIError('No user found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  })
);

// Get all users (admin only)
router.get('/users',
  protect,
  authorize('skillTeam'),
  catchAsync(async (req, res) => {
    const users = await User.find();

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users
      }
    });
  })
);

module.exports = router;
