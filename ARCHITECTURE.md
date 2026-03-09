# 🏗️ Architecture — HelpLink (UnityDrop)

> System architecture, data flow, and component design of the HelpLink platform.

---

## High-Level Overview

HelpLink is a **MERN stack** application (MongoDB · Express · React · Node.js) for organ/food donation management and hospital indoor asset tracking. The system consists of three layers:

```
┌──────────────────────────────────────────────────────────────┐
│                    React SPA (Vite, port 5173)               │
│   ┌──────────┐  ┌─────────────┐  ┌────────────────────────┐ │
│   │ React    │  │ DonorContext │  │ useTrackingData (poll) │ │
│   │ Router 7 │  │ (global)    │  │ 5s auto-refresh        │ │
│   └────┬─────┘  └──────┬──────┘  └───────────┬────────────┘ │
│        │               │                      │              │
│        │         api.js (fetch wrapper)        │              │
│        │               │                      │              │
│        └───────────────┼──────────────────────┘              │
│                        │  /api/* requests                    │
└────────────────────────┼─────────────────────────────────────┘
                         │  Vite dev proxy
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                Express REST API (port 5000)                   │
│                                                               │
│   cors · json parser · JWT auth middleware                    │
│                                                               │
│   /api/auth       ← register, login, get user                │
│   /api/donors     ← CRUD + approve/reject + tracking         │
│   /api/ngos       ← list & manage NGOs                       │
│   /api/hospitals  ← list & manage hospitals                  │
│   /api/equipment  ← live equipment inventory                 │
│   /api/history    ← movement event log                       │
│                                                               │
│   BLE Simulator (ticks every 5–8 seconds)                    │
│     └── moves equipment between zones                        │
│     └── writes MovementHistory records                       │
└──────────────────────┬───────────────────────────────────────┘
                       │  Mongoose ODM
                       ▼
┌──────────────────────────────────────────────────────────────┐
│                   MongoDB (helplink DB)                       │
│                                                               │
│   Collections: users · donors · ngos · hospitals             │
│                equipments · movementhistories                 │
└──────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Provider & Wrapper Tree

```
BrowserRouter
  └── DonorProvider (React Context — donor state)
        └── AppInner
              ├── ScrollToTop        (scroll to top on route change)
              ├── ScrollProgress     (top progress bar)
              ├── CursorGlow         (custom cursor with GSAP)
              ├── Navbar             (fixed top nav with mobile menu)
              ├── PageTransition     (GSAP fade/blur/scale per route)
              │     └── <Routes />
              └── Footer
```

### Route Map

| Path | Component | Purpose |
|------|-----------|---------|
| `/` | `Home` | Landing page |
| `/campaigns` | `Campaigns` | Donor registration (multi-step form) |
| `/campaigns/:id` | `OrganDetail` | Organ detail page |
| `/register-donor` | `DonorRegistration` | Alternate donor form |
| `/donar-dashboard` | `DonarDashboard` | Donor personal dashboard |
| `/food-donation` | `FoodDonation` | Food donation module |
| `/ngos` | `NGOs` | NGO admin dashboard (approve/reject donors) |
| `/dashboard` | `Dashboard` | Treatment analytics dashboard |
| `/about` | `About` | About page |
| `/hospital` | `Hospital` | Hospital listing |
| `/asset-tracking` | `AssetTracking` | BLE equipment tracking dashboard |
| `/donate` | `Donate` | Donation page |
| `*` | `NotFound` | 404 catch-all |

### Component Hierarchy

```
frontend/
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx            ← Fixed nav, GSAP animations, mobile menu
│   │   └── Footer.jsx
│   ├── tracking/
│   │   ├── StatsCards.jsx        ← Summary cards (total, available, in-use, low battery)
│   │   ├── HospitalLayout.jsx   ← SVG floor plan with live device markers
│   │   ├── EquipmentTable.jsx   ← Inventory table with status toggle
│   │   ├── MovementHistory.jsx  ← Movement event log
│   │   ├── ZoneOverview.jsx     ← Per-zone device counts
│   │   └── TrackingSidebar.jsx  ← Sidebar navigation (Dashboard/Equipment/History)
│   └── ui/
│       └── CampaignCard.jsx     ← Reusable campaign card
├── context/
│   └── DonorContext.jsx          ← Global donor state (API-backed)
├── hooks/
│   └── useTrackingData.js        ← Polling hook (5s interval)
├── services/
│   └── api.js                    ← Centralized fetch wrapper
├── data/
│   └── mockData.js               ← Organ data, fallback NGOs
└── pages/
    └── (13 page components)
```

### State Management

**DonorContext** — React Context providing:

| Method | API Call | Purpose |
|--------|----------|---------|
| `registerDonor(data)` | `POST /api/donors` | Create donor registration |
| `updateDonorStatus(id, status, details)` | `PATCH /api/donors/:id/status` | NGO approve/reject |
| `updateTracking(id, stageIndex, note)` | `PATCH /api/donors/:id/tracking` | Update tracking stage |
| `searchDonor({email, phone})` | `GET /api/donors/search` | Search donor |
| `refetch()` | `GET /api/donors` | Reload all donors |

**useTrackingData** — Polling hook:
- Calls `equipmentApi.getAll()` + `historyApi.getAll(50)` in parallel via `Promise.all`
- Auto-refreshes every **5 seconds** via `setInterval`
- Returns `{ equipment, history, loading, search, setSearch, refetch }`

### API Client (`services/api.js`)

Centralized fetch wrapper using relative `/api` paths (proxied by Vite in dev):

| Module | Endpoints |
|--------|-----------|
| `donorApi` | `register`, `getAll`, `getById`, `search`, `updateStatus`, `updateTracking` |
| `ngoApi` | `getAll`, `getById` |
| `hospitalApi` | `getAll`, `getById` |
| `equipmentApi` | `getAll`, `getById`, `updateLocation`, `toggleStatus` |
| `historyApi` | `getAll` |

---

## Backend Architecture

### Server Startup Sequence

```
1. Load .env            (dotenv)
2. Connect to MongoDB   (mongoose → MONGO_URI)
3. Apply middleware      (cors, express.json)
4. Mount route handlers  (6 route groups)
5. Start HTTP server     (PORT 5000)
6. Launch BLE simulator  (2s after boot)
```

### API Endpoint Map

#### Authentication (`/api/auth`)

| Method | Path | Auth | Action |
|--------|------|------|--------|
| `POST` | `/register` | No | Register user (bcrypt hash) |
| `POST` | `/login` | No | Login → JWT token |
| `GET` | `/me` | Yes | Get current user profile |

#### Donors (`/api/donors`)

| Method | Path | Auth | Action |
|--------|------|------|--------|
| `POST` | `/` | No | Register donor |
| `GET` | `/` | No | List all donors (sorted by date desc) |
| `GET` | `/search` | No | Search by email or phone |
| `GET` | `/:id` | No | Get donor by ID |
| `PATCH` | `/:id/status` | Yes | Approve/reject with details |
| `PATCH` | `/:id/tracking` | Yes | Update tracking stage |

#### NGOs (`/api/ngos`)

| Method | Path | Auth | Action |
|--------|------|------|--------|
| `GET` | `/` | No | List all NGOs |
| `GET` | `/:id` | No | Get NGO by ID |
| `POST` | `/` | Yes | Create NGO |
| `PUT` | `/:id` | Yes | Update NGO |

#### Hospitals (`/api/hospitals`)

| Method | Path | Auth | Action |
|--------|------|------|--------|
| `GET` | `/` | No | List all hospitals |
| `GET` | `/:id` | No | Get hospital by ID |
| `POST` | `/` | Yes | Create hospital |
| `PUT` | `/:id` | Yes | Update hospital |

#### Equipment (`/api/equipment`)

| Method | Path | Auth | Action |
|--------|------|------|--------|
| `GET` | `/` | No | List equipment (`?search=` filter) |
| `GET` | `/:id` | No | Get equipment by ID |
| `POST` | `/update-location` | No | Update device location |
| `PATCH` | `/:id/status` | No | Toggle Available/In Use/Maintenance |

#### Movement History (`/api/history`)

| Method | Path | Auth | Action |
|--------|------|------|--------|
| `GET` | `/` | No | Get history (`?limit=50`) |

### Authentication Strategy

```
Client                          Server
  │                                │
  ├── POST /api/auth/login ───────►│
  │   { email, password }         │
  │                                │── bcrypt.compare()
  │◄── { token: "eyJ..." } ──────│── jwt.sign({ id, role })
  │                                │
  ├── PATCH /api/donors/:id ──────►│
  │   Authorization: Bearer eyJ... │
  │                                │── jwt.verify()
  │                                │── req.user = decoded
  │                                │── controller logic
  │◄── { updated donor } ─────────│
```

- **JWT Bearer tokens** via `jsonwebtoken`
- Token verified in `middleware/auth.js`
- Secret from `JWT_SECRET` env var
- Passwords hashed with **bcryptjs** (cost factor 12)

---

## Database Schema

### Users Collection

```
┌─────────────────────────────────────────┐
│  users                                  │
├─────────────────────────────────────────┤
│  name:      String (required, trimmed)  │
│  email:     String (required, unique)   │
│  password:  String (bcrypt hash)        │
│  role:      'user'|'ngo'|'hospital'     │
│             |'admin'  (default: 'user') │
│  createdAt: Date (auto)                 │
│  updatedAt: Date (auto)                 │
└─────────────────────────────────────────┘
```

### Donors Collection

```
┌─────────────────────────────────────────┐
│  donors                                 │
├─────────────────────────────────────────┤
│  fullName, email, phone                 │
│  dob, gender, bloodGroup                │
│  address, city, state, pincode          │
│  organs:          [Number] (organ IDs)  │
│  donationType:    'living'|'posthumous' │
│                   |'both'               │
│  medicalConditions, smoking, alcohol    │
│  chronicDisease, previousSurgery        │
│  emergencyName, emergencyPhone          │
│  status:          'pending'|'approved'  │
│                   |'rejected'           │
│  approvalDetails: {                     │
│    donationDate, donationTime,          │
│    hospital, doctor                     │
│  }                                      │
│  tracking: {                            │
│    stages: [{                           │
│      name, status, timestamp,           │
│      note, location                     │
│    }]                                   │
│  }                                      │
│  createdAt, updatedAt                   │
└─────────────────────────────────────────┘
```

### Equipment Collection

```
┌─────────────────────────────────────────┐
│  equipments                             │
├─────────────────────────────────────────┤
│  device_id:       String (unique)       │
│  equipment_type:  String                │
│  location:        String (zone name)    │
│  status:          'Available'|'In Use'  │
│                   |'Maintenance'        │
│  battery_level:   Number (0–100)        │
│  last_updated:    Date                  │
└─────────────────────────────────────────┘
```

### MovementHistory Collection

```
┌─────────────────────────────────────────┐
│  movementhistories                      │
├─────────────────────────────────────────┤
│  device_id:          String             │
│  previous_location:  String             │
│  new_location:       String             │
│  signal_strength:    Number (dBm)       │
│  timestamp:          Date               │
├─────────────────────────────────────────┤
│  INDEX: { timestamp: -1 }              │
└─────────────────────────────────────────┘
```

### NGOs Collection

```
┌─────────────────────────────────────────┐
│  ngos                                   │
├─────────────────────────────────────────┤
│  name, logo, focus, rating              │
│  campaigns, beneficiaries               │
│  verified: Boolean                      │
│  contact: { email, phone, website }     │
│  createdAt, updatedAt                   │
└─────────────────────────────────────────┘
```

### Hospitals Collection

```
┌─────────────────────────────────────────┐
│  hospitals                              │
├─────────────────────────────────────────┤
│  name, city, state, address             │
│  speciality: [String]                   │
│  contact: { email, phone }              │
│  rating, verified                       │
│  createdAt, updatedAt                   │
└─────────────────────────────────────────┘
```

---

## Key Data Flows

### 1. Donor Registration → NGO Approval

```
  Donor (Campaigns page)          Backend               NGO Dashboard
         │                           │                        │
         ├── POST /api/donors ──────►│                        │
         │   (form data)             │── save (status:pending)│
         │                           │                        │
         │                           │◄── GET /api/donors ────┤
         │                           │────── donors[] ───────►│
         │                           │                        │── Review list
         │                           │                        │
         │                           │◄── PATCH /:id/status ──┤
         │                           │    {status:'approved',  │
         │                           │     approvalDetails}    │
         │                           │                        │
  Donor Dashboard                    │                        │
         │                           │                        │
         ├── GET /api/donors/search─►│                        │
         │◄── donor (approved) ──────│                        │
         │                           │                        │
         │   Shows approval details  │                        │
         │   + tracking timeline     │                        │
```

### 2. BLE Equipment Tracking (Real-Time Simulation)

```
  BLE Simulator (server-side)         MongoDB           Frontend (5s poll)
         │                               │                    │
         │  every 5–8 seconds:           │                    │
         │                               │                    │
         ├── pick random device          │                    │
         ├── pick random new zone        │                    │
         ├── update Equipment doc ──────►│                    │
         ├── create MovementHistory ────►│                    │
         │                               │                    │
         │                               │◄── GET /equipment──┤
         │                               │──── equipment[] ──►│
         │                               │◄── GET /history ───┤
         │                               │──── events[] ─────►│
         │                               │                    │
         │                               │            ┌───────┤
         │                               │            │ Render:│
         │                               │            │ • SVG floor plan
         │                               │            │ • Stats cards
         │                               │            │ • Equipment table
         │                               │            │ • Movement log
         │                               │            │ • Zone overview
         │                               │            └───────┘
```

### 3. Authentication Flow

```
     Client                   auth.js route           middleware/auth.js
       │                          │                         │
       ├── POST /register ──────►│                         │
       │   {name,email,password} │── bcrypt(12) + save     │
       │◄── { token } ──────────│── jwt.sign({id,role})   │
       │                         │                         │
       ├── Protected request ───►│                         │
       │   Authorization: Bearer │─────────────────────────►│
       │                         │                         │── verify token
       │                         │                         │── req.user = decoded
       │                         │◄────────────────────────│
       │                         │── controller executes   │
       │◄── response ───────────│                         │
```

---

## Technology Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Frontend framework** | React 19 + Vite 7 | Fast HMR, modern JSX transform |
| **Routing** | React Router 7 | File-based params, nested layouts |
| **State management** | React Context | Lightweight, sufficient for donor state |
| **Animations** | GSAP + ScrollTrigger | Smooth transitions, scroll-linked effects |
| **Icons** | Lucide React | Tree-shakeable, consistent icon set |
| **Charts** | Recharts | React-native charting, composable |
| **Backend** | Express.js 4 | Minimal, flexible REST framework |
| **Database** | MongoDB + Mongoose 8 | Schema flexibility, JSON-native |
| **Auth** | JWT + bcryptjs | Stateless, scalable token auth |
| **Dev proxy** | Vite `server.proxy` | Seamless API calls during development |
| **Real-time simulation** | `setInterval` polling | Simple, no WebSocket infrastructure needed |

---

## Security Measures

- **Password hashing** — bcryptjs with cost factor 12
- **JWT authentication** — Bearer tokens for protected routes
- **Input encoding** — `encodeURIComponent` on all URL parameters
- **CORS** — Enabled via `cors()` middleware
- **Environment variables** — Secrets stored in `.env` (not committed)

---

## Development Setup

```bash
# Terminal 1 — Backend
cd backend
npm install
node seed.js && node seedEquipment.js   # seed data
node server.js                           # API on :5000

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev                              # SPA on :5173 (proxied to :5000)
```

**Environment variables** (`backend/.env`):
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/helplink
JWT_SECRET=<your-secret>
```
