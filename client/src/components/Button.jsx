/**
 * Reusable Button component with variants.
 * Matches PANDR dark glassmorphism design system.
 *
 * @param {'primary'|'ghost'|'danger'} variant  - Button style variant (default: "primary")
 * @param {boolean}                    loading  - Shows spinner and disables when true
 * @param {React.ReactNode}            children - Button label / content
 * @param {function}                   onClick  - Click handler
 * @param {boolean}                    disabled - Disables the button
 * @param {string}                     className - Additional classes appended to the button
 * @param {string}                     type     - HTML button type attribute (default: "button")
 */
export default function Button({
  variant = "primary",
  loading = false,
  children,
  onClick,
  disabled,
  className = "",
  type = "button",
  ...props
}) {
  const base =
    "px-4 py-2 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 " +
    "flex items-center justify-center gap-2";

  const variants = {
    primary:
      "bg-gradient-to-r from-brand-600 to-brand-500 text-white " +
      "hover:from-brand-500 hover:to-brand-400 shadow-lg shadow-brand-600/20",
    ghost: "glass glass-hover text-surface-200/80 hover:text-white",
    danger: "text-red-400 hover:text-red-300 hover:bg-red-500/10",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant] ?? variants.primary} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          Loading…
        </>
      ) : (
        children
      )}
    </button>
  );
}
