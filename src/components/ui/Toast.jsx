/**
 * Toast notification container.
 * Renders toasts anchored to the bottom-right of the viewport.
 *
 * @param {Array}    toasts    - Array of { id, message, type } objects.
 * @param {Function} onDismiss - Called with toast id to remove it.
 */
export function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2.5 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-3 rounded-2xl px-5 py-3.5 shadow-outset animate-in slide-in-from-bottom-4 fade-in
            ${t.type === 'success'
              ? 'bg-[var(--color-success-bg)] border border-[var(--color-success)]/20 text-[var(--color-success-text)]'
              : 'bg-[var(--color-error-container)] border border-[var(--color-error)]/20 text-[var(--color-on-error-container)]'
            }`}
        >
          <span
            className="material-symbols-outlined text-lg shrink-0"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {t.type === 'success' ? 'check_circle' : 'error'}
          </span>
          <span className="text-sm font-semibold">{t.message}</span>
          <button
            onClick={() => onDismiss(t.id)}
            className="ml-2 cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Dismiss notification"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
      ))}
    </div>
  );
}
