import { Router } from "express";
import { adminOnly } from "../middleware/auth.js";
import supabase from "../lib/supabase.js";
import multer from "multer";
import * as XLSX from "xlsx";

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
    console.error("Admin stats error:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// ─── GET /api/admin/users ───────────────────────────────
router.get("/users", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json({ users: data });
  } catch (err) {
    console.error("Admin get users error:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// ─── POST /api/admin/users ──────────────────────────────
router.post("/users", async (req, res) => {
  try {
    const { name, email, password, role = "intern", department } = req.body;

    if (!name || !email || !password || !department) {
      return res.status(400).json({ error: "Name, email, password, and department are required" });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      if (authError.message?.toLowerCase().includes("already registered") ||
        authError.message?.toLowerCase().includes("already exists") ||
        authError.code === "email_exists") {
        return res.status(409).json({ error: "A user with this email already exists." });
      }
      throw authError;
    }

    const userId = authData.user.id;

    // Insert into public.users
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .insert({ id: userId, name, email, role, department, is_active: true })
      .select()
      .single();

    if (profileError) {
      // Rollback: remove the auth user if profile insert fails
      await supabase.auth.admin.deleteUser(userId);
      throw profileError;
    }

    res.status(201).json({ user: profile });
  } catch (err) {
    console.error("Admin create user error:", err);
    res.status(500).json({ error: err.message || "Failed to create user" });
  }
});

// ─── PATCH /api/admin/users/:id ─────────────────────────
router.patch("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, department, role, is_active, password } = req.body;

    // ── Handle optional password update via Supabase Auth ──
    if (password && typeof password === "string" && password.trim().length > 0) {
      if (password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters" });
      }
      const { error: authError } = await supabase.auth.admin.updateUserById(id, { password });
      if (authError) {
        console.error("Password update error:", authError);
        return res.status(500).json({ error: authError.message || "Failed to update password" });
      }
    }

    // ── Handle profile field updates ──
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (department !== undefined) updates.department = department;
    if (role !== undefined) updates.role = role;
    if (is_active !== undefined) updates.is_active = is_active;

    if (Object.keys(updates).length === 0) {
      // Password-only update — no profile fields to change
      return res.json({ user: { id } });
    }

    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    res.json({ user: data });
  } catch (err) {
    console.error("Admin update user error:", err);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// ─── DELETE /api/admin/users/:id ────────────────────────
router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Delete from Supabase Auth (public.users will cascade)
    const { error } = await supabase.auth.admin.deleteUser(id);
    if (error) throw error;

    res.json({ success: true });
  } catch (err) {
    console.error("Admin delete user error:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// ─── POST /api/admin/import ─────────────────────────────
// Accepts a .xlsx file (Google Forms export), parses rows, and upserts
// attendance records. Returns { imported, skipped, overwritten, unmatched }.
const upload = multer({ storage: multer.memoryStorage() });

// Parse Timestamp: '4/12/2026 7:40:16' → ISO string in PHT
function parseTimestamp(str) {
  if (!str) return null;
  const [datePart, timePart] = String(str).trim().split(" ");
  if (!datePart || !timePart) return null;
  const [month, day, year] = datePart.split("/");
  const fullStr = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${timePart.padStart(8, "0")}+08:00`;
  const d = new Date(fullStr);
  return isNaN(d.getTime()) ? null : d;
}

// Parse Attendance Date: '4/12/26' → 'YYYY-MM-DD'
function parseAttendanceDate(str) {
  if (!str) return null;
  const [month, day, year] = String(str).trim().split("/");
  if (!month || !day || !year) return null;
  const fullYear = year.length === 2 ? "20" + year : year;
  return `${fullYear}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

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
    const punchMap = {}; // key → { time_in, time_out }
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

      const email   = String(rawEmail).toLowerCase().trim();
      const userId  = emailToId[email];

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
        // No Time In at all — skip (Time Out only rows are ambiguous)
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

