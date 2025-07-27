const express = require('express');
const { body, validationResult } = require('express-validator');
const Database = require('../database/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const db = new Database();
db.init();

// Get dashboard overview
router.get('/overview', authenticateToken, (req, res) => {
  const database = db.getDatabase();
  
  // Get user's statistics
  Promise.all([
    new Promise((resolve, reject) => {
      database.get(
        'SELECT COUNT(*) as count FROM user_policies WHERE user_id = ? AND status = "active"',
        [req.user.id],
        (err, result) => err ? reject(err) : resolve(result.count)
      );
    }),
    new Promise((resolve, reject) => {
      database.get(
        'SELECT COUNT(*) as count FROM claims WHERE user_id = ?',
        [req.user.id],
        (err, result) => err ? reject(err) : resolve(result.count)
      );
    }),
    new Promise((resolve, reject) => {
      database.get(
        'SELECT SUM(amount) as total FROM payments WHERE user_id = ? AND status = "completed"',
        [req.user.id],
        (err, result) => err ? reject(err) : resolve(result.total || 0)
      );
    }),
    new Promise((resolve, reject) => {
      database.all(
        `SELECT up.*, ip.name_fa as plan_name, ip.type as plan_type
         FROM user_policies up
         JOIN insurance_plans ip ON up.plan_id = ip.id
         WHERE up.user_id = ? AND up.status = "active"
         ORDER BY up.created_at DESC
         LIMIT 3`,
        [req.user.id],
        (err, result) => err ? reject(err) : resolve(result)
      );
    }),
    new Promise((resolve, reject) => {
      database.all(
        `SELECT p.*, up.policy_number
         FROM payments p
         LEFT JOIN user_policies up ON p.policy_id = up.id
         WHERE p.user_id = ?
         ORDER BY p.created_at DESC
         LIMIT 5`,
        [req.user.id],
        (err, result) => err ? reject(err) : resolve(result)
      );
    })
  ]).then(([activePolicesCount, claimsCount, totalPaid, recentPolicies, recentPayments]) => {
    const overview = {
      stats: {
        active_policies: activePolicesCount,
        total_claims: claimsCount,
        total_paid: totalPaid,
        formatted_total_paid: new Intl.NumberFormat('fa-IR').format(totalPaid) + ' تومان'
      },
      recent_policies: recentPolicies.map(policy => ({
        ...policy,
        formatted_premium: new Intl.NumberFormat('fa-IR').format(policy.premium_amount) + ' تومان',
        is_expired: new Date(policy.end_date) < new Date(),
        days_remaining: Math.ceil((new Date(policy.end_date) - new Date()) / (1000 * 60 * 60 * 24))
      })),
      recent_payments: recentPayments.map(payment => ({
        ...payment,
        formatted_amount: new Intl.NumberFormat('fa-IR').format(payment.amount) + ' تومان',
        formatted_date: payment.payment_date ? new Date(payment.payment_date).toLocaleDateString('fa-IR') : null
      }))
    };

    res.json(overview);
  }).catch(err => {
    console.error('Dashboard overview error:', err);
    res.status(500).json({ message: 'خطا در دریافت اطلاعات داشبورد' });
  });
});

// Submit a claim
router.post('/claims', authenticateToken, [
  body('policy_id').isInt({ min: 1 }),
  body('type').isIn(['accident', 'theft', 'fire', 'health', 'other']),
  body('amount_requested').isFloat({ min: 1000 }),
  body('description_fa').isString().isLength({ min: 10 }),
  body('incident_date').isISO8601()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'اطلاعات درخواست خسارت نامعتبر است',
      errors: errors.array()
    });
  }

  const { policy_id, type, amount_requested, description_fa, incident_date } = req.body;
  const database = db.getDatabase();

  // First verify the policy belongs to the user
  database.get(
    'SELECT * FROM user_policies WHERE id = ? AND user_id = ? AND status = "active"',
    [policy_id, req.user.id],
    (err, policy) => {
      if (err) {
        return res.status(500).json({ message: 'خطا در بررسی بیمه‌نامه' });
      }

      if (!policy) {
        return res.status(404).json({ message: 'بیمه‌نامه پیدا نشد یا غیرفعال است' });
      }

      // Generate claim number
      const claimNumber = `CLM_${Date.now()}_${req.user.id}`;

      // Insert claim
      database.run(
        `INSERT INTO claims 
         (user_id, policy_id, claim_number, type, amount_requested, description_fa, incident_date)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [req.user.id, policy_id, claimNumber, type, amount_requested, description_fa, incident_date],
        function(err) {
          if (err) {
            console.error('Claim insert error:', err);
            return res.status(500).json({ message: 'خطا در ثبت درخواست خسارت' });
          }

          res.status(201).json({
            message: 'درخواست خسارت با موفقیت ثبت شد',
            claim: {
              id: this.lastID,
              claim_number: claimNumber,
              type: type,
              type_fa: getClaimTypeName(type),
              amount_requested: amount_requested,
              formatted_amount: new Intl.NumberFormat('fa-IR').format(amount_requested) + ' تومان',
              status: 'pending',
              status_fa: 'در انتظار بررسی',
              submitted_at: new Date().toISOString()
            }
          });
        }
      );
    }
  );
});

// Get user's claims
router.get('/claims', authenticateToken, (req, res) => {
  const database = db.getDatabase();
  
  database.all(
    `SELECT c.*, up.policy_number, ip.name_fa as plan_name
     FROM claims c
     JOIN user_policies up ON c.policy_id = up.id
     JOIN insurance_plans ip ON up.plan_id = ip.id
     WHERE c.user_id = ?
     ORDER BY c.submitted_at DESC`,
    [req.user.id],
    (err, claims) => {
      if (err) {
        return res.status(500).json({ message: 'خطا در دریافت درخواست‌های خسارت' });
      }

      const formattedClaims = claims.map(claim => ({
        ...claim,
        type_fa: getClaimTypeName(claim.type),
        status_fa: getClaimStatusName(claim.status),
        formatted_requested: new Intl.NumberFormat('fa-IR').format(claim.amount_requested) + ' تومان',
        formatted_approved: claim.amount_approved ? 
          new Intl.NumberFormat('fa-IR').format(claim.amount_approved) + ' تومان' : null,
        formatted_submitted: new Date(claim.submitted_at).toLocaleDateString('fa-IR'),
        formatted_reviewed: claim.reviewed_at ? 
          new Date(claim.reviewed_at).toLocaleDateString('fa-IR') : null
      }));

      res.json({ claims: formattedClaims });
    }
  );
});

// Get claim by ID
router.get('/claims/:id', authenticateToken, (req, res) => {
  const database = db.getDatabase();
  
  database.get(
    `SELECT c.*, up.policy_number, ip.name_fa as plan_name
     FROM claims c
     JOIN user_policies up ON c.policy_id = up.id
     JOIN insurance_plans ip ON up.plan_id = ip.id
     WHERE c.id = ? AND c.user_id = ?`,
    [req.params.id, req.user.id],
    (err, claim) => {
      if (err) {
        return res.status(500).json({ message: 'خطا در دریافت درخواست خسارت' });
      }

      if (!claim) {
        return res.status(404).json({ message: 'درخواست خسارت پیدا نشد' });
      }

      const formattedClaim = {
        ...claim,
        type_fa: getClaimTypeName(claim.type),
        status_fa: getClaimStatusName(claim.status),
        formatted_requested: new Intl.NumberFormat('fa-IR').format(claim.amount_requested) + ' تومان',
        formatted_approved: claim.amount_approved ? 
          new Intl.NumberFormat('fa-IR').format(claim.amount_approved) + ' تومان' : null,
        formatted_submitted: new Date(claim.submitted_at).toLocaleDateString('fa-IR'),
        formatted_reviewed: claim.reviewed_at ? 
          new Date(claim.reviewed_at).toLocaleDateString('fa-IR') : null
      };

      res.json({ claim: formattedClaim });
    }
  );
});

// Helper functions
function getClaimTypeName(type) {
  const types = {
    'accident': 'تصادف',
    'theft': 'سرقت',
    'fire': 'آتش‌سوزی',
    'health': 'درمان',
    'other': 'سایر'
  };
  return types[type] || type;
}

function getClaimStatusName(status) {
  const statuses = {
    'pending': 'در انتظار بررسی',
    'under_review': 'در حال بررسی',
    'approved': 'تأیید شده',
    'rejected': 'رد شده',
    'paid': 'پرداخت شده'
  };
  return statuses[status] || status;
}

module.exports = router;