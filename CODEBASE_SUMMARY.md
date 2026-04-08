# Project File Tree

```
.
├── .env.example
├── build_summary.js
├── client
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── src
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── lib
│   │   │   ├── api.js
│   │   │   └── supabaseClient.js
│   │   ├── main.jsx
│   │   └── pages
│   │       ├── AdminDashboard.jsx
│   │       ├── InternDashboard.jsx
│   │       └── Login.jsx
│   ├── tailwind.config.js
│   └── vite.config.js
├── README.md
├── server
│   ├── index.js
│   ├── lib
│   │   └── supabase.js
│   ├── middleware
│   │   ├── auth.js
│   │   └── ipRestriction.js
│   ├── package-lock.json
│   ├── package.json
│   └── routes
│       ├── admin.js
│       └── attendance.js
└── supabase
    └── migration.sql
```

# File Contents

## FILE: .env.example
```text
# ── Supabase ──────────────────────────────────────────────
SUPABASE_URL=https://kyuuzrqirpvyaqyffauk.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5dXV6cnFpcnB2eWFxeWZmYXVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NjIyMzMsImV4cCI6MjA5MDAzODIzM30._HMXAtxu4nXSH8sVO3145M-YlV4Y-oMJSq-Qpz1TJk0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5dXV6cnFpcnB2eWFxeWZmYXVrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDQ2MjIzMywiZXhwIjoyMDkwMDM4MjMzfQ.MuMctyvR-YJqMwjhXjjxJrvVgVgykiEujI3800_mRYo

# ── Frontend (Vite uses VITE_ prefix) ────────────────────
VITE_SUPABASE_URL=https://kyuuzrqirpvyaqyffauk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5dXV6cnFpcnB2eWFxeWZmYXVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NjIyMzMsImV4cCI6MjA5MDAzODIzM30._HMXAtxu4nXSH8sVO3145M-YlV4Y-oMJSq-Qpz1TJk0
VITE_API_URL=http://localhost:3001

# ── Server ────────────────────────────────────────────────
PORT=3001

# ── IP Restriction (comma-separated list of allowed IPs) ──
ALLOWED_OFFICE_IP=your.office.public.ip

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
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  const officeIps = process.env.ALLOWED_OFFICE_IP;
  if (officeIps) {
    console.log(`✓ IP restriction active — allowed: ${officeIps}, localhost`);
  } else {
    console.log(`⚠ ALLOWED_OFFICE_IP not set — all IPs allowed`);
  }
});

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

## FILE: server/routes/attendance.js
```js
import { Router } from "express";
import supabase from "../lib/supabase.js";

const router = Router();

// ─── POST /api/attendance/time-in ────────────────────────
// Called automatically on login. Creates today's record if none exists.
router.post("/time-in", async (req, res) => {
  try {
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
// Called when intern clicks "Record Time Out" or logs out.
router.post("/time-out", async (req, res) => {
  try {
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

## FILE: server/routes/admin.js
```js
import { Router } from "express";
import { adminOnly } from "../middleware/auth.js";
import supabase from "../lib/supabase.js";

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
      .select("*", { count: "exact", head: true })
      .eq("date", today);

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

export default router;

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

## FILE: client/src/App.jsx
```jsx
import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";
import { recordTimeOut } from "./lib/api";
import Login from "./pages/Login";
import InternDashboard from "./pages/InternDashboard";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  const [session, setSession] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
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
    setSession(newSession);
  };

  const handleLogout = async () => {
    try {
      try {
        await recordTimeOut();
      } catch (err) {
        console.warn("Auto time-out on logout:", err.message);
      }

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
              <Navigate to={isAdmin ? "/admin" : "/dashboard"} replace />
            ) : (
              <Login onLogin={handleLogin} />
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
              <Navigate to="/dashboard" replace />
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
              to={isAuthenticated ? (isAdmin ? "/admin" : "/dashboard") : "/login"}
              replace
            />
          }
        />
      </Routes>
    </div>
  );
}

```

## FILE: client/src/pages/Login.jsx
```jsx
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { recordTimeIn } from "../lib/api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [accessDenied, setAccessDenied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setAccessDenied(false);
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Auto-record time-in on login
      try {
        await recordTimeIn();
      } catch (timeInErr) {
        // Check if this is an IP restriction error
        if (timeInErr.code === "ACCESS_DENIED" || timeInErr.status === 403) {
          setAccessDenied(true);
          // Sign out since they can't use the system
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }
        console.warn("Time-in recording note:", timeInErr.message);
      }

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

## FILE: client/src/pages/InternDashboard.jsx
```jsx
import { useState, useEffect, useCallback } from "react";
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
    setError("");
    setSuccessMsg("");
    try {
      const res = await recordTimeOut();
      setToday(res.attendance);
      setSuccessMsg("Time-out recorded successfully!");
      fetchData();
    } catch (err) {
      setError(err.message);
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
  if (today?.time_in && !today?.time_out) {
    const elapsed = Math.round((currentTime - new Date(today.time_in)) / 60000);
    liveDuration = formatDuration(elapsed);
  }

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

      {/* Record Time Out Button */}
      {today?.time_in && !today?.time_out && (
        <div className="mb-8 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <button
            id="record-time-out-button"
            onClick={handleTimeOut}
            disabled={timeOutLoading}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold hover:from-brand-500 hover:to-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all duration-200 disabled:opacity-50 shadow-lg shadow-brand-600/20 hover:shadow-brand-500/40 text-lg"
          >
            {timeOutLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Recording…
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Record Time Out
              </span>
            )}
          </button>
        </div>
      )}

      {/* Attendance History Table */}
      <div className="glass rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: "0.35s" }}>
        <div className="p-5 border-b border-white/5">
          <h2 className="text-lg font-semibold text-white">Attendance History</h2>
          <p className="text-xs text-surface-200/50 mt-1">Your past attendance records</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
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

## FILE: client/src/pages/AdminDashboard.jsx
```jsx
import { useState, useEffect, useCallback } from "react";
import { getAdminAttendance, getAdminStats } from "../lib/api";

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

export default function AdminDashboard({ user, onLogout }) {
  const [stats, setStats] = useState({ totalInterns: 0, presentToday: 0, averageHours: 0 });
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [dateFilter, setDateFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [debouncedName, setDebouncedName] = useState("");

  // Debounce name filter
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedName(nameFilter), 400);
    return () => clearTimeout(timer);
  }, [nameFilter]);

  const fetchData = useCallback(async () => {
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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {/* Total Interns */}
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

        {/* Present Today */}
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
                  style={{
                    width: `${Math.min((stats.presentToday / stats.totalInterns) * 100, 100)}%`,
                  }}
                />
              </div>
              <p className="text-xs text-surface-200/40 mt-1">
                {Math.round((stats.presentToday / stats.totalInterns) * 100)}% attendance rate
              </p>
            </div>
          )}
        </div>

        {/* Average Hours */}
        <div className="glass rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "0.15s" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xs text-surface-200/50 uppercase tracking-wider font-medium">Avg Hours / Day</p>
          </div>
          <p className="text-3xl font-bold text-white">
            {loading ? "…" : `${stats.averageHours}h`}
          </p>
        </div>
      </div>

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
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all duration-200"
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
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all duration-200 [color-scheme:dark]"
            />
          </div>
          {(dateFilter || nameFilter) && (
            <button
              id="clear-filters-button"
              onClick={() => {
                setDateFilter("");
                setNameFilter("");
              }}
              className="px-4 py-2.5 rounded-xl text-sm text-surface-200/60 hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              Clear Filters
            </button>
          )}
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

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
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
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
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
                        month: "short",
                        day: "numeric",
                        year: "numeric",
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
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-brand-500/10 text-brand-400">
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
    "express": "^4.21.0"
  }
}

```

