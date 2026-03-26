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
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold gradient-text">Admin Dashboard</h1>
          <p className="text-surface-200/60 text-sm mt-1">{currentDate}</p>
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
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-1000"
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
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
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
