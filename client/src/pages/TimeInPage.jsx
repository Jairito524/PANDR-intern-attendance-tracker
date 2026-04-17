import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { recordTimeIn, changePassword } from "../lib/api";
import { supabase } from "../lib/supabaseClient";

export default function TimeInPage({ user, onLogout }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [accessDenied, setAccessDenied] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // ── Forced password change modal state
  const [showPwModal, setShowPwModal] = useState(() => user?.must_change_password === true);
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");

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

  // ── Forced password change handler
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError("");

    if (newPw.length < 8) {
      setPwError("Password must be at least 8 characters.");
      return;
    }
    if (newPw !== confirmPw) {
      setPwError("Passwords do not match.");
      return;
    }

    setPwLoading(true);
    try {
      await changePassword(newPw);
      // Supabase invalidates the session token when a password is changed via
      // the admin API. Rather than leaving the intern with a broken token that
      // causes 401 errors on the next API call, we sign out immediately and
      // send them to /login with a friendly success message.
      await supabase.auth.signOut();
      navigate("/login", {
        replace: true,
        state: {
          message:
            "Password changed successfully! Please log in with your new password.",
        },
      });
    } catch (err) {
      setPwError(err.message || "Failed to update password. Please try again.");
    } finally {
      setPwLoading(false);
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

      {/* ── Forced Password Change Modal ─────────────────── */}
      {showPwModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
          // Intentionally no onClick handler — modal cannot be dismissed
        >
          <div className="w-full max-w-md glass rounded-2xl border border-white/10 shadow-2xl animate-slide-up">
            {/* Header */}
            <div className="flex flex-col items-center gap-3 p-6 pb-4 border-b border-white/5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500/30 to-brand-400/20 border border-brand-500/20 flex items-center justify-center">
                <svg className="w-7 h-7 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="text-center">
                <h2 className="text-lg font-bold text-white">Change Your Password</h2>
                <p className="text-sm text-surface-200/50 mt-1">You must set a new password before continuing.</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleChangePassword} className="p-6 space-y-4">
              {/* Error banner */}
              {pwError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm flex items-start gap-2">
                  <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {pwError}
                </div>
              )}

              {/* New password */}
              <div className="space-y-1.5">
                <label htmlFor="new-password" className="block text-xs text-surface-200/50 uppercase tracking-wider font-medium">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showNewPw ? "text" : "password"}
                    required
                    minLength={8}
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full px-4 py-2.5 pr-10 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPw((v) => !v)}
                    className="absolute inset-y-0 right-3 flex items-center text-surface-200/40 hover:text-white transition-colors"
                    tabIndex={-1}
                  >
                    {showNewPw ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {newPw.length > 0 && newPw.length < 8 && (
                  <p className="text-xs text-red-400 mt-1">Must be at least 8 characters</p>
                )}
              </div>

              {/* Confirm password */}
              <div className="space-y-1.5">
                <label htmlFor="confirm-password" className="block text-xs text-surface-200/50 uppercase tracking-wider font-medium">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirmPw ? "text" : "password"}
                    required
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full px-4 py-2.5 pr-10 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPw((v) => !v)}
                    className="absolute inset-y-0 right-3 flex items-center text-surface-200/40 hover:text-white transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPw ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {confirmPw.length > 0 && newPw !== confirmPw && (
                  <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
                )}
              </div>

              {/* Submit */}
              <button
                id="save-password-button"
                type="submit"
                disabled={pwLoading}
                className="w-full py-3 px-4 mt-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold hover:from-brand-500 hover:to-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-600/25"
              >
                {pwLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Saving…
                  </span>
                ) : (
                  "Save Password"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

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
