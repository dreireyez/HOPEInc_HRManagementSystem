import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock supabase client
vi.mock('../../src/lib/supabaseClient.js', () => ({
  default: {
    from: vi.fn(),
  },
}));

import supabase from '../../src/lib/supabaseClient.js';
import {
  getEmployees,
  getEmployee,
  softDeleteEmployee,
  recoverEmployee,
} from '../../src/services/employeeService.js';

// Stamp format per spec (varchar(60) max):
//   "<ACTION> <actorShort8> <YYYY-MM-DDTHH:MM:SSZ>"

const makeChain = (result) => {
  const chain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue(result),
    then: (resolve) => resolve(result),
  };
  return chain;
};

describe('employeeService', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('getEmployees', () => {
    it('fetches all records for ADMIN', async () => {
      const chain = makeChain({ data: [{ empno: 1 }], error: null });
      supabase.from.mockReturnValue(chain);

      const { data, error } = await getEmployees('ADMIN');
      expect(error).toBeNull();
      expect(data).toHaveLength(1);
      // No record_status filter applied for ADMIN
      const eqCalls = chain.eq.mock.calls.map(c => c[0]);
      expect(eqCalls).not.toContain('record_status');
    });

    it('filters to ACTIVE for USER', async () => {
      const chain = makeChain({ data: [], error: null });
      supabase.from.mockReturnValue(chain);

      await getEmployees('USER');
      const eqCalls = chain.eq.mock.calls.map(c => c[0]);
      expect(eqCalls).toContain('record_status');
    });
  });

  describe('softDeleteEmployee', () => {
    it('sets record_status to INACTIVE and writes stamp', async () => {
      const chain = makeChain({ data: [{ empno: 42 }], error: null });
      supabase.from.mockReturnValue(chain);

      const { data, error } = await softDeleteEmployee(42, 'user-uuid-123');

      expect(error).toBeNull();
      const updateCall = chain.update.mock.calls[0][0];
      expect(updateCall.record_status).toBe('INACTIVE');
      expect(updateCall.stamp).toMatch(/^DEACTIVATED user-uui /);
      expect(updateCall.stamp.length).toBeLessThanOrEqual(60);
      expect(updateCall.sepdate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      // Must target the right row
      expect(chain.eq).toHaveBeenCalledWith('empno', 42);
    });

    it('returns error on supabase failure', async () => {
      const chain = makeChain({ data: null, error: new Error('DB error') });
      supabase.from.mockReturnValue(chain);

      const { data, error } = await softDeleteEmployee(1, 'uid');
      expect(error).toBeTruthy();
      expect(data).toBeNull();
    });
  });

  describe('recoverEmployee', () => {
    it('sets record_status to ACTIVE and writes stamp', async () => {
      const chain = makeChain({ data: [{ empno: 42 }], error: null });
      supabase.from.mockReturnValue(chain);

      const { data, error } = await recoverEmployee(42, 'user-uuid-456');

      expect(error).toBeNull();
      const updateCall = chain.update.mock.calls[0][0];
      expect(updateCall.record_status).toBe('ACTIVE');
      expect(updateCall.stamp).toMatch(/^REACTIVATED user-uui /);
      expect(updateCall.sepdate).toBeNull();
      expect(chain.eq).toHaveBeenCalledWith('empno', 42);
    });
  });

  describe('getEmployee', () => {
    it('filters ACTIVE for USER', async () => {
      const chain = makeChain({ data: null, error: null });
      supabase.from.mockReturnValue(chain);
      chain.maybeSingle.mockResolvedValue({ data: null, error: null });

      await getEmployee(1, 'USER');
      const eqCalls = chain.eq.mock.calls.map(c => c[0]);
      expect(eqCalls).toContain('record_status');
    });

    it('does not filter status for ADMIN', async () => {
      const chain = makeChain({ data: null, error: null });
      supabase.from.mockReturnValue(chain);
      chain.maybeSingle.mockResolvedValue({ data: { empno: 1 }, error: null });

      await getEmployee(1, 'ADMIN');
      const eqCalls = chain.eq.mock.calls.map(c => c[0]);
      expect(eqCalls).not.toContain('record_status');
    });
  });
});
