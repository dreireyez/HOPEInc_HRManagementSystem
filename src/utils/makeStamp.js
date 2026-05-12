/**
 * Builds the value written to the single `stamp varchar(60)` column.
 * Format: "<ACTION> <actorShort8> <YYYY-MM-DDTHH:MM:SSZ>" (worst case 41 chars).
 * The column width is fixed by product spec and must NOT be altered.
 *
 * @param {'DEACTIVATED'|'REACTIVATED'} action
 * @param {string} actor - user id; truncated to 8 chars
 * @returns {string}
 */
export function makeStamp(action, actor) {
  const short = String(actor || 'system').slice(0, 8);
  const ts = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
  const out = `${action} ${short} ${ts}`;
  if (out.length > 60) {
    throw new Error(`stamp overflow (${out.length} > 60): ${out}`);
  }
  return out;
}

export const STAMP_ACTIONS = Object.freeze({
  DEACTIVATED: 'DEACTIVATED',
  REACTIVATED: 'REACTIVATED',
});
