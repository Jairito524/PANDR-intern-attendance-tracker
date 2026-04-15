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

### Intern Dashboard

- **Today's Status** — live clock, time-in/time-out timestamps, and a live duration counter
- **OJT Progress Tracker** — visual progress indicator for OJT hours
- **Scrollable Attendance History** — table with a fixed max height (`max-h-96`) and sticky header for easy browsing of past records

### Admin Dashboard

- **Stats Cards** — total interns, present today (excludes admins), and average hours
- **Date & Name Filters** — filter attendance records by date or intern name/email
- **Scrollable Records Table** — fixed max height (`max-h-[500px]`) with sticky header
- **XLSX Attendance Import** — bulk import attendance records via `.xlsx` files (SheetJS + multer)
- **User Management** — add, edit, and delete intern/admin accounts
  - Custom role dropdown (replaces native `<select>`)
  - Optional password change in the Edit User modal (min 8 chars, confirmation field, show/hide toggles)
  - Enable/disable accounts via `is_active` toggle

### Security

- **Supabase Auth** — email/password login, no public sign-up
- **Role-Based Access** — separate views for `intern` and `admin` roles, secured by RLS policies
- **IP Restriction** — API access restricted to whitelisted office IPs via `ALLOWED_OFFICE_IP` env var; localhost always allowed for development
- **Disabled Account Handling** — accounts with `is_active = false` are blocked at the auth middleware level (403 `ACCOUNT_DISABLED`); on the frontend, disabled users are signed out immediately and shown an error banner on the login page
- **Network Accessibility** — server bound to `0.0.0.0` for local network access

---

## Project Structure

```
intern-attendance-tracker/
├── client/              # React + Vite + Tailwind frontend
│   ├── src/
│   │   ├── lib/         # Supabase client & API helpers
│   │   ├── pages/       # Login, TimeInPage, InternDashboard, AdminDashboard
│   │   ├── App.jsx      # Routing & auth state
│   │   └── main.jsx     # Entry point
│   └── ...
├── server/              # Express backend
│   ├── lib/             # Supabase admin client
│   ├── middleware/       # JWT auth, IP restriction
│   ├── routes/          # attendance.js, admin.js
│   └── index.js         # Express entry point
├── supabase/
│   └── migration.sql    # Database schema
├── .env.example
└── README.md
```

---

## Prerequisites

- **Node.js** v18+ and **npm**
- A **Supabase** project (free tier works)

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
4. Add the `is_active` column to the `users` table (not in the base migration):

```sql
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;
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

### 3. Environment Variables

Copy `.env.example` to `.env` in the project root and fill in your credentials:

```bash
cp .env.example .env
```

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:3001
PORT=3001
ALLOWED_OFFICE_IP=your-office-ip
```

### 4. Run the App

Open **two terminals**:

```bash
# Terminal 1 — Backend
cd server
## Run with network access (accessible to other devices on network)
npm run dev -- --host 0.0.0.0
# → Server bound to 0.0.0.0:3001

# Terminal 2 — Frontend
cd client
npm run dev -- --host 0.0.0.0
# → App running on http://localhost:5173 (and your local IP)
```

### 5. Use the App

1. Open `http://localhost:5173` in your browser
2. Sign in with an intern account → you'll land on the **Time-In** page
3. Click **Record Time-In** → you'll be redirected to the intern dashboard
4. Click **Record Time Out** → confirm in the modal → time-out is recorded
5. Sign in with an admin account → see stats, filter attendance logs, manage users

---

## Client-Side Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/login` | Public | Login page; redirects to `/timein` (intern) or `/admin` (admin) if authenticated |
| `/timein` | Intern only | Time-In landing page; skips to `/dashboard` if already clocked in today |
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
| `GET` | `/api/attendance/history` | Bearer | Get all past records |
| `GET` | `/api/admin/attendance` | Bearer (admin) | All records; `?date=` `?name=` filters |
| `GET` | `/api/admin/stats` | Bearer (admin) | Stats (total interns, present today, avg hours) |
| `GET` | `/api/admin/users` | Bearer (admin) | Get all users |
| `POST` | `/api/admin/users` | Bearer (admin) | Create a new user (auth + profile) |
| `PATCH` | `/api/admin/users/:id`| Bearer (admin) | Update user profile and/or password |
| `DELETE` | `/api/admin/users/:id`| Bearer (admin) | Delete a user (auth + profile) |
| `POST` | `/api/admin/import` | Bearer (admin) | Bulk XLSX attendance import (multer + SheetJS) |

All `/api` routes (except `/api/health`) are protected by IP restriction middleware. All authenticated routes also check `is_active` — disabled accounts receive 403 `ACCOUNT_DISABLED`.

---

## Notable Fixes & Improvements

- **RLS Policy Fix** — merged two `SELECT` policies into one for intern profile fetching to resolve redundancy
- **Admin Stat Fix** — `presentToday` calculation updated to only count `intern` role users, excluding admins
- **Disabled Account Enforcement** — auth middleware checks `is_active` and blocks disabled accounts with a structured `ACCOUNT_DISABLED` error code
- **Admin Attendance Guard** — both `POST /time-in` and `POST /time-out` reject admin users with 403

---

## Database Schema

**`users`** — `id`, `name`, `email`, `role`, `department`, `is_active`, `created_at`, `updated_at`

**`attendance`** — `id`, `user_id`, `date`, `time_in`, `time_out`, `duration_minutes`, `created_at`, `updated_at`

Unique constraint: one attendance record per `(user_id, date)`.

> **Note:** The `is_active` column is not in the base migration. Run the `ALTER TABLE` command from the setup instructions to add it.

---

## Business Rules

1. **Time-in** = manually recorded when intern clicks "Record Time-In" on the Time-In landing page (one per day, idempotent)
2. **Time-out** = recorded when intern clicks "Record Time Out" on the dashboard and confirms in the modal
3. **No auto time-out on logout** — signing out does not record time-out; the intern must do it explicitly
4. **Duration** = computed in minutes from `time_in` to `time_out`
5. **Skip if already clocked in** = if the intern has already clocked in today, the `/timein` page redirects directly to `/dashboard`
6. **Admins excluded** = admin users cannot record time-in or time-out; the system returns 403 and all frontend routes redirect admins to `/admin`
7. **Disabled accounts** = users with `is_active = false` are signed out on login and blocked from all API access

---

## Supabase Cron Job

The system uses a scheduled PostgreSQL function to automatically record time-out
for interns who forgot to clock out at the end of the day.

  ### Setup

  1. Go to **Supabase Dashboard** → **SQL Editor**
  2. Paste and run the following:

  ```sql
      -- Enable pg_cron extension
      create extension if not exists pg_cron;

      -- Create the auto time-out function
      create or replace function public.auto_timeout_missing_records()
      returns void as $$
      declare
        end_of_day timestamptz;
      begin
        end_of_day := (current_date + time '10:00:00') at time zone 'UTC';

        update public.attendance
        set
          time_out = end_of_day,
          duration_minutes = round(extract(epoch from (end_of_day - time_in)) / 60)
        where
          date = current_date
          and time_out is null;
      end;
      $$ language plpgsql security definer;

      -- Schedule it to run every day at 6:00 PM Philippine Time (UTC+8)
      select cron.schedule(
        'auto-timeout-missing-records',
        '0 10 * * *',
        'select public.auto_timeout_missing_records();'
      );
  ```

  ### Behavior

  - Runs every day at **6:00 PM PHT**
  - Only affects records from the **current day** with no time-out
  - Records that already have a time-out are untouched