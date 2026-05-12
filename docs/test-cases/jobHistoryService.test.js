import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/lib/supabaseClient.js', () => ({
  default: { from: vi.fn() },
}));

import supabase from '../../src/lib/supabaseClient.js';
import {
  getJobHistory,
  getAllJobHistory,
  updateJobHistory,
  softDeleteJobHistory,
  recoverJobHistory,
} from '../../src/services/jobHistoryService.js';

const makeChain = (result) => ({
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  then: (resolve) => resolve(result),
});

describe('jobHistoryService', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('updateJobHistory — composite PK', () => {
    it('matches on empno, jobcode, and effdate', async () => {
      const chain = makeChain({ data: [{}], error: null });
      supabase.from.mockReturnValue(chain);

      await updateJobHistory(1, 'J001', '2024-01-01', { salary: 50000 });

      const eqCalls = chain.eq.mock.calls.map(([col]) => col);
      expect(eqCalls).toContain('empno');
      expect(eqCalls).toContain('jobcode');
      expect(eqCalls).toContain('effdate');
      expect(eqCalls).not.toContain('id');
    });

    it('passes correct values for composite key', async () => {
      const chain = makeChain({ data: [{}], error: null });
      supabase.from.mockReturnValue(chain);

      await updateJobHistory(99, 'ENG-01', '2025-06-01', { salary: 60000 });

      expect(chain.eq).toHaveBeenCalledWith('empno', 99);
      expect(chain.eq).toHaveBeenCalledWith('jobcode', 'ENG-01');
      expect(chain.eq).toHaveBeenCalledWith('effdate', '2025-06-01');
    });
  });

  describe('softDeleteJobHistory', () => {
    it('sets INACTIVE, writes stamp, uses composite PK', async () => {
      const chain = makeChain({ data: [{}], error: null });
      supabase.from.mockReturnValue(chain);

      await softDeleteJobHistory(1, 'J001', '2024-01-01', 'admin-uid');

      const updateArg = chain.update.mock.calls[0][0];
      expect(updateArg.record_status).toBe('INACTIVE');
      expect(updateArg.stamp).toMatch(/^DEACTIVATED admin-ui /);

      const eqCols = chain.eq.mock.calls.map(([col]) => col);
      expect(eqCols).toContain('empno');
      expect(eqCols).toContain('jobcode');
      expect(eqCols).toContain('effdate');
      expect(eqCols).not.toContain('id');
    });
  });

  describe('recoverJobHistory', () => {
    it('sets ACTIVE, writes stamp, uses composite PK', async () => {
      const chain = makeChain({ data: [{}], error: null });
      supabase.from.mockReturnValue(chain);

      await recoverJobHistory(1, 'J001', '2024-01-01', 'admin-uid');

      const updateArg = chain.update.mock.calls[0][0];
      expect(updateArg.record_status).toBe('ACTIVE');
      expect(updateArg.stamp).toMatch(/^REACTIVATED admin-ui /);

      const eqCols = chain.eq.mock.calls.map(([col]) => col);
      expect(eqCols).toContain('empno');
      expect(eqCols).toContain('jobcode');
      expect(eqCols).toContain('effdate');
    });
  });

  describe('getJobHistory', () => {
    it('filters ACTIVE records for USER', async () => {
      const chain = makeChain({ data: [], error: null });
      supabase.from.mockReturnValue(chain);

      await getJobHistory(1, 'USER');
      expect(chain.eq).toHaveBeenCalledWith('record_status', 'ACTIVE');
    });

    it('does not filter status for ADMIN', async () => {
      const chain = makeChain({ data: [], error: null });
      supabase.from.mockReturnValue(chain);

      await getJobHistory(1, 'ADMIN');
      const eqCols = chain.eq.mock.calls.map(([col]) => col);
      expect(eqCols).not.toContain('record_status');
    });
  });

  describe('getAllJobHistory', () => {
    it('filters ACTIVE for USER', async () => {
      const chain = makeChain({ data: [], error: null });
      supabase.from.mockReturnValue(chain);

      await getAllJobHistory('USER');
      expect(chain.eq).toHaveBeenCalledWith('record_status', 'ACTIVE');
    });

    it('returns all records for ADMIN', async () => {
      const chain = makeChain({ data: [{ empno: 1 }], error: null });
      supabase.from.mockReturnValue(chain);

      const { data } = await getAllJobHistory('ADMIN');
      expect(data).toHaveLength(1);
      const eqCols = chain.eq.mock.calls.map(([col]) => col);
      expect(eqCols).not.toContain('record_status');
    });
  });
});
