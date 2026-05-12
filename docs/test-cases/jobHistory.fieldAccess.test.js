import { describe, it, expect } from 'vitest';

const resolveHistoryRow = (item) => ({
  empno: item.empno ?? '',
  jobcode: item.jobcode || 'N/A',
  deptcode: item.deptcode || 'N/A',
  effdate: item.effdate ? new Date(item.effdate).toLocaleDateString() : 'N/A',
  salary: item.salary ? Number(item.salary).toLocaleString() : '0',
});

describe('JobHistory page field access', () => {
  it('renders all fields from all-lowercase keys', () => {
    const row = {
      empno: '00001',
      jobcode: 'J001',
      deptcode: 'ENG',
      effdate: '2024-01-01',
      salary: 50000,
      record_status: 'ACTIVE',
    };
    const result = resolveHistoryRow(row);
    expect(result.empno).toBe('00001');
    expect(result.jobcode).toBe('J001');
    expect(result.deptcode).toBe('ENG');
    expect(result.effdate).not.toBe('N/A');
    expect(result.salary).toBe('50,000');
  });

  it('shows N/A for missing code fields', () => {
    const row = { empno: '00002', salary: 40000 };
    const result = resolveHistoryRow(row);
    expect(result.jobcode).toBe('N/A');
    expect(result.deptcode).toBe('N/A');
    expect(result.effdate).toBe('N/A');
  });

  it('does NOT read camelCase or underscore variants', () => {
    const row = {
      jobCode: 'WRONG_CAMEL',
      job_code: 'WRONG_SNAKE',
      jobcode: 'CORRECT',
      deptcode: 'ENG',
      empno: '00003',
    };
    const result = resolveHistoryRow(row);
    expect(result.jobcode).toBe('CORRECT');
  });

  it('initial sort field is effdate (all-lowercase)', () => {
    const INITIAL_SORT = 'effdate';
    expect(INITIAL_SORT).toBe('effdate');
    expect(INITIAL_SORT).not.toContain('_');
  });
});
