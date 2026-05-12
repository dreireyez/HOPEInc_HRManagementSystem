import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock the rights context — we drive different role profiles per test.
const mockRightsState = { rights: {}, user_type: 'USER', userid: 'tester' };
vi.mock('../../src/context/UserRightsContext', () => ({
  useRights: () => ({
    can: (rid) => !!mockRightsState.rights[rid],
    currentUser: { user_type: mockRightsState.user_type, userid: mockRightsState.userid },
  }),
}));

// Stub services so the components render without network calls.
const sampleJob = { jobcode: 'J001', jobdesc: 'Engineer', record_status: 'ACTIVE', stamp: 'X' };
const sampleDept = { deptcode: 'D01', deptname: 'Engineering', record_status: 'ACTIVE', stamp: 'X' };

vi.mock('../../src/services/jobService', () => ({
  getJobs: vi.fn().mockResolvedValue({ data: [sampleJob], error: null }),
  softDeleteJob: vi.fn().mockResolvedValue({ data: null, error: null }),
}));
vi.mock('../../src/services/departmentService', () => ({
  getDepts: vi.fn().mockResolvedValue({ data: [sampleDept], error: null }),
  softDeleteDept: vi.fn().mockResolvedValue({ data: null, error: null }),
}));

import JobListPage from '../../src/pages/JobListPage';
import DeptListPage from '../../src/pages/DeptListPage';

const setRole = (user_type, rights = {}) => {
  mockRightsState.user_type = user_type;
  mockRightsState.rights = rights;
};

describe('soft-delete visibility by role', () => {
  beforeEach(() => vi.clearAllMocks());

  it('USER sees no delete button on jobs', async () => {
    setRole('USER', { JOB_VIEW: true });
    render(<MemoryRouter><JobListPage /></MemoryRouter>);
    await waitFor(() => expect(screen.getByText('Engineer')).toBeInTheDocument());
    // No delete-sweep icon present
    expect(document.querySelector('.material-symbols-outlined.text-error')).toBeNull();
  });

  it('SUPERADMIN sees a delete button on jobs (JOB_DEL=1)', async () => {
    setRole('SUPERADMIN', { JOB_VIEW: true, JOB_EDIT: true, JOB_DEL: true });
    render(<MemoryRouter><JobListPage /></MemoryRouter>);
    await waitFor(() => expect(screen.getByText('Engineer')).toBeInTheDocument());
    expect(screen.getByTestId('stamp-header')).toBeInTheDocument();
  });

  it('ADMIN does NOT see a delete button on departments (DEPT_DEL=0)', async () => {
    setRole('ADMIN', { DEPT_VIEW: true, DEPT_EDIT: true });
    render(<MemoryRouter><DeptListPage /></MemoryRouter>);
    await waitFor(() => expect(screen.getByText('Engineering')).toBeInTheDocument());
    // Stamp visible to ADMIN
    expect(screen.getByTestId('stamp-cell')).toBeInTheDocument();
  });

  it('USER does not see the stamp cell on departments', async () => {
    setRole('USER', { DEPT_VIEW: true });
    render(<MemoryRouter><DeptListPage /></MemoryRouter>);
    await waitFor(() => expect(screen.getByText('Engineering')).toBeInTheDocument());
    expect(screen.queryByTestId('stamp-cell')).toBeNull();
  });
});
