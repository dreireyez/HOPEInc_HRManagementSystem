import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';

// 🔧 Mock Supabase
vi.mock('../lib/supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signInWithOAuth: vi.fn(),
    },
  },
}));

// 🔧 Mock navigate
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual: any = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// ✅ Helper to wrap with Router
const renderWithRouter = (ui: React.ReactNode) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Auth Flow Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('Login success with ACTIVE user', async () => {
    const { supabase } = await import('../lib/supabaseClient');

    const mockSignIn = supabase.auth.signInWithPassword as any;

    mockSignIn.mockResolvedValue({
      data: { user: { id: '123' } },
      error: null,
    });

    renderWithRouter(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText(/name@company.com/i), {
      target: { value: 'test@gmail.com' },
    });

    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('Login fails with invalid credentials', async () => {
    const { supabase } = await import('../lib/supabaseClient');

    const mockSignIn = supabase.auth.signInWithPassword as any;

    mockSignIn.mockResolvedValue({
      data: {},
      error: { message: 'Invalid login' },
    });

    renderWithRouter(<LoginPage />);

    // ✅ FIX: Fill inputs so form submits
    fireEvent.change(screen.getByPlaceholderText(/name@company.com/i), {
      target: { value: 'wrong@gmail.com' },
    });

    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  test('Login page renders', () => {
    renderWithRouter(<LoginPage />);

    expect(
      screen.getByRole('button', { name: /login/i })
    ).toBeInTheDocument();
  });
});