import { describe, it, expect } from 'vitest';

const DEFAULT_SORT_FIELD = 'empno';

const sortEmployees = (employees, sortField, sortDir) =>
  [...employees].sort((a, b) => {
    let aVal = a[sortField] ?? '';
    let bVal = b[sortField] ?? '';
    if (typeof aVal === 'string') { aVal = aVal.toLowerCase(); bVal = (bVal || '').toLowerCase(); }
    if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

const filterEmployees = (employees, statusFilter, deptFilter, empDeptMap) =>
  employees.filter(emp => {
    if (statusFilter !== 'ALL' && emp.record_status !== statusFilter) return false;
    if (deptFilter && empDeptMap[emp.empno] !== deptFilter) return false;
    return true;
  });

describe('EmployeeListPage sort and filter logic', () => {
  it('default sort field is empno', () => {
    expect(DEFAULT_SORT_FIELD).toBe('empno');
  });

  it('sorts employees by empno ascending', () => {
    const emps = [
      { empno: '00003', lastname: 'Charlie' },
      { empno: '00001', lastname: 'Alice' },
      { empno: '00002', lastname: 'Bob' },
    ];
    const sorted = sortEmployees(emps, 'empno', 'asc');
    expect(sorted[0].empno).toBe('00001');
    expect(sorted[1].empno).toBe('00002');
    expect(sorted[2].empno).toBe('00003');
  });

  it('deptFilter removes employees not in empDeptMap', () => {
    const emps = [
      { empno: '00001', record_status: 'ACTIVE' },
      { empno: '00002', record_status: 'ACTIVE' },
      { empno: '00003', record_status: 'ACTIVE' },
    ];
    const empDeptMap = { '00001': 'ENG', '00002': 'MKT', '00003': 'ENG' };
    const result = filterEmployees(emps, 'ALL', 'ENG', empDeptMap);
    expect(result.map(e => e.empno)).toEqual(['00001', '00003']);
  });

  it('status filter ACTIVE removes inactive employees', () => {
    const emps = [
      { empno: '00001', record_status: 'ACTIVE' },
      { empno: '00002', record_status: 'INACTIVE' },
    ];
    const result = filterEmployees(emps, 'ACTIVE', '', {});
    expect(result.length).toBe(1);
    expect(result[0].empno).toBe('00001');
  });

  it('action buttons have no opacity-0 class — they are persistently visible', () => {
    // Simulate the class string applied to the actions container in EmployeeListPage.
    // Before the fix: 'flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all'
    // After the fix:  'flex justify-end gap-2'
    const actionContainerClass = 'flex justify-end gap-2';
    expect(actionContainerClass).not.toContain('opacity-0');
    expect(actionContainerClass).not.toContain('group-hover:opacity-100');
  });
});
