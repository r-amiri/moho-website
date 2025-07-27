const jwt = require('jsonwebtoken');
const Database = require('../database/database');

const JWT_SECRET = process.env.JWT_SECRET || 'amiri_insurance_secret_key_2024';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      message: 'توکن احراز هویت لازم است',
      error: 'Authentication token required' 
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        message: 'توکن نامعتبر است',
        error: 'Invalid token' 
      });
    }

    req.user = user;
    next();
  });
};

const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role,
      name: `${user.first_name} ${user.last_name}`
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      message: 'دسترسی محدود - فقط مدیران',
      error: 'Admin access required' 
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  generateToken,
  requireAdmin,
  JWT_SECRET
};