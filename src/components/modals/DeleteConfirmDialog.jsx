import { Button } from '../ui/Button';

export default function DeleteConfirmDialog({ isOpen, onCancel, onConfirm, employeeName }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 overlay-scrim animate-in fade-in">
      <div className="modal-panel w-full max-w-md rounded-[28px] p-8 animate-in zoom-in-95">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-3xl bg-[var(--color-error-container)] flex items-center justify-center text-[var(--color-on-error-container)] mb-6 shadow-inset">
            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              warning
            </span>
          </div>

          <h2 className="text-xl font-bold text-[var(--color-on-surface)] mb-3 tracking-tight">Deactivate Record?</h2>
          <p className="text-[var(--color-on-surface-variant)] font-medium text-sm leading-relaxed mb-8 px-2">
            You are about to deactivate <span className="text-[var(--color-on-surface)] font-bold">{employeeName}</span>.
            This employee will be moved to the <span className="text-[var(--color-primary-container)] font-bold">Deleted Items</span> directory.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button onClick={onCancel} variant="ghost" className="flex-1">
              Cancel
            </Button>
            <Button onClick={onConfirm} variant="danger" className="flex-1">
              Deactivate
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
