const express = require('express');
const { body, validationResult } = require('express-validator');
const Database = require('../database/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const db = new Database();
db.init();

// Mock payment processing
router.post('/process', authenticateToken, [
  body('amount').isFloat({ min: 1000 }),
  body('payment_method').isIn(['card', 'bank_transfer', 'wallet']),
  body('policy_id').optional().isInt({ min: 1 }),
  body('description_fa').optional().isString()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'اطلاعات پرداخت نامعتبر است',
      errors: errors.array()
    });
  }

  const { amount, payment_method, policy_id, description_fa } = req.body;
  const database = db.getDatabase();

  // Generate mock transaction ID
  const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Mock payment processing - simulate 95% success rate
  const isSuccessful = Math.random() > 0.05;
  const status = isSuccessful ? 'completed' : 'failed';
  const paymentDate = isSuccessful ? new Date().toISOString() : null;

  // Insert payment record
  database.run(
    `INSERT INTO payments 
     (user_id, policy_id, amount, payment_method, transaction_id, status, payment_date, description_fa)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [req.user.id, policy_id, amount, payment_method, transactionId, status, paymentDate, description_fa],
    function(err) {
      if (err) {
        console.error('Payment insert error:', err);
        return res.status(500).json({ message: 'خطا در پردازش پرداخت' });
      }

      if (isSuccessful && policy_id) {
        // Update policy payment
        database.run(
          'UPDATE user_policies SET total_paid = total_paid + ? WHERE id = ? AND user_id = ?',
          [amount, policy_id, req.user.id]
        );
      }

      res.json({
        success: isSuccessful,
        message: isSuccessful ? 'پرداخت با موفقیت انجام شد' : 'خطا در پردازش پرداخت',
        payment: {
          id: this.lastID,
          transaction_id: transactionId,
          amount: amount,
          formatted_amount: new Intl.NumberFormat('fa-IR').format(amount) + ' تومان',
          status: status,
          payment_method: payment_method,
          payment_date: paymentDate
        }
      });
    }
  );
});

// Get payment history
router.get('/history', authenticateToken, (req, res) => {
  const database = db.getDatabase();
  
  database.all(
    `SELECT p.*, up.policy_number, ip.name_fa as plan_name
     FROM payments p
     LEFT JOIN user_policies up ON p.policy_id = up.id
     LEFT JOIN insurance_plans ip ON up.plan_id = ip.id
     WHERE p.user_id = ?
     ORDER BY p.created_at DESC`,
    [req.user.id],
    (err, payments) => {
      if (err) {
        return res.status(500).json({ message: 'خطا در دریافت تاریخچه پرداخت‌ها' });
      }

      const formattedPayments = payments.map(payment => ({
        ...payment,
        formatted_amount: new Intl.NumberFormat('fa-IR').format(payment.amount) + ' تومان',
        payment_method_fa: getPaymentMethodName(payment.payment_method),
        status_fa: getStatusName(payment.status),
        formatted_date: payment.payment_date ? new Date(payment.payment_date).toLocaleDateString('fa-IR') : null
      }));

      res.json({ payments: formattedPayments });
    }
  );
});

// Get payment by transaction ID
router.get('/transaction/:transactionId', authenticateToken, (req, res) => {
  const database = db.getDatabase();
  
  database.get(
    `SELECT p.*, up.policy_number, ip.name_fa as plan_name
     FROM payments p
     LEFT JOIN user_policies up ON p.policy_id = up.id
     LEFT JOIN insurance_plans ip ON up.plan_id = ip.id
     WHERE p.transaction_id = ? AND p.user_id = ?`,
    [req.params.transactionId, req.user.id],
    (err, payment) => {
      if (err) {
        return res.status(500).json({ message: 'خطا در دریافت اطلاعات پرداخت' });
      }

      if (!payment) {
        return res.status(404).json({ message: 'تراکنش پیدا نشد' });
      }

      const formattedPayment = {
        ...payment,
        formatted_amount: new Intl.NumberFormat('fa-IR').format(payment.amount) + ' تومان',
        payment_method_fa: getPaymentMethodName(payment.payment_method),
        status_fa: getStatusName(payment.status),
        formatted_date: payment.payment_date ? new Date(payment.payment_date).toLocaleDateString('fa-IR') : null
      };

      res.json({ payment: formattedPayment });
    }
  );
});

// Mock payment verification (for demo purposes)
router.post('/verify', authenticateToken, [
  body('transaction_id').isString()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'شناسه تراکنش نامعتبر است',
      errors: errors.array()
    });
  }

  const { transaction_id } = req.body;
  const database = db.getDatabase();

  database.get(
    'SELECT * FROM payments WHERE transaction_id = ? AND user_id = ?',
    [transaction_id, req.user.id],
    (err, payment) => {
      if (err) {
        return res.status(500).json({ message: 'خطا در تأیید پرداخت' });
      }

      if (!payment) {
        return res.status(404).json({ message: 'تراکنش پیدا نشد' });
      }

      res.json({
        verified: payment.status === 'completed',
        payment: {
          transaction_id: payment.transaction_id,
          amount: payment.amount,
          formatted_amount: new Intl.NumberFormat('fa-IR').format(payment.amount) + ' تومان',
          status: payment.status,
          status_fa: getStatusName(payment.status),
          payment_date: payment.payment_date
        }
      });
    }
  );
});

// Helper functions
function getPaymentMethodName(method) {
  const methods = {
    'card': 'کارت بانکی',
    'bank_transfer': 'انتقال بانکی',
    'wallet': 'کیف پول'
  };
  return methods[method] || method;
}

function getStatusName(status) {
  const statuses = {
    'pending': 'در انتظار',
    'completed': 'تکمیل شده',
    'failed': 'ناموفق',
    'cancelled': 'لغو شده'
  };
  return statuses[status] || status;
}

module.exports = router;