# Intern Attendance Tracker

A full-stack web application for tracking intern daily attendance. After login, interns are directed to a Time-In landing page where they manually record their arrival. Time-out is recorded from the dashboard with a confirmation step. Admins get a separate dashboard with stats, filters, and user management.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![Tech Stack](https://img.shields.io/badge/Tailwind_CSS-3-blue) ![Tech Stack](https://img.shields.io/badge/Express-4-green) ![Tech Stack](https://img.shields.io/badge/Supabase-PostgreSQL-purple)

---

## Features

### Attendance Tracking

- **Manual Time-In** — after login, interns land on a dedicated Time-In page (`/timein`) where they click a button to record their arrival; one record per intern per day (idempotent)
- **Manual Time-Out with Confirmation** — intern clicks "Record Time Out" on the dashboard, which opens a confirmation modal showing the current time and duration clocked in before recording
- **No Auto Time-Out on Logout** — signing out does not automatically record time-out; interns must explicitly record it from the dashboard
- **Admin Attendance Exclusion** — admin users are excluded from all attendance tracking; `POST /time-in` and `POST /time-out` return 403 for admins, and the `/timein` route redirects them to `/admin`
- **Incomplete Record Handling** — if an intern forgets to clock out, the record remains with `time_out = null` and is shown as an amber **Incomplete** badge in the history table; the next day the intern can time-in normally

### Intern Dashboard

- **Today's Status** — live clock, time-in/time-out timestamps, and a live duration counter
- **OJT Progress Tracker** — visual progress indicator for OJT hours with an editable required-hours target (persisted per-user in localStorage)
- **Scrollable Attendance History** — table with a fixed max height (`max-h-96`) and sticky header; records show three statuses: **Completed**, **Active** (today, no time-out yet), or **Incomplete** (past day with no time-out)

### Admin Dashboard

- **Stats Cards** — total interns, present today (excludes admins), and average hours
- **Date & Name Filters** — filter attendance records by date or intern name/email with 400 ms debounce on the name field
- **Scrollable Records Table** — fixed max height (`max-h-[500px]`) with sticky header; same three-state status badges as the intern view
- **XLSX Attendance Import** — bulk import attendance records via `.xlsx` files (SheetJS + multer); tolerates Google Forms date/time string formats with PHT timezone handling
- **XLSX Attendance Export** — export the currently filtered attendance records as a `.xlsx` file; filename reflects the active filter (`attendance_Allan.xlsx`, `attendance_2026-04-15.xlsx`, or `attendance_all.xlsx`)
- **User Management** — add, edit, and delete intern/admin accounts
  - Custom role dropdown (replaces native `<select>`)
  - Optional password change in the Edit User modal (min 8 chars, confirmation field, show/hide toggles)
  - Enable/disable accounts via `is_active` toggle
- **Welcome Email on Account Creation** — when a new intern account is created, an automated welcome email is sent via Resend containing the intern's login credentials and a link to the app

### Security & Authentication

- **Supabase Auth** — email/password login, no public sign-up
- **Remember Me** — checkbox on the login page; when checked the session persists across browser restarts (localStorage); when unchecked the session is cleared on browser close (sessionStorage). Preference is saved and pre-filled on subsequent visits
- **Forced Password Change on First Login** — when an admin creates a new intern account, `must_change_password` is set to `true`. On first login the intern sees an undismissable modal requiring them to set a new password before continuing. After a successful change the intern is signed out and must log in again with their new password
- **Role-Based Access** — separate views for `intern` and `admin` roles, secured by RLS policies
- **IP Restriction** — API access restricted to whitelisted office IPs via `ALLOWED_OFFICE_IP` env var; localhost always allowed for development
- **Disabled Account Handling** — accounts with `is_active = false` are blocked at the auth middleware level (403 `ACCOUNT_DISABLED`); on the frontend, disabled users are signed out immediately and shown an error banner on the login page
- **Network Accessibility** — server bound to `0.0.0.0` for local network access

---

## Project Structure

```
intern-attendance-tracker/
├── client/              # React + Vite + Tailwind CSS frontend
│   ├── src/
│   │   ├── lib/
│   │   │   ├── api.js           # Authenticated fetch helpers for all API calls
│   │   │   └── supabaseClient.js # Supabase browser client (storage-aware)
│   │   ├── pages/
│   │   │   ├── Login.jsx        # Login page with Remember Me, Access Denied & Account Disabled banners
│   │   │   ├── TimeInPage.jsx   # Time-In landing page with forced password-change modal
│   │   │   ├── InternDashboard.jsx # Intern view with OJT tracker & time-out confirmation
│   │   │   └── AdminDashboard.jsx  # Admin view with stats, import/export, user management
│   │   ├── App.jsx      # Routing, auth state, TimeInGuard
│   │   ├── main.jsx     # Entry point
│   │   └── index.css    # Global styles, glassmorphism, scrollbar, animations
│   ├── Dockerfile       # Docker image for the Vite frontend
│   ├── .dockerignore
│   ├── tailwind.config.js
│   ├── vite.config.js   # allowedHosts: true, /api proxy → localhost:3001
│   └── package.json
├── server/              # Express backend (ESM)
│   ├── lib/
│   │   ├── supabase.js  # Supabase admin client (service-role key, bypasses RLS)
│   │   └── mailer.js    # Resend welcome-email sender
│   ├── middleware/
│   │   ├── auth.js      # JWT verification, profile fetch, is_active guard, adminOnly()
│   │   └── ipRestriction.js # Office IP whitelist middleware
│   ├── routes/
│   │   ├── attendance.js  # time-in, time-out, today, history, change-password
│   │   └── admin.js       # attendance, stats, users CRUD, import, export
│   ├── index.js         # Express entry point, bound to 0.0.0.0:3001
│   ├── Dockerfile       # Docker image for the Express backend
│   ├── .dockerignore
│   └── package.json
├── supabase/
│   └── migration.sql    # Database schema (users, attendance, RLS, triggers)
├── docker-compose.yml   # Orchestrates server + client containers
├── .env.example
├── .gitignore
└── README.md
```

---

## Prerequisites

- **Node.js** v18+ and **npm** *(not needed if using Docker)*
- **Docker** and **Docker Compose** *(optional — alternative to running manually)*
- A **Supabase** project (free tier works)
- A **Resend** account (free tier) for welcome emails

---

## Setup Instructions

### 1. Clone & Install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → **New Query**
3. Paste the contents of `supabase/migration.sql` and run it
4. Add the extra columns not included in the base migration:

```sql
-- Allows admins to disable intern accounts
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;

-- Forces a password change on the intern's first login
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN NOT NULL DEFAULT false;
```

5. Go to **Authentication** → **Users** and create test accounts (one intern, one admin)
6. For each user, insert a matching row in the `users` table:

```sql
INSERT INTO public.users (id, name, email, role, department)
VALUES
  ('<auth-user-uuid>', 'John Intern', 'john@company.com', 'intern', 'Engineering'),
  ('<auth-admin-uuid>', 'Jane Admin', 'jane@company.com', 'admin', 'HR');
```

7. Copy your project URL, anon key, and service role key from **Settings** → **API**

### 3. Email Setup (Resend)

The app sends a welcome email to every newly created intern account containing their login credentials.

1. Go to [resend.com](https://resend.com) and create a free account
2. Go to **API Keys** → **Create API Key** and copy the key
3. Set `RESEND_API_KEY` in your `.env` file (see below)

> **Free-tier note:** With `RESEND_FROM_EMAIL=onboarding@resend.dev` (Resend's shared test address), emails can only be delivered to your **own verified email address**. To send to any intern's inbox, verify a custom domain under **Resend → Domains**.

If the email send fails for any reason (network error, invalid key, unverified recipient), the account is still created and the error is logged as a warning — the failure is non-blocking.

### 4. Environment Variables

Copy `.env.example` to `.env` in the project root and fill in your credentials:

```bash
cp .env.example .env
```

```env
# ── Supabase ──────────────────────────────────────────────
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ── Frontend (Vite uses VITE_ prefix) ────────────────────
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=

# ── Email (Resend) ────────────────────────────────────────
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=onboarding@resend.dev
APP_URL=http://localhost:5173

# ── Server ────────────────────────────────────────────────
PORT=3001

# ── IP Restriction (comma-separated list of allowed IPs) ──
# Leave empty to allow all IPs (development mode)
ALLOWED_OFFICE_IP=
```

> **`VITE_API_URL`** — leave empty so the Vite dev-server proxy (`/api → localhost:3001`) handles all API calls. Set to `http://localhost:3001` only if you run the frontend without the Vite proxy.

### 5. Run the App

Open **two terminals**:

```bash
# Terminal 1 — Backend
cd server
npm run dev
# → Server running on http://0.0.0.0:3001

# Terminal 2 — Frontend
cd client
npm run dev
# → App running on http://localhost:5173
```

### 6. Use the App

1. Open `http://localhost:5173` in your browser
2. Sign in with an intern account → you'll land on the **Time-In** page
   - On first login (new account), a **Change Password** modal appears — set a new password to continue, then log in again
3. Click **Record Time-In** → you'll be redirected to the intern dashboard
4. Click **Record Time Out** → confirm in the modal → time-out is recorded
5. Sign in with an admin account → see stats, filter attendance logs, manage users

---

## Docker Setup

Docker is an alternative to running the app manually. Supabase is **not** containerized — it remains an external cloud service.

```bash
# Build and start both containers (server + client)
docker-compose up --build

# Run in background
docker-compose up --build -d

# Stop and remove containers
docker-compose down
```

Once running, the app is accessible at `http://localhost:5173` (frontend) and `http://localhost:3001` (backend API).

**How it works:**
- `docker-compose.yml` defines two services: `server` (port 3001) and `client` (port 5173).
- Both services load environment variables from the root `.env` file via `env_file: - .env`.
- Source directories are mounted as volumes so code changes are reflected without rebuilding.
- An anonymous volume over `/app/node_modules` prevents the host's Windows `node_modules` from overwriting the Linux container's installed packages.
- `client` depends on `server`, so Compose starts the backend first.

> **`VITE_API_URL`** — keep this empty in `.env` when using Docker so the Vite proxy (`/api → localhost:3001`) handles all API calls within the same host. The proxy target `http://localhost:3001` in `vite.config.js` resolves correctly because both ports are bound on the host.

---

## Tunnel Access (Cloudflare / ngrok)

To share the app over the internet via a tunnel:

```bash
# Install cloudflared (Windows)
# Download from: https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.msi

# Start the frontend tunnel (Vite proxy forwards /api calls to the local backend)
cloudflared tunnel --url http://localhost:5173
```

The `vite.config.js` already sets `allowedHosts: true` (boolean), which tells Vite to accept requests from any hostname, including dynamically assigned tunnel URLs. Without this, Vite blocks the request with a "This host is not allowed" error.

You only need **one tunnel** on port `5173`. The Vite dev-server proxy automatically forwards all `/api/*` requests to `localhost:3001` on the same machine, so the backend is never directly exposed.

```
Browser (via tunnel) → https://xyz.trycloudflare.com → Vite :5173 → /api proxy → Express :3001
```

---

## Client-Side Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/login` | Public | Login page; redirects to `/timein` (intern) or `/admin` (admin) if authenticated |
| `/timein` | Intern only | Time-In landing page; shows forced password modal if `must_change_password = true`; redirects to `/dashboard` if already clocked in today |
| `/dashboard` | Intern only | Intern dashboard with today's status, history, and OJT progress |
| `/admin` | Admin only | Admin dashboard with stats, filters, attendance log, and user management |

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/health` | — | Health check |
| `POST` | `/api/attendance/time-in` | Bearer | Record today's time-in (idempotent; 403 for admins) |
| `POST` | `/api/attendance/time-out` | Bearer | Record today's time-out (403 for admins) |
| `GET` | `/api/attendance/today` | Bearer | Get today's attendance record |
| `GET` | `/api/attendance/history` | Bearer | Get all past records for the authenticated intern |
| `PATCH` | `/api/attendance/change-password` | Bearer | Change own password and clear `must_change_password` flag |
| `GET` | `/api/admin/attendance` | Bearer (admin) | All records; `?date=` `?name=` filters |
| `GET` | `/api/admin/stats` | Bearer (admin) | Stats (total interns, present today, avg hours) |
| `GET` | `/api/admin/users` | Bearer (admin) | Get all users |
| `POST` | `/api/admin/users` | Bearer (admin) | Create a new user (auth + profile; sets `must_change_password = true`; sends welcome email) |
| `PATCH` | `/api/admin/users/:id` | Bearer (admin) | Update user profile and/or password |
| `DELETE` | `/api/admin/users/:id` | Bearer (admin) | Delete a user (auth + profile cascade) |
| `POST` | `/api/admin/import` | Bearer (admin) | Bulk XLSX attendance import (multer + SheetJS) |
| `GET` | `/api/admin/export` | Bearer (admin) | Export filtered records as `.xlsx`; accepts `?date=` `?name=` |

All `/api` routes (except `/api/health`) are protected by IP restriction middleware. All authenticated routes also check `is_active` — disabled accounts receive 403 `ACCOUNT_DISABLED`.

---

## Notable Fixes & Improvements

- **RLS Policy Fix** — merged two `SELECT` policies into one for intern profile fetching to resolve redundancy
- **Admin Stat Fix** — `presentToday` calculation updated to only count `intern` role users, excluding admins
- **Disabled Account Enforcement** — auth middleware checks `is_active` and blocks disabled accounts with a structured `ACCOUNT_DISABLED` error code
- **Admin Attendance Guard** — both `POST /time-in` and `POST /time-out` reject admin users with 403
- **XLSX Timezone Fix** — import route uses `raw: false` SheetJS option to read date/time cells as plain strings, avoiding UTC conversion bugs for PHT timestamps
- **Session Token Refresh After Password Change** — after the forced password change flow, the app signs the user out immediately (Supabase invalidates the token on password update) and redirects to login with a success message, preventing 401 errors
- **Tunnel Host Allow** — `allowedHosts: true` in `vite.config.js` permits any external hostname (Cloudflare, ngrok) without needing to list specific URLs

---

## Database Schema

**`users`** — `id` (UUID, FK → `auth.users`), `name`, `email`, `role` (`intern` | `admin`), `department`, `is_active` (bool, default `true`), `must_change_password` (bool, default `false`), `created_at`, `updated_at`

**`attendance`** — `id` (bigint identity), `user_id` (FK → `users`), `date` (DATE), `time_in` (TIMESTAMPTZ), `time_out` (TIMESTAMPTZ, nullable), `duration_minutes` (INTEGER, nullable), `created_at`, `updated_at`

Unique constraint: one attendance record per `(user_id, date)`.

> **Note:** `is_active` and `must_change_password` are not in the base `migration.sql`. Run the `ALTER TABLE` commands from the setup instructions to add them.

---

## Business Rules

1. **Time-in** = manually recorded when intern clicks "Record Time-In" on the Time-In landing page (one per day, idempotent)
2. **Time-out** = recorded when intern clicks "Record Time Out" on the dashboard and confirms in the modal
3. **No auto time-out on logout** — signing out does not record time-out; the intern must do it explicitly
4. **Duration** = computed in minutes from `time_in` to `time_out`
5. **Skip if already clocked in** = if the intern has already clocked in today, the `/timein` page redirects directly to `/dashboard`
6. **Admins excluded** = admin users cannot record time-in or time-out; the system returns 403 and all frontend routes redirect admins to `/admin`
7. **Disabled accounts** = users with `is_active = false` are signed out on login and blocked from all API access
8. **Incomplete records** = if an intern forgets to clock out, the record remains with `time_out = null` and is shown as an amber "Incomplete" badge in the history table. The following day a new record is created normally — incomplete records never block time-in
9. **Forced password change** = accounts created by an admin have `must_change_password = true`; the intern must set a new password via the modal before they can use the system. After a successful change they are signed out and must log in again with the new password
10. **Welcome email** = when an admin creates a new intern account, a welcome email containing the intern's email address and temporary password is sent via Resend. If the email fails, the account creation is not rolled back
11. **Remember Me** = when checked at login the session persists in `localStorage` across browser restarts; when unchecked the session is stored in `sessionStorage` and is cleared when the browser closes. A startup guard in `App.jsx` enforces the unchecked case on page load


## Project Handover Notes

This project was developed during an OJT placement at PANDR Outsourcing.
The following notes are intended for the next developer or intern who will
maintain or extend this system.

### Current State
- The system is fully functional for daily intern attendance tracking
- Core features are implemented and tested (I think haha)
- The codebase has been refactored for readability (shared utilities, reusable components, modular routes)
- Docker support is available for consistent local development

### Deployment Decision

The initial plan for this project was to deploy it **locally within the office network**,
meaning interns can only access the system when physically connected to the PANDR office
network. This aligns with the attendance tracking purpose — interns should only be able
to clock in and clock out when they are actually in the office.

The IP restriction feature (`ALLOWED_OFFICE_IP` in `.env`) was built with this in mind.
When configured, only requests coming from the office public IP are allowed through.

However, the **final deployment decision is left to the next developer**. Both options are viable:

**Option A — Local Office Network (original plan)**
- Run the app on a dedicated office PC that stays on during office hours
- Interns access it via local IP (e.g. `http://192.168.1.x:5173`)
- No domain or cloud hosting needed
- Set `ALLOWED_OFFICE_IP` to the office public IP for enforcement
- Set a static local IP on the office PC via the router to keep the URL stable
- Use PM2 to keep the server running automatically on startup

**Option B — Public Domain**
- Host the frontend on Cloudflare Pages or Vercel
- Host the backend on Render or Railway
- Interns can access from anywhere — but the IP restriction should then be
  reconsidered since it would block non-office access
- A custom domain for Resend is also needed for welcome emails to work properly

### Known Limitations
- The free Resend tier with `onboarding@resend.dev` can only send welcome emails
  to verified addresses — a custom domain is needed to send to any intern email
- No audit log — when an admin edits an attendance record, there is no history
  of what the values were before
- Local IP addresses can change when the office PC reconnects — set a static
  local IP via the router to avoid this (relevant for Option A)

### Future Improvements

#### 🔴 High Priority
- [ ] **Configure `ALLOWED_OFFICE_IP`** — set the PANDR office public IP in `.env`
  to enforce IP restriction. Visit [whatismyip.com](https://whatismyip.com) from
  the office network to get the public IP
- [ ] **Set up on a dedicated office PC** — run the app on a dedicated office machine
  instead of a developer's laptop so interns always have a stable URL. Use PM2 to
  keep the server running automatically on startup
- [ ] **Edit Attendance Record** — feature branch `feature/edit-attendance` was started
  but not completed. Admin should be able to edit the date, time-in, and time-out of
  any attendance record. The full implementation prompt is already written and ready to use
- [ ] **Custom Resend domain** — add a verified domain (e.g. `noreply@pandr.com`) so
  welcome emails can be sent to any intern email address

#### 🟡 Medium Priority
- [ ] **Audit log for attendance edits** — when an admin edits an attendance record,
  log the previous values, who changed it, and when
- [ ] **Admin can manually add a single attendance record** — for cases where an intern
  forgot to time-in entirely. A simple modal with intern selector, date, time-in, and
  time-out fields
- [ ] **Loading skeletons** — replace "Loading..." text with skeleton placeholder UI
- [ ] **Environment variable validation** — add startup checks in `server/index.js`
  to fail fast with a clear error if required env vars are missing
- [ ] **Weekly/monthly attendance summary** — summary view for admins showing total
  hours rendered per intern per week or month
- [ ] **Pagination** — the attendance table loads all records at once. Add pagination
  or infinite scroll as data grows

#### 🟢 Low Priority
- [ ] **PM2 setup** — configure PM2 on the office PC so the server restarts
  automatically on reboot without manual intervention
- [ ] **Forgot password flow** — currently only admins can reset passwords. Add a
  self-service forgot password option for interns
- [ ] **Intern profile page** — let interns update their own name and department
  without needing admin intervention
- [ ] **Push notifications** — notify interns if they haven't clocked in by a
  certain time (e.g. 30 minutes after their shift start)
- [ ] **Dark/light mode toggle** — currently dark mode only
- [ ] **TypeScript migration** — convert the codebase to TypeScript for better
  type safety and developer experience
- [ ] **CHANGELOG.md** — maintain a changelog tracking features and fixes per version

### About This Project

This project was built by **Jairo Barra** during OJT at PANDR Outsourcing (2026).
For questions about the codebase, refer to the inline code comments and this README.
