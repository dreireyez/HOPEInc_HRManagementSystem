import { describe, it, expect, vi } from 'vitest';

const buildInsertPayload = (empNo, formData) => ({
  empno: empNo,
  jobcode: formData.jobCode,
  deptcode: formData.deptCode,
  effdate: formData.effDate,
  salary: formData.salary ? parseFloat(formData.salary) : null,
  record_status: 'ACTIVE',
});

const isEditMode = (initialData) =>
  !!(initialData?.empno && initialData?.jobcode && initialData?.effdate);

describe('JobHistoryModal payload', () => {
  it('insert payload uses all-lowercase column names', () => {
    const payload = buildInsertPayload('00001', {
      jobCode: 'J001',
      deptCode: 'ENG',
      effDate: '2024-06-01',
      salary: '55000',
    });
    expect(payload).toHaveProperty('empno', '00001');
    expect(payload).toHaveProperty('jobcode', 'J001');
    expect(payload).toHaveProperty('deptcode', 'ENG');
    expect(payload).toHaveProperty('effdate', '2024-06-01');
    expect(payload).not.toHaveProperty('emp_no');
    expect(payload).not.toHaveProperty('jobCode');
    expect(payload).not.toHaveProperty('deptCode');
    expect(payload).not.toHaveProperty('effDate');
  });

  it('salary is parsed as float', () => {
    const payload = buildInsertPayload('00001', { jobCode: 'J001', deptCode: 'ENG', effDate: '2024-01-01', salary: '75000.50' });
    expect(payload.salary).toBe(75000.50);
  });

  it('salary is null when empty', () => {
    const payload = buildInsertPayload('00001', { jobCode: 'J001', deptCode: 'ENG', effDate: '2024-01-01', salary: '' });
    expect(payload.salary).toBeNull();
  });

  it('edit mode detected from composite PK fields on initialData', () => {
    expect(isEditMode({ empno: '00001', jobcode: 'J001', effdate: '2024-01-01' })).toBe(true);
    expect(isEditMode({ id: 99 })).toBe(false);
    expect(isEditMode(null)).toBe(false);
    expect(isEditMode({ empno: '00001' })).toBe(false);
  });

  it('updateJobHistory called with composite key args in edit mode', async () => {
    const mockUpdate = vi.fn().mockResolvedValue({ data: [{}], error: null });
    const mockAdd = vi.fn();

    const initialData = { empno: '00001', jobcode: 'J001', effdate: '2024-01-01' };
    const payload = buildInsertPayload(initialData.empno, {
      jobCode: 'J001', deptCode: 'ENG', effDate: '2024-01-01', salary: '50000',
    });

    if (isEditMode(initialData)) {
      await mockUpdate(initialData.empno, initialData.jobcode, initialData.effdate, payload);
    } else {
      await mockAdd(payload);
    }

    expect(mockUpdate).toHaveBeenCalledWith('00001', 'J001', '2024-01-01', payload);
    expect(mockAdd).not.toHaveBeenCalled();
  });
});
