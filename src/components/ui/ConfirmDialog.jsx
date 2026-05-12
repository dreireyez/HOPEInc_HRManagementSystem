import { createPortal } from 'react-dom';
import { Button } from './Button';

/**
 * Reusable animated confirmation dialog.
 * Replaces window.confirm() across the application.
 *
 * @param {boolean}  isOpen         - Whether the dialog is visible.
 * @param {string}   icon           - Material Symbol icon name shown in the header.
 * @param {string}   title          - Bold heading text.
 * @param {React.ReactNode} description - Body message (supports JSX).
 * @param {string}   confirmLabel   - Text for the confirm button.
 * @param {'primary'|'danger'|'secondary'} confirmVariant - Button variant.
 * @param {Function} onCancel       - Called when Cancel is clicked.
 * @param {Function} onConfirm      - Called when Confirm is clicked.
 * @param {boolean}  loading        - Shows loading state on confirm button.
 */
export function ConfirmDialog({
  isOpen,
  icon = 'warning',
  iconBg = 'bg-[var(--color-error-container)]',
  iconColor = 'text-[var(--color-error)]',
  title,
  description,
  confirmLabel = 'Confirm',
  confirmVariant = 'danger',
  onCancel,
  onConfirm,
  loading = false,
}) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#181c1c]/40 backdrop-blur-sm animate-in fade-in">
      <div 
        className="modal-panel w-full max-w-md rounded-[28px] p-8 animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          {/* Icon badge */}
          <div className={`w-16 h-16 rounded-3xl ${iconBg} flex items-center justify-center ${iconColor} mb-6 shadow-inset`}>
            <span
              className="material-symbols-outlined text-3xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {icon}
            </span>
          </div>

          <h2 className="text-xl font-bold text-[var(--color-on-surface)] mb-3 tracking-tight">
            {title}
          </h2>

          <div className="text-[var(--color-on-surface-variant)] font-medium text-sm leading-relaxed mb-8 px-2">
            {description}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button
              onClick={onCancel}
              variant="ghost"
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              variant={confirmVariant}
              className="flex-1"
              loading={loading}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
