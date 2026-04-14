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
