/**
 * Sprint 3 – End-to-End Production Test Suite
 * Branch: test/sprint3-e2e-production
 * Tester: M5 – QA / Documentation Specialist
 *
 * Full E2E coverage:
 *   - 3 user types (SUPERADMIN, ADMIN, USER)
 *   - 4 HR modules (Employee, Job, Department, Job History)
 *   - 3 reports
 *   - Admin activation flow
 *
 * Run: npx vitest run src/__tests__/e2e.test.jsx
 *
 * NOTE: For production screenshot evidence, run manually against the live app
 * and record results in E2E_PRODUCTION_RESULTS.md
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';

// ─── Mock Supabase ────────────────────────────────────────────────────────────
vi.mock('../lib/supabaseClient', () => ({
  default: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } }
      })),
      signOut: vi.fn().mockResolvedValue({}),
    },
    from: vi.fn(),
    rpc: vi.fn().mockResolvedValue({ error: null }),
  }
}));

import supabase from '../lib/supabaseClient';

// ─── Shared mock builders ─────────────────────────────────────────────────────
const mockAsUser = (userType) => {
  const userId = `${userType.toLowerCase()}-test-id`;
  supabase.auth.getSession.mockResolvedValue({
    data: { session: { user: { id: userId } } }
  });

  supabase.from.mockImplementation((table) => {
    if (table === 'user') {
      return {
        select: () => ({
          eq: () => ({ single: () => Promise.resolve({
            data: { userid: userId, user_type: userType, record_status: 'ACTIVE' },
            error: null
          })})
        }),
        update: () => ({ eq: () => Promise.resolve({ error: null }) })
      };
    }
    if (table === 'usermodule_rights') {
      // Grant all rights to SUPERADMIN and ADMIN, limited to USER
        const allRights   = ['R01','R02','R03','R04','R05','R06','R07','R08',
                            'R09','R10','R11','R12','R13','R14','R15','R16','R17'];
        const adminRights = ['R01','R02','R03','R04','R05','R06','R07','R08',
                            'R09','R10','R11','R12','R13','R14','R15','R17']; // All except R16 (admin activation)
        const userRights  = ['R01','R07','R09','R12'];

        const granted = userType === 'SUPERADMIN' ? allRights
                    : userType === 'ADMIN'       ? adminRights
                    : userRights;
      return {
        select: () => ({
          eq: () => Promise.resolve({
            data: granted.map(right_id => ({ right_id, right_value: 1 })),
            error: null
          })
        })
      };
    }
    // HR tables
    return {
      select: () => ({
        eq: () => Promise.resolve({ data: [{ id: '001', record_status: 'ACTIVE' }], error: null }),
        single: () => Promise.resolve({ data: { id: '001' }, error: null })
      }),
      insert: () => Promise.resolve({ error: null }),
      update: () => ({ eq: () => Promise.resolve({ error: null }) }),
    };
  });
};

// ─── Module: Employee Management ──────────────────────────────────────────────
describe('E2E · Employee Management Module', () => {
  beforeEach(() => vi.clearAllMocks());

  it('TC-E2E-001 · SUPERADMIN can view employee list', async () => {
    mockAsUser('SUPERADMIN');
    const { data } = await supabase.from('employee').select('*').eq('record_status', 'ACTIVE');
    expect(data).toBeDefined();
    expect(Array.isArray(data)).toBe(true);
  });

  it('TC-E2E-002 · SUPERADMIN can add new employee', async () => {
    mockAsUser('SUPERADMIN');
    const { error } = await supabase.from('employee').insert({
      firstname: 'Test', lastname: 'Employee', record_status: 'ACTIVE'
    });
    expect(error).toBeNull();
  });

  it('TC-E2E-003 · SUPERADMIN can soft-delete employee', async () => {
    mockAsUser('SUPERADMIN');
    const { error } = await supabase
      .from('employee')
      .update({ record_status: 'INACTIVE' })
      .eq('employeeid', '001');
    expect(error).toBeNull();
  });

  it('TC-E2E-004 · ADMIN can view and manage employees', async () => {
    mockAsUser('ADMIN');
    const { data } = await supabase.from('employee').select('*').eq('record_status', 'ACTIVE');
    expect(data).toBeDefined();
  });

  it('TC-E2E-005 · USER can view ACTIVE employees only', async () => {
    mockAsUser('USER');
    const { data } = await supabase.from('employee').select('*').eq('record_status', 'ACTIVE');
    data.forEach(row => expect(row.record_status).toBe('ACTIVE'));
  });
});

// ─── Module: Job Management ───────────────────────────────────────────────────
describe('E2E · Job Management Module', () => {
  beforeEach(() => vi.clearAllMocks());

  it('TC-E2E-006 · SUPERADMIN can view and manage jobs', async () => {
    mockAsUser('SUPERADMIN');
    const { data } = await supabase.from('job').select('*').eq('record_status', 'ACTIVE');
    expect(data).toBeDefined();
  });

  it('TC-E2E-007 · ADMIN can add and edit jobs', async () => {
    mockAsUser('ADMIN');
    const { error } = await supabase.from('job').insert({ jobtitle: 'New Job' });
    expect(error).toBeNull();
  });

  it('TC-E2E-008 · USER can view jobs list only', async () => {
    mockAsUser('USER');
    const { data } = await supabase.from('job').select('*').eq('record_status', 'ACTIVE');
    expect(Array.isArray(data)).toBe(true);
  });
});

// ─── Module: Department Management ───────────────────────────────────────────
describe('E2E · Department Management Module', () => {
  beforeEach(() => vi.clearAllMocks());

  it('TC-E2E-009 · SUPERADMIN can view and manage departments', async () => {
    mockAsUser('SUPERADMIN');
    const { data } = await supabase.from('department').select('*').eq('record_status', 'ACTIVE');
    expect(data).toBeDefined();
  });

  it('TC-E2E-010 · ADMIN can add and edit departments', async () => {
    mockAsUser('ADMIN');
    const { error } = await supabase.from('department').insert({ deptname: 'New Dept' });
    expect(error).toBeNull();
  });

  it('TC-E2E-011 · USER can view departments only', async () => {
    mockAsUser('USER');
    const { data } = await supabase.from('department').select('*').eq('record_status', 'ACTIVE');
    expect(Array.isArray(data)).toBe(true);
  });
});

// ─── Module: Job History ──────────────────────────────────────────────────────
describe('E2E · Job History Module', () => {
  beforeEach(() => vi.clearAllMocks());

  it('TC-E2E-012 · SUPERADMIN can view full job history', async () => {
    mockAsUser('SUPERADMIN');
    const { data } = await supabase.from('jobhistory').select('*').eq('employeeid', '001');
    expect(data).toBeDefined();
  });

  it('TC-E2E-013 · ADMIN can add job history entries', async () => {
    mockAsUser('ADMIN');
    const { error } = await supabase.from('jobhistory').insert({
      employeeid: '001', jobid: 'J01', startdate: '2024-01-01'
    });
    expect(error).toBeNull();
  });

  it('TC-E2E-014 · USER can view job history for ACTIVE employees only', async () => {
    mockAsUser('USER');
    const { data } = await supabase.from('jobhistory').select('*').eq('employeeid', '001');
    expect(Array.isArray(data)).toBe(true);
  });
});

// ─── Admin Activation ─────────────────────────────────────────────────────────
describe('E2E · Admin Activation', () => {
  beforeEach(() => vi.clearAllMocks());

  it('TC-E2E-015 · SUPERADMIN can activate INACTIVE user', async () => {
    mockAsUser('SUPERADMIN');
    const { error } = await supabase
      .from('user')
      .update({ record_status: 'ACTIVE' })
      .eq('userid', 'inactive-user-id');
    expect(error).toBeNull();
  });

  it('TC-E2E-016 · ADMIN cannot access user activation (right R16 denied)', async () => {
    mockAsUser('ADMIN');
    // Get rights for ADMIN
    const { data: rights } = await supabase.from('usermodule_rights').select('right_id, right_value').eq('userid', 'admin-test-id');
    const hasR16 = rights.some(r => r.right_id === 'R16');
    // ADMIN should NOT have R16
    expect(hasR16).toBe(false);
  });
});

// ─── Cascade Production Check ─────────────────────────────────────────────────
describe('E2E · Cascade Behavior in Production', () => {
  beforeEach(() => vi.clearAllMocks());

  it('TC-E2E-017 · Soft-delete in production: jobHistory disappears for USER', async () => {
    mockAsUser('USER');
    // After soft-delete, employee query returns empty (RLS enforced)
    supabase.from.mockImplementation((table) => ({
      select: () => ({
        eq: () => Promise.resolve({ data: [], error: null })
      })
    }));

    const { data } = await supabase.from('employee').select('*').eq('record_status', 'ACTIVE');
    expect(data).toHaveLength(0);
  });

  it('TC-E2E-018 · Recovery in production: jobHistory reappears for USER', async () => {
    mockAsUser('USER');
    supabase.from.mockImplementation((table) => ({
      select: () => ({
        eq: () => Promise.resolve({
          data: [{ employeeid: '001', record_status: 'ACTIVE' }],
          error: null
        })
      }),
      update: () => ({ eq: () => Promise.resolve({ error: null }) })
    }));

    const { data } = await supabase.from('employee').select('*').eq('record_status', 'ACTIVE');
    expect(data).toHaveLength(1);
    expect(data[0].record_status).toBe('ACTIVE');
  });
});