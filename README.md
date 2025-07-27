# بیمه امیری - Amiri Insurance

سامانه آنلاین خرید و مدیریت بیمه‌نامه با پشتیبانی کامل از زبان فارسی

## توضیحات پروژه

این پروژه یک سامانه کامل برای خرید آنلاین بیمه‌نامه است که شامل موارد زیر می‌باشد:

### ویژگی‌های کلیدی:
- **رابط کاربری فارسی**: پشتیبانی کامل از RTL و فونت‌های فارسی
- **سیستم احراز هویت**: ثبت‌نام و ورود کاربران
- **طرح‌های بیمه**: بیمه شخص ثالث، بدنه، آتش‌سوزی، درمان
- **محاسبه قیمت**: سیستم هوشمند محاسبه قیمت بیمه
- **خرید آنلاین**: فرآیند خرید ساده و امن
- **داشبورد کاربری**: مدیریت بیمه‌نامه‌ها و پرداخت‌ها
- **سیستم خسارت**: ثبت و پیگیری درخواست‌های خسارت
- **پرداخت موک**: شبیه‌سازی درگاه پرداخت

### تکنولوژی‌های استفاده شده:

**Backend:**
- Node.js + Express.js
- SQLite Database
- JWT Authentication
- bcryptjs for password hashing
- Express Validator
- CORS & Security middleware

**Frontend:**
- React 18 + TypeScript
- Styled Components
- React Router
- Axios for API calls
- Persian/Farsi localization

## نصب و راه‌اندازی

### پیش‌نیازها:
- Node.js (نسخه 16 یا بالاتر)
- npm یا yarn

### مراحل نصب:

1. **کپی کردن پروژه:**
```bash
git clone <repository-url>
cd amiri-insurance
```

2. **نصب وابستگی‌ها:**
```bash
# نصب وابستگی‌های کلی
npm install

# نصب وابستگی‌های سرور
cd server
npm install

# نصب وابستگی‌های کلاینت
cd ../client
npm install
```

3. **راه‌اندازی سرور:**
```bash
# از ریشه پروژه
npm run server
```
سرور روی پورت 5000 اجرا می‌شود: http://localhost:5000

4. **راه‌اندازی کلاینت:**
```bash
# در ترمینال جدید، از ریشه پروژه
npm run client
```
کلاینت روی پورت 3000 اجرا می‌شود: http://localhost:3000

5. **اجرای همزمان (توصیه شده):**
```bash
# از ریشه پروژه
npm run dev
```

## ساختار پروژه

```
amiri-insurance/
├── server/                 # Backend (Node.js + Express)
│   ├── routes/            # API Routes
│   ├── database/          # Database models & setup
│   ├── middleware/        # Authentication & validation
│   └── index.js           # Server entry point
├── client/                # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts (Auth)
│   │   ├── styles/        # Styled components & themes
│   │   └── App.tsx        # Main App component
│   └── public/            # Static files
├── package.json           # Main package file
└── README.md             # این فایل
```

## API Endpoints

### Authentication:
- `POST /api/auth/register` - ثبت‌نام کاربر جدید
- `POST /api/auth/login` - ورود کاربر
- `GET /api/auth/profile` - دریافت پروفایل کاربر
- `PUT /api/auth/profile` - به‌روزرسانی پروفایل

### Insurance:
- `GET /api/insurance/plans` - دریافت طرح‌های بیمه
- `POST /api/insurance/quote` - محاسبه قیمت
- `POST /api/insurance/purchase` - خرید بیمه‌نامه
- `GET /api/insurance/my-policies` - بیمه‌نامه‌های کاربر

### Payment:
- `POST /api/payment/process` - پردازش پرداخت
- `GET /api/payment/history` - تاریخچه پرداخت‌ها

### Dashboard:
- `GET /api/dashboard/overview` - داده‌های داشبورد
- `POST /api/dashboard/claims` - ثبت درخواست خسارت
- `GET /api/dashboard/claims` - درخواست‌های خسارت

## اطلاعات تست

برای تست سیستم می‌توانید از اطلاعات زیر استفاده کنید:

**کاربر تست:**
- ایمیل: test@amiri.com
- رمز عبور: 123456

یا حساب جدیدی ایجاد کنید.

## ویژگی‌های طراحی

### رنگ‌بندی:
- اصلی: #87cfd1 (آبی مایل به سبز)
- ثانویه: #9093de (بنفش روشن)
- تیره: #14142f (سرمه‌ای تیره)
- سفید: #ffffff

### فونت:
- اصلی: Digi Hamishe، Vazir
- پشتیبان: Tahoma، Arial

### ویژگی‌های RTL:
- پشتیبانی کامل از راست به چپ
- تنظیمات فونت فارسی
- طراحی responsive
- سازگاری با مرورگرهای مختلف

## توسعه و سفارشی‌سازی

### اضافه کردن طرح بیمه جدید:
1. طرح را در دیتابیس اضافه کنید
2. کامپوننت کارت بیمه را به‌روزرسانی کنید
3. منطق محاسبه قیمت را تنظیم کنید

### اضافه کردن صفحه جدید:
1. کامپوننت صفحه را در `client/src/pages/` ایجاد کنید
2. مسیر را در `App.tsx` اضافه کنید
3. لینک را در Navbar اضافه کنید

### تغییر طراحی:
- رنگ‌ها: `client/src/styles/theme.ts`
- استایل‌های کلی: `client/src/styles/GlobalStyle.ts`
- کامپوننت‌های styled: در فایل‌های مربوطه

## مشارکت

برای مشارکت در این پروژه:
1. Fork کنید
2. Branch جدید ایجاد کنید
3. تغییرات خود را commit کنید
4. Pull Request ارسال کنید

## مجوز

این پروژه تحت مجوز MIT منتشر شده است.

## پشتیبانی

برای سوالات و پشتیبانی:
- ایمیل: support@amiri-insurance.com
- تلفن: ۰۲۱-۱۲۳۴۵۶۷۸

---

**نکته:** این پروژه برای اهداف آموزشی طراحی شده و برای استفاده تجاری نیاز به تنظیمات امنیتی و عملکردی بیشتری دارد.