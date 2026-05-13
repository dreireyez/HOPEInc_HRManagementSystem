import { render, screen, waitFor } from '@testing-library/react';
import Reports from '../Reports';
import { useRights } from '../../context/UserRightsContext';
import { getHeadcountByDept, getSalarySummaryByJob, getEmployeeFullHistory } from '../../services/reportService';
import { getEmployees } from '../../services/employeeService';
import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../../context/UserRightsContext');
vi.mock('../../services/reportService');
vi.mock('../../services/employeeService');

describe('Reports Headcount UI', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    
    useRights.mockReturnValue({
      currentUser: { user_type: 'SUPERADMIN' }
    });

    getSalarySummaryByJob.mockResolvedValue({ data: [] });
    getEmployees.mockResolvedValue({ data: [] });
    getEmployeeFullHistory.mockResolvedValue({ data: [] });
  });

  it('renders Headcount Distribution correctly with percentages', async () => {
    const mockHeadcountData = [
      { deptname: 'Engineering', activeheadcount: 5 },
      { deptname: 'Sales', activeheadcount: 15 }
    ];
    
    getHeadcountByDept.mockResolvedValue({ data: mockHeadcountData });

    render(<Reports />);

    // Wait for the data to load and render by waiting for Engineering text to show
    await waitFor(() => {
      expect(screen.getByText('Engineering')).toBeInTheDocument();
    });

    expect(screen.getByText('5 Employees (25.0%)')).toBeInTheDocument();
    expect(screen.getByText('Sales')).toBeInTheDocument();
    expect(screen.getByText('15 Employees (75.0%)')).toBeInTheDocument();
  });
});
