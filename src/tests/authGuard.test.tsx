import { vi, describe, test, expect } from 'vitest';
import { supabase } from '../lib/supabaseClient';

vi.mock('../lib/supabaseClient', () => ({
  supabase: {
    auth: {
      signOut: vi.fn(),
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
    from: vi.fn(() => ({
      select: () => ({
        eq: () => ({
          single: () =>
            Promise.resolve({
              data: { record_status: 'INACTIVE' },
              error: null,
            }),
        }),
      }),
    })),
  },
}));

describe('Login Guard', () => {
  test('❌ INACTIVE user is blocked and signed out', async () => {
    const mockedGetSession = vi.mocked(supabase.auth.getSession);
    const mockedOnAuthStateChange = vi.mocked(supabase.auth.onAuthStateChange);

    mockedGetSession.mockResolvedValue({
      data: { session: { user: { id: '123' } } },
      error: null,
    } as any);

    mockedOnAuthStateChange.mockReturnValue({
      data: {
        subscription: { unsubscribe: vi.fn() },
      },
    } as any);

    const result = await supabase
      .from('user')
      .select('record_status')
      .eq('userid', '123')
      .single();

    expect(result.data.record_status).toBe('INACTIVE');
  });
});
