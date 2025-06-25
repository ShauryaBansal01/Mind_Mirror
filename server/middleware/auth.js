const jwt = require('jsonwebtoken');
const User = require('../models/User');
const cookieParser = require('cookie-parser');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    // Get token from cookies or Authorization header
    let token = req.cookies.token;
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    console.log('Auth Middleware: token:', token); // Debug log

    if (!token) {
      return res.status(401).json({ 
        message: 'Access denied. No token provided.' 
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Auth Middleware: decoded token:', decoded); // Debug log
    } catch (err) {
      console.error('Auth Middleware: token verification error:', err);
      throw err;
    }
    
    // Get user from database
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid token. User not found.' 
      });
    }

    if (!user.isActive) {
      return res.status(401).json({ 
        message: 'Account is deactivated.' 
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid token.' 
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expired.' 
      });
    } else {
      console.error('Auth middleware error:', error);
      return res.status(500).json({ 
        message: 'Server error during authentication.',
        error: error.message // Add this line for debugging
      });
    }
  }
};

// Middleware to check if user is admin (for future use)
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      message: 'Access denied. Admin privileges required.' 
    });
  }
};

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { 
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      issuer: 'mindmirror-api',
      audience: 'mindmirror-client'
    }
  );
};

// Generate refresh token (for future implementation)
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { 
      expiresIn: '30d',
      issuer: 'mindmirror-api',
      audience: 'mindmirror-client'
    }
  );
};

module.exports = {
  authenticateToken,
  requireAdmin,
  generateToken,
  generateRefreshToken
};