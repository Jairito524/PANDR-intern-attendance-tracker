import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "⚠ Supabase credentials not found. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file."
  );
}

/**
 * Pick the right storage adapter based on the "rememberMe" flag.
 * - rememberMe === "true"  → localStorage  (session survives browser restart)
 * - rememberMe !== "true"  → sessionStorage (session dies with the tab/browser)
 * Falls back to localStorage when the flag has never been set (first visit).
 */
function getSupabaseStorage() {
  const remembered = localStorage.getItem("rememberMe");
  // Default to localStorage (remembered) when no preference has been saved yet
  if (remembered === null || remembered === "true") {
    return localStorage;
  }
  return sessionStorage;
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key",
  {
    auth: {
      storage: getSupabaseStorage(),
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
