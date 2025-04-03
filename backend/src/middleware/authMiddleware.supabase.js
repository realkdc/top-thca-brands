const jwt = require('jsonwebtoken');
const supabase = require('../utils/supabaseClient');

/**
 * Middleware to protect routes that require authentication
 * Verifies JWT token and attaches user to request object
 */
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret');

      // Get user from database
      const { data: user, error } = await supabase
        .from('users')
        .select('id, name, email, role')
        .eq('id', decoded.id)
        .single();

      if (error) throw error;
      
      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // Attach user to request object
      req.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      };

      next();
    } catch (error) {
      console.error('JWT verification error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } catch (error) {
    console.error('Protect middleware error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Middleware to check if user has admin role
 * Must be used after the protect middleware
 */
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

/**
 * Middleware to check if user has editor role or admin role
 * Must be used after the protect middleware
 */
exports.editor = (req, res, next) => {
  if (req.user && ['admin', 'editor'].includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an editor' });
  }
};

/**
 * Middleware to authorize users with specific roles
 * @param  {...string} roles - Roles allowed to access the route
 * @returns {function} - Express middleware
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, user not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role ${req.user.role} is not authorized to access this route` 
      });
    }

    next();
  };
}; 