# 🐘 Ganesh Chanda 2026 — Online Donation Collection App

<div align="center">

![Ganesh Chanda](https://img.shields.io/badge/Ganesh%20Chanda-2026-orange?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6Ii8+PC9zdmc+)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

**A full-stack web application for collecting and managing Ganesh festival donations online.**

**Made with ❤️ by Mogili Adieshwar Reddy**

</div>

---

## 🌐 Live Deployed Links

| Service | URL |
|--------|-----|
| 🏠 **Frontend (Vercel)** | https://ganesh-chanda-app.vercel.app |
| 💰 **Donate Page** | https://ganesh-chanda-app.vercel.app/donate |
| 👥 **Contributors** | https://ganesh-chanda-app.vercel.app/contributors |
| 🔑 **User Login** | https://ganesh-chanda-app.vercel.app/login |
| 🛡️ **Admin Dashboard** | https://ganesh-chanda-app.vercel.app/admin/login |
| ⚙️ **Backend API (Render)** | https://ganesh-chanda-app.onrender.com |
| 📖 **API Docs (Swagger)** | https://ganesh-chanda-app.onrender.com/docs |

---

## 📌 About the Project

**Ganesh Chanda 2026** is a digital donation management platform built for apartment communities and housing societies to collect Ganesh festival contributions online. It replaces traditional paper-based collection with a modern, transparent, and real-time system.

### Key Features
- 🎯 **Live Progress Tracker** — Real-time donation goal progress bar
- 💸 **UPI Payment Integration** — Donors pay via GPay/PhonePe and upload screenshot
- 🛡️ **Admin Dashboard** — Verify, approve, reject, and export donations
- 📊 **Analytics** — Daily stats, payment method breakdown, contribution charts
- 📋 **CSV Export** — Download full contributor list for committee records
- 🏆 **Public Contributors Board** — Transparent leaderboard of donors
- 🧾 **PDF Receipt** — Auto-generated donation receipt for each contributor
- 📱 **Mobile Responsive** — Works on all devices

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18** | UI Framework |
| **Vite** | Build Tool & Dev Server |
| **React Router v6** | Client-side Routing |
| **Axios** | HTTP Client for API calls |
| **Tailwind CSS** | Utility-first Styling |
| **Lucide React** | Icon Library |
| **React Hot Toast** | Toast Notifications |
| **jsPDF** | PDF Receipt Generation |

### Backend
| Technology | Purpose |
|-----------|---------|
| **FastAPI** | Python Web Framework |
| **SQLAlchemy** | ORM (Database Models) |
| **Alembic** | Database Migrations |
| **PostgreSQL** | Production Database |
| **SQLite** | Local Development Database |
| **Pydantic v2** | Request/Response Validation |
| **Python-Jose** | JWT Token Authentication |
| **Passlib** | Password Hashing |
| **Uvicorn** | ASGI Server |

### Deployment & Infrastructure
| Service | Purpose |
|---------|---------|
| **Vercel** | Frontend Hosting (Free, CDN) |
| **Render** | Backend Hosting (Free, Python) |
| **Neon.tech** | PostgreSQL Cloud Database (Free) |
| **GitHub** | Version Control & CI/CD Trigger |

---

## 🏗️ Architecture & Code Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        USER BROWSER                         │
│                  (React + Vite on Vercel)                    │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/HTTPS (Axios)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND API SERVER                        │
│                  (FastAPI on Render)                         │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐  │
│  │  /auth   │  │/donations│  │ /campaign│  │  /admin   │  │
│  │ Router   │  │  Router  │  │  Router  │  │  Router   │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └─────┬─────┘  │
│       └─────────────┴─────────────┴───────────────┘        │
│                          │                                  │
│                   SQLAlchemy ORM                            │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    NEON PostgreSQL                          │
│              (Cloud Database — Free Tier)                    │
│                                                             │
│   users | campaigns | donations                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Complete Code Flow

### 1. User Makes a Donation
```
Donor visits /donate
    │
    ├─► Sees campaign details (title, goal, progress)
    │   └─► GET /api/campaign/current
    │
    ├─► Fills donation form (name, phone, amount, UPI ref)
    │
    ├─► Pays via GPay/PhonePe to organizer's UPI
    │
    ├─► Uploads payment screenshot
    │   └─► POST /api/donations/upload-screenshot
    │
    └─► Submits form
        └─► POST /api/donations
            └─► Status = PENDING (waits for admin verify)
```

### 2. Admin Verifies Donation
```
Admin visits /admin/login
    │
    ├─► Clicks "Enter Admin Dashboard"
    │   └─► POST /api/auth/dev-login (creates admin JWT)
    │
    ├─► Views pending donations
    │   └─► GET /api/admin/donations?status=PENDING
    │
    ├─► Reviews screenshot + details
    │
    └─► Clicks Verify ✅ or Reject ❌
        └─► PATCH /api/admin/donations/{id}/verify
            └─► Status = VERIFIED → shows on public board
```

### 3. Authentication Flow
```
User/Admin clicks Login
    │
    ├─► Frontend calls POST /api/auth/dev-login
    │   with { name, email, role }
    │
    ├─► Backend checks if user exists in DB
    │   ├─► If YES → returns JWT token
    │   └─► If NO → creates new user → returns JWT token
    │
    ├─► Frontend stores JWT in localStorage
    │
    └─► All future API calls include:
        Authorization: Bearer <JWT_TOKEN>
```

---

## 📁 Project Structure

```
Ganesh chanda app/
├── 📁 backend/                    # FastAPI Python Backend
│   ├── 📁 app/
│   │   ├── 📁 api/                # Route handlers
│   │   │   ├── auth.py            # Login, JWT auth
│   │   │   ├── donations.py       # Submit, list donations
│   │   │   ├── campaigns.py       # Campaign details
│   │   │   └── admin.py           # Admin verify/reject/stats
│   │   ├── 📁 models/             # SQLAlchemy DB models
│   │   │   ├── user.py            # User table
│   │   │   ├── campaign.py        # Campaign table
│   │   │   └── donation.py        # Donation table
│   │   ├── 📁 schemas/            # Pydantic request/response schemas
│   │   ├── 📁 services/           # Business logic
│   │   │   ├── auth_service.py    # Token creation, user lookup
│   │   │   └── donation_service.py # Donation processing
│   │   ├── 📁 core/
│   │   │   ├── config.py          # Environment variables
│   │   │   ├── security.py        # JWT creation/validation
│   │   │   └── dependencies.py    # Auth middleware
│   │   ├── 📁 database/
│   │   │   └── database.py        # DB connection (Neon/SQLite)
│   │   └── main.py                # App entry point + seed data
│   ├── requirements.txt           # Python dependencies
│   └── .env                       # Backend secrets (not in git)
│
├── 📁 frontend/                   # React + Vite Frontend
│   ├── 📁 src/
│   │   ├── 📁 pages/              # Page components
│   │   │   ├── Home.jsx           # Homepage with progress bar
│   │   │   ├── Donate.jsx         # Donation form + UPI
│   │   │   ├── Contributors.jsx   # Public leaderboard
│   │   │   ├── Login.jsx          # User login
│   │   │   ├── MyDonations.jsx    # Personal donation history
│   │   │   └── 📁 admin/
│   │   │       ├── AdminLogin.jsx     # Admin login
│   │   │       ├── AdminDashboard.jsx # Stats + overview
│   │   │       ├── AdminDonations.jsx # Verify/reject donations
│   │   │       └── AdminSettings.jsx  # Campaign settings
│   │   ├── 📁 components/
│   │   │   └── 📁 common/
│   │   │       ├── Navbar.jsx     # Top navigation
│   │   │       ├── Footer.jsx     # Footer with contact info
│   │   │       └── LoadingSpinner.jsx
│   │   ├── 📁 context/
│   │   │   └── AuthContext.jsx    # Global auth state
│   │   ├── 📁 layouts/
│   │   │   ├── PublicLayout.jsx   # Navbar + Footer wrapper
│   │   │   └── AdminLayout.jsx    # Admin sidebar wrapper
│   │   ├── 📁 services/
│   │   │   └── api.js             # Axios client + all API calls
│   │   └── 📁 utils/
│   │       └── receipt.js         # PDF receipt generator
│   ├── .env                       # VITE_API_URL (not in git)
│   └── vite.config.js
│
└── README.md                      # This file
```

---

## 🗄️ Database Schema

```sql
-- Users Table
users (
  id          UUID PRIMARY KEY,
  name        VARCHAR,
  email       VARCHAR UNIQUE,
  google_id   VARCHAR,
  role        ENUM('USER', 'ADMIN'),
  created_at  TIMESTAMP
)

-- Campaigns Table
campaigns (
  id           UUID PRIMARY KEY,
  title        VARCHAR,         -- "Ganesh Utsav 2026"
  description  TEXT,
  target_amount FLOAT,          -- e.g. 200000
  upi_id       VARCHAR,         -- organizer's UPI
  is_active    BOOLEAN,
  created_at   TIMESTAMP
)

-- Donations Table
donations (
  id              UUID PRIMARY KEY,
  campaign_id     UUID → campaigns.id,
  user_id         UUID → users.id,
  donor_name      VARCHAR,
  donor_phone     VARCHAR,
  amount          FLOAT,
  payment_method  ENUM('UPI', 'CASH', 'BANK_TRANSFER'),
  upi_reference   VARCHAR,      -- transaction ID
  screenshot_url  VARCHAR,      -- uploaded proof
  status          ENUM('PENDING', 'VERIFIED', 'REJECTED'),
  notes           TEXT,
  created_at      TIMESTAMP
)
```

---

## 🚀 Running Locally

### Prerequisites
- Python 3.11+
- Node.js 18+
- Git

### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt

# Create .env file
echo "DATABASE_URL=sqlite:///./ganesh_chanda.db" > .env
echo "SECRET_KEY=your-secret-key-here" >> .env

# Run backend
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:8000/api" > .env

# Run frontend
npm run dev
```

Visit: http://localhost:5173

---

## 🌍 Deployment Setup

### 1. Database — Neon.tech (Free PostgreSQL)
1. Sign up at [neon.tech](https://neon.tech)
2. Create project → copy connection string
3. Add to Render as `DATABASE_URL`

### 2. Backend — Render.com (Free)
1. Connect GitHub repo
2. Set **Root Directory**: `backend`
3. **Build Command**: `pip install -r requirements.txt`
4. **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. **Environment Variables**:
   ```
   DATABASE_URL = postgresql://...  (from Neon)
   SECRET_KEY   = any-random-string
   PYTHON_VERSION = 3.11.9
   FRONTEND_URL = https://ganesh-chanda-app.vercel.app
   ```

### 3. Frontend — Vercel (Free)
1. Connect GitHub repo
2. Set **Root Directory**: `frontend`
3. **Environment Variables**:
   ```
   VITE_API_URL = https://ganesh-chanda-app.onrender.com/api
   ```

---

## 👤 Contact & Credits

| | |
|--|--|
| **Made By** | Mogili Adieshwar Reddy |
| **Email** | mogiliadieshwarreddy5919@gmail.com |
| **Phone** | 9014118851 |
| **Location** | Hyderabad, Telangana, India |
| **LinkedIn** | [adieshwar-reddy-mogili](https://www.linkedin.com/in/adieshwar-reddy-mogili-3b4b11332/) |
| **GitHub** | [AdieshwarReddy](https://github.com/AdieshwarReddy/Ganesh-Chanda-App) |
| **YouTube** | [@AdieshwarReddyMogili](https://www.youtube.com/@AdieshwarReddyMogili) |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**🙏 Ganpati Bappa Morya! 🐘**

*Built with ❤️ for the community of Hyderabad*

</div>
