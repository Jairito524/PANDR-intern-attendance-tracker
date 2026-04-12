# Intern Attendance Tracker

A full-stack web application for tracking intern daily attendance. Login auto-records time-in; interns manually record time-out. Admins get a dedicated dashboard with stats and filters.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![Tech Stack](https://img.shields.io/badge/Tailwind_CSS-3-blue) ![Tech Stack](https://img.shields.io/badge/Express-4-green) ![Tech Stack](https://img.shields.io/badge/Supabase-PostgreSQL-purple)

---

## Features

- **Automatic Time-In** — recorded on login; one record per intern per day
- **Manual Time-Out** — intern clicks a button or auto-saved on logout
- **Intern Dashboard** — today's status, live clock, attendance history table
- **Admin Dashboard** — stats cards, date/name filters, full attendance log
- **Role-Based Access** — separate views for `intern` and `admin` roles
- **Supabase Auth** — email/password login, no public sign-up

---

## Project Structure

```
intern-attendance-tracker/
├── client/              # React + Vite + Tailwind frontend
│   ├── src/
│   │   ├── lib/         # Supabase client & API helpers
│   │   ├── pages/       # Login, InternDashboard, AdminDashboard
│   │   ├── App.jsx      # Routing & auth state
│   │   └── main.jsx     # Entry point
│   └── ...
├── server/              # Express backend
│   ├── lib/             # Supabase admin client
│   ├── middleware/       # JWT auth middleware
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
4. Go to **Authentication** → **Users** and create test accounts (one intern, one admin)
5. For each user, insert a matching row in the `users` table:

```sql
INSERT INTO public.users (id, name, email, role, department)
VALUES
  ('<auth-user-uuid>', 'John Intern', 'john@company.com', 'intern', 'Engineering'),
  ('<auth-admin-uuid>', 'Jane Admin', 'jane@company.com', 'admin', 'HR');
```

6. Copy your project URL, anon key, and service role key from **Settings** → **API**

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
```

### 4. Run the App

Open **two terminals**:

```bash
# Terminal 1 — Backend
cd server
npm run dev
# → Server running on http://localhost:3001

# Terminal 2 — Frontend
cd client
npm run dev
# → App running on http://localhost:5173
```

### 5. Use the App

1. Open `http://localhost:5173` in your browser
2. Sign in with an intern account → time-in is auto-recorded, see your dashboard
3. Click **Record Time Out** when leaving
4. Sign in with an admin account → see stats, filter attendance logs

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/health` | — | Health check |
| `POST` | `/api/attendance/time-in` | Bearer | Record today's time-in (idempotent) |
| `POST` | `/api/attendance/time-out` | Bearer | Record today's time-out |
| `GET` | `/api/attendance/today` | Bearer | Get today's attendance record |
| `GET` | `/api/attendance/history` | Bearer | Get all past records |
| `GET` | `/api/admin/attendance` | Bearer (admin) | All records; `?date=` `?name=` |
| `GET` | `/api/admin/stats` | Bearer (admin) | Stats: totals, present, avg hours |

---

## Database Schema

**`users`** — `id`, `name`, `email`, `role`, `department`, `created_at`, `updated_at`

**`attendance`** — `id`, `user_id`, `date`, `time_in`, `time_out`, `duration_minutes`, `created_at`, `updated_at`

Unique constraint: one attendance record per `(user_id, date)`.

---

## Business Rules

1. **Time-in** = timestamp of login, auto-recorded (one per day)
2. **Time-out** = recorded when intern clicks the button
3. **Auto-save on logout** = if the intern logs out without clicking "Record Time Out", time-out is auto-saved
4. **Duration** = computed in minutes from `time_in` to `time_out`

---

## Supabase Cron Job

The system uses a scheduled PostgreSQL function to automatically record time-out
for interns who forgot to log out at the end of the day.

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