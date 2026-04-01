import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

import ipRestriction from "./middleware/ipRestriction.js";
import authMiddleware from "./middleware/auth.js";
import attendanceRoutes from "./routes/attendance.js";
import adminRoutes from "./routes/admin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ──────────────────────────────────────────
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Trust proxy so req.ip returns the real client IP behind reverse proxies
app.set("trust proxy", true);

// Health check (no IP restriction needed)
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── IP Restriction on all /api/ routes ─────────────────
app.use("/api", ipRestriction);

// ─── Protected Routes ───────────────────────────────────
app.use("/api/attendance", authMiddleware, attendanceRoutes);
app.use("/api/admin", authMiddleware, adminRoutes);

// ─── Start ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  const officeIps = process.env.ALLOWED_OFFICE_IP;
  if (officeIps) {
    console.log(`✓ IP restriction active — allowed: ${officeIps}, localhost`);
  } else {
    console.log(`⚠ ALLOWED_OFFICE_IP not set — all IPs allowed`);
  }
});
