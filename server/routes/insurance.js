const express = require('express');
const { body, validationResult } = require('express-validator');
const Database = require('../database/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const db = new Database();
db.init();

// Get all insurance plans
router.get('/plans', (req, res) => {
  const database = db.getDatabase();
  
  database.all(
    'SELECT * FROM insurance_plans WHERE is_active = 1 ORDER BY type, base_price',
    (err, plans) => {
      if (err) {
        return res.status(500).json({ message: 'خطا در دریافت طرح‌های بیمه' });
      }

      const formattedPlans = plans.map(plan => ({
        ...plan,
        features: JSON.parse(plan.features || '[]'),
        formatted_price: new Intl.NumberFormat('fa-IR').format(plan.base_price) + ' تومان',
        formatted_coverage: new Intl.NumberFormat('fa-IR').format(plan.coverage_amount) + ' تومان'
      }));

      res.json({ plans: formattedPlans });
    }
  );
});

// Get plan by ID
router.get('/plans/:id', (req, res) => {
  const database = db.getDatabase();
  
  database.get(
    'SELECT * FROM insurance_plans WHERE id = ? AND is_active = 1',
    [req.params.id],
    (err, plan) => {
      if (err) {
        return res.status(500).json({ message: 'خطا در دریافت طرح بیمه' });
      }

      if (!plan) {
        return res.status(404).json({ message: 'طرح بیمه پیدا نشد' });
      }

      const formattedPlan = {
        ...plan,
        features: JSON.parse(plan.features || '[]'),
        formatted_price: new Intl.NumberFormat('fa-IR').format(plan.base_price) + ' تومان',
        formatted_coverage: new Intl.NumberFormat('fa-IR').format(plan.coverage_amount) + ' تومان'
      };

      res.json({ plan: formattedPlan });
    }
  );
});

// Get quote for insurance
router.post('/quote', [
  body('plan_id').isInt({ min: 1 }),
  body('coverage_duration').isInt({ min: 1, max: 60 }), // months
  body('vehicle_year').optional().isInt({ min: 1300, max: 1410 }), // Persian year
  body('vehicle_value').optional().isInt({ min: 1000000 }),
  body('property_value').optional().isInt({ min: 1000000 }),
  body('age').optional().isInt({ min: 18, max: 100 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'اطلاعات وارد شده نامعتبر است',
      errors: errors.array()
    });
  }

  const { plan_id, coverage_duration, vehicle_year, vehicle_value, property_value, age } = req.body;
  const database = db.getDatabase();

  database.get(
    'SELECT * FROM insurance_plans WHERE id = ? AND is_active = 1',
    [plan_id],
    (err, plan) => {
      if (err) {
        return res.status(500).json({ message: 'خطا در محاسبه قیمت' });
      }

      if (!plan) {
        return res.status(404).json({ message: 'طرح بیمه پیدا نشد' });
      }

      // Calculate quote based on plan and user inputs
      let basePrice = plan.base_price;
      let finalPrice = basePrice;

      // Duration multiplier
      finalPrice = finalPrice * coverage_duration;

      // Type-specific calculations
      if (plan.type === 'auto' && vehicle_year && vehicle_value) {
        const currentYear = 1403; // Current Persian year
        const vehicleAge = currentYear - vehicle_year;
        
        // Older vehicles might have higher premiums
        if (vehicleAge > 10) {
          finalPrice *= 1.2;
        } else if (vehicleAge > 5) {
          finalPrice *= 1.1;
        }

        // Higher value vehicles
        if (vehicle_value > 500000000) {
          finalPrice *= 1.3;
        } else if (vehicle_value > 200000000) {
          finalPrice *= 1.15;
        }
      }

      if (plan.type === 'property' && property_value) {
        // Property value adjustment
        if (property_value > 1000000000) {
          finalPrice *= 1.4;
        } else if (property_value > 500000000) {
          finalPrice *= 1.2;
        }
      }

      if (plan.type === 'health' && age) {
        // Age-based health insurance pricing
        if (age > 60) {
          finalPrice *= 1.5;
        } else if (age > 40) {
          finalPrice *= 1.2;
        }
      }

      // Round to nearest 1000 Toman
      finalPrice = Math.round(finalPrice / 1000) * 1000;

      const quote = {
        plan_id: plan.id,
        plan_name: plan.name_fa,
        base_price: plan.base_price,
        final_price: finalPrice,
        coverage_duration,
        coverage_amount: plan.coverage_amount,
        features: JSON.parse(plan.features || '[]'),
        formatted_price: new Intl.NumberFormat('fa-IR').format(finalPrice) + ' تومان',
        monthly_price: Math.round(finalPrice / coverage_duration),
        formatted_monthly: new Intl.NumberFormat('fa-IR').format(Math.round(finalPrice / coverage_duration)) + ' تومان',
        valid_until: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        quote_id: `QUOTE_${Date.now()}_${plan_id}`
      };

      res.json({ quote });
    }
  );
});

// Purchase insurance policy
router.post('/purchase', authenticateToken, [
  body('plan_id').isInt({ min: 1 }),
  body('coverage_duration').isInt({ min: 1, max: 60 }),
  body('quote_id').isString(),
  body('vehicle_info').optional().isObject(),
  body('property_info').optional().isObject()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'اطلاعات وارد شده نامعتبر است',
      errors: errors.array()
    });
  }

  const { plan_id, coverage_duration, quote_id, vehicle_info, property_info } = req.body;
  const database = db.getDatabase();

  // First, get the plan and recalculate price (for security)
  database.get(
    'SELECT * FROM insurance_plans WHERE id = ? AND is_active = 1',
    [plan_id],
    (err, plan) => {
      if (err) {
        return res.status(500).json({ message: 'خطا در پردازش خرید' });
      }

      if (!plan) {
        return res.status(404).json({ message: 'طرح بیمه پیدا نشد' });
      }

      // Calculate final price (simplified version)
      const finalPrice = plan.base_price * coverage_duration;
      
      // Generate policy number
      const policyNumber = `POL_${Date.now()}_${req.user.id}`;
      
      // Calculate dates
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + coverage_duration);

      // Insert policy
      database.run(
        `INSERT INTO user_policies 
         (user_id, plan_id, policy_number, start_date, end_date, premium_amount, vehicle_info, property_info)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          req.user.id,
          plan_id,
          policyNumber,
          startDate.toISOString().split('T')[0],
          endDate.toISOString().split('T')[0],
          finalPrice,
          vehicle_info ? JSON.stringify(vehicle_info) : null,
          property_info ? JSON.stringify(property_info) : null
        ],
        function(err) {
          if (err) {
            console.error('Policy insert error:', err);
            return res.status(500).json({ message: 'خطا در ایجاد بیمه‌نامه' });
          }

          const policyId = this.lastID;

          res.status(201).json({
            message: 'بیمه‌نامه با موفقیت صادر شد',
            policy: {
              id: policyId,
              policy_number: policyNumber,
              plan_name: plan.name_fa,
              premium_amount: finalPrice,
              formatted_amount: new Intl.NumberFormat('fa-IR').format(finalPrice) + ' تومان',
              start_date: startDate.toISOString().split('T')[0],
              end_date: endDate.toISOString().split('T')[0],
              status: 'active'
            }
          });
        }
      );
    }
  );
});

// Get user's policies
router.get('/my-policies', authenticateToken, (req, res) => {
  const database = db.getDatabase();
  
  database.all(
    `SELECT up.*, ip.name_fa as plan_name, ip.type as plan_type
     FROM user_policies up
     JOIN insurance_plans ip ON up.plan_id = ip.id
     WHERE up.user_id = ?
     ORDER BY up.created_at DESC`,
    [req.user.id],
    (err, policies) => {
      if (err) {
        return res.status(500).json({ message: 'خطا در دریافت بیمه‌نامه‌ها' });
      }

      const formattedPolicies = policies.map(policy => ({
        ...policy,
        formatted_premium: new Intl.NumberFormat('fa-IR').format(policy.premium_amount) + ' تومان',
        formatted_paid: new Intl.NumberFormat('fa-IR').format(policy.total_paid) + ' تومان',
        vehicle_info: policy.vehicle_info ? JSON.parse(policy.vehicle_info) : null,
        property_info: policy.property_info ? JSON.parse(policy.property_info) : null,
        is_expired: new Date(policy.end_date) < new Date(),
        days_remaining: Math.ceil((new Date(policy.end_date) - new Date()) / (1000 * 60 * 60 * 24))
      }));

      res.json({ policies: formattedPolicies });
    }
  );
});

module.exports = router;