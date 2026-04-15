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
