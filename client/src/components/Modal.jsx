import { useEffect } from "react";

/**
 * Reusable Modal component with dark glassmorphism styling.
 * Handles overlay, backdrop blur, Escape key, centering, and close button.
 *
 * @param {boolean}          isOpen      - Whether the modal is visible
 * @param {function}         onClose     - Called when X, overlay, or Escape is pressed
 * @param {string}           title       - Modal title shown in the header
 * @param {React.ReactNode}  children    - Modal body content
 * @param {boolean}          dismissable - Whether clicking outside/Escape closes it (default: true)
 */
export default function Modal({ isOpen, onClose, title, children, dismissable = true }) {
  // Escape key handler
  useEffect(() => {
    if (!isOpen || !dismissable) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose, dismissable]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={dismissable ? (e) => { if (e.target === e.currentTarget) onClose(); } : undefined}
    >
      <div
        className="w-full max-w-md rounded-2xl glass border border-white/10 shadow-2xl animate-slide-up"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {dismissable && onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-surface-200/50 hover:text-white hover:bg-white/5 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
