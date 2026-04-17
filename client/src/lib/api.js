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
export const changePassword = (newPassword) =>
  authFetch("/api/attendance/change-password", {
    method: "PATCH",
    body: JSON.stringify({ newPassword }),
  });


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

