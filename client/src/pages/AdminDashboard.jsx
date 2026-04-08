import { useState, useEffect, useCallback, useRef } from "react";
import {
  getAdminAttendance,
  getAdminStats,
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
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
    <Modal title="Add New Intern" onClose={onClose}>
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
          <select id="add-role" value={form.role} onChange={(e) => set("role", e.target.value)}
            className={inputCls + " [color-scheme:dark]"}>
            <option value="intern">Intern</option>
            <option value="admin">Admin</option>
          </select>
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

// ─── Edit User Modal ─────────────────────────────────────
function EditUserModal({ user, onClose, onSuccess }) {
  const [form, setForm] = useState({ name: user.name || "", department: user.department || "", role: user.role || "intern" });
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.department.trim()) {
      setServerError("Name and department are required."); return;
    }
    setSubmitting(true);
    setServerError("");
    try {
      await updateAdminUser(user.id, form);
      onSuccess("User updated successfully!");
    } catch (err) {
      setServerError(err.message || "Failed to update user");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title={`Edit — ${user.name}`} onClose={onClose}>
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
          <select id="edit-role" value={form.role} onChange={(e) => set("role", e.target.value)}
            className={inputCls + " [color-scheme:dark]"}>
            <option value="intern">Intern</option>
            <option value="admin">Admin</option>
          </select>
        </Field>
        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose}
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
          { key: "attendance", label: "Attendance", icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          )},
          { key: "users", label: "Users", icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )},
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
                Add Intern
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
