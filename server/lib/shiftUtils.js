/**
 * Shift schedule utility functions.
 * Used server-side for potential future reporting;
 * the same logic is duplicated on the client for badge rendering.
 */

/**
 * Determines if an intern was late based on their shift start time.
 * Allows a 5-minute grace period.
 *
 * @param {string} timeIn   - ISO timestamp of time-in
 * @param {string} shiftStart - Shift start time in "HH:MM:SS" format
 * @param {string} date     - Attendance date in "YYYY-MM-DD" format
 * @returns {'on_time'|'late'|null}
 */
export function getArrivalStatus(timeIn, shiftStart, date) {
  if (!timeIn || !shiftStart || !date) return null;

  // Parse shift start in PHT (UTC+8)
  const [hours, minutes] = shiftStart.split(":").map(Number);
  const shiftStartPHT = new Date(
    `${date}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00+08:00`
  );

  // Add 5-minute grace period
  const graceDeadline = new Date(shiftStartPHT.getTime() + 5 * 60 * 1000);

  return new Date(timeIn) <= graceDeadline ? "on_time" : "late";
}

/**
 * Determines if an intern left early based on their shift end time.
 *
 * @param {string} timeOut  - ISO timestamp of time-out
 * @param {string} shiftEnd - Shift end time in "HH:MM:SS" format
 * @param {string} date     - Attendance date in "YYYY-MM-DD" format
 * @returns {'on_time'|'early'|null}
 */
export function getDepartureStatus(timeOut, shiftEnd, date) {
  if (!timeOut || !shiftEnd || !date) return null;

  const [hours, minutes] = shiftEnd.split(":").map(Number);
  const shiftEndPHT = new Date(
    `${date}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00+08:00`
  );

  return new Date(timeOut) >= shiftEndPHT ? "on_time" : "early";
}
