/**
 * Zod validation middleware factory.
 * Validates req.body against the provided schema.
 * Returns 400 with structured validation errors if invalid.
 *
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 */
import { ZodError } from "zod";

export function validate(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          message: err.errors[0].message,
          details: err.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
      }
      next(err);
    }
  };
}
