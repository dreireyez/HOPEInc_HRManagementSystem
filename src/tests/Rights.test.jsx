/**
 * Sprint 1 – Auth Flow Tests
 * Branch: test/auth-Test-Cases
 * Tester: M5 – QA / Documentation Specialist
 *
 * Run: ./node_modules/.bin/vitest run src/tests/Auth.test.jsx
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';

// ─── Mock Supabase ────────────────────────────────────────────────────────────
vi.mock('../lib/supabaseClient', () => {
  const mockSingle     = vi.fn();
  const mockSignOut    = vi.fn().mockResolvedValue({});
  const mockRpc        = vi.fn().mockResolvedValue({ error: null });
  const mockGetSession = vi.fn();

  return {
    default: {
      auth: {
        getSession: mockGetSession,
        onAuthStateChange: vi.fn(() => ({
          data: { subscription: { unsubscribe: vi.fn() } }
        })),
        signOut: mockSignOut,
      },
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: mockSingle
          }))
        }))
      })),
      rpc: mockRpc,
      _mocks: { mockSingle, mockSignOut, mockRpc, mockGetSession }
    }
  };
});

import { AuthProvider, useAuth } from '../context/AuthContext';
import supabase from '../lib/supabaseClient';

// ─── Helper to access mocks ───────────────────────────────────────────────────
const getMocks = () => supabase._mocks;

// ─── Consumer component ───────────────────────────────────────────────────────
const AuthConsumer = () => {
  const { user, loading } = useAuth();
  if (loading) return <div>loading</div>;
  return <div data-testid="user">{user ? user.id : 'null'}</div>;
};

const renderAuth = () =>
  render(
    <AuthProvider>
      <AuthConsumer />
    </AuthProvider>
  );

// ─── TC-S1-005 / TC-S1-006 · ACTIVE user login ───────────────────────────────
describe('TC-S1-005 / TC-S1-006 · ACTIVE user can log in', () => {
  beforeEach(() => vi.clearAllMocks());

  it('sets user state when record_status is ACTIVE', async () => {
    const { mockSingle, mockSignOut, mockGetSession } = getMocks();
    const fakeUser = { id: 'user-active-123' };

    mockGetSession.mockResolvedValue({
      data: { session: { user: fakeUser } }
    });
    mockSingle.mockResolvedValue({
      data: { record_status: 'ACTIVE' },
      error: null
    });

    renderAuth();

    await waitFor(() =>
      expect(screen.getByTestId('user').textContent).toBe('user-active-123')
    );

    expect(mockSignOut).not.toHaveBeenCalled();
  });
});

// ─── TC-S1-007 / TC-S1-008 · INACTIVE user blocked ───────────────────────────
describe('TC-S1-007 / TC-S1-008 · INACTIVE user is blocked', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls signOut and shows alert when record_status is INACTIVE', async () => {
    const { mockSingle, mockSignOut, mockGetSession } = getMocks();
    const fakeUser = { id: 'user-inactive-456' };

    mockGetSession.mockResolvedValue({
      data: { session: { user: fakeUser } }
    });
    mockSingle.mockResolvedValue({
      data: { record_status: 'INACTIVE' },
      error: null
    });

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    renderAuth();

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('user').textContent).toBe('null');
    });

    expect(alertSpy).toHaveBeenCalledWith(
      'Your account is pending activation by an administrator.'
    );

    alertSpy.mockRestore();
  });
});

// ─── TC-S1-009 · New user provisioned ────────────────────────────────────────
describe('TC-S1-009 · New user without DB row gets provisioned', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls provision_new_user() when no user row found, then blocks if INACTIVE', async () => {
    const { mockSingle, mockSignOut, mockRpc, mockGetSession } = getMocks();
    const fakeUser = { id: 'user-new-789' };

    mockGetSession.mockResolvedValue({
      data: { session: { user: fakeUser } }
    });

    mockSingle
      .mockResolvedValueOnce({ data: null, error: { message: 'not found' } })
      .mockResolvedValueOnce({ data: { record_status: 'INACTIVE' }, error: null });

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    renderAuth();

    await waitFor(() => {
      expect(mockRpc).toHaveBeenCalledWith('provision_new_user');
      expect(mockSignOut).toHaveBeenCalled();
    });

    alertSpy.mockRestore();
  });
});

// ─── TC-S1-011 · No session = no user ────────────────────────────────────────
describe('TC-S1-011 · Unauthenticated user has no session', () => {
  beforeEach(() => vi.clearAllMocks());

  it('sets user to null when session is null', async () => {
    const { mockGetSession } = getMocks();

    mockGetSession.mockResolvedValue({
      data: { session: null }
    });

    renderAuth();

    await waitFor(() =>
      expect(screen.getByTestId('user').textContent).toBe('null')
    );
  });
});

// ─── TC-S1-010 · Loading state ───────────────────────────────────────────────
describe('TC-S1-010 · Loading state shown during auth resolution', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders loading screen before auth resolves', () => {
    const { mockGetSession } = getMocks();

    // Never resolves → stays in AuthProvider loading state
    mockGetSession.mockReturnValue(new Promise(() => {}));

    renderAuth();

    // FIX: match actual UI ("Synchronizing...")
    expect(screen.getByText(/synchronizing/i)).toBeInTheDocument();
  });
});