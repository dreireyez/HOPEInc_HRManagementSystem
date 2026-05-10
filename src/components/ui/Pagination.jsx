import React from 'react';

export function Pagination({
  currentPage,
  totalItems,
  pageSize = 10,
  onPageChange,
  className = '',
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  if (totalItems <= pageSize) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const visiblePages = [];
  const startPage = Math.max(1, currentPage - 1);
  const endPage = Math.min(totalPages, startPage + 2);

  for (let page = Math.max(1, endPage - 2); page <= endPage; page += 1) {
    visiblePages.push(page);
  }

  return (
    <div className={`flex flex-col gap-3 md:flex-row md:items-center md:justify-between ${className}`}>
      <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">
        Showing {startItem}-{endItem} of {totalItems}
      </p>

      <div className="flex items-center gap-2 self-end md:self-auto">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="interactive-surface rounded-xl px-3 py-2 text-xs font-mono font-bold uppercase tracking-[0.18em] text-[var(--color-on-surface-variant)] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Prev
        </button>

        {visiblePages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`rounded-xl px-3 py-2 text-xs font-mono font-bold uppercase tracking-[0.18em] transition-all ${
              page === currentPage
                ? 'bg-[var(--color-primary-container)] text-white shadow-outset-soft'
                : 'interactive-surface text-[var(--color-on-surface-variant)]'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="interactive-surface rounded-xl px-3 py-2 text-xs font-mono font-bold uppercase tracking-[0.18em] text-[var(--color-on-surface-variant)] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
