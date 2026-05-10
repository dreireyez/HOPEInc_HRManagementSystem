import React from 'react';

export function Card({
  children,
  className = '',
  hoverEffect = false,
  interactive = false,
  padding = 'lg',
  ...props
}) {
  const paddingMap = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const interactiveClass =
    hoverEffect || interactive
      ? 'interactive-surface surface-panel-hover hover:shadow-outset-hover hover:shadow-glow hover:-translate-y-[3px] active:-translate-y-[1px] active:shadow-outset cursor-pointer'
      : 'surface-panel';

  return (
    <div
      className={`rounded-[var(--radius-xl)] ${paddingMap[padding]} ${interactiveClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
