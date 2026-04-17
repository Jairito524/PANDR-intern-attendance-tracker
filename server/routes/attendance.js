import { Router } from "express";
import supabase from "../lib/supabase.js";

const router = Router();

// ─── POST /api/attendance/time-in ────────────────────────
// Called when intern clicks "Record Time-In" on the Time-In page.
router.post("/time-in", async (req, res) => {
  try {
    // Admins do not record attendance
    if (req.user.role === "admin") {
      return res.status(403).json({ error: "Admins do not record attendance" });
    }

    const userId = req.user.id;
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    // Check if a record already exists for today
    const { data: existing } = await supabase
      .from("attendance")
      .select("*")
      .eq("user_id", userId)
      .eq("date", today)
      .maybeSingle();

    if (existing) {
      return res.json({ message: "Already clocked in today", attendance: existing });
    }

    // Insert new attendance record
    const { data, error } = await supabase
      .from("attendance")
      .insert({
        user_id: userId,
        date: today,
        time_in: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ message: "Time-in recorded", attendance: data });
  } catch (err) {
    console.error("Time-in error:", err);
    res.status(500).json({ error: "Failed to record time-in" });
  }
});

// ─── POST /api/attendance/time-out ───────────────────────
// Called when intern clicks "Record Time Out" from the dashboard.
router.post("/time-out", async (req, res) => {
  try {
    // Admins do not record attendance
    if (req.user.role === "admin") {
      return res.status(403).json({ error: "Admins do not record attendance" });
    }

    const userId = req.user.id;
    const today = new Date().toISOString().split("T")[0];

    // Find today's record
    const { data: existing } = await supabase
      .from("attendance")
      .select("*")
      .eq("user_id", userId)
      .eq("date", today)
      .maybeSingle();

    if (!existing) {
      return res.status(404).json({ error: "No time-in record found for today" });
    }

    if (existing.time_out) {
      return res.json({ message: "Already clocked out today", attendance: existing });
    }

    const timeOut = new Date();
    const timeIn = new Date(existing.time_in);
    const durationMinutes = Math.round((timeOut - timeIn) / 60000);

    const { data, error } = await supabase
      .from("attendance")
      .update({
        time_out: timeOut.toISOString(),
        duration_minutes: durationMinutes,
      })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) throw error;

    res.json({ message: "Time-out recorded", attendance: data });
  } catch (err) {
    console.error("Time-out error:", err);
    res.status(500).json({ error: "Failed to record time-out" });
  }
});

// ─── GET /api/attendance/today ──────────────────────────
router.get("/today", async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("attendance")
      .select("*")
      .eq("user_id", userId)
      .eq("date", today)
      .maybeSingle();

    if (error) throw error;

    res.json({ attendance: data });
  } catch (err) {
    console.error("Today error:", err);
    res.status(500).json({ error: "Failed to fetch today's attendance" });
  }
});

// ─── GET /api/attendance/history ────────────────────────
router.get("/history", async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from("attendance")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (error) throw error;

    res.json({ records: data });
  } catch (err) {
    console.error("History error:", err);
    res.status(500).json({ error: "Failed to fetch attendance history" });
  }
});

// ─── PATCH /api/attendance/change-password ───────────────
// Allows an intern to set their own password on first login.
// Clears the must_change_password flag after a successful update.
router.patch("/change-password", async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || typeof newPassword !== "string") {
      return res.status(400).json({ error: "newPassword is required" });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    const userId = req.user.id;

    // Update the password via Supabase Auth admin API
    const { error: authError } = await supabase.auth.admin.updateUserById(userId, {
      password: newPassword,
    });
    if (authError) throw authError;

    // Clear the forced-change flag
    const { error: profileError } = await supabase
      .from("users")
      .update({ must_change_password: false })
      .eq("id", userId);
    if (profileError) throw profileError;

    res.json({ success: true });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ error: err.message || "Failed to change password" });
  }
});

export default router;
