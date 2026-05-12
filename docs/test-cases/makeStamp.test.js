import { describe, it, expect } from 'vitest';
import { makeStamp, STAMP_ACTIONS } from '../../src/utils/makeStamp.js';

describe('makeStamp', () => {
  it('emits "<ACTION> <actorShort8> <ISO seconds Z>"', () => {
    const out = makeStamp('DEACTIVATED', 'abcdef0123456789');
    expect(out).toMatch(/^DEACTIVATED abcdef01 \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
  });

  it('truncates short actors safely and never exceeds 60 chars', () => {
    const out = makeStamp('REACTIVATED', 'u');
    expect(out.length).toBeLessThanOrEqual(60);
    expect(out.startsWith('REACTIVATED u ')).toBe(true);
  });

  it('falls back to "system" when actor is missing', () => {
    expect(makeStamp('DEACTIVATED', null)).toMatch(/^DEACTIVATED system /);
  });

  it('exports the canonical action constants', () => {
    expect(STAMP_ACTIONS.DEACTIVATED).toBe('DEACTIVATED');
    expect(STAMP_ACTIONS.REACTIVATED).toBe('REACTIVATED');
  });
});
