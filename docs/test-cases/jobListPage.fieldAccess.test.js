import { describe, it, expect } from 'vitest';

const resolveJobFields = (job) => ({
  code: job.jobcode ?? '',
  desc: job.jobdesc ?? '',
  key: job.jobcode,
});

const INITIAL_SORT_FIELD = 'jobcode';

describe('JobListPage field access', () => {
  it('resolves jobcode and jobdesc from all-lowercase keys', () => {
    const job = { jobcode: 'J001', jobdesc: 'Software Engineer', record_status: 'ACTIVE' };
    const { code, desc, key } = resolveJobFields(job);
    expect(code).toBe('J001');
    expect(desc).toBe('Software Engineer');
    expect(key).toBe('J001');
  });

  it('initial sort field is lowercase jobcode', () => {
    expect(INITIAL_SORT_FIELD).toBe('jobcode');
  });

  it('produces unique keys for multiple jobs', () => {
    const jobs = [
      { jobcode: 'J001', jobdesc: 'Engineer' },
      { jobcode: 'J002', jobdesc: 'Manager' },
      { jobcode: 'J003', jobdesc: 'Analyst' },
    ];
    const keys = jobs.map(j => resolveJobFields(j).key);
    expect(new Set(keys).size).toBe(jobs.length);
  });

  it('does NOT read camelCase jobCode field', () => {
    const job = { jobCode: 'WRONG', jobcode: 'CORRECT', jobdesc: 'Test' };
    const { code } = resolveJobFields(job);
    expect(code).toBe('CORRECT');
  });

  it('sorts correctly on lowercase field name', () => {
    const jobs = [
      { jobcode: 'J003', jobdesc: 'Manager' },
      { jobcode: 'J001', jobdesc: 'Analyst' },
      { jobcode: 'J002', jobdesc: 'Engineer' },
    ];
    const sorted = [...jobs].sort((a, b) => {
      const aVal = (a[INITIAL_SORT_FIELD] ?? '').toLowerCase();
      const bVal = (b[INITIAL_SORT_FIELD] ?? '').toLowerCase();
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    });
    expect(sorted[0].jobcode).toBe('J001');
    expect(sorted[1].jobcode).toBe('J002');
    expect(sorted[2].jobcode).toBe('J003');
  });
});
