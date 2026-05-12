import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/lib/supabaseClient.js', () => ({
  default: { from: vi.fn() },
}));

import supabase from '../../src/lib/supabaseClient.js';
import { getEmployeeCurrentJobById } from '../../src/services/reportService.js';
import { softDeleteEmployee } from '../../src/services/employeeService.js';

const makeChain = (result) => ({
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  single: vi.fn().mockResolvedValue(result),
  maybeSingle: vi.fn().mockResolvedValue(result),
  then: (resolve) => resolve(result),
});

describe('employee - jobhistory - department relational join', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('getEmployeeCurrentJobById', () => {
    it('returns joined deptname and jobdesc for a known empno', async () => {
      const mockRow = {
        empno: '00001',
        jobcode: 'MGR1',
        jobdesc: 'Manager',
        deptcode: 'ADM',
        deptname: 'Admin',
        salary: 75000,
        currenteffdate: '2020-01-01',
      };
      const chain = makeChain({ data: mockRow, error: null });
      supabase.from.mockReturnValue(chain);

      const { data, error } = await getEmployeeCurrentJobById('00001');

      expect(error).toBeNull();
      expect(data).not.toBeNull();
      expect(data.deptname).toBe('Admin');
      expect(data.jobdesc).toBe('Manager');
      expect(data.empno).toBe('00001');
    });

    it('queries the employee_current_job view', async () => {
      const chain = makeChain({ data: null, error: null });
      supabase.from.mockReturnValue(chain);

      await getEmployeeCurrentJobById('00001');

      expect(supabase.from).toHaveBeenCalledWith('employee_current_job');
    });

    it('filters by empno using lowercase column name', async () => {
      const chain = makeChain({ data: null, error: null });
      supabase.from.mockReturnValue(chain);

      await getEmployeeCurrentJobById('00001');

      const eqCalls = chain.eq.mock.calls.map(([col]) => col);
      expect(eqCalls).toContain('empno');
      expect(eqCalls).not.toContain('empNo');
    });

    it('returns null data when no matching employee is found', async () => {
      const chain = makeChain({ data: null, error: null });
      supabase.from.mockReturnValue(chain);

      const { data, error } = await getEmployeeCurrentJobById('99999');

      expect(error).toBeNull();
      expect(data).toBeNull();
    });

    it('surfaces supabase errors correctly', async () => {
      const chain = makeChain({ data: null, error: new Error('view not found') });
      supabase.from.mockReturnValue(chain);

      const { data, error } = await getEmployeeCurrentJobById('00001');

      expect(data).toBeNull();
      expect(error).toBeTruthy();
      expect(error.message).toBe('view not found');
    });
  });

  describe('softDeleteEmployee cascade expectations', () => {
    it('sets employee record_status to INACTIVE with correct stamp format', async () => {
      const chain = makeChain({ data: [{ empno: '00001' }], error: null });
      supabase.from.mockReturnValue(chain);

      const { error } = await softDeleteEmployee('00001', 'admin-user-id');

      expect(error).toBeNull();
      const updatePayload = chain.update.mock.calls[0][0];
      expect(updatePayload.record_status).toBe('INACTIVE');
      expect(updatePayload.stamp).toMatch(/^DEACTIVATED admin-us /);
    });

    it('targets the employee table with lowercase empno eq filter', async () => {
      const chain = makeChain({ data: [{}], error: null });
      supabase.from.mockReturnValue(chain);

      await softDeleteEmployee('00001', 'uid');

      expect(supabase.from).toHaveBeenCalledWith('employee');
      expect(chain.eq).toHaveBeenCalledWith('empno', '00001');
    });

    it('returns error without writing stamp when supabase rejects', async () => {
      const chain = makeChain({ data: null, error: new Error('RLS violation') });
      supabase.from.mockReturnValue(chain);

      const { data, error } = await softDeleteEmployee('00001', 'uid');

      expect(data).toBeNull();
      expect(error.message).toBe('RLS violation');
    });
  });
});
