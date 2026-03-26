import { supabase } from "./supabaseClient";

const API_URL = import.meta.env.VITE_API_URL || "";

/**
 * Authenticated fetch wrapper — attaches the Supabase JWT automatically.
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
    throw new Error(data.error || `Request failed (${res.status})`);
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
