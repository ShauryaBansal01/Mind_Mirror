const express = require('express');
const User = require('../models/User');
const { authenticateToken, generateToken } = require('../middleware/auth');
const { 
  validateUserRegistration, 
  validateUserLogin, 
  validateProfileUpdate,
  validatePasswordChange 
} = require('../middleware/validation');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validateUserRegistration, async (req, res) => {
  try {
    const { username, email, password, profile } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmailOrUsername(email);
    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists with this email or username'
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      profile: profile || {}
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Set token in cookies
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // use true in production
      sameSite: 'strict'
    });

    // Return user data (without password) and token
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: user.getPublicProfile()
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
      });
    }

    res.status(500).json({
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateUserLogin, async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Find user by email or username
    const user = await User.findByEmailOrUsername(identifier);
    if (!user) {
      return res.status(400).json({
        message: 'Invalid credentials'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(400).json({
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({
        message: 'Invalid credentials'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Set token in cookies
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // use true in production
      sameSite: 'strict'
    });

    res.json({
      message: 'Login successful',
      token,
      user: user.getPublicProfile()
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', authenticateToken, async (req, res) => {
  try {
    res.json({
      user: req.user.getPublicProfile()
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      message: 'Server error while fetching profile'
    });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticateToken, validateProfileUpdate, async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Update profile fields
    if (updates.profile) {
      user.profile = { ...user.profile, ...updates.profile };
    }

    // Update preferences
    if (updates.preferences) {
      user.preferences = { ...user.preferences, ...updates.preferences };
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: user.getPublicProfile()
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      message: 'Server error while updating profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', authenticateToken, validatePasswordChange, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({
      message: 'Server error while changing password',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', authenticateToken, (req, res) => {
  // In a JWT-based system, logout is typically handled client-side
  // by removing the token from storage. This endpoint exists for
  // consistency and potential future server-side token blacklisting.
  
  res.json({
    message: 'Logout successful'
  });
});

// @route   DELETE /api/auth/account
// @desc    Deactivate user account
// @access  Private
router.delete('/account', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Deactivate account instead of deleting (for data retention)
    user.isActive = false;
    await user.save();

    res.json({
      message: 'Account deactivated successfully'
    });

  } catch (error) {
    console.error('Account deactivation error:', error);
    res.status(500).json({
      message: 'Server error while deactivating account',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;