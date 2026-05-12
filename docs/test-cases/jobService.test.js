import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/lib/supabaseClient.js', () => ({
  default: { from: vi.fn() },
}));

import supabase from '../../src/lib/supabaseClient.js';
import {
  getJobs,
  updateJob,
  softDeleteJob,
  recoverJob,
} from '../../src/services/jobService.js';

const makeChain = (result) => ({
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  then: (resolve) => resolve(result),
});

describe('jobService', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('updateJob', () => {
    it('uses lowercase jobcode column name', async () => {
      const chain = makeChain({ data: [{}], error: null });
      supabase.from.mockReturnValue(chain);

      await updateJob('J001', { jobDesc: 'Engineer' });

      const eqCalls = chain.eq.mock.calls;
      expect(eqCalls.some(([col]) => col === 'jobcode')).toBe(true);
      expect(eqCalls.some(([col]) => col === 'jobCode')).toBe(false);
    });
  });

  describe('softDeleteJob', () => {
    it('sets INACTIVE, writes stamp, and uses lowercase column', async () => {
      const chain = makeChain({ data: [{}], error: null });
      supabase.from.mockReturnValue(chain);

      await softDeleteJob('J001', 'admin-uid');

      const updateArg = chain.update.mock.calls[0][0];
      expect(updateArg.record_status).toBe('INACTIVE');
      expect(updateArg.stamp).toMatch(/^DEACTIVATED admin-ui /);

      const eqCalls = chain.eq.mock.calls;
      expect(eqCalls.some(([col]) => col === 'jobcode')).toBe(true);
    });
  });

  describe('recoverJob', () => {
    it('sets ACTIVE, writes stamp, and uses lowercase column', async () => {
      const chain = makeChain({ data: [{}], error: null });
      supabase.from.mockReturnValue(chain);

      await recoverJob('J001', 'admin-uid');

      const updateArg = chain.update.mock.calls[0][0];
      expect(updateArg.record_status).toBe('ACTIVE');
      expect(updateArg.stamp).toMatch(/^REACTIVATED admin-ui /);

      const eqCalls = chain.eq.mock.calls;
      expect(eqCalls.some(([col]) => col === 'jobcode')).toBe(true);
    });
  });

  describe('getJobs', () => {
    it('applies ACTIVE filter for USER', async () => {
      const chain = makeChain({ data: [], error: null });
      supabase.from.mockReturnValue(chain);

      await getJobs('USER');
      expect(chain.eq).toHaveBeenCalledWith('record_status', 'ACTIVE');
    });

    it('does not apply status filter for ADMIN', async () => {
      const chain = makeChain({ data: [], error: null });
      supabase.from.mockReturnValue(chain);

      await getJobs('ADMIN');
      const eqCalls = chain.eq.mock.calls.map(([col]) => col);
      expect(eqCalls).not.toContain('record_status');
    });
  });
});
