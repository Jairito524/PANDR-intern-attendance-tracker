/**
 * Admin Attendance Routes — /api/admin/attendance & /api/admin/stats
 * Handles attendance record viewing and stats for admin users.
 * All routes require admin role via adminOnly middleware.
 */

import { Router } from "express";
import supabase from "../../lib/supabase.js";
import { validate } from "../../lib/validate.js";
import { updateAttendanceSchema } from "../../lib/schemas.js";
import { logger } from "../../lib/logger.js";

const router = Router();

// ─── GET /api/admin/attendance ──────────────────────────
// Returns all attendance records. Supports ?date= and ?name= filters.
router.get("/attendance", async (req, res) => {
  try {
    const { date, name } = req.query;

    let query = supabase
      .from("attendance")
      .select("*, users(name, email, department, shift_start, shift_end)")
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
    logger.error("Admin attendance error:", err);
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

    // Present today (intern role only)
    const { count: presentToday } = await supabase
      .from("attendance")
      .select("*, users!inner(role)", { count: "exact", head: true })
      .eq("date", today)
      .eq("users.role", "intern");

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
    logger.error("Admin stats error:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// ─── PATCH /api/admin/attendance/:id ───────────────────────────
/**
 * Update an attendance record by ID.
 * Recalculates duration_minutes automatically.
 * Handles unique constraint conflicts gracefully.
 */
router.patch("/attendance/:id", validate(updateAttendanceSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time_in, time_out } = req.body;

    // Fetch current record so we can fall back to existing values
    const { data: existing, error: fetchErr } = await supabase
      .from("attendance")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchErr || !existing) {
      return res.status(404).json({ error: "Attendance record not found" });
    }

    // Build the update payload
    const updates = {};
    if (date !== undefined)     updates.date     = date;
    if (time_in !== undefined)  updates.time_in  = time_in;

    // time_out: null / empty string ⇒ clear it
    if (time_out !== undefined) {
      updates.time_out = (time_out === null || time_out === "") ? null : time_out;
    }

    // Recalculate duration
    const resolvedTimeIn  = time_in  !== undefined ? time_in  : existing.time_in;
    const resolvedTimeOut = time_out !== undefined
      ? (time_out === null || time_out === "" ? null : time_out)
      : existing.time_out;

    if (resolvedTimeIn && resolvedTimeOut) {
      updates.duration_minutes = Math.round(
        (new Date(resolvedTimeOut) - new Date(resolvedTimeIn)) / 60000
      );
    } else if (resolvedTimeIn && !resolvedTimeOut) {
      updates.duration_minutes = null;
    }

    const { data: updated, error: updateErr } = await supabase
      .from("attendance")
      .update(updates)
      .eq("id", id)
      .select("*, users(name, email, department)")
      .single();

    if (updateErr) {
      // Unique constraint on (user_id, date)
      if (updateErr.code === "23505") {
        return res.status(409).json({
          error: "An attendance record already exists for this intern on that date",
        });
      }
      throw updateErr;
    }

    res.json({ record: updated });
  } catch (err) {
    logger.error("Admin update attendance error:", err);
    res.status(500).json({ error: "Failed to update attendance record" });
  }
});

export default router;
