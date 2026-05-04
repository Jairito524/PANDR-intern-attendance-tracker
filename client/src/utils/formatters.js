/**
 * Shared date/time/duration formatters.
 * Import from this file in all page components to avoid duplication.
 */

/**
 * Formats an ISO timestamp to a readable time string with seconds (e.g. "08:22:05 AM").
 * Used in InternDashboard history table.
 * @param {string|null} iso - ISO timestamp string
 * @returns {string} Formatted time or "—" if null/undefined
 */
export function formatTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

/**
 * Formats an ISO timestamp to a short time string without seconds (e.g. "08:22 AM").
 * Used in AdminDashboard attendance table.
 * @param {string|null} iso - ISO timestamp string
 * @returns {string} Formatted time or "—" if null/undefined
 */
export function formatTimeShort(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Formats a YYYY-MM-DD date string to a short date with weekday (e.g. "Mon, Apr 12, 2026").
 * Used in InternDashboard history table.
 * @param {string|null} dateStr - Date string in YYYY-MM-DD format
 * @returns {string} Formatted date or "—" if null/undefined
 */
export function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Formats an ISO timestamp to a short date without weekday (e.g. "Apr 12, 2026").
 * Used in AdminDashboard attendance table.
 * @param {string|null} iso - ISO timestamp or date string
 * @returns {string} Formatted date or "—" if null/undefined
 */
export function formatShortDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Formats duration in minutes to a readable string (e.g. "8h 30m").
 * @param {number|null} minutes - Duration in minutes
 * @returns {string} Formatted duration or "—" if null/undefined
 */
export function formatDuration(minutes) {
  if (minutes == null) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

/**
 * Formats a Date object to a full readable date string (e.g. "Monday, April 12, 2026").
 * Used for the live date display on InternDashboard and TimeInPage.
 * @param {Date} date - JavaScript Date object
 * @returns {string} Full formatted date string
 */
export function formatFullDate(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Formats a Date object to a live time string with seconds (e.g. "08:22:05 AM").
 * Used for the live clock on InternDashboard and TimeInPage.
 * @param {Date} date - JavaScript Date object
 * @returns {string} Formatted time string
 */
export function formatLiveTime(date) {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}
