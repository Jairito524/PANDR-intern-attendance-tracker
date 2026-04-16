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
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      // Remember Me guard — if the user didn't check "Remember Me" on their last
      // login, we should NOT restore a persisted session on a fresh browser open.
      // We detect this by checking the flag written to localStorage at login time.
      if (currentSession && localStorage.getItem("rememberMe") === "false") {
        // Session exists in storage but user chose not to be remembered —
        // sign out silently so they land on /login next time they open the browser.
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

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
