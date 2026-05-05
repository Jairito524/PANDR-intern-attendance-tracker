/**
 * Zod validation schemas for all API routes.
 * Centralised schema definitions for consistency and reuse.
 */
import { z } from "zod";

// ─── User schemas ────────────────────────────────────────

/**
 * POST /api/admin/users — create a new user account.
 * role defaults to "intern" so the field is optional on the wire.
 */
export const createUserSchema = z.object({
  name:       z.string().min(1, "Name is required"),
  email:      z.string().email("Invalid email address"),
  password:   z.string().min(8, "Password must be at least 8 characters"),
  role:       z.enum(["intern", "admin"], {
    errorMap: () => ({ message: "Role must be intern or admin" }),
  }).default("intern"),
  department: z.string().min(1, "Department is required"),
});

/**
 * PATCH /api/admin/users/:id — update a user profile.
 * All fields are optional; at least one must be present.
 * An empty-string password is ignored by the route handler, but a
 * non-empty password is subject to the 8-character minimum.
 */
export const updateUserSchema = z
  .object({
    name:       z.string().min(1, "Name must not be empty").optional(),
    department: z.string().min(1, "Department must not be empty").optional(),
    role:       z.enum(["intern", "admin"], {
      errorMap: () => ({ message: "Role must be intern or admin" }),
    }).optional(),
    is_active:  z.boolean().optional(),
    // Allow empty string so the frontend can send "" to skip password update
    password:   z
      .string()
      .refine(
        (v) => v === "" || v.length >= 8,
        { message: "Password must be at least 8 characters" }
      )
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

// ─── Attendance / password schemas ───────────────────────

/**
 * PATCH /api/attendance/change-password — intern sets their own password.
 */
export const changePasswordSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});
