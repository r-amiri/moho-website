const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const Database = require('../database/database');
const { generateToken, authenticateToken } = require('../middleware/auth');

const router = express.Router();
const db = new Database();
db.init();

// Register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('first_name').trim().isLength({ min: 2 }),
  body('last_name').trim().isLength({ min: 2 }),
  body('phone').optional().isMobilePhone('fa-IR'),
  body('national_id').optional().isLength({ min: 10, max: 10 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'اطلاعات وارد شده نامعتبر است',
        errors: errors.array()
      });
    }

    const { email, password, first_name, last_name, phone, national_id, birth_date, address } = req.body;

    // Check if user already exists
    const database = db.getDatabase();
    database.get(
      'SELECT id FROM users WHERE email = ? OR national_id = ?',
      [email, national_id],
      async (err, row) => {
        if (err) {
          return res.status(500).json({ message: 'خطای داخلی سرور' });
        }

        if (row) {
          return res.status(400).json({ 
            message: 'کاربر با این ایمیل یا کد ملی قبلاً ثبت‌نام کرده است' 
          });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        database.run(
          `INSERT INTO users (email, password, first_name, last_name, phone, national_id, birth_date, address)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [email, hashedPassword, first_name, last_name, phone, national_id, birth_date, address],
          function(err) {
            if (err) {
              return res.status(500).json({ message: 'خطا در ثبت‌نام کاربر' });
            }

            const user = {
              id: this.lastID,
              email,
              first_name,
              last_name,
              role: 'user'
            };

            const token = generateToken(user);

            res.status(201).json({
              message: 'ثبت‌نام با موفقیت انجام شد',
              user: {
                id: user.id,
                email: user.email,
                name: `${user.first_name} ${user.last_name}`,
                role: user.role
              },
              token
            });
          }
        );
      }
    );
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'خطای داخلی سرور' });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'اطلاعات وارد شده نامعتبر است',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;
    const database = db.getDatabase();

    database.get(
      'SELECT * FROM users WHERE email = ?',
      [email],
      async (err, user) => {
        if (err) {
          return res.status(500).json({ message: 'خطای داخلی سرور' });
        }

        if (!user) {
          return res.status(401).json({ 
            message: 'ایمیل یا رمز عبور اشتباه است' 
          });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return res.status(401).json({ 
            message: 'ایمیل یا رمز عبور اشتباه است' 
          });
        }

        const token = generateToken(user);

        res.json({
          message: 'ورود با موفقیت انجام شد',
          user: {
            id: user.id,
            email: user.email,
            name: `${user.first_name} ${user.last_name}`,
            role: user.role
          },
          token
        });
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'خطای داخلی سرور' });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, (req, res) => {
  const database = db.getDatabase();
  
  database.get(
    'SELECT id, email, first_name, last_name, phone, national_id, birth_date, address, role, created_at FROM users WHERE id = ?',
    [req.user.id],
    (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'خطای داخلی سرور' });
      }

      if (!user) {
        return res.status(404).json({ message: 'کاربر پیدا نشد' });
      }

      res.json({
        user: {
          ...user,
          name: `${user.first_name} ${user.last_name}`
        }
      });
    }
  );
});

// Update user profile
router.put('/profile', authenticateToken, [
  body('first_name').optional().trim().isLength({ min: 2 }),
  body('last_name').optional().trim().isLength({ min: 2 }),
  body('phone').optional().isMobilePhone('fa-IR'),
  body('address').optional().trim()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'اطلاعات وارد شده نامعتبر است',
      errors: errors.array()
    });
  }

  const { first_name, last_name, phone, address } = req.body;
  const database = db.getDatabase();

  database.run(
    `UPDATE users SET 
     first_name = COALESCE(?, first_name),
     last_name = COALESCE(?, last_name),
     phone = COALESCE(?, phone),
     address = COALESCE(?, address),
     updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [first_name, last_name, phone, address, req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'خطا در به‌روزرسانی پروفایل' });
      }

      res.json({ message: 'پروفایل با موفقیت به‌روزرسانی شد' });
    }
  );
});

// Verify token
router.get('/verify', authenticateToken, (req, res) => {
  res.json({ 
    valid: true, 
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role
    }
  });
});

module.exports = router;