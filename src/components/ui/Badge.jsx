import React from 'react';

export function Badge({ children, variant = 'default', className = '', interactive = false }) {
  const baseStyles =
    'inline-flex items-center justify-center whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-[0.2em] shadow-inset transition-all duration-[var(--motion-fast)]';

  const variants = {
    default: 'bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] border-[var(--color-outline-variant)]/45',
    success: 'bg-[var(--color-success-bg)] text-[var(--color-success-text)] border-[var(--color-success)]/18',
    error: 'bg-[var(--color-error-container)] text-[var(--color-on-error-container)] border-[var(--color-error)]/14',
    primary: 'gradient-primary text-white border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-2px_4px_rgba(0,0,0,0.14),0_8px_18px_rgba(17,58,91,0.2)]',
    active: 'bg-[var(--color-primary-soft)] text-[var(--color-primary-container)] border-[var(--color-primary-container)]/12',
    inactive: 'bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] border-[var(--color-outline-variant)]/40 opacity-90',
  };

  return (
    <span
      className={`${baseStyles} ${variants[variant]} ${interactive ? 'cursor-pointer hover:-translate-y-px hover:shadow-outset-soft' : ''} ${className}`}
    >
      {children}
    </span>
  );
}
