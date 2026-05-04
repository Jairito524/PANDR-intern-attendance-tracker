/**
 * Simple structured logger for the PANDR server.
 * Prefixes every log with an ISO timestamp and severity level.
 * Replace with winston or pino for production deployments.
 */

const timestamp = () => new Date().toISOString();

export const logger = {
  info:  (msg, data = "") => console.log(`[${timestamp()}] INFO:`,  msg, data),
  warn:  (msg, data = "") => console.warn(`[${timestamp()}] WARN:`,  msg, data),
  error: (msg, data = "") => console.error(`[${timestamp()}] ERROR:`, msg, data),
};
