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
