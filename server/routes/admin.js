import { Router } from "express";
import { adminOnly } from "../middleware/auth.js";
import supabase from "../lib/supabase.js";

const router = Router();

// All routes in this file require admin role
router.use(adminOnly);

// ─── GET /api/admin/attendance ──────────────────────────
// Returns all attendance records. Supports ?date= and ?name= filters.
router.get("/attendance", async (req, res) => {
  try {
    const { date, name } = req.query;

    let query = supabase
      .from("attendance")
      .select("*, users(name, email, department)")
      .order("date", { ascending: false })
      .order("time_in", { ascending: false });

    if (date) {
      query = query.eq("date", date);
    }

    const { data, error } = await query;

    if (error) throw error;

    // If name filter is provided, filter in JS (Supabase doesn't support
    // ilike on joined columns easily in the query builder)
    let results = data;
    if (name) {
      const lowerName = name.toLowerCase();
      results = data.filter(
        (r) =>
          r.users?.name?.toLowerCase().includes(lowerName) ||
          r.users?.email?.toLowerCase().includes(lowerName)
      );
    }

    res.json({ records: results });
  } catch (err) {
    console.error("Admin attendance error:", err);
    res.status(500).json({ error: "Failed to fetch attendance records" });
  }
});

// ─── GET /api/admin/stats ───────────────────────────────
router.get("/stats", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    // Total interns
    const { count: totalInterns } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("role", "intern");

    // Present today
    const { count: presentToday } = await supabase
      .from("attendance")
      .select("*", { count: "exact", head: true })
      .eq("date", today);

    // Average hours (from records that have duration)
    const { data: durationData } = await supabase
      .from("attendance")
      .select("duration_minutes")
      .not("duration_minutes", "is", null);

    let averageHours = 0;
    if (durationData && durationData.length > 0) {
      const totalMinutes = durationData.reduce(
        (sum, r) => sum + (r.duration_minutes || 0),
        0
      );
      averageHours = Math.round((totalMinutes / durationData.length / 60) * 10) / 10;
    }

    res.json({
      totalInterns: totalInterns || 0,
      presentToday: presentToday || 0,
      averageHours,
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;
