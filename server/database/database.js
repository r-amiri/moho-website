const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.db = null;
  }

  init() {
    const dbPath = path.join(__dirname, 'amiri_insurance.db');
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('خطا در اتصال به پایگاه داده:', err.message);
      } else {
        console.log('✅ اتصال به پایگاه داده SQLite برقرار شد');
        this.createTables();
      }
    });
  }

  createTables() {
    // Users table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        phone TEXT,
        national_id TEXT UNIQUE,
        birth_date DATE,
        address TEXT,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insurance plans table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS insurance_plans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name_fa TEXT NOT NULL,
        name_en TEXT NOT NULL,
        description_fa TEXT,
        description_en TEXT,
        type TEXT NOT NULL,
        base_price DECIMAL(10,2) NOT NULL,
        coverage_amount DECIMAL(12,2),
        features TEXT,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // User policies table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS user_policies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        plan_id INTEGER NOT NULL,
        policy_number TEXT UNIQUE NOT NULL,
        status TEXT DEFAULT 'active',
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        premium_amount DECIMAL(10,2) NOT NULL,
        total_paid DECIMAL(10,2) DEFAULT 0,
        vehicle_info TEXT,
        property_info TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (plan_id) REFERENCES insurance_plans (id)
      )
    `);

    // Payments table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        policy_id INTEGER,
        amount DECIMAL(10,2) NOT NULL,
        payment_method TEXT NOT NULL,
        transaction_id TEXT UNIQUE,
        status TEXT DEFAULT 'pending',
        payment_date DATETIME,
        description_fa TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (policy_id) REFERENCES user_policies (id)
      )
    `);

    // Claims table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS claims (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        policy_id INTEGER NOT NULL,
        claim_number TEXT UNIQUE NOT NULL,
        type TEXT NOT NULL,
        amount_requested DECIMAL(10,2) NOT NULL,
        amount_approved DECIMAL(10,2),
        status TEXT DEFAULT 'pending',
        description_fa TEXT,
        incident_date DATE,
        submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        reviewed_at DATETIME,
        approved_at DATETIME,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (policy_id) REFERENCES user_policies (id)
      )
    `);

    // Insert sample insurance plans
    this.insertSampleData();
  }

  insertSampleData() {
    const samplePlans = [
      {
        name_fa: 'بیمه شخص ثالث',
        name_en: 'Third Party Insurance',
        description_fa: 'پوشش خسارات وارده به شخص ثالث در تصادفات رانندگی',
        description_en: 'Coverage for third party damages in traffic accidents',
        type: 'auto',
        base_price: 2500000,
        coverage_amount: 50000000,
        features: JSON.stringify(['پوشش خسارت مالی', 'پوشش خسارت جانی', 'خدمات امداد جاده‌ای'])
      },
      {
        name_fa: 'بیمه بدنه',
        name_en: 'Comprehensive Auto Insurance',
        description_fa: 'پوشش کامل خسارات وارده به خودرو شما',
        description_en: 'Full coverage for damages to your vehicle',
        type: 'auto',
        base_price: 8500000,
        coverage_amount: 150000000,
        features: JSON.stringify(['پوشش کامل بدنه', 'پوشش سرقت', 'پوشش آتش‌سوزی', 'خدمات امداد ۲۴ ساعته'])
      },
      {
        name_fa: 'بیمه آتش‌سوزی',
        name_en: 'Fire Insurance',
        description_fa: 'پوشش خسارات آتش‌سوزی منزل و اموال',
        description_en: 'Coverage for fire damages to home and property',
        type: 'property',
        base_price: 3200000,
        coverage_amount: 200000000,
        features: JSON.stringify(['پوشش آتش‌سوزی', 'پوشش انفجار', 'پوشش صاعقه', 'پوشش اموال منزل'])
      },
      {
        name_fa: 'بیمه درمان',
        name_en: 'Health Insurance',
        description_fa: 'پوشش هزینه‌های درمان و بستری',
        description_en: 'Coverage for medical and hospitalization costs',
        type: 'health',
        base_price: 4800000,
        coverage_amount: 100000000,
        features: JSON.stringify(['پوشش بستری', 'پوشش ویزیت', 'پوشش دارو', 'پوشش آزمایش'])
      }
    ];

    // Check if plans already exist
    this.db.get("SELECT COUNT(*) as count FROM insurance_plans", (err, row) => {
      if (!err && row.count === 0) {
        const stmt = this.db.prepare(`
          INSERT INTO insurance_plans 
          (name_fa, name_en, description_fa, description_en, type, base_price, coverage_amount, features)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        samplePlans.forEach(plan => {
          stmt.run(
            plan.name_fa, plan.name_en, plan.description_fa, plan.description_en,
            plan.type, plan.base_price, plan.coverage_amount, plan.features
          );
        });

        stmt.finalize();
        console.log('✅ نمونه طرح‌های بیمه اضافه شد');
      }
    });
  }

  getDatabase() {
    return this.db;
  }

  close() {
    if (this.db) {
      this.db.close((err) => {
        if (err) {
          console.error('خطا در بستن پایگاه داده:', err.message);
        } else {
          console.log('اتصال پایگاه داده بسته شد');
        }
      });
    }
  }
}

module.exports = Database;