# Project File Tree

```
.
├── client
│   ├── src
│   │   ├── lib
│   │   │   ├── api.js
│   │   │   └── supabaseClient.js
│   │   ├── pages
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── InternDashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   └── TimeInPage.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── server
│   ├── lib
│   │   └── supabase.js
│   ├── middleware
│   │   ├── auth.js
│   │   └── ipRestriction.js
│   ├── routes
│   │   ├── admin.js
│   │   └── attendance.js
│   ├── index.js
│   └── package.json
├── supabase
│   └── migration.sql
├── .env
├── .env.example
├── .gitignore
└── README.md
```

# File Contents

## FILE: .env
```text
# ── Supabase ──────────────────────────────────────────────
SUPABASE_URL=https://kyuuzrqirpvyaqyffauk.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5dXV6cnFpcnB2eWFxeWZmYXVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NjIyMzMsImV4cCI6MjA5MDAzODIzM30._HMXAtxu4nXSH8sVO3145M-YlV4Y-oMJSq-Qpz1TJk0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5dXV6cnFpcnB2eWFxeWZmYXVrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDQ2MjIzMywiZXhwIjoyMDkwMDM4MjMzfQ.MuMctyvR-YJqMwjhXjjxJrvVgVgykiEujI3800_mRYo

# ── Frontend (Vite uses VITE_ prefix) ────────────────────
VITE_SUPABASE_URL=https://kyuuzrqirpvyaqyffauk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5dXV6cnFpcnB2eWFxeWZmYXVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NjIyMzMsImV4cCI6MjA5MDAzODIzM30._HMXAtxu4nXSH8sVO3145M-YlV4Y-oMJSq-Qpz1TJk0
VITE_API_URL=http://localhost:3001
#http://10.100.10.249:3001


# ── Server ────────────────────────────────────────────────
PORT=3001

# ── IP Restriction (comma-separated list of allowed IPs) ──
# Leave empty to allow all IPs (development mode)
ALLOWED_OFFICE_IP=
```

## FILE: .env.example
```example
# ── Supabase ──────────────────────────────────────────────
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
# ── Frontend (Vite uses VITE_ prefix) ────────────────────
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:3001

# ── Server ────────────────────────────────────────────────
PORT=3001

# ── IP Restriction (comma-separated list of allowed IPs) ──
ALLOWED_OFFICE_IP=122.3.177.108

```

## FILE: .gitignore
```text
﻿node_modules/
.env
.env.local
dist/
build/
*.log

```

## FILE: client/index.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="PANDR Outsourcing — Intern Attendance Tracker. Track daily attendance for company interns with automatic time-in and manual time-out." />
    <title>PANDR | Intern Attendance Tracker</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
  </head>
  <body class="bg-surface-900 text-white font-sans antialiased">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

```

## FILE: client/package.json
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

## FILE: client/postcss.config.js
```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

```

## FILE: client/src/App.jsx
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

  // Listen for auth state changes
  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      if (currentSession) {
        fetchProfile(currentSession.user.id);
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
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
      console.log("🔍 Fetching profile for userId:", userId);
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      console.log("📋 Profile query result:", { data, error });

      if (error) {
        console.warn("Profile fetch error:", error.message);
        setUserProfile({
          id: userId,
          name: "User",
          email: "",
          role: "intern",
          department: "",
        });
      } else if (data.is_active === false) {
        // Account is disabled — sign out immediately
        console.warn("⛔ Account disabled for user:", data.email);
        await supabase.auth.signOut();
        setSession(null);
        setUserProfile(null);
        setDisabledMessage(
          "Your account has been disabled. Please contact your administrator for assistance."
        );
        navigate("/login");
        return;
      } else {
        console.log("✅ Profile loaded, role:", data.role);
        setUserProfile(data);
      }
    } catch (err) {
      console.error("Profile fetch exception:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (newSession) => {
    setDisabledMessage(""); // Clear any previous disabled message
    setSession(newSession);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setUserProfile(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Loading screen — PANDR branded
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-400 flex items-center justify-center animate-pulse-soft">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-surface-200/50 text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  const isAuthenticated = !!session;
  const isAdmin = userProfile?.role === "admin";

  return (
    <div className="max-w-7xl mx-auto">
      <Routes>
        {/* Login */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to={isAdmin ? "/admin" : "/timein"} replace />
            ) : (
              <Login onLogin={handleLogin} disabledMessage={disabledMessage} />
            )
          }
        />

        {/* Time-In Landing Page (interns only) */}
        <Route
          path="/timein"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : isAdmin ? (
              <Navigate to="/admin" replace />
            ) : (
              <TimeInGuard user={userProfile} onLogout={handleLogout} />
            )
          }
        />

        {/* Intern Dashboard */}
        <Route
          path="/dashboard"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : isAdmin ? (
              <Navigate to="/admin" replace />
            ) : (
              <InternDashboard user={userProfile} onLogout={handleLogout} />
            )
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : !isAdmin ? (
              <Navigate to="/timein" replace />
            ) : (
              <AdminDashboard user={userProfile} onLogout={handleLogout} />
            )
          }
        />

        {/* Default redirect */}
        <Route
          path="*"
          element={
            <Navigate
              to={isAuthenticated ? (isAdmin ? "/admin" : "/timein") : "/login"}
              replace
            />
          }
        />
      </Routes>
    </div>
  );
}

/**
 * TimeInGuard — checks if the intern has already clocked in today.
 * If yes, skips straight to /dashboard. Otherwise renders TimeInPage.
 */
function TimeInGuard({ user, onLogout }) {
  const [checking, setChecking] = useState(true);
  const [alreadyClockedIn, setAlreadyClockedIn] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getTodayAttendance()
      .then((res) => {
        if (!cancelled && res.attendance?.time_in) {
          setAlreadyClockedIn(true);
        }
      })
      .catch(() => {
        // If the check fails, show the time-in page anyway
      })
      .finally(() => {
        if (!cancelled) setChecking(false);
      });
    return () => { cancelled = true; };
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-400 flex items-center justify-center animate-pulse-soft">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-surface-200/50 text-sm">Checking attendance…</p>
        </div>
      </div>
    );
  }

  if (alreadyClockedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return <TimeInPage user={user} onLogout={onLogout} />;
}

```

## FILE: client/src/index.css
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
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(233, 30, 140, 0.3);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(233, 30, 140, 0.5);
}

/* ─── Animated gradient border ──────────────────────────── */
.gradient-border {
  position: relative;
}
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
.gradient-border:hover::before {
  opacity: 1;
}

/* ─── Table ─────────────────────────────────────────────── */
.table-row-hover:hover {
  background: rgba(233, 30, 140, 0.06);
}

/* ─── Pulse dot animation ───────────────────────────────── */
@keyframes pulseDot {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.5; }
}
.pulse-dot {
  animation: pulseDot 2s infinite;
}

```

## FILE: client/src/lib/api.js
```js
import { supabase } from "./supabaseClient";

const API_URL = import.meta.env.VITE_API_URL || "";

/**
 * Custom error class that carries the error code from the server.
 */
class ApiError extends Error {
  constructor(message, code, status) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

/**
 * Authenticated fetch wrapper — attaches the Supabase JWT automatically.
 * Throws ApiError with a `code` property for structured error handling.
 */
async function authFetch(path, options = {}) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

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

  if (!res.ok) {
    throw new ApiError(
      data.message || data.error || `Request failed (${res.status})`,
      data.error,  // error code like "ACCESS_DENIED"
      res.status
    );
  }

  return data;
}

// ─── Attendance API ─────────────────────────────────────
export const recordTimeIn = () => authFetch("/api/attendance/time-in", { method: "POST" });
export const recordTimeOut = () => authFetch("/api/attendance/time-out", { method: "POST" });
export const getTodayAttendance = () => authFetch("/api/attendance/today");
export const getAttendanceHistory = () => authFetch("/api/attendance/history");

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
  // Derive filename from Content-Disposition header if present
  const disposition = res.headers.get("Content-Disposition") || "";
  const match = disposition.match(/filename="([^"]+)"/);
  const filename = match ? match[1] : "attendance_export.xlsx";
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

// ─── User Management API ────────────────────────────────
export const getAdminUsers = () => authFetch("/api/admin/users");
export const createAdminUser = (body) =>
  authFetch("/api/admin/users", { method: "POST", body: JSON.stringify(body) });
export const updateAdminUser = (id, body) => {
  // Only include password if it's a non-empty string
  const payload = { ...body };
  if (!payload.password || typeof payload.password !== "string" || !payload.password.trim()) {
    delete payload.password;
  }
  return authFetch(`/api/admin/users/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
};
export const deleteAdminUser = (id) =>
  authFetch(`/api/admin/users/${id}`, { method: "DELETE" });

/**
 * Upload a .xlsx file to the import endpoint.
 * Uses a manual fetch so we can send FormData without setting Content-Type
 * (the browser must set it with the correct multipart boundary).
 */
export async function importAttendance(file) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;

  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API_URL}/api/admin/import`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `Import failed (${res.status})`);
  }

  return data; // { imported, skipped, overwritten, unmatched }
}


```

## FILE: client/src/lib/supabaseClient.js
```js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "⚠ Supabase credentials not found. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file."
  );
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key"
);

```

## FILE: client/src/main.jsx
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

## FILE: client/src/pages/AdminDashboard.jsx
```jsx
import { useState, useEffect, useCallback, useRef } from "react";
import {
  getAdminAttendance,
  getAdminStats,
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  importAttendance,
  exportAttendance,
} from "../lib/api";

// ─── Helpers ─────────────────────────────────────────────
function formatTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDuration(minutes) {
  if (minutes == null) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Spinner ─────────────────────────────────────────────
function Spinner({ size = "w-4 h-4" }) {
  return (
    <svg className={`animate-spin ${size}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

// ─── Toast ───────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-sm font-medium transition-all duration-300 pointer-events-auto
            ${t.type === "success"
              ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300"
              : "bg-red-500/20 border border-red-500/30 text-red-300"}`}
        >
          {t.type === "success" ? (
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ─── Modal Shell ─────────────────────────────────────────
function Modal({ title, onClose, children }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-md rounded-2xl glass border border-white/10 shadow-2xl animate-slide-up"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-surface-200/50 hover:text-white hover:bg-white/5 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// ─── Form Field ──────────────────────────────────────────
function Field({ label, id, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs text-surface-200/50 uppercase tracking-wider font-medium mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

const inputCls =
  "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm " +
  "focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all duration-200";

const ROLE_OPTIONS = [
  { value: "intern", label: "Intern" },
  { value: "admin", label: "Admin" },
];

// ─── Custom Role Dropdown ─────────────────────────────────
function RoleSelect({ id, value, onChange }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const selected = ROLE_OPTIONS.find((o) => o.value === value) ?? ROLE_OPTIONS[0];

  return (
    <div ref={containerRef} className="relative" id={id}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={inputCls + " flex items-center justify-between pr-10 cursor-pointer text-left"}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{selected.label}</span>
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <svg
            className={`w-4 h-4 text-white/40 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {/* Dropdown panel */}
      {open && (
        <ul
          role="listbox"
          className="absolute z-50 mt-1.5 w-full rounded-xl border border-white/10 overflow-hidden shadow-2xl"
          style={{ background: "rgba(18,18,28,0.97)", backdropFilter: "blur(12px)" }}
        >
          {ROLE_OPTIONS.map((opt) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              onMouseDown={(e) => {
                e.preventDefault(); // prevent blur-before-click
                onChange(opt.value);
                setOpen(false);
              }}
              className={`px-4 py-2.5 text-sm cursor-pointer select-none transition-colors duration-100
                ${opt.value === value
                  ? "bg-brand-500/20 text-brand-300 font-medium"
                  : "text-white/70 hover:bg-white/8 hover:text-white"
                }`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Add User Modal ──────────────────────────────────────
function AddUserModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "intern", department: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8) e.password = "Must be at least 8 characters";
    if (!form.department.trim()) e.department = "Department is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    setServerError("");
    try {
      await createAdminUser(form);
      onSuccess("Intern account created successfully!");
    } catch (err) {
      setServerError(err.message || "Failed to create user");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Add New User" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {serverError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5 text-red-400 text-sm">
            {serverError}
          </div>
        )}
        <Field label="Full Name" id="add-name" error={errors.name}>
          <input id="add-name" type="text" placeholder="e.g. Maria Santos" value={form.name}
            onChange={(e) => set("name", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Email" id="add-email" error={errors.email}>
          <input id="add-email" type="email" placeholder="intern@company.com" value={form.email}
            onChange={(e) => set("email", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Password" id="add-password" error={errors.password}>
          <input id="add-password" type="password" placeholder="Min. 8 characters" value={form.password}
            onChange={(e) => set("password", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Role" id="add-role">
          <RoleSelect id="add-role" value={form.role} onChange={(v) => set("role", v)} />
        </Field>
        <Field label="Department" id="add-department" error={errors.department}>
          <input id="add-department" type="text" placeholder="e.g. Engineering" value={form.department}
            onChange={(e) => set("department", e.target.value)} className={inputCls} />
        </Field>
        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm text-surface-200/60 hover:text-white hover:bg-white/5 transition-all">
            Cancel
          </button>
          <button type="submit" disabled={submitting}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-brand-500 to-brand-400 text-white hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
            {submitting ? <><Spinner /> Creating…</> : "Create Account"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Eye Toggle Button ───────────────────────────────────
function EyeToggle({ visible, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      tabIndex={-1}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
    >
      {visible ? (
        /* Eye open */
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ) : (
        /* Eye closed */
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l18 18" />
        </svg>
      )}
    </button>
  );
}

// ─── Edit User Modal ─────────────────────────────────────
function EditUserModal({ user, onClose, onSuccess }) {
  const [form, setForm] = useState({ name: user.name || "", department: user.department || "", role: user.role || "intern" });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // Clear password fields when modal closes
  const handleClose = () => {
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirm(false);
    setPasswordErrors({});
    onClose();
  };

  const validatePasswords = () => {
    const errs = {};
    if (password && password.length < 8) {
      errs.password = "Must be at least 8 characters";
    }
    if (password && confirmPassword !== password) {
      errs.confirm = "Passwords do not match";
    }
    if (password && !confirmPassword) {
      errs.confirm = "Please confirm the new password";
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.department.trim()) {
      setServerError("Name and department are required."); return;
    }

    // Validate password fields if user typed anything
    const pwErrors = validatePasswords();
    if (Object.keys(pwErrors).length) {
      setPasswordErrors(pwErrors);
      return;
    }
    setPasswordErrors({});

    setSubmitting(true);
    setServerError("");
    try {
      const payload = { ...form };
      if (password.trim()) {
        payload.password = password;
      }
      await updateAdminUser(user.id, payload);
      // Clear password fields after successful save
      setPassword("");
      setConfirmPassword("");
      onSuccess("User updated successfully!");
    } catch (err) {
      setServerError(err.message || "Failed to update user");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title={`Edit — ${user.name}`} onClose={handleClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {serverError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5 text-red-400 text-sm">
            {serverError}
          </div>
        )}
        <Field label="Full Name" id="edit-name">
          <input id="edit-name" type="text" value={form.name}
            onChange={(e) => set("name", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Department" id="edit-department">
          <input id="edit-department" type="text" value={form.department}
            onChange={(e) => set("department", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Role" id="edit-role">
          <RoleSelect id="edit-role" value={form.role} onChange={(v) => set("role", v)} />
        </Field>

        {/* ── Password Section Divider ── */}
        <div className="flex items-center gap-3 pt-2">
          <div className="flex-1 h-px bg-white/8" />
          <span className="text-xs text-surface-200/40 uppercase tracking-wider font-medium whitespace-nowrap">
            Change Password <span className="text-surface-200/25">(optional)</span>
          </span>
          <div className="flex-1 h-px bg-white/8" />
        </div>

        <Field label="New Password" id="edit-password" error={passwordErrors.password}>
          <div className="relative">
            <input
              id="edit-password"
              type={showPassword ? "text" : "password"}
              placeholder="Leave blank to keep current"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setPasswordErrors((p) => ({ ...p, password: undefined })); }}
              className={inputCls + " pr-10"}
              autoComplete="new-password"
            />
            <EyeToggle visible={showPassword} onClick={() => setShowPassword((v) => !v)} />
          </div>
        </Field>

        <Field label="Confirm Password" id="edit-confirm-password" error={passwordErrors.confirm}>
          <div className="relative">
            <input
              id="edit-confirm-password"
              type={showConfirm ? "text" : "password"}
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setPasswordErrors((p) => ({ ...p, confirm: undefined })); }}
              className={inputCls + " pr-10"}
              autoComplete="new-password"
            />
            <EyeToggle visible={showConfirm} onClick={() => setShowConfirm((v) => !v)} />
          </div>
        </Field>

        <div className="flex gap-3 pt-1">
          <button type="button" onClick={handleClose}
            className="flex-1 py-2.5 rounded-xl text-sm text-surface-200/60 hover:text-white hover:bg-white/5 transition-all">
            Cancel
          </button>
          <button type="submit" disabled={submitting}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-brand-500 to-brand-400 text-white hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
            {submitting ? <><Spinner /> Saving…</> : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────
function DeleteModal({ user, onClose, onSuccess }) {
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleDelete = async () => {
    setSubmitting(true);
    setServerError("");
    try {
      await deleteAdminUser(user.id);
      onSuccess(`${user.name}'s account has been deleted.`);
    } catch (err) {
      setServerError(err.message || "Failed to delete user");
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Delete Account" onClose={onClose}>
      <div className="flex flex-col gap-5">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-red-300 leading-relaxed">
            Are you sure you want to delete <strong className="text-red-200">{user.name}</strong>?
            This will permanently remove their account and all attendance records.
          </p>
        </div>
        {serverError && (
          <p className="text-sm text-red-400">{serverError}</p>
        )}
        <div className="flex gap-3">
          <button type="button" onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm text-surface-200/60 hover:text-white hover:bg-white/5 transition-all">
            Cancel
          </button>
          <button onClick={handleDelete} disabled={submitting}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-500/80 hover:bg-red-500 text-white transition-all flex items-center justify-center gap-2 disabled:opacity-60">
            {submitting ? <><Spinner /> Deleting…</> : "Yes, Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Import Modal ────────────────────────────────────────
function ImportModal({ onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [serverError, setServerError] = useState("");
  const fileRef = useRef(null);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.name.endsWith(".xlsx")) {
      setServerError("Only .xlsx files are accepted.");
      return;
    }
    setServerError("");
    setResult(null);
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    if (!f.name.endsWith(".xlsx")) { setServerError("Only .xlsx files are accepted."); return; }
    setServerError("");
    setResult(null);
    setFile(f);
  };

  const handleSubmit = async () => {
    if (!file) { setServerError("Please select a .xlsx file."); return; }
    setUploading(true);
    setServerError("");
    try {
      const res = await importAttendance(file);
      setResult(res);
      onSuccess(res);
    } catch (err) {
      setServerError(err.message || "Import failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal title="Import Attendance" onClose={onClose}>
      <div className="flex flex-col gap-5">
        {/* Drop zone */}
        {!result && (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className="relative flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed border-white/10 hover:border-brand-500/40 bg-white/3 hover:bg-brand-500/5 cursor-pointer transition-all duration-200 group"
          >
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx"
              className="sr-only"
              onChange={handleFileChange}
              id="import-file-input"
            />
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center group-hover:bg-brand-500/20 transition-colors">
              <svg className="w-6 h-6 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            {file ? (
              <div className="text-center">
                <p className="text-white font-medium text-sm">{file.name}</p>
                <p className="text-xs text-surface-200/40 mt-0.5">{(file.size / 1024).toFixed(1)} KB — click to change</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm text-surface-200/60">Drop your <span className="text-white font-medium">.xlsx</span> file here</p>
                <p className="text-xs text-surface-200/30 mt-0.5">or click to browse</p>
              </div>
            )}
          </div>
        )}

        {/* Results summary */}
        {result && (
          <div className="rounded-xl overflow-hidden border border-white/10">
            <div className="px-4 py-3 bg-emerald-500/10 border-b border-white/5 flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-semibold text-emerald-300">Import Complete</p>
            </div>
            <div className="p-4 grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{result.imported}</p>
                <p className="text-xs text-surface-200/40 mt-0.5">New Records</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-300">{result.overwritten}</p>
                <p className="text-xs text-surface-200/40 mt-0.5">Overwritten</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-surface-200/50">{result.skipped}</p>
                <p className="text-xs text-surface-200/40 mt-0.5">Skipped</p>
              </div>
            </div>
            {result.unmatched?.length > 0 && (
              <div className="px-4 pb-4">
                <p className="text-xs text-red-400 font-medium mb-1.5">Unmatched emails ({result.unmatched.length}):</p>
                <ul className="flex flex-col gap-1">
                  {result.unmatched.map((email) => (
                    <li key={email} className="text-xs text-red-300/70 font-mono bg-red-500/5 px-2.5 py-1 rounded-lg">{email}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {serverError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5 text-red-400 text-sm">
            {serverError}
          </div>
        )}

        <div className="flex gap-3">
          <button type="button" onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm text-surface-200/60 hover:text-white hover:bg-white/5 transition-all">
            {result ? "Close" : "Cancel"}
          </button>
          {!result && (
            <button
              id="import-confirm-button"
              onClick={handleSubmit}
              disabled={uploading || !file}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-brand-500 to-brand-400 text-white hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {uploading ? <><Spinner /> Importing…</> : "Import"}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}

// ─── Toggle Switch ────────────────────────────────────────
function ToggleSwitch({ checked, onChange, disabled, loading }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled || loading}
      onClick={onChange}
      className={`relative inline-flex w-10 h-5.5 shrink-0 cursor-pointer rounded-full border-2 border-transparent
        transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50
        disabled:opacity-50 disabled:cursor-not-allowed
        ${checked ? "bg-brand-500" : "bg-white/10"}`}
      style={{ height: "22px" }}
    >
      <span
        className={`pointer-events-none inline-block h-[18px] w-[18px] rounded-full bg-white shadow transform
          transition-transform duration-200 flex items-center justify-center
          ${checked ? "translate-x-[18px]" : "translate-x-0"}`}
      >
        {loading && (
          <svg className="animate-spin w-2.5 h-2.5 text-brand-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        )}
      </span>
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────
export default function AdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("attendance");

  // ── Attendance state
  const [stats, setStats] = useState({ totalInterns: 0, presentToday: 0, averageHours: 0 });
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [debouncedName, setDebouncedName] = useState("");

  // ── Users state
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  // ── Import modal
  const [showImportModal, setShowImportModal] = useState(false);

  // ── Export
  const [exportLoading, setExportLoading] = useState(false);
  const [exportError, setExportError] = useState("");

  // ── Toasts
  const [toasts, setToasts] = useState([]);
  const toastRef = useRef(0);

  const showToast = useCallback((message, type = "success") => {
    const id = ++toastRef.current;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  // ── Debounce name
  useEffect(() => {
    const t = setTimeout(() => setDebouncedName(nameFilter), 400);
    return () => clearTimeout(t);
  }, [nameFilter]);

  // ── Fetch attendance
  const fetchAttendance = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const params = {};
      if (dateFilter) params.date = dateFilter;
      if (debouncedName) params.name = debouncedName;
      const [statsRes, attendanceRes] = await Promise.all([
        getAdminStats(),
        getAdminAttendance(params),
      ]);
      setStats(statsRes);
      setRecords(attendanceRes.records || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [dateFilter, debouncedName]);

  useEffect(() => { fetchAttendance(); }, [fetchAttendance]);

  // ── Fetch users
  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    setUsersError("");
    try {
      const res = await getAdminUsers();
      setUsers(res.users || []);
    } catch (err) {
      setUsersError(err.message);
    } finally {
      setUsersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "users") fetchUsers();
  }, [activeTab, fetchUsers]);

  // ── Export filtered attendance
  const handleExport = async () => {
    setExportLoading(true);
    setExportError("");
    try {
      const params = {};
      if (nameFilter) params.name = nameFilter;
      if (dateFilter) params.date = dateFilter;
      await exportAttendance(params);
    } catch (err) {
      setExportError(err.message || "Export failed. Please try again.");
    } finally {
      setExportLoading(false);
    }
  };

  // ── Toggle active state
  const handleToggleActive = async (u) => {
    if (u.id === user?.id) { showToast("You cannot disable your own account.", "error"); return; }
    setTogglingId(u.id);
    try {
      const updated = await updateAdminUser(u.id, { is_active: !u.is_active });
      setUsers((prev) => prev.map((x) => x.id === u.id ? updated.user : x));
      showToast(updated.user.is_active ? `${u.name}'s account enabled.` : `${u.name}'s account disabled.`);
    } catch (err) {
      showToast(err.message || "Failed to update account status.", "error");
    } finally {
      setTogglingId(null);
    }
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="min-h-screen p-4 md:p-8 animate-fade-in">
      <Toast toasts={toasts} />

      {/* Modals */}
      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onSuccess={(msg) => { showToast(msg); setShowAddModal(false); fetchUsers(); fetchAttendance(); }}
        />
      )}
      {editTarget && (
        <EditUserModal
          user={editTarget}
          onClose={() => setEditTarget(null)}
          onSuccess={(msg) => { showToast(msg); setEditTarget(null); fetchUsers(); }}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          user={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onSuccess={(msg) => { showToast(msg); setDeleteTarget(null); fetchUsers(); fetchAttendance(); }}
        />
      )}
      {showImportModal && (
        <ImportModal
          onClose={() => setShowImportModal(false)}
          onSuccess={(res) => {
            fetchAttendance();
            showToast(`Imported ${res.imported} record(s), ${res.overwritten} overwritten.`);
          }}
        />
      )}

      {/* ── Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-400 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight gradient-text">
                PANDR <span className="text-surface-200/30 font-normal mx-1">|</span> Admin Portal
              </h1>
              <p className="text-surface-200/40 text-xs -mt-0.5">{currentDate}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm text-white font-medium">{user?.name || "Admin"}</p>
            <p className="text-xs text-surface-200/40">{user?.email}</p>
          </div>
          <button
            id="admin-logout-button"
            onClick={onLogout}
            className="px-4 py-2 rounded-xl glass glass-hover text-sm text-surface-200/80 hover:text-white transition-all duration-200"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* ── Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "0.05s" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-xs text-surface-200/50 uppercase tracking-wider font-medium">Total Interns</p>
          </div>
          <p className="text-3xl font-bold text-white">{loading ? "…" : stats.totalInterns}</p>
        </div>

        <div className="glass rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-brand-400/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-brand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xs text-surface-200/50 uppercase tracking-wider font-medium">Present Today</p>
          </div>
          <p className="text-3xl font-bold text-white">{loading ? "…" : stats.presentToday}</p>
          {!loading && stats.totalInterns > 0 && (
            <div className="mt-2">
              <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all duration-1000"
                  style={{ width: `${Math.min((stats.presentToday / stats.totalInterns) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-surface-200/40 mt-1">
                {Math.round((stats.presentToday / stats.totalInterns) * 100)}% attendance rate
              </p>
            </div>
          )}
        </div>

        <div className="glass rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "0.15s" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xs text-surface-200/50 uppercase tracking-wider font-medium">Avg Hours / Day</p>
          </div>
          <p className="text-3xl font-bold text-white">{loading ? "…" : `${stats.averageHours}h`}</p>
        </div>
      </div>

      {/* ── Tab Bar */}
      <div className="flex gap-1 mb-6 p-1 glass rounded-xl w-fit animate-slide-up" style={{ animationDelay: "0.18s" }}>
        {[
          {
            key: "attendance", label: "Attendance", icon: (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            )
          },
          {
            key: "users", label: "Users", icon: (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )
          },
        ].map((tab) => (
          <button
            key={tab.key}
            id={`tab-${tab.key}`}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${activeTab === tab.key
                ? "bg-brand-500/20 text-brand-300 shadow-sm"
                : "text-surface-200/50 hover:text-white hover:bg-white/5"}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Attendance Tab */}
      {activeTab === "attendance" && (
        <>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {/* Filters */}
          <div className="glass rounded-2xl p-5 mb-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[200px]">
                <label htmlFor="admin-name-filter" className="block text-xs text-surface-200/50 uppercase tracking-wider font-medium mb-2">
                  Search Intern
                </label>
                <input
                  id="admin-name-filter"
                  type="text"
                  placeholder="Search by name or email…"
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div className="min-w-[180px]">
                <label htmlFor="admin-date-filter" className="block text-xs text-surface-200/50 uppercase tracking-wider font-medium mb-2">
                  Filter by Date
                </label>
                <input
                  id="admin-date-filter"
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className={inputCls + " [color-scheme:dark]"}
                />
              </div>
              {(dateFilter || nameFilter) && (
                <button
                  id="clear-filters-button"
                  onClick={() => { setDateFilter(""); setNameFilter(""); }}
                  className="px-4 py-2.5 rounded-xl text-sm text-surface-200/60 hover:text-white hover:bg-white/5 transition-all duration-200"
                >
                  Clear Filters
                </button>
              )}
              <div className="flex items-center gap-2 ml-auto">
                {exportError && (
                  <p className="text-xs text-red-400">{exportError}</p>
                )}
                <button
                  id="export-attendance-button"
                  onClick={handleExport}
                  disabled={exportLoading}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-white/15 text-surface-200/70 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all disabled:opacity-50"
                >
                  {exportLoading ? (
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  )}
                  Export
                </button>
                <button
                  id="import-attendance-button"
                  onClick={() => setShowImportModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-brand-500 to-brand-400 text-white hover:opacity-90 transition-all shadow-lg shadow-brand-500/20"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Import Attendance
                </button>
              </div>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="glass rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: "0.25s" }}>
            <div className="p-5 border-b border-white/5">
              <h2 className="text-lg font-semibold text-white">All Attendance Records</h2>
              <p className="text-xs text-surface-200/50 mt-1">
                {records.length} record{records.length !== 1 ? "s" : ""} found
              </p>
            </div>
            <div className="overflow-x-auto overflow-y-auto max-h-[500px]">
              <table className="w-full text-sm">
                <thead className="sticky top-0 z-10 bg-[#12141a]">
                  <tr className="text-surface-200/50 text-xs uppercase tracking-wider border-b border-white/5">
                    <th className="text-left px-5 py-3 font-medium">Intern</th>
                    <th className="text-left px-5 py-3 font-medium">Department</th>
                    <th className="text-left px-5 py-3 font-medium">Date</th>
                    <th className="text-left px-5 py-3 font-medium">Time In</th>
                    <th className="text-left px-5 py-3 font-medium">Time Out</th>
                    <th className="text-left px-5 py-3 font-medium">Duration</th>
                    <th className="text-left px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-surface-200/40">
                        <div className="flex items-center justify-center gap-2">
                          <Spinner size="w-5 h-5" />
                          Loading records…
                        </div>
                      </td>
                    </tr>
                  ) : records.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-surface-200/40">
                        <svg className="w-12 h-12 mx-auto mb-3 text-surface-200/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        No records found
                      </td>
                    </tr>
                  ) : (
                    records.map((record) => (
                      <tr key={record.id} className="border-b border-white/5 table-row-hover transition-colors duration-150">
                        <td className="px-5 py-3">
                          <div>
                            <p className="text-white font-medium">{record.users?.name || "Unknown"}</p>
                            <p className="text-xs text-surface-200/40">{record.users?.email}</p>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-surface-200/60">{record.users?.department || "—"}</td>
                        <td className="px-5 py-3 text-white tabular-nums">
                          {new Date(record.date + "T00:00:00").toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric",
                          })}
                        </td>
                        <td className="px-5 py-3 text-surface-200/70 tabular-nums">{formatTime(record.time_in)}</td>
                        <td className="px-5 py-3 text-surface-200/70 tabular-nums">{formatTime(record.time_out)}</td>
                        <td className="px-5 py-3 text-surface-200/70 tabular-nums">{formatDuration(record.duration_minutes)}</td>
                        <td className="px-5 py-3">
                          {record.time_out ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-surface-200/5 text-surface-200/50">
                              Completed
                            </span>
                          ) : record.date === new Date().toISOString().split("T")[0] ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-brand-500/10 text-brand-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 pulse-dot" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-red-500/10 text-red-400">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Incomplete
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── Users Tab */}
      {activeTab === "users" && (
        <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          {usersError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {usersError}
            </div>
          )}

          <div className="glass rounded-2xl overflow-hidden">
            {/* Table Header */}
            <div className="p-5 border-b border-white/5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-white">Registered Users</h2>
                <p className="text-xs text-surface-200/50 mt-0.5">
                  {usersLoading ? "Loading…" : `${users.length} user${users.length !== 1 ? "s" : ""} total`}
                </p>
              </div>
              <button
                id="add-intern-button"
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-brand-500 to-brand-400 text-white hover:opacity-90 transition-all shadow-lg shadow-brand-500/20"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add User
              </button>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-surface-200/50 text-xs uppercase tracking-wider border-b border-white/5">
                    <th className="text-left px-5 py-3 font-medium">Name</th>
                    <th className="text-left px-5 py-3 font-medium">Email</th>
                    <th className="text-left px-5 py-3 font-medium">Role</th>
                    <th className="text-left px-5 py-3 font-medium">Department</th>
                    <th className="text-left px-5 py-3 font-medium">Date Added</th>
                    <th className="text-left px-5 py-3 font-medium">Active</th>
                    <th className="text-left px-5 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersLoading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-surface-200/40">
                        <div className="flex items-center justify-center gap-2">
                          <Spinner size="w-5 h-5" />
                          Loading users…
                        </div>
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-surface-200/40">
                        <svg className="w-12 h-12 mx-auto mb-3 text-surface-200/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        No users yet
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => {
                      const isSelf = u.id === user?.id;
                      return (
                        <tr key={u.id} className="border-b border-white/5 table-row-hover transition-colors duration-150">
                          {/* Name */}
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center shrink-0">
                                <span className="text-xs font-bold text-brand-300">
                                  {u.name?.charAt(0).toUpperCase() || "?"}
                                </span>
                              </div>
                              <div>
                                <p className="text-white font-medium leading-tight">
                                  {u.name}
                                  {isSelf && (
                                    <span className="ml-1.5 text-xs text-brand-400/80 font-normal">(you)</span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </td>
                          {/* Email */}
                          <td className="px-5 py-3 text-surface-200/60 text-xs">{u.email}</td>
                          {/* Role */}
                          <td className="px-5 py-3">
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium
                              ${u.role === "admin"
                                ? "bg-brand-500/15 text-brand-300"
                                : "bg-white/5 text-surface-200/60"}`}>
                              {u.role}
                            </span>
                          </td>
                          {/* Department */}
                          <td className="px-5 py-3 text-surface-200/60">{u.department || "—"}</td>
                          {/* Date Added */}
                          <td className="px-5 py-3 text-surface-200/50 text-xs tabular-nums">
                            {formatDate(u.created_at)}
                          </td>
                          {/* Toggle */}
                          <td className="px-5 py-3">
                            <ToggleSwitch
                              checked={u.is_active !== false}
                              disabled={isSelf}
                              loading={togglingId === u.id}
                              onChange={() => handleToggleActive(u)}
                            />
                          </td>
                          {/* Actions */}
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                id={`edit-user-${u.id}`}
                                onClick={() => setEditTarget(u)}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium text-surface-200/70 hover:text-white hover:bg-white/8 border border-white/8 hover:border-white/15 transition-all duration-150"
                              >
                                Edit
                              </button>
                              <button
                                id={`delete-user-${u.id}`}
                                disabled={isSelf}
                                onClick={() => setDeleteTarget(u)}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400/80 hover:text-red-300 hover:bg-red-500/10 border border-red-500/15 hover:border-red-500/30 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

```

## FILE: client/src/pages/InternDashboard.jsx
```jsx
import { useState, useEffect, useCallback, useRef } from "react";
import { getTodayAttendance, getAttendanceHistory, recordTimeOut } from "../lib/api";

function formatTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDuration(minutes) {
  if (minutes == null) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

export default function InternDashboard({ user, onLogout }) {
  const [today, setToday] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeOutLoading, setTimeOutLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showTimeOutModal, setShowTimeOutModal] = useState(false);
  const [timeOutError, setTimeOutError] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Live clock
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [todayRes, historyRes] = await Promise.all([
        getTodayAttendance(),
        getAttendanceHistory(),
      ]);
      setToday(todayRes.attendance);
      setHistory(historyRes.records || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTimeOut = async () => {
    setTimeOutLoading(true);
    setTimeOutError("");
    setError("");
    setSuccessMsg("");
    try {
      const res = await recordTimeOut();
      setToday(res.attendance);
      setSuccessMsg("Time-out recorded successfully!");
      setShowTimeOutModal(false);
      fetchData();
    } catch (err) {
      setTimeOutError(err.message);
    } finally {
      setTimeOutLoading(false);
    }
  };

  const todayDateStr = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const liveTimeStr = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  // Compute live duration if clocked in but not clocked out
  let liveDuration = null;
  let liveElapsedMinutes = 0;
  if (today?.time_in && !today?.time_out) {
    liveElapsedMinutes = Math.round((currentTime - new Date(today.time_in)) / 60000);
    liveDuration = formatDuration(liveElapsedMinutes);
  }

  // ── OJT Progress Tracker ────────────────────────────────
  const OJT_KEY = user?.id ? `ojt_required_hours_${user.id}` : null;
  const [requiredHours, setRequiredHours] = useState(() => {
    if (!OJT_KEY) return 480;
    const saved = localStorage.getItem(OJT_KEY);
    return saved ? Number(saved) : 480;
  });
  const [editingHours, setEditingHours] = useState(false);
  const [draftHours, setDraftHours] = useState(String(requiredHours));
  const hoursInputRef = useRef(null);

  // Persist to localStorage whenever requiredHours changes
  useEffect(() => {
    if (OJT_KEY) localStorage.setItem(OJT_KEY, String(requiredHours));
  }, [requiredHours, OJT_KEY]);

  // Focus the input when editing starts
  useEffect(() => {
    if (editingHours) hoursInputRef.current?.focus();
  }, [editingHours]);

  const saveHours = () => {
    const val = parseInt(draftHours, 10);
    if (!isNaN(val) && val > 0) setRequiredHours(val);
    else setDraftHours(String(requiredHours)); // revert bad input
    setEditingHours(false);
  };

  // Compute OJT stats
  // Sum completed history records (exclude today's in-progress row since we use liveElapsedMinutes)
  const completedMinutes = history
    .filter((r) => r.duration_minutes != null)
    .reduce((sum, r) => sum + r.duration_minutes, 0);
  const totalMinutes = completedMinutes + liveElapsedMinutes;
  const totalHours = Math.round((totalMinutes / 60) * 10) / 10;
  const remaining = Math.max(0, requiredHours - totalHours);
  const pct = Math.min(100, Math.round((totalHours / requiredHours) * 1000) / 10);
  const isComplete = totalHours >= requiredHours;

  // Average daily hours from completed records only (to estimate days remaining)
  const completedDays = history.filter((r) => r.duration_minutes != null).length;
  const avgDailyHours =
    completedDays > 0 ? Math.round((completedMinutes / 60 / completedDays) * 10) / 10 : 0;
  const estDays =
    avgDailyHours > 0 ? Math.ceil(remaining / avgDailyHours) : null;

  return (
    <div className="min-h-screen p-4 md:p-8 animate-fade-in">
      {/* Header with PANDR branding */}
      <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-400 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight gradient-text">PANDR Outsourcing</h1>
              <p className="text-surface-200/40 text-xs -mt-0.5">Intern Dashboard</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm text-white font-medium">{user?.name || "Intern"}</p>
            <p className="text-xs text-surface-200/40">{user?.department || "Department"} • {user?.email}</p>
          </div>
          <button
            id="logout-button"
            onClick={onLogout}
            className="px-4 py-2 rounded-xl glass glass-hover text-sm text-surface-200/80 hover:text-white transition-all duration-200"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Date & Live Clock */}
      <div className="glass rounded-2xl p-6 mb-6 animate-slide-up">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-surface-200/50 text-xs uppercase tracking-wider font-medium">Today</p>
            <p className="text-xl font-semibold text-white mt-1">{todayDateStr}</p>
          </div>
          <div className="text-right">
            <p className="text-surface-200/50 text-xs uppercase tracking-wider font-medium">Current Time</p>
            <p className="text-2xl font-bold text-brand-400 mt-1 tabular-nums">{liveTimeStr}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}
      {successMsg && (
        <div className="bg-brand-500/10 border border-brand-500/20 rounded-xl px-4 py-3 text-brand-400 text-sm mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {successMsg}
        </div>
      )}

      {/* Today's Attendance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Time In */}
        <div className="glass rounded-2xl p-5 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </div>
            <p className="text-xs text-surface-200/50 uppercase tracking-wider font-medium">Time In</p>
          </div>
          <p className="text-xl font-semibold text-white tabular-nums">
            {loading ? "..." : formatTime(today?.time_in)}
          </p>
        </div>

        {/* Time Out */}
        <div className="glass rounded-2xl p-5 animate-slide-up" style={{ animationDelay: "0.15s" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <p className="text-xs text-surface-200/50 uppercase tracking-wider font-medium">Time Out</p>
          </div>
          <p className="text-xl font-semibold text-white tabular-nums">
            {loading ? "..." : formatTime(today?.time_out)}
          </p>
        </div>

        {/* Duration */}
        <div className="glass rounded-2xl p-5 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xs text-surface-200/50 uppercase tracking-wider font-medium">Total Hours</p>
          </div>
          <p className="text-xl font-semibold text-white tabular-nums">
            {loading
              ? "..."
              : today?.time_out
              ? formatDuration(today?.duration_minutes)
              : liveDuration
              ? liveDuration
              : "—"}
          </p>
          {liveDuration && !today?.time_out && (
            <p className="text-xs text-brand-400/70 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 pulse-dot inline-block" />
              In progress
            </p>
          )}
        </div>

        {/* Status */}
        <div className="glass rounded-2xl p-5 animate-slide-up" style={{ animationDelay: "0.25s" }}>
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                today?.time_out
                  ? "bg-surface-200/5"
                  : today?.time_in
                  ? "bg-brand-500/10"
                  : "bg-surface-200/5"
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  today?.time_out
                    ? "bg-surface-200/30"
                    : today?.time_in
                    ? "bg-brand-400 pulse-dot"
                    : "bg-surface-200/30"
                }`}
              />
            </div>
            <p className="text-xs text-surface-200/50 uppercase tracking-wider font-medium">Status</p>
          </div>
          <p
            className={`text-xl font-semibold ${
              today?.time_out
                ? "text-surface-200/50"
                : today?.time_in
                ? "text-brand-400"
                : "text-surface-200/50"
            }`}
          >
            {loading
              ? "..."
              : today?.time_out
              ? "Completed"
              : today?.time_in
              ? "Clocked In"
              : "Not Clocked In"}
          </p>
        </div>
      </div>

      {/* ── OJT Progress Tracker */}
      <div className="glass rounded-2xl p-6 mb-6 animate-slide-up" style={{ animationDelay: "0.28s" }}>
        {/* Header row */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold text-white">OJT Progress Tracker</h2>
            <p className="text-xs text-surface-200/40 mt-0.5">Track your required internship hours</p>
          </div>
          {/* Required-hours inline editor */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-surface-200/40 uppercase tracking-wider font-medium">Required</span>
            {editingHours ? (
              <div className="flex items-center gap-1.5">
                <input
                  ref={hoursInputRef}
                  type="number"
                  min="1"
                  value={draftHours}
                  onChange={(e) => setDraftHours(e.target.value)}
                  onBlur={saveHours}
                  onKeyDown={(e) => { if (e.key === "Enter") saveHours(); if (e.key === "Escape") { setDraftHours(String(requiredHours)); setEditingHours(false); } }}
                  className="w-20 px-2 py-1 rounded-lg bg-transparent border border-brand-500/40 text-white text-sm text-center focus:outline-none focus:ring-2 focus:ring-brand-500/50 tabular-nums [color-scheme:dark]"
                />
                <span className="text-xs text-surface-200/50">hrs</span>
              </div>
            ) : (
              <button
                id="edit-required-hours-button"
                onClick={() => { setDraftHours(String(requiredHours)); setEditingHours(true); }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-white/5 transition-colors group"
              >
                <span className="text-white font-semibold tabular-nums">{requiredHours}</span>
                <span className="text-xs text-surface-200/40">hrs</span>
                <svg className="w-3.5 h-3.5 text-surface-200/30 group-hover:text-brand-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
          <div className="bg-white/3 rounded-xl p-3.5">
            <p className="text-xs text-surface-200/40 uppercase tracking-wider font-medium mb-1">Rendered</p>
            <p className="text-2xl font-bold text-white tabular-nums">{totalHours}<span className="text-sm font-normal text-surface-200/40 ml-1">h</span></p>
          </div>
          <div className="bg-white/3 rounded-xl p-3.5">
            <p className="text-xs text-surface-200/40 uppercase tracking-wider font-medium mb-1">Remaining</p>
            {isComplete ? (
              <p className="text-lg font-bold text-brand-400">Done! 🎉</p>
            ) : (
              <p className="text-2xl font-bold text-white tabular-nums">{remaining.toFixed(1)}<span className="text-sm font-normal text-surface-200/40 ml-1">h</span></p>
            )}
          </div>
          <div className="bg-white/3 rounded-xl p-3.5">
            <p className="text-xs text-surface-200/40 uppercase tracking-wider font-medium mb-1">Completed</p>
            <p className={`text-2xl font-bold tabular-nums ${isComplete ? "text-brand-400" : "text-white"}`}>{pct.toFixed(1)}<span className="text-sm font-normal text-surface-200/40 ml-0.5">%</span></p>
          </div>
          <div className="bg-white/3 rounded-xl p-3.5">
            <p className="text-xs text-surface-200/40 uppercase tracking-wider font-medium mb-1">Est. Days Left</p>
            <p className="text-2xl font-bold text-white tabular-nums">
              {isComplete ? (
                <span className="text-brand-400">0</span>
              ) : estDays !== null ? (
                estDays
              ) : (
                <span className="text-surface-200/30 text-lg">—</span>
              )}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-surface-200/40">{totalHours}h of {requiredHours}h</span>
            <span className={`text-xs font-semibold ${isComplete ? "text-brand-400" : "text-surface-200/60"}`}>{pct.toFixed(1)}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-400 transition-all duration-700 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
          {isComplete && (
            <p className="mt-2.5 text-center text-sm font-semibold text-brand-400">
              🎉 Congratulations! You've completed your OJT hours!
            </p>
          )}
        </div>
      </div>

      {/* Time Out Confirmation Modal */}
      {showTimeOutModal && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) { setShowTimeOutModal(false); setTimeOutError(""); } }}
        >
          <div className="w-full max-w-md rounded-2xl glass border border-white/10 shadow-2xl animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h3 className="text-lg font-semibold text-white">Confirm Time Out</h3>
              <button
                onClick={() => { setShowTimeOutModal(false); setTimeOutError(""); }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-surface-200/50 hover:text-white hover:bg-white/5 transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-5 flex flex-col gap-5">
              {/* Info block */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-brand-500/10 border border-brand-500/20">
                <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-white font-medium">
                    Current time: <span className="text-brand-400 font-bold tabular-nums">{currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}</span>
                  </p>
                  {liveDuration && (
                    <p className="text-sm text-surface-200/60 mt-1">
                      You've been clocked in for <span className="text-white font-semibold">{liveDuration}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Error inside modal */}
              {timeOutError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5 text-red-400 text-sm flex items-start gap-2">
                  <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {timeOutError}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setShowTimeOutModal(false); setTimeOutError(""); }}
                  className="flex-1 py-2.5 rounded-xl text-sm text-surface-200/60 hover:text-white hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  id="confirm-time-out-button"
                  onClick={handleTimeOut}
                  disabled={timeOutLoading}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-brand-500 to-brand-400 text-white hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {timeOutLoading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      Recording…
                    </>
                  ) : (
                    "Confirm Time Out"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Record Time Out Button */}
      {today?.time_in && !today?.time_out && (
        <div className="mb-8 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <button
            id="record-time-out-button"
            onClick={() => { setTimeOutError(""); setShowTimeOutModal(true); }}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold hover:from-brand-500 hover:to-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all duration-200 shadow-lg shadow-brand-600/20 hover:shadow-brand-500/40 text-lg"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Record Time Out
            </span>
          </button>
        </div>
      )}

      {/* Attendance History Table */}
      <div className="glass rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: "0.35s" }}>
        <div className="p-5 border-b border-white/5">
          <h2 className="text-lg font-semibold text-white">Attendance History</h2>
          <p className="text-xs text-surface-200/50 mt-1">Your past attendance records</p>
        </div>

        <div className="overflow-x-auto overflow-y-auto max-h-96">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-[#12141a]">
              <tr className="text-surface-200/50 text-xs uppercase tracking-wider border-b border-white/5">
                <th className="text-left px-5 py-3 font-medium">Date</th>
                <th className="text-left px-5 py-3 font-medium">Time In</th>
                <th className="text-left px-5 py-3 font-medium">Time Out</th>
                <th className="text-left px-5 py-3 font-medium">Duration</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-surface-200/40">
                    Loading…
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-surface-200/40">
                    No attendance records yet
                  </td>
                </tr>
              ) : (
                history.map((record) => (
                  <tr key={record.id} className="border-b border-white/5 table-row-hover transition-colors duration-150">
                    <td className="px-5 py-3 text-white font-medium">{formatDate(record.date)}</td>
                    <td className="px-5 py-3 text-surface-200/70 tabular-nums">{formatTime(record.time_in)}</td>
                    <td className="px-5 py-3 text-surface-200/70 tabular-nums">{formatTime(record.time_out)}</td>
                    <td className="px-5 py-3 text-surface-200/70 tabular-nums">{formatDuration(record.duration_minutes)}</td>
                    <td className="px-5 py-3">
                      {record.time_out ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-surface-200/5 text-surface-200/50">
                          Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-brand-500/10 text-brand-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 pulse-dot" />
                          Active
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

```

## FILE: client/src/pages/Login.jsx
```jsx
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Login({ onLogin, disabledMessage = "" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [accessDenied, setAccessDenied] = useState(false);
  const [accountDisabled, setAccountDisabled] = useState(disabledMessage);

  // Sync prop changes (e.g. when App sets disabledMessage after sign-out)
  useEffect(() => {
    if (disabledMessage) setAccountDisabled(disabledMessage);
  }, [disabledMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setAccessDenied(false);
    setAccountDisabled("");
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      onLogin(data.session);
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 animate-fade-in">
      {/* Background decorations — pink glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-400/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* PANDR Branding */}
        <div className="text-center mb-8 animate-slide-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-400 mb-4 shadow-lg shadow-brand-500/25">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-black tracking-tight gradient-text">PANDR</h1>
          <p className="text-surface-200/60 mt-1 text-sm font-medium">Intern Attendance Tracker</p>
        </div>

        {/* Access Denied Banner */}
        {accessDenied && (
          <div
            id="access-denied-banner"
            className="mb-6 rounded-2xl overflow-hidden animate-slide-up"
          >
            <div className="bg-gradient-to-r from-red-500/20 via-brand-500/15 to-red-500/20 border border-red-500/30 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v.01M12 12V8m0 13a9 9 0 110-18 9 9 0 010 18zm0-2a7 7 0 100-14 7 7 0 000 14z" />
                  </svg>
                </div>
                <div>
                  <p className="text-red-300 font-semibold text-sm">🔒 Access Denied</p>
                  <p className="text-red-400/80 text-sm mt-1 leading-relaxed">
                    You must be connected to the PANDR office network to log in.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Account Disabled Banner */}
        {accountDisabled && (
          <div
            id="account-disabled-banner"
            className="mb-6 rounded-2xl overflow-hidden animate-slide-up"
          >
            <div className="bg-gradient-to-r from-red-500/20 via-brand-500/15 to-red-500/20 border border-red-500/30 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </div>
                <div>
                  <p className="text-red-300 font-semibold text-sm">🚫 Account Disabled</p>
                  <p className="text-red-400/80 text-sm mt-1 leading-relaxed">
                    {accountDisabled}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Login Card */}
        <form
          onSubmit={handleSubmit}
          className="glass rounded-2xl p-8 space-y-6 animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm flex items-start gap-2">
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-surface-200/80">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="intern@company.com"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-surface-200/80">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all duration-200"
            />
          </div>

          <button
            id="login-button"
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold hover:from-brand-500 hover:to-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-600/25 hover:shadow-brand-500/40"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Signing in…
              </span>
            ) : (
              "Sign In"
            )}
          </button>

          <p className="text-center text-xs text-surface-200/40 mt-4">
            Only pre-registered intern accounts can sign in.
            <br />
            Contact your administrator for access.
          </p>
        </form>

        {/* Footer branding */}
        <p className="text-center text-xs text-surface-200/25 mt-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          © {new Date().getFullYear()} PANDR Outsourcing
        </p>
      </div>
    </div>
  );
}

```

## FILE: client/src/pages/TimeInPage.jsx
```jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { recordTimeIn } from "../lib/api";
import { supabase } from "../lib/supabaseClient";

export default function TimeInPage({ user, onLogout }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [accessDenied, setAccessDenied] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Safety: admins should never see this page
  useEffect(() => {
    if (user?.role === "admin") {
      navigate("/admin", { replace: true });
    }
  }, [user, navigate]);

  // Live clock — updates every second
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const todayDateStr = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const liveTimeStr = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const handleRecordTimeIn = async () => {
    setLoading(true);
    setError("");
    setAccessDenied(false);

    try {
      await recordTimeIn();
      navigate("/dashboard", { replace: true });
    } catch (err) {
      // IP restriction — sign out and show access denied
      if (err.code === "ACCESS_DENIED" || err.status === 403) {
        setAccessDenied(true);
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      // Already clocked in today — treat as success
      if (
        err.message?.toLowerCase().includes("already clocked in") ||
        err.message?.toLowerCase().includes("already recorded")
      ) {
        navigate("/dashboard", { replace: true });
        return;
      }

      setError(err.message || "Failed to record time-in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      if (onLogout) onLogout();
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  // Greeting based on time of day
  const hour = currentTime.getHours();
  let greeting = "Good morning";
  if (hour >= 12 && hour < 17) greeting = "Good afternoon";
  else if (hour >= 17) greeting = "Good evening";

  const firstName = user?.name?.split(" ")[0] || "Intern";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 animate-fade-in">
      {/* Background decorations — pink glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-400/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* PANDR Branding */}
        <div className="text-center mb-8 animate-slide-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-400 mb-4 shadow-lg shadow-brand-500/25">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-black tracking-tight gradient-text">PANDR</h1>
          <p className="text-surface-200/60 mt-1 text-sm font-medium">Intern Attendance Tracker</p>
        </div>

        {/* Access Denied Banner */}
        {accessDenied && (
          <div
            id="access-denied-banner"
            className="mb-6 rounded-2xl overflow-hidden animate-slide-up"
          >
            <div className="bg-gradient-to-r from-red-500/20 via-brand-500/15 to-red-500/20 border border-red-500/30 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v.01M12 12V8m0 13a9 9 0 110-18 9 9 0 010 18zm0-2a7 7 0 100-14 7 7 0 000 14z" />
                  </svg>
                </div>
                <div>
                  <p className="text-red-300 font-semibold text-sm">🔒 Access Denied</p>
                  <p className="text-red-400/80 text-sm mt-1 leading-relaxed">
                    You must be connected to the PANDR office network to clock in.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Time-In Card */}
        <div
          className="glass rounded-2xl p-8 space-y-6 animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          {/* Greeting */}
          <div className="text-center">
            <p className="text-surface-200/50 text-sm font-medium">{greeting},</p>
            <p className="text-2xl font-bold text-white mt-1">{firstName}!</p>
          </div>

          {/* Date & Live Clock */}
          <div className="bg-white/[0.03] rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-surface-200/40 text-xs uppercase tracking-wider font-medium">Today</p>
                <p className="text-sm font-medium text-white mt-1">{todayDateStr}</p>
              </div>
              <div className="text-right">
                <p className="text-surface-200/40 text-xs uppercase tracking-wider font-medium">Current Time</p>
                <p className="text-2xl font-bold text-brand-400 mt-1 tabular-nums">{liveTimeStr}</p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm flex items-start gap-2">
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {/* Record Time-In Button */}
          <button
            id="record-time-in-button"
            onClick={handleRecordTimeIn}
            disabled={loading || accessDenied}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold hover:from-brand-500 hover:to-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-600/25 hover:shadow-brand-500/40 text-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Recording Time-In…
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Record Time-In
              </span>
            )}
          </button>

          {/* Sign Out link */}
          <div className="text-center">
            <button
              id="timein-sign-out-button"
              onClick={handleSignOut}
              className="text-sm text-surface-200/40 hover:text-surface-200/70 transition-colors duration-200 underline underline-offset-2 decoration-surface-200/20 hover:decoration-surface-200/50"
            >
              Sign out instead
            </button>
          </div>
        </div>

        {/* Footer branding */}
        <p className="text-center text-xs text-surface-200/25 mt-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          © {new Date().getFullYear()} PANDR Outsourcing
        </p>
      </div>
    </div>
  );
}

```

## FILE: client/tailwind.config.js
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

## FILE: client/vite.config.js
```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  envDir: "..",
  server: {
    host: true,
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});

```

## FILE: README.md
```md
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
```

## FILE: server/index.js
```js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

import ipRestriction from "./middleware/ipRestriction.js";
import authMiddleware from "./middleware/auth.js";
import attendanceRoutes from "./routes/attendance.js";
import adminRoutes from "./routes/admin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ──────────────────────────────────────────
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Trust proxy so req.ip returns the real client IP behind reverse proxies
app.set("trust proxy", true);

// Health check (no IP restriction needed)
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── IP Restriction on all /api/ routes ─────────────────
app.use("/api", ipRestriction);

// ─── Protected Routes ───────────────────────────────────
app.use("/api/attendance", authMiddleware, attendanceRoutes);
app.use("/api/admin", authMiddleware, adminRoutes);

// ─── Start ──────────────────────────────────────────────
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  const officeIps = process.env.ALLOWED_OFFICE_IP;
  if (officeIps) {
    console.log(`✓ IP restriction active — allowed: ${officeIps}, localhost`);
  } else {
    console.log(`⚠ ALLOWED_OFFICE_IP not set — all IPs allowed`);
  }
});

```

## FILE: server/lib/supabase.js
```js
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, "../../.env") });

// Admin client – uses the service-role key so it bypasses RLS.
// Use this for all server-side operations.
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default supabase;

```

## FILE: server/middleware/auth.js
```js
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, "../../.env") });

/**
 * Auth middleware — verifies the Supabase JWT from the Authorization header
 * and attaches the user profile (from public.users) to req.user.
 */
export default async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid authorization header" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Create a temporary client with the user's token to get their identity
    const supabaseAuth = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
      {
        global: { headers: { Authorization: `Bearer ${token}` } },
      }
    );

    const {
      data: { user },
      error,
    } = await supabaseAuth.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Fetch the full profile from public.users using the admin client
    const { default: supabaseAdmin } = await import("../lib/supabase.js");
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return res.status(403).json({ error: "User profile not found. Contact your admin." });
    }

    if (profile.is_active === false) {
      return res.status(403).json({
        error: "ACCOUNT_DISABLED",
        message: "Your account has been disabled. Please contact your administrator.",
      });
    }

    req.user = profile;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(500).json({ error: "Authentication failed" });
  }
}

/**
 * Admin-only guard — must be used AFTER authMiddleware.
 */
export function adminOnly(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}

```

## FILE: server/middleware/ipRestriction.js
```js
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, "../../.env") });

// Localhost IPs that are always allowed (for development)
const LOCALHOST_IPS = new Set([
  "127.0.0.1",
  "::1",
  "::ffff:127.0.0.1",
]);

/**
 * Normalize an IP address — strips the IPv6-mapped IPv4 prefix if present.
 * e.g. "::ffff:192.168.1.1" → "192.168.1.1"
 */
function normalizeIp(ip) {
  if (!ip) return "";
  return ip.replace(/^::ffff:/, "").trim();
}

/**
 * Parse the ALLOWED_OFFICE_IP env var into a Set of IPs.
 * Supports comma-separated values.
 */
function getAllowedIps() {
  const raw = process.env.ALLOWED_OFFICE_IP || "";
  const ips = new Set();
  raw.split(",").forEach((ip) => {
    const trimmed = ip.trim();
    if (trimmed) ips.add(trimmed);
  });
  return ips;
}

/**
 * IP Restriction Middleware
 *
 * Blocks requests from IPs not on the office whitelist.
 * Localhost is always allowed for development.
 * Reads the client's real IP from x-forwarded-for (proxy) or req.ip.
 */
export default function ipRestriction(req, res, next) {
  // Extract the real client IP (first entry in x-forwarded-for, or req.ip)
  const forwarded = req.headers["x-forwarded-for"];
  const rawIp = forwarded
    ? forwarded.split(",")[0].trim()
    : req.ip || req.connection?.remoteAddress || "";

  const clientIp = normalizeIp(rawIp);

  // Always allow localhost for development
  if (LOCALHOST_IPS.has(rawIp) || LOCALHOST_IPS.has(clientIp) || clientIp === "127.0.0.1") {
    return next();
  }

  // Check against the allowed office IPs
  const allowedIps = getAllowedIps();

  // If no office IPs are configured, allow all traffic (fail-open for unconfigured env)
  if (allowedIps.size === 0) {
    return next();
  }

  if (allowedIps.has(clientIp)) {
    return next();
  }

  // Blocked — return 403
  console.warn(`⛔ IP blocked: ${clientIp} (raw: ${rawIp})`);
  return res.status(403).json({
    error: "ACCESS_DENIED",
    message:
      "You must be connected to the PANDR office network to access this system.",
  });
}

```

## FILE: server/package.json
```json
{
  "name": "intern-attendance-server",
  "version": "1.0.0",
  "description": "Express backend for Intern Attendance Tracker",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "dev": "node --watch index.js",
    "start": "node index.js"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.45.0",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.21.0",
    "multer": "^2.1.1",
    "xlsx": "^0.18.5"
  }
}

```

## FILE: server/routes/admin.js
```js
import { Router } from "express";
import { adminOnly } from "../middleware/auth.js";
import supabase from "../lib/supabase.js";
import multer from "multer";
import * as XLSX from "xlsx";

const router = Router();

// All routes in this file require admin role
router.use(adminOnly);

// ─── GET /api/admin/attendance ──────────────────────────
// Returns all attendance records. Supports ?date= and ?name= filters.
router.get("/attendance", async (req, res) => {
  try {
    const { date, name } = req.query;

    let query = supabase
      .from("attendance")
      .select("*, users(name, email, department)")
      .order("date", { ascending: false })
      .order("time_in", { ascending: false });

    if (date) {
      query = query.eq("date", date);
    }

    const { data, error } = await query;

    if (error) throw error;

    // If name filter is provided, filter in JS (Supabase doesn't support
    // ilike on joined columns easily in the query builder)
    let results = data;
    if (name) {
      const lowerName = name.toLowerCase();
      results = data.filter(
        (r) =>
          r.users?.name?.toLowerCase().includes(lowerName) ||
          r.users?.email?.toLowerCase().includes(lowerName)
      );
    }

    res.json({ records: results });
  } catch (err) {
    console.error("Admin attendance error:", err);
    res.status(500).json({ error: "Failed to fetch attendance records" });
  }
});

// ─── GET /api/admin/export ───────────────────────────────
// Downloads the filtered attendance records as a .xlsx file.
// Accepts the same ?date= and ?name= query params as /attendance.
router.get("/export", async (req, res) => {
  try {
    const { date, name } = req.query;

    let query = supabase
      .from("attendance")
      .select("*, users(name, email, department)")
      .order("date", { ascending: false })
      .order("time_in", { ascending: false });

    if (date) {
      query = query.eq("date", date);
    }

    const { data, error } = await query;
    if (error) throw error;

    let results = data;
    if (name) {
      const lowerName = name.toLowerCase();
      results = data.filter(
        (r) =>
          r.users?.name?.toLowerCase().includes(lowerName) ||
          r.users?.email?.toLowerCase().includes(lowerName)
      );
    }

    // ── Format helpers
    const today = new Date().toISOString().split("T")[0];

    const fmtTime = (iso) => {
      if (!iso) return "";
      return new Date(iso).toLocaleTimeString("en-US", {
        hour: "2-digit", minute: "2-digit", hour12: true,
      });
    };

    const fmtDuration = (mins) => {
      if (mins == null) return "";
      return `${Math.floor(mins / 60)}h ${mins % 60}m`;
    };

    const fmtDate = (dateStr) => {
      if (!dateStr) return "";
      return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      });
    };

    const fmtStatus = (rec) => {
      if (rec.time_out) return "Completed";
      if (rec.date === today) return "Active";
      return "Incomplete";
    };

    // ── Build worksheet rows
    const rows = results.map((r) => ({
      "Name":       r.users?.name || "",
      "Email":      r.users?.email || "",
      "Department": r.users?.department || "",
      "Date":       fmtDate(r.date),
      "Time In":    fmtTime(r.time_in),
      "Time Out":   fmtTime(r.time_out),
      "Duration":   fmtDuration(r.duration_minutes),
      "Status":     fmtStatus(r),
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook  = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    // ── Derive filename from active filters
    let filename = "attendance_all.xlsx";
    if (name) filename = `attendance_${name.replace(/\s+/g, "_")}.xlsx`;
    else if (date) filename = `attendance_${date}.xlsx`;

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (err) {
    console.error("Admin export error:", err);
    res.status(500).json({ error: "Export failed" });
  }
});


// ─── GET /api/admin/stats ───────────────────────────────
router.get("/stats", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    // Total interns
    const { count: totalInterns } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("role", "intern");

    // Present today
    const { count: presentToday } = await supabase
      .from("attendance")
      .select("*, users!inner(role)", { count: "exact", head: true })
      .eq("date", today)
      .eq("users.role", "intern");

    // Average hours (from records that have duration)
    const { data: durationData } = await supabase
      .from("attendance")
      .select("duration_minutes")
      .not("duration_minutes", "is", null);

    let averageHours = 0;
    if (durationData && durationData.length > 0) {
      const totalMinutes = durationData.reduce(
        (sum, r) => sum + (r.duration_minutes || 0),
        0
      );
      averageHours = Math.round((totalMinutes / durationData.length / 60) * 10) / 10;
    }

    res.json({
      totalInterns: totalInterns || 0,
      presentToday: presentToday || 0,
      averageHours,
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// ─── GET /api/admin/users ───────────────────────────────
router.get("/users", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json({ users: data });
  } catch (err) {
    console.error("Admin get users error:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// ─── POST /api/admin/users ──────────────────────────────
router.post("/users", async (req, res) => {
  try {
    const { name, email, password, role = "intern", department } = req.body;

    if (!name || !email || !password || !department) {
      return res.status(400).json({ error: "Name, email, password, and department are required" });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      if (authError.message?.toLowerCase().includes("already registered") ||
        authError.message?.toLowerCase().includes("already exists") ||
        authError.code === "email_exists") {
        return res.status(409).json({ error: "A user with this email already exists." });
      }
      throw authError;
    }

    const userId = authData.user.id;

    // Insert into public.users
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .insert({ id: userId, name, email, role, department, is_active: true })
      .select()
      .single();

    if (profileError) {
      // Rollback: remove the auth user if profile insert fails
      await supabase.auth.admin.deleteUser(userId);
      throw profileError;
    }

    res.status(201).json({ user: profile });
  } catch (err) {
    console.error("Admin create user error:", err);
    res.status(500).json({ error: err.message || "Failed to create user" });
  }
});

// ─── PATCH /api/admin/users/:id ─────────────────────────
router.patch("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, department, role, is_active, password } = req.body;

    // ── Handle optional password update via Supabase Auth ──
    if (password && typeof password === "string" && password.trim().length > 0) {
      if (password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters" });
      }
      const { error: authError } = await supabase.auth.admin.updateUserById(id, { password });
      if (authError) {
        console.error("Password update error:", authError);
        return res.status(500).json({ error: authError.message || "Failed to update password" });
      }
    }

    // ── Handle profile field updates ──
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (department !== undefined) updates.department = department;
    if (role !== undefined) updates.role = role;
    if (is_active !== undefined) updates.is_active = is_active;

    if (Object.keys(updates).length === 0) {
      // Password-only update — no profile fields to change
      return res.json({ user: { id } });
    }

    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    res.json({ user: data });
  } catch (err) {
    console.error("Admin update user error:", err);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// ─── DELETE /api/admin/users/:id ────────────────────────
router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Delete from Supabase Auth (public.users will cascade)
    const { error } = await supabase.auth.admin.deleteUser(id);
    if (error) throw error;

    res.json({ success: true });
  } catch (err) {
    console.error("Admin delete user error:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// ─── POST /api/admin/import ─────────────────────────────
// Accepts a .xlsx file (Google Forms export), parses rows, and upserts
// attendance records. Returns { imported, skipped, overwritten, unmatched }.
const upload = multer({ storage: multer.memoryStorage() });

// Parse Timestamp: '4/12/2026 7:40:16' → ISO string in PHT
function parseTimestamp(str) {
  if (!str) return null;
  const [datePart, timePart] = String(str).trim().split(" ");
  if (!datePart || !timePart) return null;
  const [month, day, year] = datePart.split("/");
  const fullStr = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${timePart.padStart(8, "0")}+08:00`;
  const d = new Date(fullStr);
  return isNaN(d.getTime()) ? null : d;
}

// Parse Attendance Date: '4/12/26' → 'YYYY-MM-DD'
function parseAttendanceDate(str) {
  if (!str) return null;
  const [month, day, year] = String(str).trim().split("/");
  if (!month || !day || !year) return null;
  const fullYear = year.length === 2 ? "20" + year : year;
  return `${fullYear}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

router.post("/import", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // ── Parse the workbook from the in-memory buffer
    // raw:false forces SheetJS to output dates as plain strings
    // (e.g. "4/12/2026 7:40:16") instead of JS Date objects, avoiding UTC bugs.
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
      raw: false,
      dateNF: "yyyy-mm-dd hh:mm:ss",
      defval: null,
    });

    if (!rows.length) {
      return res.json({ imported: 0, skipped: 0, overwritten: 0, unmatched: [] });
    }

    // ── Build a lookup map: email → user_id from public.users
    const { data: usersData, error: usersError } = await supabase
      .from("users")
      .select("id, email");
    if (usersError) throw usersError;

    const emailToId = {};
    for (const u of usersData) {
      emailToId[u.email.toLowerCase().trim()] = u.id;
    }

    // ── Group rows into a map keyed by "user_id|YYYY-MM-DD"
    // Each entry: { time_in: Date|null, time_out: Date|null }
    const punchMap = {}; // key → { time_in, time_out }
    const unmatchedEmails = new Set();

    for (const row of rows) {
      // Normalise column names (Google Forms may vary capitalisation)
      const keys = Object.keys(row);
      const get = (hint) => {
        const k = keys.find((k) => k.toLowerCase().includes(hint.toLowerCase()));
        return k ? row[k] : null;
      };

      const rawTimestamp = get("Timestamp") ?? get("timestamp");
      const rawEmail     = get("Email") ?? get("email");
      const rawDate      = get("Attendance Date") ?? get("date");
      const rawLog       = get("Time Log") ?? get("log");

      if (!rawEmail || !rawTimestamp || !rawLog) continue;

      const email   = String(rawEmail).toLowerCase().trim();
      const userId  = emailToId[email];

      if (!userId) {
        unmatchedEmails.add(rawEmail);
        continue;
      }

      // Parse the punch timestamp as PHT → Date object (internally UTC)
      const punchTimeUTC = parseTimestamp(rawTimestamp);
      if (!punchTimeUTC) continue;

      // Resolve the attendance date (prefer explicit "Attendance Date" column)
      const attendanceDate = parseAttendanceDate(rawDate)
        || parseAttendanceDate(String(rawTimestamp).trim().split(" ")[0]);
      if (!attendanceDate) continue;

      const key = `${userId}|${attendanceDate}`;
      if (!punchMap[key]) {
        punchMap[key] = { userId, attendanceDate, time_in: null, time_out: null };
      }

      const logType = String(rawLog).trim();
      if (logType === "Time In") {
        // Keep the earliest Time In if there are duplicates
        if (!punchMap[key].time_in || punchTimeUTC < punchMap[key].time_in) {
          punchMap[key].time_in = punchTimeUTC;
        }
      } else if (logType === "Time Out") {
        // Keep the latest Time Out if there are duplicates
        if (!punchMap[key].time_out || punchTimeUTC > punchMap[key].time_out) {
          punchMap[key].time_out = punchTimeUTC;
        }
      }
    }

    // ── Upsert each paired record
    let imported = 0;
    let skipped = 0;
    let overwritten = 0;

    for (const entry of Object.values(punchMap)) {
      if (!entry.time_in) {
        // No Time In at all — skip (Time Out only rows are ambiguous)
        skipped++;
        continue;
      }

      const durationMinutes =
        entry.time_out
          ? Math.round((entry.time_out - entry.time_in) / 60000)
          : null;

      // Check whether a record already exists for this (user_id, date)
      const { data: existing } = await supabase
        .from("attendance")
        .select("id")
        .eq("user_id", entry.userId)
        .eq("date", entry.attendanceDate)
        .maybeSingle();

      const record = {
        user_id:          entry.userId,
        date:             entry.attendanceDate,
        time_in:          entry.time_in.toISOString(),
        time_out:         entry.time_out ? entry.time_out.toISOString() : null,
        duration_minutes: durationMinutes,
      };

      const { error: upsertError } = await supabase
        .from("attendance")
        .upsert(record, { onConflict: "user_id,date" });

      if (upsertError) {
        console.error("Upsert error for", entry, upsertError);
        skipped++;
        continue;
      }

      if (existing) {
        overwritten++;
      } else {
        imported++;
      }
    }

    res.json({
      imported,
      skipped,
      overwritten,
      unmatched: [...unmatchedEmails],
    });
  } catch (err) {
    console.error("Admin import error:", err);
    res.status(500).json({ error: err.message || "Import failed" });
  }
});

export default router;


```

## FILE: server/routes/attendance.js
```js
import { Router } from "express";
import supabase from "../lib/supabase.js";

const router = Router();

// ─── POST /api/attendance/time-in ────────────────────────
// Called when intern clicks "Record Time-In" on the Time-In page.
router.post("/time-in", async (req, res) => {
  try {
    // Admins do not record attendance
    if (req.user.role === "admin") {
      return res.status(403).json({ error: "Admins do not record attendance" });
    }

    const userId = req.user.id;
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    // Check if a record already exists for today
    const { data: existing } = await supabase
      .from("attendance")
      .select("*")
      .eq("user_id", userId)
      .eq("date", today)
      .maybeSingle();

    if (existing) {
      return res.json({ message: "Already clocked in today", attendance: existing });
    }

    // Insert new attendance record
    const { data, error } = await supabase
      .from("attendance")
      .insert({
        user_id: userId,
        date: today,
        time_in: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ message: "Time-in recorded", attendance: data });
  } catch (err) {
    console.error("Time-in error:", err);
    res.status(500).json({ error: "Failed to record time-in" });
  }
});

// ─── POST /api/attendance/time-out ───────────────────────
// Called when intern clicks "Record Time Out" from the dashboard.
router.post("/time-out", async (req, res) => {
  try {
    // Admins do not record attendance
    if (req.user.role === "admin") {
      return res.status(403).json({ error: "Admins do not record attendance" });
    }

    const userId = req.user.id;
    const today = new Date().toISOString().split("T")[0];

    // Find today's record
    const { data: existing } = await supabase
      .from("attendance")
      .select("*")
      .eq("user_id", userId)
      .eq("date", today)
      .maybeSingle();

    if (!existing) {
      return res.status(404).json({ error: "No time-in record found for today" });
    }

    if (existing.time_out) {
      return res.json({ message: "Already clocked out today", attendance: existing });
    }

    const timeOut = new Date();
    const timeIn = new Date(existing.time_in);
    const durationMinutes = Math.round((timeOut - timeIn) / 60000);

    const { data, error } = await supabase
      .from("attendance")
      .update({
        time_out: timeOut.toISOString(),
        duration_minutes: durationMinutes,
      })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) throw error;

    res.json({ message: "Time-out recorded", attendance: data });
  } catch (err) {
    console.error("Time-out error:", err);
    res.status(500).json({ error: "Failed to record time-out" });
  }
});

// ─── GET /api/attendance/today ──────────────────────────
router.get("/today", async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("attendance")
      .select("*")
      .eq("user_id", userId)
      .eq("date", today)
      .maybeSingle();

    if (error) throw error;

    res.json({ attendance: data });
  } catch (err) {
    console.error("Today error:", err);
    res.status(500).json({ error: "Failed to fetch today's attendance" });
  }
});

// ─── GET /api/attendance/history ────────────────────────
router.get("/history", async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from("attendance")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (error) throw error;

    res.json({ records: data });
  } catch (err) {
    console.error("History error:", err);
    res.status(500).json({ error: "Failed to fetch attendance history" });
  }
});

export default router;

```

## FILE: supabase/migration.sql
```sql
-- ============================================================
-- Intern Attendance Tracker — Supabase Migration
-- Run this in the Supabase SQL Editor (Dashboard → SQL → New Query)
-- ============================================================

-- 1. Users table (profile data, linked to auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT        NOT NULL,
  email       TEXT        NOT NULL UNIQUE,
  role        TEXT        NOT NULL DEFAULT 'intern' CHECK (role IN ('intern', 'admin')),
  department  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Attendance table
CREATE TABLE IF NOT EXISTS public.attendance (
  id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id          UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date             DATE        NOT NULL DEFAULT CURRENT_DATE,
  time_in          TIMESTAMPTZ NOT NULL DEFAULT now(),
  time_out         TIMESTAMPTZ,
  duration_minutes INTEGER,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- One attendance record per intern per day
  CONSTRAINT unique_user_date UNIQUE (user_id, date)
);

-- 3. Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_attendance_user_id ON public.attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date    ON public.attendance(date);

-- 4. Helper function to check admin role (SECURITY DEFINER bypasses RLS to avoid recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 5. Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Admins can view all profiles (uses SECURITY DEFINER function to avoid recursion)
CREATE POLICY "Admins can view all profiles"
  ON public.users FOR SELECT
  USING (public.is_admin());

-- Interns can view their own attendance
CREATE POLICY "Interns can view own attendance"
  ON public.attendance FOR SELECT
  USING (auth.uid() = user_id);

-- Interns can insert their own attendance
CREATE POLICY "Interns can insert own attendance"
  ON public.attendance FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Interns can update their own attendance
CREATE POLICY "Interns can update own attendance"
  ON public.attendance FOR UPDATE
  USING (auth.uid() = user_id);

-- Admins can view all attendance
CREATE POLICY "Admins can view all attendance"
  ON public.attendance FOR SELECT
  USING (public.is_admin());

-- Admins can update all attendance
CREATE POLICY "Admins can update all attendance"
  ON public.attendance FOR UPDATE
  USING (public.is_admin());

-- 5. Function to auto-update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_users_updated
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_attendance_updated
  BEFORE UPDATE ON public.attendance
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

```

