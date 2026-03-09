# 🌐 HelpLink — UnityDrop

A full-stack web platform connecting **organ donors**, **NGOs**, and **hospitals** — with a built-in **Hospital Indoor Asset Tracking System** powered by BLE beacon simulation.

> Built by **Team CreXter**

---

## ✨ Features

### 🫀 Organ Donation System
- **Donor Registration** — Multi-step wizard to pledge organs (kidney, liver, heart, etc.)
- **Donor Dashboard** — Search donations by email/phone, view approval status & tracking timeline
- **NGO Dashboard** — Review all donor registrations, approve or reject with hospital & doctor details
- **Organ Detail Pages** — Detailed info on each organ including eligibility, procedure & recovery

### 🏥 Hospital Indoor Asset Tracking
- **Live BLE Simulation** — Equipment (wheelchairs, stretchers, IV stands, oxygen cylinders) moves across 6 hospital zones in real-time
- **Interactive Floor Plan** — SVG hospital layout showing live device positions
- **Equipment Inventory** — Table with status toggle (Available / In Use / Maintenance), battery levels & last-updated timestamps
- **Movement History** — Real-time log of device zone transitions with signal strength
- **Zone Overview** — Device count per zone with visual progress bars

### 🍽️ Food Donation
- Dedicated food donation page

### 📊 Dashboard & Analytics
- Central dashboard with data visualization using Recharts

### 🎨 UI/UX
- Dark-themed responsive design with GSAP page transitions
- Custom cursor glow effect
- Scroll progress bar
- Smooth animations throughout

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 7, React Router 7 |
| **Styling** | Custom CSS (dark theme) |
| **Animations** | GSAP, ScrollTrigger |
| **Icons** | Lucide React |
| **Charts** | Recharts |
| **Backend** | Express.js 4, Node.js |
| **Database** | MongoDB with Mongoose 8 |
| **Auth** | JWT + bcryptjs |
| **Simulation** | Custom BLE beacon simulator |

---

## 📁 Project Structure

```
helplink/
├── frontend/
│   ├── components/
│   │   ├── layout/          # Navbar, Footer
│   │   ├── tracking/        # Asset tracking components (6 files)
│   │   └── ui/              # Reusable UI components
│   ├── context/
│   │   └── DonorContext.jsx  # Donor state management (API-backed)
│   ├── data/
│   │   └── mockData.js      # Organ data, fallback NGOs
│   ├── hooks/
│   │   └── useTrackingData.js
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Campaigns.jsx         # Donor registration form
│   │   ├── NGOs.jsx              # NGO dashboard (approve/reject donors)
│   │   ├── DonarDashboard.jsx    # Donor dashboard
│   │   ├── Hospital.jsx
│   │   ├── AssetTracking/        # Indoor asset tracking page
│   │   ├── FoodDonation.jsx
│   │   ├── Dashboard.jsx
│   │   ├── About.jsx
│   │   ├── Donate.jsx
│   │   └── OrganDetail.jsx
│   ├── services/
│   │   └── api.js            # API client (donors, ngos, equipment, history)
│   ├── App.jsx
│   ├── main.jsx
│   └── vite.config.js        # Proxy /api → localhost:5000
│
├── backend/
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── controllers/
│   │   ├── donorController.js
│   │   └── equipmentController.js
│   ├── middleware/
│   │   └── auth.js           # JWT authentication
│   ├── models/
│   │   ├── Donor.js
│   │   ├── Equipment.js
│   │   ├── MovementHistory.js
│   │   ├── Hospital.js
│   │   ├── NGO.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── donors.js
│   │   ├── equipment.js
│   │   ├── history.js
│   │   ├── hospitals.js
│   │   └── ngos.js
│   ├── simulator/
│   │   └── bleSimulator.js   # BLE beacon movement simulator
│   ├── seed.js               # Seed NGO data
│   ├── seedEquipment.js      # Seed equipment data
│   └── server.js
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+)
- **MongoDB** running locally on default port 27017

### 1. Clone the Repository

```bash
git clone https://github.com/sujal-mane/Team_CreXter.git
cd Team_CreXter
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/helplink
JWT_SECRET=your_secret_key_here
```

Seed the database:

```bash
node seed.js
node seedEquipment.js
```

Start the backend server:

```bash
node server.js
```

The API will run on `http://localhost:5000`.

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173` with API requests proxied to the backend.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register user |
| `POST` | `/api/auth/login` | Login user |
| `GET` | `/api/donors` | Get all donors |
| `POST` | `/api/donors` | Register a donor |
| `GET` | `/api/donors/search?email=...` | Search donor |
| `PATCH` | `/api/donors/:id/status` | Approve/reject donor |
| `PATCH` | `/api/donors/:id/tracking` | Update tracking stage |
| `GET` | `/api/ngos` | Get all NGOs |
| `GET` | `/api/hospitals` | Get all hospitals |
| `GET` | `/api/equipment` | Get all equipment |
| `POST` | `/api/equipment/update-location` | Update device location |
| `PATCH` | `/api/equipment/:id/status` | Toggle equipment status |
| `GET` | `/api/history` | Get movement history |

---

## 🔄 Data Flow

```
Donor registers (Campaigns page)
        ↓
  Saved as "pending" in MongoDB
        ↓
  Appears on NGO Dashboard
        ↓
  NGO approves (with hospital, doctor, date)
  or rejects the donation
        ↓
  Status updates in DB
        ↓
  Donor sees updated status on Donor Dashboard
```

---

## 🏥 Asset Tracking — How It Works

1. **Equipment seeded** into MongoDB (wheelchairs, stretchers, IV stands, oxygen cylinders)
2. **BLE Simulator** (`bleSimulator.js`) runs on the backend and randomly moves equipment between 6 hospital zones every 5–8 seconds
3. **Frontend** auto-refreshes every 5 seconds via the `useTrackingData` hook
4. **SVG floor plan** renders live device positions with low-battery alerts
5. **Movement history** logs every zone transition with timestamps and signal strength

---

## 👥 Team CreXter

Built with ❤️ for healthcare innovation.

---

## 📄 License

ISC
