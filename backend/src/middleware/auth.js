const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    console.log("authHeader::::",authHeader)

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Access denied. No valid token provided.'
      });
    }

    const token = authHeader && authHeader.split(' ')[1];
    console.log("token:::::",  token)

    if (!token) {
      return res.status(401).json({
        message: 'Access denied. No token provided.'
      });
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({
        message: 'Token is not valid. User not found.'
      });
    }

    req.user = user;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: 'Token is not valid.'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token has expired.'
      });
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({
      message: 'Server error during authentication.'
    });
  }
};

module.exports = auth;