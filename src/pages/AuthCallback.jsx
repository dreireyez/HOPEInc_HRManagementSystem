import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * AuthCallback
 *
 * Landing page for Google OAuth redirect. Waits for the auth session
 * to resolve, then navigates to the dashboard or back to login on failure.
 * Renders a minimal on-brand spinner while resolving.
 */
export default function AuthCallback() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (loading) return;
      if (user) navigate('/');
      else navigate('/login?error=auth_failed');
    };
    handleAuthCallback();
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface)]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-[3px] border-[var(--color-outline-variant)]/40 border-t-[var(--color-primary-container)] animate-spin" />
        </div>
        <p className="text-[10px] font-mono font-bold uppercase tracking-[0.26em] text-[var(--color-on-surface-variant)] animate-pulse">
          Signing in…
        </p>
      </div>
    </div>
  );
}
