/**
 * Reusable status badge for attendance records.
 * Displays Active, Completed, or Incomplete with appropriate colors.
 *
 * @param {'active'|'completed'|'incomplete'} status      - Status type
 * @param {'amber'|'red'}                     incomplete  - Color for incomplete status (default: "red")
 */
export default function StatusBadge({ status, incomplete = "red" }) {
  const incompleteStyle =
    incomplete === "amber"
      ? "bg-amber-500/10 text-amber-400"
      : "bg-red-500/10 text-red-400";

  const styles = {
    completed: "bg-surface-200/5 text-surface-200/50",
    active: "bg-brand-500/10 text-brand-400",
    incomplete: incompleteStyle,
  };

  const labels = {
    completed: "Completed",
    active: "Active",
    incomplete: "Incomplete",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
        styles[status] ?? styles.completed
      }`}
    >
      {status === "active" && (
        <span className="w-1.5 h-1.5 rounded-full bg-brand-400 pulse-dot" />
      )}
      {status === "incomplete" && incomplete !== "amber" && (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
      {status === "incomplete" && incomplete === "amber" && (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
      {labels[status] ?? "Completed"}
    </span>
  );
}
