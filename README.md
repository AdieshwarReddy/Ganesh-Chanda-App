# 🐘 Ganesh Chanda 2026 — Online Donation & Festival Management Platform

A modern, transparent, full-stack donation management web application for **Ganesh Utsav 2026**. Designed to make community contributions seamless, transparent, and joyful with dynamic UPI QR payments, instant PDF/digital receipts, live collection progress tracking, and organizer admin control.

---

## 🌟 Live Deployed Links

- 🌐 **Frontend (Vercel)**: `https://ganesh-chanda-app.vercel.app` *(or your custom Vercel link)*
- ⚙️ **Backend API (Render)**: `https://ganesh-chanda-app.onrender.com`
- 📚 **Interactive API Docs (Swagger UI)**: `https://ganesh-chanda-app.onrender.com/docs`
- 🐙 **GitHub Repository**: [https://github.com/AdieshwarReddy/Ganesh-Chanda-App](https://github.com/AdieshwarReddy/Ganesh-Chanda-App)

---

## 🚀 Key Features

### 🌸 For Devotees & Donors:
- **Instant UPI Donations**: Dynamic QR code and direct GPay / PhonePe / Paytm / BHIM payment integration for any custom or preset amounts (₹501, ₹1,001, ₹2,100, ₹5,001, ₹11,000, etc.).
- **0% Platform Fees**: 100% of the funds go directly into the organizer's personal/committee bank account.
- **Official Downloadable Receipts**: Instant customized digital receipts with Bappa's blessings, serial numbers, and transaction IDs.
- **Contributors Leaderboard**: Transparent public wall honoring donors and devotees.
- **1-Click Devotee Portal**: Access transaction history and receipts without mandatory third-party logins.

### 🛡️ For Organizers & Admins:
- **Instant Admin Dashboard**: Real-time stats, total funds raised vs festival target progress bar.
- **Transaction Verification**: Review donor UTR numbers and payment screenshots before approving donations.
- **Excel/CSV Export**: One-click download of all contributor spreadsheets for committee audits.
- **Dynamic Campaign Settings**: Update target amount, UPI ID, organizer phone, and festival descriptions anytime.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, html2canvas, Axios, React Hot Toast
- **Backend**: FastAPI (Python 3.11), SQLAlchemy, Pydantic v2, Uvicorn
- **Database**: PostgreSQL (Neon Serverless Cloud DB) / SQLite (Local Dev)
- **Deployment**: Vercel (Frontend CDN) + Render.com (Backend Web Service)

---

## ⚙️ Environment Configuration

### Frontend (`frontend/.env`)
```dotenv
VITE_API_URL=https://ganesh-chanda-app.onrender.com/api
```

### Backend (`backend/.env`)
```dotenv
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require
ADMIN_EMAILS=mogiliadieshwarreddy5919@gmail.com
JWT_SECRET=d89e4f2b1a7c6e5d0f3b8a2c4e1f7a9b8c6d4e2a0f1b3c5e7a9d2f4b6c8e0a1
FRONTEND_URL=*
APP_ENV=production
```

---

## 👨‍💻 Developer & Organizer Info

- **Developed By**: **Mogili Adieshwar Reddy**
- **Location**: Hyderabad, Telangana, India
- **Phone**: `901411xxxx`
- **Email**: [mogiliadieshwarreddy5919@gmail.com](mailto:mogiliadieshwarreddy5919@gmail.com)
- **LinkedIn**: [Adieshwar Reddy Mogili](https://www.linkedin.com/in/adieshwar-reddy-mogili-3b4b11332/)
- **GitHub**: [AdieshwarReddy](https://github.com/AdieshwarReddy)
- **YouTube**: [@AdieshwarReddyMogili](https://www.youtube.com/@AdieshwarReddyMogili)

---

## 🙏 Blessings
> *Vakratunda Mahakaya Surya Koti Samaprabha*  
> *Nirvighnam Kuru Me Deva Sarva-Karyeshu Sarvada*  
> **Ganpati Bappa Morya! 🌺**
