# Patent Blockchain

سیستم ثبت و تأیید اسناد (مالکیت معنوی/اختراع) با استفاده از بلاک‌چین

## معرفی

این پروژه یک سیستم ثبت مالکیت معنوی است که هش اسناد را در بلاک‌چین اتریوم (Ganache) ذخیره می‌کند. با این روش می‌توان تاریخ ثبت سند را به صورت غیرقابل تغییر ثبت کرد و در آینده اصالت و زمان ثبت آن را تأیید نمود.

## ساختار پروژه

```
patent-blockchain/
├── backend/                    # بک‌اند Django
│   ├── core/                   # اپلیکیشن اصلی
│   │   ├── models.py           # مدل PatentRecord
│   │   ├── views.py            # ثبت و تأیید سند
│   │   └── urls.py
│   ├── patent_project/         # تنظیمات Django
│   ├── contracts/
│   │   └── PatentRegistry.sol  # قرارداد هوشمند
│   ├── blockchain_utils.py     # ارتباط با بلاک‌چین
│   ├── compile_deploy.py       # deploy قرارداد
│   └── requirements.txt        # وابستگی‌های پایتون
└── frontend/                   # فرانت‌اند React
    ├── src/
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   └── VerifyPage.jsx
    │   └── components/
    └── package.json            # وابستگی‌های Node
```

## پیش‌نیازها

- Python 3.10+
- Node.js 18+
- Ganache (برای بلاک‌چین محلی)

## نصب و راه‌اندازی

### ۱. Clone پروژه
```bash
git clone https://github.com/aminyz/patent-blockchain.git
cd patent-blockchain
```

### ۲. راه‌اندازی بک‌اند

```bash
cd backend

# ساخت محیط مجازی
python -m venv venv

# فعال‌سازی (Windows)
venv\Scripts\activate

# فعال‌سازی (Linux/Mac)
source venv/bin/activate

# نصب وابستگی‌ها
pip install -r requirements.txt

# اجرای migration
python manage.py migrate
```

### ۳. راه‌اندازی فرانت‌اند

```bash
cd frontend
npm install
```

### ۴. اجرای Ganache
نرم‌افزار Ganache را روی پورت `7545` اجرا کنید.

### ۵. Deploy قرارداد هوشمند
```bash
cd backend
python compile_deploy.py
```

### ۶. اجرای سرور

**بک‌اند:**
```bash
cd backend
python manage.py runserver
```

**فرانت‌اند:**
```bash
cd frontend
npm start
```

## API Endpoints

| Method | Endpoint | توضیح |
|--------|----------|-------|
| GET/POST | `/register/` | ثبت سند جدید |
| GET/POST | `/verify/` | تأیید سند |

## تکنولوژی‌ها

- **Backend**: Django + Django REST Framework
- **Blockchain**: Web3.py + Solidity + Ganache
- **Frontend**: React + Axios + Framer Motion
- **Database**: SQLite
