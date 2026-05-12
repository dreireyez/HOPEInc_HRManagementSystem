import { describe, it, expect } from 'vitest';

const computeHiresByMonth = (employees) => {
  const map = {};
  employees.forEach(emp => {
    if (!emp.hiredate) return;
    const month = emp.hiredate.slice(0, 7);
    map[month] = (map[month] || 0) + 1;
  });
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => {
      const [y, m] = month.split('-');
      const label = new Date(Number(y), Number(m) - 1).toLocaleString('default', { month: 'short', year: 'numeric' });
      return { month, label, count };
    });
};

describe('hiresByMonth aggregation', () => {
  it('produces 3 entries for employees spanning 3 months', () => {
    const employees = [
      { empno: '001', hiredate: '2024-01-15' },
      { empno: '002', hiredate: '2024-02-10' },
      { empno: '003', hiredate: '2024-03-05' },
    ];
    const result = computeHiresByMonth(employees);
    expect(result.length).toBe(3);
  });

  it('counts correctly per month', () => {
    const employees = [
      { empno: '001', hiredate: '2024-01-15' },
      { empno: '002', hiredate: '2024-01-20' },
      { empno: '003', hiredate: '2024-02-10' },
    ];
    const result = computeHiresByMonth(employees);
    const jan = result.find(r => r.month === '2024-01');
    const feb = result.find(r => r.month === '2024-02');
    expect(jan.count).toBe(2);
    expect(feb.count).toBe(1);
  });

  it('output is sorted chronologically', () => {
    const employees = [
      { empno: '001', hiredate: '2024-03-01' },
      { empno: '002', hiredate: '2024-01-01' },
      { empno: '003', hiredate: '2024-02-01' },
    ];
    const result = computeHiresByMonth(employees);
    expect(result[0].month).toBe('2024-01');
    expect(result[1].month).toBe('2024-02');
    expect(result[2].month).toBe('2024-03');
  });

  it('ignores employees without hiredate', () => {
    const employees = [
      { empno: '001', hiredate: '2024-01-01' },
      { empno: '002', hiredate: null },
      { empno: '003' },
    ];
    const result = computeHiresByMonth(employees);
    expect(result.length).toBe(1);
    expect(result[0].count).toBe(1);
  });
});
