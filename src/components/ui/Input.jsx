import React, { forwardRef, useId } from 'react';

export const Input = forwardRef(
  (
    {
      label,
      error,
      hint,
      success,
      icon,
      className = '',
      wrapperClassName = '',
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className={`flex flex-col gap-1.5 w-full ${wrapperClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--color-on-surface-variant)] font-bold ml-1"
          >
            {label}
          </label>
        )}
        <div className={`field-shell relative group rounded-xl ${error ? 'border-[var(--color-error)]/40' : ''} ${success ? 'border-[var(--color-success)]/30' : ''}`}>
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[var(--color-outline)] text-[20px] transition-all duration-[var(--motion-fast)] group-focus-within:text-[var(--color-primary-container)] group-focus-within:scale-105">
              {icon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full rounded-xl bg-transparent py-3 ${icon ? 'pl-10' : 'pl-4'} pr-4 text-[var(--color-on-surface)] font-medium outline-none placeholder:text-[var(--color-outline)] ${className}`}
            {...props}
          />
        </div>
        {error ? (
          <span className="text-xs font-medium text-[var(--color-error)] mt-0.5 ml-1 animate-in fade-in slide-in-from-bottom-4">
            {error}
          </span>
        ) : success ? (
          <span className="text-xs font-medium text-[var(--color-success-text)] mt-0.5 ml-1">{success}</span>
        ) : hint ? (
          <span className="text-xs font-medium text-[var(--color-on-surface-variant)] mt-0.5 ml-1">{hint}</span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
