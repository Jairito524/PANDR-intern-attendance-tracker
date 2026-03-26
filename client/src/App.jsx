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
      // Use the session token to fetch from our API, or directly from Supabase
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.warn("Profile fetch error:", error.message);
        // fallback — still let them use the app with basic info
        setUserProfile({
          id: userId,
          name: "User",
          email: "",
          role: "intern",
          department: "",
        });
      } else {
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
    // Profile will be fetched via the onAuthStateChange listener
  };

  const handleLogout = async () => {
    try {
      // Auto-record time-out on logout
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

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center animate-pulse-soft">
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
