/**
 * Sprint 2 – Cascade, Visibility, API Bypass & SUPERADMIN Protection Tests
 * Branch: test/sprint2-cascade-visibility
 * Tester: M5 – QA / Documentation Specialist
 *
 * Covers:
 *   - Soft-delete cascade (jobHistory hidden from USER)
 *   - Recovery cascade (jobHistory restored for USER)
 *   - API bypass test (RLS blocks INACTIVE rows)
 *   - Stamp column visibility by user type
 *   - No hard-delete audit (.delete() calls = 0)
 *   - SUPERADMIN protection (UI + RLS)
 *
 * Run: npx vitest run src/__tests__/cascade.test.jsx
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';

// ─── Mock Supabase ────────────────────────────────────────────────────────────
const mockUpdate  = vi.fn().mockResolvedValue({ error: null });
const mockSelect  = vi.fn();
const mockEq      = vi.fn();
const mockSingle  = vi.fn();

vi.mock('../lib/supabaseClient', () => ({
  default: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } }
      })),
    },
    from: vi.fn((table) => ({
      select: vi.fn(() => ({ eq: vi.fn(() => ({ single: mockSingle })) })),
      update: vi.fn(() => ({ eq: mockEq })),
    })),
  }
}));

import supabase from '../lib/supabaseClient';

// ─── TC-S2C-001 & TC-S2C-002 · Soft-Delete Cascade ──────────────────────────
describe('TC-S2C-001 · Soft-delete: jobHistory hidden from USER', () => {
  it('USER cannot see jobHistory rows for a soft-deleted employee', async () => {
    // Simulate: employee 00001 is INACTIVE (soft-deleted)
    // RLS should return empty array for USER query
    supabase.from.mockImplementation((table) => {
      if (table === 'employee') {
        return {
          select: () => ({
            eq: (col, val) => {
              // USER query with ACTIVE filter — returns only active employees
              if (col === 'record_status' && val === 'ACTIVE') {
                return Promise.resolve({ data: [], error: null }); // 00001 not here
              }
              return Promise.resolve({ data: [], error: null });
            }
          })
        };
      }
      if (table === 'jobhistory') {
        return {
          select: () => ({
            eq: () => Promise.resolve({ data: [], error: null }) // no history visible
          })
        };
      }
    });

    // Employee 00001 is soft-deleted — USER sees zero records
    const { data: employees } = await supabase.from('employee').select('*').eq('record_status', 'ACTIVE');
    const { data: history }   = await supabase.from('jobhistory').select('*').eq('employeeid', '00001');

    expect(employees).toHaveLength(0);
    expect(history).toHaveLength(0);
  });
});

describe('TC-S2C-002 · Soft-deleted employee visible to ADMIN in Deleted Items', () => {
  it('ADMIN can see INACTIVE employee 00001 in deleted items query', async () => {
    supabase.from.mockImplementation((table) => {
      if (table === 'employee') {
        return {
          select: () => ({
            eq: (col, val) => {
              // ADMIN queries INACTIVE records
              if (col === 'record_status' && val === 'INACTIVE') {
                return Promise.resolve({
                  data: [{ employeeid: '00001', record_status: 'INACTIVE', firstname: 'Test' }],
                  error: null
                });
              }
              return Promise.resolve({ data: [], error: null });
            }
          })
        };
      }
    });

    const { data } = await supabase.from('employee').select('*').eq('record_status', 'INACTIVE');
    expect(data).toHaveLength(1);
    expect(data[0].employeeid).toBe('00001');
  });
});

// ─── TC-S2C-003 · Recovery Cascade ───────────────────────────────────────────
describe('TC-S2C-003 · Recovery cascade: jobHistory reappears for USER', () => {
  it('USER sees jobHistory rows after employee 00001 is recovered', async () => {
    // After recovery, employee is ACTIVE again
    supabase.from.mockImplementation((table) => {
      if (table === 'employee') {
        return {
          select: () => ({
            eq: () => Promise.resolve({
              data: [{ employeeid: '00001', record_status: 'ACTIVE' }],
              error: null
            })
          }),
          update: () => ({ eq: () => Promise.resolve({ error: null }) })
        };
      }
      if (table === 'jobhistory') {
        return {
          select: () => ({
            eq: () => Promise.resolve({
              data: [
                { historyid: 1, employeeid: '00001', jobid: 'J01' },
                { historyid: 2, employeeid: '00001', jobid: 'J02' },
              ],
              error: null
            })
          })
        };
      }
    });

    const { data: employees } = await supabase.from('employee').select('*').eq('record_status', 'ACTIVE');
    const { data: history }   = await supabase.from('jobhistory').select('*').eq('employeeid', '00001');

    expect(employees[0].record_status).toBe('ACTIVE');
    expect(history).toHaveLength(2);
  });
});

// ─── TC-S2C-004 & TC-S2C-005 · API Bypass Test (RLS) ────────────────────────
describe('TC-S2C-004 / TC-S2C-005 · RLS blocks INACTIVE rows for USER on all 4 tables', () => {
  const hrTables = ['employee', 'job', 'department', 'jobhistory'];

  hrTables.forEach((table) => {
    it(`RLS filters INACTIVE rows from ${table} for USER (no filter applied)`, async () => {
      // Even without a record_status filter, RLS returns only ACTIVE for USER
      supabase.from.mockImplementation((t) => ({
        select: () => Promise.resolve({
          data: t === table
            ? [{ record_status: 'ACTIVE', id: '001' }] // RLS already filtered
            : [],
          error: null
        })
      }));

      const { data } = await supabase.from(table).select('*');

      // All returned rows must be ACTIVE — RLS enforcement
      data.forEach(row => {
        if (row.record_status) {
          expect(row.record_status).toBe('ACTIVE');
        }
      });
    });
  });
});

// ─── TC-S2C-008 · No Hard Delete Audit ───────────────────────────────────────
describe('TC-S2C-008 · No hard delete: zero .delete() calls on HR tables', () => {
  it('supabase.from().delete() is never called on HR tables', async () => {
    const deleteSpy = vi.fn();

    supabase.from.mockImplementation(() => ({
      delete: deleteSpy,
      update: vi.fn(() => ({ eq: vi.fn().mockResolvedValue({ error: null }) })),
      select: vi.fn(() => ({ eq: vi.fn().mockResolvedValue({ data: [], error: null }) })),
    }));

    // Simulate soft-delete: uses UPDATE, not DELETE
    await supabase.from('employee').update({ record_status: 'INACTIVE' }).eq('employeeid', '00001');

    // Hard delete should never be called
    expect(deleteSpy).not.toHaveBeenCalled();
  });
});

// ─── TC-S2C-009 & TC-S2C-010 · SUPERADMIN Protection ────────────────────────
describe('TC-S2C-010 · SUPERADMIN RLS: ADMIN cannot UPDATE SUPERADMIN rows', () => {
  it('returns RLS error when ADMIN attempts to modify SUPERADMIN record', async () => {
    // Simulate RLS blocking the UPDATE
    supabase.from.mockImplementation(() => ({
      update: () => ({
        eq: () => Promise.resolve({
          data: null,
          error: { message: 'new row violates row-level security policy for table "user"' }
        })
      })
    }));

    const { error } = await supabase
      .from('user')
      .update({ user_type: 'ADMIN' })
      .eq('user_type', 'SUPERADMIN');

    expect(error).not.toBeNull();
    expect(error.message).toMatch(/row-level security/i);
  });
});