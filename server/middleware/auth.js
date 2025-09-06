const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user exists and is active
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to multiple failed login attempts'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

// Middleware to check user roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Middleware to check if user is verified
const requireVerification = (req, res, next) => {
  if (!req.user.isVerified) {
    return res.status(403).json({
      success: false,
      message: 'Account verification required'
    });
  }
  next();
};

// Middleware to check Aadhaar verification
const requireAadhaarVerification = (req, res, next) => {
  if (!req.user.aadhaarVerified) {
    return res.status(403).json({
      success: false,
      message: 'Aadhaar verification required'
    });
  }
  next();
};

// Middleware for rate limiting specific to authentication
const authRateLimit = (req, res, next) => {
  // This would typically use a more sophisticated rate limiting mechanism
  // For now, we'll rely on the general rate limiter
  next();
};

// Middleware to log authentication events
const logAuthEvent = (event) => {
  return (req, res, next) => {
    const logData = {
      event,
      userId: req.user ? req.user._id : null,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date()
    };
    
    // In production, this would be logged to a proper logging service
    console.log('Auth Event:', logData);
    next();
  };
};

// Middleware to check if user can access resource
const checkResourceAccess = (resourceType) => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params.id;
      const userId = req.user._id;
      const userRole = req.user.role;

      // Admin can access everything
      if (userRole === 'admin') {
        return next();
      }

      // Check resource-specific access
      switch (resourceType) {
        case 'appointment':
          const Appointment = require('../models/Appointment');
          const appointment = await Appointment.findById(resourceId);
          if (!appointment) {
            return res.status(404).json({
              success: false,
              message: 'Appointment not found'
            });
          }
          
          if (appointment.patient.toString() !== userId.toString() && 
              appointment.doctor.toString() !== userId.toString()) {
            return res.status(403).json({
              success: false,
              message: 'Access denied to this appointment'
            });
          }
          break;

        case 'prescription':
          const Prescription = require('../models/Prescription');
          const prescription = await Prescription.findById(resourceId);
          if (!prescription) {
            return res.status(404).json({
              success: false,
              message: 'Prescription not found'
            });
          }
          
          if (prescription.patient.toString() !== userId.toString() && 
              prescription.doctor.toString() !== userId.toString()) {
            return res.status(403).json({
              success: false,
              message: 'Access denied to this prescription'
            });
          }
          break;

        case 'user':
          if (req.params.id !== userId.toString() && userRole !== 'admin') {
            return res.status(403).json({
              success: false,
              message: 'Access denied to this user profile'
            });
          }
          break;

        default:
          return res.status(400).json({
            success: false,
            message: 'Invalid resource type'
          });
      }

      next();
    } catch (error) {
      console.error('Resource access check error:', error);
      res.status(500).json({
        success: false,
        message: 'Error checking resource access'
      });
    }
  };
};

// Middleware to validate government compliance
const validateCompliance = (req, res, next) => {
  // Check if request is from a government-verified source
  const govtHeaders = req.headers['x-government-verified'];
  const ndhmHeaders = req.headers['x-ndhm-verified'];
  
  if (req.user.role === 'doctor' && !req.user.governmentVerified) {
    return res.status(403).json({
      success: false,
      message: 'Government verification required for this operation'
    });
  }

  next();
};

// Middleware to check elderly mode requirements
const checkElderlyMode = (req, res, next) => {
  if (req.user.preferences.elderlyMode) {
    // Add elderly-friendly headers
    res.set('X-Elderly-Mode', 'enabled');
    res.set('X-Accessibility', 'enhanced');
  }
  next();
};

module.exports = {
  authenticateToken,
  authorize,
  requireVerification,
  requireAadhaarVerification,
  authRateLimit,
  logAuthEvent,
  checkResourceAccess,
  validateCompliance,
  checkElderlyMode
};