const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const insuranceRoutes = require('./routes/insurance');
const paymentRoutes = require('./routes/payment');
const dashboardRoutes = require('./routes/dashboard');
const Database = require('./database/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize database
const db = new Database();
db.init();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/insurance', insuranceRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'بیمه امیری - سرور فعال است',
    timestamp: new Date().toISOString() 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'خطای داخلی سرور', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'مسیر پیدا نشد' });
});

app.listen(PORT, () => {
  console.log(`🚀 سرور بیمه امیری در پورت ${PORT} فعال است`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;