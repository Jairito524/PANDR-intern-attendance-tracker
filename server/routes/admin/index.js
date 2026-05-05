/**
 * Admin Routes — /api/admin
 * Entry point for all admin routes.
 * All routes require JWT auth + admin role.
 */

import { Router } from "express";
import { adminOnly } from "../../middleware/auth.js";
import userRoutes from "./users.js";
import attendanceRoutes from "./attendance.js";
import importExportRoutes from "./importExport.js";

const router = Router();

// Apply admin role guard to every route in this sub-tree
router.use(adminOnly);

router.use("/", userRoutes);
router.use("/", attendanceRoutes);
router.use("/", importExportRoutes);

export default router;
