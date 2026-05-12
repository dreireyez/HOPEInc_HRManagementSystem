import { describe, it, expect } from 'vitest';

const resolveDeptFields = (dept) => ({
  code: dept.deptcode ?? '',
  name: dept.deptname ?? 'Unnamed',
  key: dept.deptcode,
});

describe('DeptListPage field access', () => {
  it('resolves code and name from all-lowercase keys', () => {
    const dept = { deptcode: 'ENG', deptname: 'Engineering', record_status: 'ACTIVE' };
    const { code, name, key } = resolveDeptFields(dept);
    expect(code).toBe('ENG');
    expect(name).toBe('Engineering');
    expect(key).toBe('ENG');
  });

  it('falls back to Unnamed when deptname is missing', () => {
    const dept = { deptcode: 'MKT' };
    const { name } = resolveDeptFields(dept);
    expect(name).toBe('Unnamed');
  });

  it('produces unique keys for multiple departments', () => {
    const depts = [
      { deptcode: 'ENG', deptname: 'Engineering' },
      { deptcode: 'MKT', deptname: 'Marketing' },
      { deptcode: 'FIN', deptname: 'Finance' },
    ];
    const keys = depts.map(d => resolveDeptFields(d).key);
    const uniqueKeys = new Set(keys);
    expect(uniqueKeys.size).toBe(depts.length);
  });

  it('does NOT read camelCase deptCode field', () => {
    const dept = { deptCode: 'WRONG', deptcode: 'CORRECT', deptname: 'Test' };
    const { code } = resolveDeptFields(dept);
    expect(code).toBe('CORRECT');
  });
});
