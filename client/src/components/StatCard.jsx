/**
 * Reusable stat card with icon, label, and value.
 * Used in both InternDashboard and AdminDashboard.
 *
 * @param {React.ReactNode}       icon           - SVG icon element
 * @param {string}                label          - Card label (e.g. "TIME IN")
 * @param {string|React.ReactNode} value         - Main value to display
 * @param {React.ReactNode}       subtext        - Optional subtext / extra content below value
 * @param {string}                animationDelay - Optional CSS animation delay (e.g. "0.1s")
 * @param {string}                iconBg         - Tailwind bg class for the icon wrapper (default: "bg-brand-500/10")
 * @param {'sm'|'md'}             size           - Icon size variant: sm = w-10 h-10, md = w-12 h-12 (default: "sm")
 * @param {string}                padding        - Tailwind padding class (default: "p-5")
 */
export default function StatCard({
  icon,
  label,
  value,
  subtext,
  animationDelay,
  iconBg = "bg-brand-500/10",
  size = "sm",
  padding = "p-5",
}) {
  const iconSize = size === "md" ? "w-12 h-12" : "w-10 h-10";

  return (
    <div
      className={`glass rounded-2xl ${padding} animate-slide-up`}
      style={animationDelay ? { animationDelay } : undefined}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`${iconSize} rounded-xl ${iconBg} flex items-center justify-center`}>
          {icon}
        </div>
        <p className="text-xs text-surface-200/50 uppercase tracking-wider font-medium">
          {label}
        </p>
      </div>
      <div className="text-xl font-semibold text-white tabular-nums">{value}</div>
      {subtext && (
        <div className="mt-1">{subtext}</div>
      )}
    </div>
  );
}
