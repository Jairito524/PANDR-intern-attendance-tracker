/**
 * Admin Import/Export Routes — /api/admin/import & /api/admin/export
 * Handles XLSX attendance data import and export.
 * All routes require admin role via adminOnly middleware.
 */

import { Router } from "express";
import multer from "multer";
import * as XLSX from "xlsx";
import supabase from "../../lib/supabase.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// ─── Parse Helpers ───────────────────────────────────────

/**
 * Parses a Google Forms timestamp string as PHT (UTC+8).
 * Example input: '4/12/2026 7:40:16' → Date object (UTC internally)
 * @param {string|null} str
 * @returns {Date|null}
 */
function parseTimestamp(str) {
  if (!str) return null;
  const [datePart, timePart] = String(str).trim().split(" ");
  if (!datePart || !timePart) return null;
  const [month, day, year] = datePart.split("/");
  const fullStr = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${timePart.padStart(8, "0")}+08:00`;
  const d = new Date(fullStr);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Parses a short date string to YYYY-MM-DD.
 * Example input: '4/12/26' → '2026-04-12'
 * @param {string|null} str
 * @returns {string|null}
 */
function parseAttendanceDate(str) {
  if (!str) return null;
  const [month, day, year] = String(str).trim().split("/");
  if (!month || !day || !year) return null;
  const fullYear = year.length === 2 ? "20" + year : year;
  return `${fullYear}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

// ─── GET /api/admin/export ───────────────────────────────
// Downloads the filtered attendance records as a .xlsx file.
// Accepts the same ?date= and ?name= query params as /attendance.
router.get("/export", async (req, res) => {
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

    let results = data;
    if (name) {
      const lowerName = name.toLowerCase();
      results = data.filter(
        (r) =>
          r.users?.name?.toLowerCase().includes(lowerName) ||
          r.users?.email?.toLowerCase().includes(lowerName)
      );
    }

    // ── Format helpers
    const today = new Date().toISOString().split("T")[0];

    const fmtTime = (iso) => {
      if (!iso) return "";
      return new Date(iso).toLocaleTimeString("en-US", {
        hour: "2-digit", minute: "2-digit", hour12: true,
      });
    };

    const fmtDuration = (mins) => {
      if (mins == null) return "";
      return `${Math.floor(mins / 60)}h ${mins % 60}m`;
    };

    const fmtDate = (dateStr) => {
      if (!dateStr) return "";
      return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      });
    };

    const fmtStatus = (rec) => {
      if (rec.time_out) return "Completed";
      if (rec.date === today) return "Active";
      return "Incomplete";
    };

    // ── Build worksheet rows
    const rows = results.map((r) => ({
      "Name":       r.users?.name || "",
      "Email":      r.users?.email || "",
      "Department": r.users?.department || "",
      "Date":       fmtDate(r.date),
      "Time In":    fmtTime(r.time_in),
      "Time Out":   fmtTime(r.time_out),
      "Duration":   fmtDuration(r.duration_minutes),
      "Status":     fmtStatus(r),
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook  = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    // ── Derive filename from active filters
    let filename = "attendance_all.xlsx";
    if (name) filename = `attendance_${name.replace(/\s+/g, "_")}.xlsx`;
    else if (date) filename = `attendance_${date}.xlsx`;

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (err) {
    console.error("Admin export error:", err);
    res.status(500).json({ error: "Export failed" });
  }
});

// ─── POST /api/admin/import ─────────────────────────────
// Accepts a .xlsx file (Google Forms export), parses rows, and upserts
// attendance records. Returns { imported, skipped, overwritten, unmatched }.
router.post("/import", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // ── Parse the workbook from the in-memory buffer
    // raw:false forces SheetJS to output dates as plain strings
    // (e.g. "4/12/2026 7:40:16") instead of JS Date objects, avoiding UTC bugs.
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
      raw: false,
      dateNF: "yyyy-mm-dd hh:mm:ss",
      defval: null,
    });

    if (!rows.length) {
      return res.json({ imported: 0, skipped: 0, overwritten: 0, unmatched: [] });
    }

    // ── Build a lookup map: email → user_id from public.users
    const { data: usersData, error: usersError } = await supabase
      .from("users")
      .select("id, email");
    if (usersError) throw usersError;

    const emailToId = {};
    for (const u of usersData) {
      emailToId[u.email.toLowerCase().trim()] = u.id;
    }

    // ── Group rows into a map keyed by "user_id|YYYY-MM-DD"
    // Each entry: { time_in: Date|null, time_out: Date|null }
    const punchMap = {};
    const unmatchedEmails = new Set();

    for (const row of rows) {
      // Normalise column names (Google Forms may vary capitalisation)
      const keys = Object.keys(row);
      const get = (hint) => {
        const k = keys.find((k) => k.toLowerCase().includes(hint.toLowerCase()));
        return k ? row[k] : null;
      };

      const rawTimestamp = get("Timestamp") ?? get("timestamp");
      const rawEmail     = get("Email") ?? get("email");
      const rawDate      = get("Attendance Date") ?? get("date");
      const rawLog       = get("Time Log") ?? get("log");

      if (!rawEmail || !rawTimestamp || !rawLog) continue;

      const email  = String(rawEmail).toLowerCase().trim();
      const userId = emailToId[email];

      if (!userId) {
        unmatchedEmails.add(rawEmail);
        continue;
      }

      // Parse the punch timestamp as PHT → Date object (internally UTC)
      const punchTimeUTC = parseTimestamp(rawTimestamp);
      if (!punchTimeUTC) continue;

      // Resolve the attendance date (prefer explicit "Attendance Date" column)
      const attendanceDate = parseAttendanceDate(rawDate)
        || parseAttendanceDate(String(rawTimestamp).trim().split(" ")[0]);
      if (!attendanceDate) continue;

      const key = `${userId}|${attendanceDate}`;
      if (!punchMap[key]) {
        punchMap[key] = { userId, attendanceDate, time_in: null, time_out: null };
      }

      const logType = String(rawLog).trim();
      if (logType === "Time In") {
        // Keep the earliest Time In if there are duplicates
        if (!punchMap[key].time_in || punchTimeUTC < punchMap[key].time_in) {
          punchMap[key].time_in = punchTimeUTC;
        }
      } else if (logType === "Time Out") {
        // Keep the latest Time Out if there are duplicates
        if (!punchMap[key].time_out || punchTimeUTC > punchMap[key].time_out) {
          punchMap[key].time_out = punchTimeUTC;
        }
      }
    }

    // ── Upsert each paired record
    let imported = 0;
    let skipped = 0;
    let overwritten = 0;

    for (const entry of Object.values(punchMap)) {
      if (!entry.time_in) {
        // No Time In at all — skip (Time Out-only rows are ambiguous)
        skipped++;
        continue;
      }

      const durationMinutes =
        entry.time_out
          ? Math.round((entry.time_out - entry.time_in) / 60000)
          : null;

      // Check whether a record already exists for this (user_id, date)
      const { data: existing } = await supabase
        .from("attendance")
        .select("id")
        .eq("user_id", entry.userId)
        .eq("date", entry.attendanceDate)
        .maybeSingle();

      const record = {
        user_id:          entry.userId,
        date:             entry.attendanceDate,
        time_in:          entry.time_in.toISOString(),
        time_out:         entry.time_out ? entry.time_out.toISOString() : null,
        duration_minutes: durationMinutes,
      };

      const { error: upsertError } = await supabase
        .from("attendance")
        .upsert(record, { onConflict: "user_id,date" });

      if (upsertError) {
        console.error("Upsert error for", entry, upsertError);
        skipped++;
        continue;
      }

      if (existing) {
        overwritten++;
      } else {
        imported++;
      }
    }

    res.json({
      imported,
      skipped,
      overwritten,
      unmatched: [...unmatchedEmails],
    });
  } catch (err) {
    console.error("Admin import error:", err);
    res.status(500).json({ error: err.message || "Import failed" });
  }
});

export default router;
