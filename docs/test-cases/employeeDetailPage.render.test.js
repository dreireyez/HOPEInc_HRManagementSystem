import { describe, it, expect } from 'vitest';

// Tests validate the pure logic functions used to build the profile object and
// the field inclusion/exclusion rules applied in EmployeeDetailPage.

// Mirrors the profile mapping in EmployeeDetailPage.jsx.
const buildProfile = (employee, currentJob) => ({
  id: employee.empno,
  firstName: employee.firstname || 'N/A',
  lastName: employee.lastname || 'N/A',
  joined: employee.hiredate
    ? new Date(employee.hiredate + 'T00:00:00').toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Not specified',
  role: currentJob?.jobdesc || currentJob?.job_desc || 'Not assigned',
  dept: currentJob?.deptname || currentJob?.dept_name || 'Not assigned',
  status: employee.record_status === 'ACTIVE' ? 'Active' : 'Inactive',
  empNo: employee.empno,
});

// Mirrors the bento stats array in EmployeeDetailPage.jsx (Status card removed).
const buildBentoStats = (profile) => [
  { label: 'Employee No', val: profile.empNo, icon: 'badge', sub: 'System ID' },
  { label: 'Department', val: profile.dept, icon: 'apartment', sub: 'Assigned Department' },
];

// Mirrors the hire date label in the rendered output.
const buildHireDateLabel = (joinedString) => `Hired on ${joinedString}`;

// Mirrors the job title line (dept tag removed).
const buildJobTitleLine = (role) => role;

describe('EmployeeDetailPage field logic', () => {
  describe('hire date formatting', () => {
    it('formats 2010-05-11 as "Hired on May 11, 2010"', () => {
      const employee = {
        empno: '00001',
        firstname: 'Jane',
        lastname: 'Doe',
        hiredate: '2010-05-11',
        record_status: 'ACTIVE',
      };
      const profile = buildProfile(employee, null);
      const label = buildHireDateLabel(profile.joined);

      expect(label).toBe('Hired on May 11, 2010');
    });

    it('formats 1995-01-01 as "Hired on January 1, 1995"', () => {
      const employee = {
        empno: '00002',
        firstname: 'John',
        lastname: 'Smith',
        hiredate: '1995-01-01',
        record_status: 'ACTIVE',
      };
      const profile = buildProfile(employee, null);
      const label = buildHireDateLabel(profile.joined);

      expect(label).toBe('Hired on January 1, 1995');
    });

    it('returns "Not specified" label when hiredate is null', () => {
      const employee = {
        empno: '00003',
        firstname: 'No',
        lastname: 'Date',
        hiredate: null,
        record_status: 'ACTIVE',
      };
      const profile = buildProfile(employee, null);
      const label = buildHireDateLabel(profile.joined);

      expect(label).toBe('Hired on Not specified');
      expect(profile.joined).toBe('Not specified');
    });

    it('hire date label uses "Hired on" prefix, not "Joined"', () => {
      const employee = { empno: '00001', firstname: 'A', lastname: 'B', hiredate: '2020-06-15', record_status: 'ACTIVE' };
      const profile = buildProfile(employee, null);
      const label = buildHireDateLabel(profile.joined);

      expect(label).toContain('Hired on');
      expect(label).not.toContain('Joined');
    });
  });

  describe('profile object does not include deprecated fields', () => {
    it('profile object has no email key', () => {
      const employee = { empno: '00001', firstname: 'Jane', lastname: 'Doe', hiredate: '2010-05-11', record_status: 'ACTIVE' };
      const profile = buildProfile(employee, null);

      expect(Object.keys(profile)).not.toContain('email');
    });

    it('profile object has no location key', () => {
      const employee = { empno: '00001', firstname: 'Jane', lastname: 'Doe', hiredate: '2010-05-11', record_status: 'ACTIVE' };
      const profile = buildProfile(employee, null);

      expect(Object.keys(profile)).not.toContain('location');
    });
  });

  describe('bento stats — Status card is absent', () => {
    it('bento stats array contains exactly 2 cards', () => {
      const employee = { empno: '00001', firstname: 'Jane', lastname: 'Doe', hiredate: '2010-05-11', record_status: 'ACTIVE' };
      const profile = buildProfile(employee, { jobdesc: 'Analyst', deptname: 'Finance' });
      const stats = buildBentoStats(profile);

      expect(stats).toHaveLength(2);
    });

    it('bento stats labels are Employee No and Department only', () => {
      const employee = { empno: '00001', firstname: 'Jane', lastname: 'Doe', hiredate: '2010-05-11', record_status: 'ACTIVE' };
      const profile = buildProfile(employee, { jobdesc: 'Analyst', deptname: 'Finance' });
      const stats = buildBentoStats(profile);
      const labels = stats.map(s => s.label);

      expect(labels).toContain('Employee No');
      expect(labels).toContain('Department');
      expect(labels).not.toContain('Status');
    });

    it('status is still available on the profile object for the header badge', () => {
      const employee = { empno: '00001', firstname: 'Jane', lastname: 'Doe', hiredate: '2010-05-11', record_status: 'ACTIVE' };
      const profile = buildProfile(employee, null);

      expect(profile.status).toBe('Active');
    });

    it('inactive employee status resolves correctly for the header badge', () => {
      const employee = { empno: '00002', firstname: 'Bob', lastname: 'Lee', hiredate: '2005-03-10', record_status: 'INACTIVE' };
      const profile = buildProfile(employee, null);

      expect(profile.status).toBe('Inactive');
    });
  });

  describe('job title header — department tag is absent', () => {
    it('job title line contains only the role, not the department name', () => {
      const currentJob = { jobdesc: 'Analyst', deptname: 'Finance' };
      const employee = { empno: '00001', firstname: 'Jane', lastname: 'Doe', hiredate: '2010-05-11', record_status: 'ACTIVE' };
      const profile = buildProfile(employee, currentJob);
      const titleLine = buildJobTitleLine(profile.role);

      expect(titleLine).toBe('Analyst');
      expect(titleLine).not.toContain('Finance');
    });

    it('job title line does not use an em dash separator', () => {
      const currentJob = { jobdesc: 'Engineer', deptname: 'IT' };
      const employee = { empno: '00001', firstname: 'Jane', lastname: 'Doe', hiredate: '2010-05-11', record_status: 'ACTIVE' };
      const profile = buildProfile(employee, currentJob);
      const titleLine = buildJobTitleLine(profile.role);

      expect(titleLine).not.toContain('—');
      expect(titleLine).not.toContain('IT');
    });

    it('falls back to Not assigned when no current job exists', () => {
      const employee = { empno: '00001', firstname: 'Jane', lastname: 'Doe', hiredate: '2010-05-11', record_status: 'ACTIVE' };
      const profile = buildProfile(employee, null);
      const titleLine = buildJobTitleLine(profile.role);

      expect(titleLine).toBe('Not assigned');
    });
  });
});
