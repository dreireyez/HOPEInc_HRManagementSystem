import React from 'react';

export function Table({ children, className = '', dense = false, ...props }) {
  return (
    <div className={`surface-panel overflow-hidden rounded-[var(--radius-xl)] ${className}`}>
      <div className="overflow-x-auto">
        <table
          className={`w-full min-w-[640px] border-separate border-spacing-x-0 text-left ${dense ? 'border-spacing-y-3' : 'border-spacing-y-4'} px-3`}
          {...props}
        >
          {children}
        </table>
      </div>
    </div>
  );
}

export function Thead({ children, className = '', ...props }) {
  return (
    <thead className={className} {...props}>
      {children}
    </thead>
  );
}

export function Tbody({ children, className = '', ...props }) {
  return (
    <tbody className={`table-body-separated animate-in fade-in slide-in-from-bottom-4 ${className}`} {...props}>
      {children}
    </tbody>
  );
}

export function Tr({ children, className = '', interactive = false, selected = false, onClick, ...props }) {
  return (
    <tr
      className={`table-row-shell group ${interactive || onClick ? 'cursor-pointer' : ''} ${selected ? 'is-selected' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </tr>
  );
}

export function Th({ children, className = '', ...props }) {
  return (
    <th
      className={`sticky top-0 z-10 bg-[var(--color-surface)] px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.24em] font-bold text-[var(--color-on-surface-variant)] whitespace-nowrap backdrop-blur-sm ${className}`}
      {...props}
    >
      {children}
    </th>
  );
}

export function Td({ children, className = '', selected = false, ...props }) {
  return (
    <td
      className={`table-row-surface px-5 py-4 text-sm font-sans text-[var(--color-on-surface)] align-middle first:rounded-l-[16px] last:rounded-r-[16px] group-hover:table-row-surface-hover group-hover:bg-[var(--color-surface)] ${selected ? 'bg-[var(--color-primary-soft)]' : ''} ${className}`}
      {...props}
    >
      {children}
    </td>
  );
}
