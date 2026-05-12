import { createPortal } from 'react-dom';
import { Button } from '../ui/Button';

export default function ChangeUserRoleDialog({ isOpen, onCancel, onConfirm, user }) {
  if (!isOpen || !user) return null;

  const targetRole =
    user.user_type === 'ADMIN'
      ? 'USER'
      : 'ADMIN';

  const actionLabel =
    targetRole === 'ADMIN'
      ? 'Promote to ADMIN'
      : 'Demote to USER';

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#181c1c]/40 backdrop-blur-sm animate-in fade-in">
      <div 
        className="modal-panel w-full max-w-md rounded-[28px] p-8 animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-3xl bg-[var(--color-primary-soft)] flex items-center justify-center text-[var(--color-primary-container)] mb-6 shadow-inset">
            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              swap_horiz
            </span>
          </div>

          <h2 className="text-xl font-bold text-[var(--color-on-surface)] mb-3 tracking-tight">Change User Role?</h2>
          <p className="text-[var(--color-on-surface-variant)] font-medium text-sm leading-relaxed mb-3 px-2">
            You are about to change <span className="text-[var(--color-on-surface)] font-bold">{user.username || user.email || user.userid}</span> from{' '}
            <span className="text-[var(--color-on-surface)] font-bold">{user.user_type}</span> to{' '}
            <span className="text-[var(--color-primary-container)] font-bold">{targetRole}</span>.
          </p>
          <p className="text-[var(--color-on-surface-variant)] text-xs mb-8">
            Only active non-SUPERADMIN accounts can have their roles changed.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button onClick={onCancel} variant="ghost" className="flex-1">
              Cancel
            </Button>
            <Button onClick={() => onConfirm(targetRole)} variant="primary" className="flex-1">
              {actionLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
