const PHT_FORMATTER = new Intl.DateTimeFormat('en-PH', {
  timeZone: 'Asia/Manila',
  year: 'numeric',
  month: 'short',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: true,
});

/**
 * Format a timestamp in Philippine Time for admin-facing audit data.
 *
 * @param {string | number | Date | null | undefined} value
 * @returns {string}
 */
export const formatPhtDateTime = (value) => {
  if (!value) {
    return 'N/A';
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'N/A';
  }

  return `${PHT_FORMATTER.format(date)} PHT`;
};
