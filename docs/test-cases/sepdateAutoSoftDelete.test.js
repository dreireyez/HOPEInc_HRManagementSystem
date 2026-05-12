import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/lib/supabaseClient.js', () => ({
  default: { from: vi.fn() },
}));

import supabase from '../../src/lib/supabaseClient.js';
import { updateEmployee } from '../../src/services/employeeService.js';

const buildChain = ({ existingRow, updateResult }) => {
  // Two distinct call shapes are expected:
  //   1) .select('sepdate, record_status').eq('empno', x).maybeSingle()  -> existingRow
  //   2) .update(payload).eq('empno', x).select()                        -> updateResult
  let updatePayload = null;
  const chain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data: existingRow, error: null }),
    update: vi.fn((payload) => { updatePayload = payload; return chain; }),
    then: (resolve) => resolve(updateResult),
  };
  return { chain, getPayload: () => updatePayload };
};

describe('updateEmployee → sepdate auto-soft-delete', () => {
  beforeEach(() => vi.clearAllMocks());

  it('routes through soft-delete when sepdate is added to an ACTIVE row', async () => {
    const { chain, getPayload } = buildChain({
      existingRow: { sepdate: null, record_status: 'ACTIVE' },
      updateResult: { data: [{ empno: '00001' }], error: null },
    });
    supabase.from.mockReturnValue(chain);

    await updateEmployee('00001', { sepdate: '2026-05-11', firstname: 'Jane' }, 'actor-uuid');

    const payload = getPayload();
    expect(payload.record_status).toBe('INACTIVE');
    expect(payload.stamp).toMatch(/^DEACTIVATED actor-uu /);
    expect(payload.firstname).toBe('Jane');
    expect(payload.sepdate).toBe('2026-05-11');
  });

  it('does not flip status when sepdate already existed', async () => {
    const { chain, getPayload } = buildChain({
      existingRow: { sepdate: '2024-01-01', record_status: 'INACTIVE' },
      updateResult: { data: [{ empno: '00002' }], error: null },
    });
    supabase.from.mockReturnValue(chain);

    await updateEmployee('00002', { sepdate: '2026-05-11' }, 'actor-uuid');

    const payload = getPayload();
    expect(payload.record_status).toBeUndefined();
    expect(payload.stamp).toBeUndefined();
  });

  it('passes through unrelated edits unchanged', async () => {
    const { chain, getPayload } = buildChain({
      existingRow: { sepdate: null, record_status: 'ACTIVE' },
      updateResult: { data: [{ empno: '00003' }], error: null },
    });
    supabase.from.mockReturnValue(chain);

    await updateEmployee('00003', { firstname: 'Alex' }, 'actor');
    const payload = getPayload();
    expect(payload.record_status).toBeUndefined();
    expect(payload.stamp).toBeUndefined();
    expect(payload.firstname).toBe('Alex');
  });
});
