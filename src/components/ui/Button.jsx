import React from 'react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled,
  ...props
}) {
  const baseStyles =
    'group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl font-sans font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary-container)] focus-visible:ring-offset-[var(--color-surface)] disabled:opacity-55 disabled:cursor-not-allowed transition-all duration-[var(--motion-base)] ease-[var(--ease-standard)] active:scale-[0.985]';

  const sizes = {
    sm: 'px-3.5 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base',
  };

  const variants = {
    primary:
      'gradient-primary text-white shadow-outset hover:-translate-y-[1px] hover:shadow-outset-hover hover:shadow-glow active:shadow-inset-deep',
    secondary:
      'bg-[var(--color-surface-bright)] text-[var(--color-on-surface)] border border-[var(--color-outline-variant)]/70 shadow-outset-soft hover:-translate-y-[1px] hover:shadow-outset-hover',
    danger:
      'bg-[var(--color-error)] text-[var(--color-on-error)] shadow-outset hover:-translate-y-[1px] hover:shadow-outset-hover hover:shadow-[0_16px_34px_rgba(186,26,26,0.22)]',
    ghost:
      'bg-transparent text-[var(--color-on-surface)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary-container)]',
  };

  return (
    <button
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      <span className="absolute inset-0 opacity-0 transition-opacity duration-[var(--motion-fast)] group-hover:opacity-100 bg-gradient-to-r from-white/10 via-white/0 to-white/5 pointer-events-none" />
      {loading && (
        <svg
          className="absolute h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4zm2 5.29A7.94 7.94 0 014 12H0c0 3.04 1.13 5.82 3 7.94l3-2.65z"></path>
        </svg>
      )}
      <span className={`relative z-10 inline-flex items-center justify-center gap-2 transition-opacity duration-[var(--motion-fast)] ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </span>
    </button>
  );
}
