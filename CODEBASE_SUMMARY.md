# Codebase Summary — Intern Attendance Tracker

> Generated: 2026-04-30. Reflects the current state of all source files.

---

## File Tree

```
intern-attendance-tracker/
├── .env.example
├── .gitignore
├── README.md
├── CODEBASE_SUMMARY.md
├── build_summary.js
├── client/
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       ├── lib/
│       │   ├── api.js
│       │   └── supabaseClient.js
│       └── pages/
│           ├── AdminDashboard.jsx
│           ├── InternDashboard.jsx
│           ├── Login.jsx
│           └── TimeInPage.jsx
├── server/
│   ├── index.js
│   ├── package.json
│   ├── lib/
│   │   ├── mailer.js
│   │   └── supabase.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── ipRestriction.js
│   └── routes/
│       ├── admin.js
│       └── attendance.js
└── supabase/
    └── migration.sql
```

---

## Root Config Files

### `.env.example`
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
ALLOWED_OFFICE_IP=
```

### `.gitignore`
```
node_modules/
.env
.env.local
dist/
build/
*.log
```

---

## Client

### `client/package.json`
```json
{
  "name": "intern-attendance-client",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.45.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.41",
    "tailwindcss": "^3.4.9",
    "vite": "^5.4.2"
  }
}
```

### `client/vite.config.js`
```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  envDir: "..",
  server: {
    host: true,
    port: 5173,
    allowedHosts: true,       // accepts any hostname (Cloudflare, ngrok, etc.)
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
```

### `client/tailwind.config.js`
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#fdf2f8",
          100: "#fce7f3",
          200: "#fbcfe8",
          300: "#f9a8d4",
          400: "#f472b6",
          500: "#e91e8c",
          600: "#d6197f",
          700: "#be185d",
          800: "#9d174d",
          900: "#831843",
          950: "#500724",
        },
        surface: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          700: "#1e293b",
          800: "#0f172a",
          900: "#020617",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "pulse-soft": "pulseSoft 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [],
};
```

### `client/src/index.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ─── Global Styles ─────────────────────────────────────── */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  min-height: 100vh;
  background: linear-gradient(135deg, #0d0f14 0%, #12141a 50%, #1a0a15 100%);
}

/* ─── Glassmorphism card ────────────────────────────────── */
.glass {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.07);
}

.glass-hover:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(233, 30, 140, 0.2);
}

/* ─── Gradient text (PANDR Pink) ────────────────────────── */
.gradient-text {
  background: linear-gradient(135deg, #f472b6 0%, #e91e8c 50%, #f9a8d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ─── Scrollbar ─────────────────────────────────────────── */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(233, 30, 140, 0.3); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: rgba(233, 30, 140, 0.5); }

/* ─── Animated gradient border ──────────────────────────── */
.gradient-border { position: relative; }
.gradient-border::before {
  content: "";
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  background: linear-gradient(135deg, #e91e8c, #f472b6, #e91e8c);
  z-index: -1;
  opacity: 0.5;
  transition: opacity 0.3s;
}
.gradient-border:hover::before { opacity: 1; }

/* ─── Table ─────────────────────────────────────────────── */
.table-row-hover:hover { background: rgba(233, 30, 140, 0.06); }

/* ─── Pulse dot animation ───────────────────────────────── */
@keyframes pulseDot {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.5; }
}
.pulse-dot { animation: pulseDot 2s infinite; }
```

### `client/src/main.jsx`
```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

---

## `client/src/App.jsx`

Handles global auth state, session restoration with Remember Me guard, role-based routing, and the `TimeInGuard` that checks whether the intern has already clocked in before rendering `TimeInPage`.

```jsx
import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";
import { getTodayAttendance } from "./lib/api";
import Login from "./pages/Login";
import InternDashboard from "./pages/InternDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import TimeInPage from "./pages/TimeInPage";

export default function App() {
  const [session, setSession] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [disabledMessage, setDisabledMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      // Remember Me guard — sign out silently if user chose not to be remembered
      if (currentSession && localStorage.getItem("rememberMe") === "false") {
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }
      setSession(currentSession);
      if (currentSession) {
        fetchProfile(currentSession.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession) {
        fetchProfile(newSession.user.id);
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase.from("users").select("*").eq("id", userId).single();
      if (error) {
        setUserProfile({ id: userId, name: "User", email: "", role: "intern", department: "" });
      } else if (data.is_active === false) {
        await supabase.auth.signOut();
        setSession(null);
        setUserProfile(null);
        setDisabledMessage("Your account has been disabled. Please contact your administrator for assistance.");
        navigate("/login");
        return;
      } else {
        setUserProfile(data);
      }
    } catch (err) {
      console.error("Profile fetch exception:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (newSession) => { setDisabledMessage(""); setSession(newSession); };
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUserProfile(null);
    navigate("/login");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">…</div>;

  const isAuthenticated = !!session;
  const isAdmin = userProfile?.role === "admin";

  return (
    <div className="max-w-7xl mx-auto">
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to={isAdmin ? "/admin" : "/timein"} replace /> : <Login onLogin={handleLogin} disabledMessage={disabledMessage} />} />
        <Route path="/timein" element={!isAuthenticated ? <Navigate to="/login" replace /> : isAdmin ? <Navigate to="/admin" replace /> : <TimeInGuard user={userProfile} onLogout={handleLogout} />} />
        <Route path="/dashboard" element={!isAuthenticated ? <Navigate to="/login" replace /> : isAdmin ? <Navigate to="/admin" replace /> : <InternDashboard user={userProfile} onLogout={handleLogout} />} />
        <Route path="/admin" element={!isAuthenticated ? <Navigate to="/login" replace /> : !isAdmin ? <Navigate to="/timein" replace /> : <AdminDashboard user={userProfile} onLogout={handleLogout} />} />
        <Route path="*" element={<Navigate to={isAuthenticated ? (isAdmin ? "/admin" : "/timein") : "/login"} replace />} />
      </Routes>
    </div>
  );
}

/**
 * TimeInGuard — fetches today's attendance before rendering TimeInPage.
 * If already clocked in, redirects directly to /dashboard.
 */
function TimeInGuard({ user, onLogout }) {
  const [checking, setChecking] = useState(true);
  const [alreadyClockedIn, setAlreadyClockedIn] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getTodayAttendance()
      .then((res) => { if (!cancelled && res.attendance?.time_in) setAlreadyClockedIn(true); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setChecking(false); });
    return () => { cancelled = true; };
  }, []);

  if (checking) return <div className="min-h-screen flex items-center justify-center">…</div>;
  if (alreadyClockedIn) return <Navigate to="/dashboard" replace />;
  return <TimeInPage user={user} onLogout={onLogout} />;
}
```

---

## `client/src/lib/supabaseClient.js`

Creates the Supabase browser client. Chooses `localStorage` or `sessionStorage` based on the `rememberMe` flag set at login time.

```js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function getSupabaseStorage() {
  const remembered = localStorage.getItem("rememberMe");
  if (remembered === null || remembered === "true") return localStorage;
  return sessionStorage;
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key",
  {
    auth: {
      storage: getSupabaseStorage(),
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
```

---

## `client/src/lib/api.js`

All authenticated API calls. Uses `authFetch` which attaches the Supabase JWT from the current session. `exportAttendance` uses a raw `fetch` to handle a binary blob response.

```js
import { supabase } from "./supabaseClient";

const API_URL = import.meta.env.VITE_API_URL || "";

class ApiError extends Error {
  constructor(message, code, status) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

async function authFetch(path, options = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new ApiError(data.message || data.error || `Request failed (${res.status})`, data.error, res.status);
  return data;
}

// ─── Attendance API ─────────────────────────────────────
export const recordTimeIn = () => authFetch("/api/attendance/time-in", { method: "POST" });
export const recordTimeOut = () => authFetch("/api/attendance/time-out", { method: "POST" });
export const getTodayAttendance = () => authFetch("/api/attendance/today");
export const getAttendanceHistory = () => authFetch("/api/attendance/history");
export const changePassword = (newPassword) =>
  authFetch("/api/attendance/change-password", { method: "PATCH", body: JSON.stringify({ newPassword }) });

// ─── Admin API ──────────────────────────────────────────
export const getAdminAttendance = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return authFetch(`/api/admin/attendance${qs ? `?${qs}` : ""}`);
};
export const getAdminStats = () => authFetch("/api/admin/stats");

export const exportAttendance = async (params = {}) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/api/admin/export${qs ? `?${qs}` : ""}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Export failed");
  const blob = await res.blob();
  const disposition = res.headers.get("Content-Disposition") || "";
  const match = disposition.match(/filename="([^"]+)"/);
  const filename = match ? match[1] : "attendance_export.xlsx";
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};

// ─── User Management API ────────────────────────────────
export const getAdminUsers = () => authFetch("/api/admin/users");
export const createAdminUser = (body) =>
  authFetch("/api/admin/users", { method: "POST", body: JSON.stringify(body) });
export const updateAdminUser = (id, body) => {
  const payload = { ...body };
  if (!payload.password || typeof payload.password !== "string" || !payload.password.trim()) delete payload.password;
  return authFetch(`/api/admin/users/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
};
export const deleteAdminUser = (id) => authFetch(`/api/admin/users/${id}`, { method: "DELETE" });

export async function importAttendance(file) {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API_URL}/api/admin/import`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Import failed (${res.status})`);
  return data; // { imported, skipped, overwritten, unmatched }
}
```

---

## `client/src/pages/Login.jsx`

Login form with Remember Me checkbox, Access Denied banner (IP restriction), Account Disabled banner (propagated from `App.jsx`), and a success banner shown after a forced password change redirect.

**Key behaviours:**
- Writes `rememberMe` to `localStorage` before calling `signInWithPassword` so `supabaseClient.js` picks the correct storage adapter on the next init.
- Reads `location.state.message` on mount to show the post-password-change success message, then clears the router state via `history.replaceState`.

---

## `client/src/pages/TimeInPage.jsx`

The landing page interns see immediately after login (before they clock in for the day).

**Key behaviours:**
- If `user.must_change_password === true`, renders an **undismissable** Change Password modal over the page. The intern must set a new password (min 8 chars, confirmed) before proceeding.
- On successful password change: calls `PATCH /api/attendance/change-password`, then signs out via Supabase and navigates to `/login` with a success message in router state. (Supabase invalidates the session token on admin-API password updates, so immediate sign-out prevents 401 errors.)
- The **Record Time-In** button calls `POST /api/attendance/time-in` and navigates to `/dashboard` on success.
- On `ACCESS_DENIED` (IP restriction 403): signs the user out and shows an Access Denied banner; the button is disabled.
- Includes a live clock (updates every second) and a time-of-day greeting.
- A "Sign out instead" link lets the intern sign out without clocking in.
- Safety redirect: if `user.role === "admin"`, immediately redirects to `/admin`.

---

## `client/src/pages/InternDashboard.jsx`

Main view for interns after clocking in.

**Key sections:**
- **Header** — PANDR branding, intern name/department/email, Sign Out button.
- **Live clock card** — current date and time, updates every second.
- **Today's status cards** — Time In, Time Out, Total Hours (live counter while clocked in with a pulse dot), Status badge.
- **OJT Progress Tracker** — editable required-hours target (default 480 h, stored per-user in localStorage under `ojt_required_hours_<userId>`). Stats: hours rendered (including live elapsed), remaining, % completed, estimated days left based on average daily hours. Animated progress bar.
- **Time-Out Confirmation Modal** — triggered by "Record Time Out" button. Shows current time and live elapsed duration. Backdrop click closes the modal. Error state displayed inside modal.
- **Attendance History Table** — scrollable (`max-h-96`, sticky header). Three status badges: **Completed** (grey), **Active** (brand pink, today + no time-out), **Incomplete** (amber, past day + no time-out).

---

## `client/src/pages/AdminDashboard.jsx`

Full admin control panel. ~1270 lines. Key sub-components defined in the same file:

| Component | Purpose |
|---|---|
| `Toast` | Stacked toast notifications (success/error) auto-dismissed after 4 s |
| `Modal` | Generic backdrop + card wrapper with close button |
| `Field` | Label + input wrapper with inline error display |
| `RoleSelect` | Custom role dropdown replacing native `<select>` (intern / admin) |
| `PasswordToggle` | Eye icon button for show/hide password fields |
| `AddUserModal` | Form to create a new intern/admin account |
| `EditUserModal` | Form to update name, department, role, is_active, and optional password change |
| `ImportModal` | File picker for `.xlsx` bulk attendance import |
| `ConfirmDeleteModal` | Confirmation dialog before deleting a user |

**Key sections in the main `AdminDashboard` component:**
- **Stats Cards** — total interns, present today (intern-only), average hours per session. Auto-refreshed on mount.
- **Filters** — date picker and name/email text input (400 ms debounce). Filters are passed as query params to `GET /api/admin/attendance`.
- **Attendance Table** — scrollable (`max-h-[500px]`, sticky header). Columns: Name, Email, Department, Date, Time In, Time Out, Duration, Status. Same three-state status badges as the intern view.
- **Export button** — calls `exportAttendance(activeFilters)` which triggers a browser file download. Filename derived from `Content-Disposition` header.
- **Import button** — opens `ImportModal`. On success shows a result toast: `Imported X, Overwritten Y, Skipped Z` plus a list of unmatched emails.
- **Users tab** — lists all users with name, email, department, role badge, active status. Add / Edit / Delete actions.

---

## Server

### `server/package.json`
```json
{
  "name": "intern-attendance-server",
  "version": "1.0.0",
  "type": "module",
  "scripts": { "dev": "node --watch index.js", "start": "node index.js" },
  "dependencies": {
    "@supabase/supabase-js": "^2.45.0",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.21.0",
    "multer": "^2.1.1",
    "resend": "^6.12.2",
    "xlsx": "^0.18.5"
  }
}
```

### `server/index.js`

Express entry point. Binds to `0.0.0.0:3001` so it is reachable on the local network and via tunnels.

- `cors({ origin: true, credentials: true })` — allows all origins.
- `app.set("trust proxy", true)` — reads real client IP from `x-forwarded-for`.
- `GET /api/health` — health check, exempt from IP restriction.
- All `/api/*` routes pass through `ipRestriction` middleware.
- `/api/attendance/*` and `/api/admin/*` additionally require `authMiddleware`.

---

### `server/lib/supabase.js`

Admin Supabase client using the **service-role key** (bypasses RLS). Used exclusively on the server for all database operations.

---

### `server/lib/mailer.js`

Sends a branded HTML welcome email via **Resend** when a new intern account is created.

- Exports `sendWelcomeEmail({ name, email, password })`.
- Email includes the intern's email address, temporary password (highlighted in brand pink), and a "Log In Now" button linking to `APP_URL`.
- Called from `POST /api/admin/users` inside a `try/catch` — email failure is logged as a warning and does **not** roll back the account.

**Required env vars:** `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `APP_URL`

---

### `server/middleware/auth.js`

JWT verification middleware. Verifies the `Authorization: Bearer <token>` header and attaches the full `public.users` profile to `req.user`.

**Steps:**
1. Creates a scoped Supabase client with the user's token and calls `getUser(token)`.
2. Fetches the full profile from `public.users` via the admin client.
3. Returns `403 ACCOUNT_DISABLED` if `profile.is_active === false`.
4. Sets `req.user = profile` and calls `next()`.

Also exports `adminOnly(req, res, next)` — checks `req.user.role === "admin"`, used on all `/api/admin/*` routes.

---

### `server/middleware/ipRestriction.js`

Blocks requests from IPs not on the office whitelist.

- `ALLOWED_OFFICE_IP` — comma-separated list of allowed IPs in `.env`.
- Localhost (`127.0.0.1`, `::1`, `::ffff:127.0.0.1`) always allowed.
- Normalises IPv6-mapped IPv4 prefixes (`::ffff:x.x.x.x` → `x.x.x.x`).
- If `ALLOWED_OFFICE_IP` is empty → **fail-open** (all IPs allowed, for dev).
- Blocked requests return `403 ACCESS_DENIED`.

---

### `server/routes/attendance.js`

Intern attendance endpoints (all behind `authMiddleware`):

| Route | Description |
|---|---|
| `POST /time-in` | Rejects admins (403). Idempotent — returns existing record if already clocked in. Otherwise inserts `{ user_id, date, time_in }`. |
| `POST /time-out` | Rejects admins (403). Finds today's record, computes `duration_minutes`, updates `time_out`. 404 if no time-in. |
| `GET /today` | Returns today's record for the authenticated user (`null` if not clocked in). |
| `GET /history` | All records for the authenticated user, newest first. |
| `PATCH /change-password` | Updates password via `auth.admin.updateUserById`, clears `must_change_password` flag. Min 8 chars enforced. |

---

### `server/routes/admin.js`

All routes behind `adminOnly` middleware:

| Route | Description |
|---|---|
| `GET /attendance` | All records joined with `users(name, email, department)`. Supports `?date=` and `?name=` (JS-side filter). |
| `GET /export` | Same query, rendered as `.xlsx` via SheetJS. Filename from active filters. Streams buffer with `Content-Disposition`. |
| `GET /stats` | `{ totalInterns, presentToday (intern-only), averageHours }`. |
| `GET /users` | All `public.users` rows, newest first. |
| `POST /users` | Creates auth user + profile. Sets `must_change_password: true`. Sends welcome email (non-blocking). Handles duplicate email → 409. |
| `PATCH /users/:id` | Updates profile fields and/or password. Password-only update supported. |
| `DELETE /users/:id` | Deletes auth user (profile cascades via FK). |
| `POST /import` | Accepts `.xlsx` via multer (memory). Parses with `raw: false` to avoid UTC timezone bugs. Groups punches by `(user_id, date)`. Upserts with `onConflict: "user_id,date"`. Returns `{ imported, skipped, overwritten, unmatched[] }`. |

**PHT date/time helpers:**
- `parseTimestamp("4/12/2026 7:40:16")` → `Date` (UTC) treating the input as PHT (UTC+8).
- `parseAttendanceDate("4/12/26")` → `"2026-04-12"`.

---

## `supabase/migration.sql`

Run in the Supabase SQL Editor to create all tables, indexes, RLS policies, and triggers.

**Tables created:**

`public.users` — `id` (UUID PK → `auth.users`), `name`, `email` (unique), `role` (`intern`|`admin`), `department`, `created_at`, `updated_at`

`public.attendance` — `id` (bigint identity PK), `user_id` (FK → `users`), `date` (DATE), `time_in` (TIMESTAMPTZ), `time_out` (TIMESTAMPTZ nullable), `duration_minutes` (INTEGER nullable), `created_at`, `updated_at`. Unique constraint: `(user_id, date)`.

**Extra columns (run separately after migration):**

```sql
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_active            BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN NOT NULL DEFAULT false;
```

**RLS policies:** Interns can SELECT/INSERT/UPDATE their own attendance. Admins can SELECT/UPDATE all attendance. Users can SELECT their own profile. Admins can SELECT all profiles. The `is_admin()` SECURITY DEFINER function avoids RLS recursion.

---

## Environment Variables Reference

| Variable | Used By | Description |
|---|---|---|
| `SUPABASE_URL` | server | Supabase project URL |
| `SUPABASE_ANON_KEY` | server (auth middleware) | Public anon key for JWT verification |
| `SUPABASE_SERVICE_ROLE_KEY` | server | Service-role key for admin DB operations |
| `VITE_SUPABASE_URL` | client | Supabase URL exposed to Vite |
| `VITE_SUPABASE_ANON_KEY` | client | Anon key exposed to Vite |
| `VITE_API_URL` | client | Base URL for API calls (leave empty for Vite proxy) |
| `RESEND_API_KEY` | server/lib/mailer.js | Resend API key |
| `RESEND_FROM_EMAIL` | server/lib/mailer.js | Sender address |
| `APP_URL` | server/lib/mailer.js | Login URL in welcome email |
| `PORT` | server | Express listen port (default `3001`) |
| `ALLOWED_OFFICE_IP` | server/middleware | Comma-separated allowed IPs; empty = allow all |
