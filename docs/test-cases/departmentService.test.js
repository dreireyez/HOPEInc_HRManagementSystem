import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/lib/supabaseClient.js', () => ({
  default: { from: vi.fn() },
}));

import supabase from '../../src/lib/supabaseClient.js';
import {
  getDepts,
  updateDept,
  softDeleteDept,
  recoverDept,
} from '../../src/services/departmentService.js';
import { getEmployeeDeptMap } from '../../src/services/employeeService.js';

const makeChain = (result) => ({
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  then: (resolve) => resolve(result),
});

describe('departmentService', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('updateDept', () => {
    it('uses lowercase deptcode column name', async () => {
      const chain = makeChain({ data: [{}], error: null });
      supabase.from.mockReturnValue(chain);

      await updateDept('ENG', { deptName: 'Engineering' });

      const eqCalls = chain.eq.mock.calls;
      expect(eqCalls.some(([col]) => col === 'deptcode')).toBe(true);
      expect(eqCalls.some(([col]) => col === 'deptCode')).toBe(false);
    });
  });

  describe('softDeleteDept', () => {
    it('sets INACTIVE, writes stamp, and uses lowercase column', async () => {
      const chain = makeChain({ data: [{}], error: null });
      supabase.from.mockReturnValue(chain);

      await softDeleteDept('ENG', 'admin-uid');

      const updateArg = chain.update.mock.calls[0][0];
      expect(updateArg.record_status).toBe('INACTIVE');
      expect(updateArg.stamp).toMatch(/^DEACTIVATED admin-ui /);

      const eqCalls = chain.eq.mock.calls;
      expect(eqCalls.some(([col]) => col === 'deptcode')).toBe(true);
    });
  });

  describe('recoverDept', () => {
    it('sets ACTIVE, writes stamp, and uses lowercase column', async () => {
      const chain = makeChain({ data: [{}], error: null });
      supabase.from.mockReturnValue(chain);

      await recoverDept('ENG', 'admin-uid');

      const updateArg = chain.update.mock.calls[0][0];
      expect(updateArg.record_status).toBe('ACTIVE');
      expect(updateArg.stamp).toMatch(/^REACTIVATED admin-ui /);

      const eqCalls = chain.eq.mock.calls;
      expect(eqCalls.some(([col]) => col === 'deptcode')).toBe(true);
    });
  });

  describe('getDepts', () => {
    it('applies ACTIVE filter for USER', async () => {
      const chain = makeChain({ data: [], error: null });
      supabase.from.mockReturnValue(chain);

      await getDepts('USER');
      expect(chain.eq).toHaveBeenCalledWith('record_status', 'ACTIVE');
    });

    it('does not apply status filter for ADMIN', async () => {
      const chain = makeChain({ data: [], error: null });
      supabase.from.mockReturnValue(chain);

      await getDepts('ADMIN');
      const eqCalls = chain.eq.mock.calls.map(([col]) => col);
      expect(eqCalls).not.toContain('record_status');
    });
  });
});

// getEmployeeDeptMap tests — validates the department filter fix (PR-05 relational logic)
describe('getEmployeeDeptMap', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns a Map with deptCode entries for ACTIVE employees', async () => {
    const rows = [
      { empNo: '00001', deptCode: 'ENG', effDate: '2023-01-01' },
      { empNo: '00002', deptCode: 'MKT', effDate: '2022-06-15' },
    ];
    const chain = makeChain({ data: rows, error: null });
    supabase.from.mockReturnValue(chain);

    const { data } = await getEmployeeDeptMap('ADMIN');

    expect(data).toBeInstanceOf(Map);
    expect(data.get('00001')).toBe('ENG');
    expect(data.get('00002')).toBe('MKT');
  });

  it('for ADMIN, includes entries for INACTIVE jobHistory rows — fixes the broken dept filter', async () => {
    // Row with record_status INACTIVE must still appear in the map for ADMIN.
    // Before the fix, getEmployeeCurrentJob() only returned ACTIVE rows from the view,
    // so inactive employees had no dept entry and were excluded from dept filter results.
    const rows = [
      { empNo: '00003', deptCode: 'ACC', effDate: '2021-03-10', record_status: 'INACTIVE' },
    ];
    const chain = makeChain({ data: rows, error: null });
    supabase.from.mockReturnValue(chain);

    const { data } = await getEmployeeDeptMap('ADMIN');

    expect(data.get('00003')).toBe('ACC');
  });

  it('for USER, applies ACTIVE record_status filter to jobHistory query', async () => {
    const chain = makeChain({ data: [], error: null });
    supabase.from.mockReturnValue(chain);

    await getEmployeeDeptMap('USER');

    expect(chain.eq).toHaveBeenCalledWith('record_status', 'ACTIVE');
  });

  it('picks the most recent effDate when an employee has multiple jobHistory rows', async () => {
    const rows = [
      { empNo: '00001', deptCode: 'OLD', effDate: '2020-01-01' },
      { empNo: '00001', deptCode: 'NEW', effDate: '2024-06-01' },
    ];
    const chain = makeChain({ data: rows, error: null });
    supabase.from.mockReturnValue(chain);

    const { data } = await getEmployeeDeptMap('ADMIN');

    expect(data.get('00001')).toBe('NEW');
  });
});
