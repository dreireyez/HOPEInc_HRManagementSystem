import { useState } from 'react';
import supabase from '../lib/supabaseClient';

/**
 * LoginPage
 *
 * Google OAuth SSO-only entry point for HopeHRS.
 * Email/password and self-registration are intentionally removed —
 * all accounts are provisioned by a SUPERADMIN.
 */
export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (oauthError) throw oauthError;
    } catch (err) {
      console.error('Google Auth Error:', err.message);
      setError(err.message || 'Failed to sign in with Google. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">

      {/* Background ambient gradients */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 20% 20%, rgba(17,58,91,0.13), transparent 36%),' +
            'radial-gradient(circle at 80% 80%, rgba(10,41,66,0.09), transparent 30%)',
        }}
      />

      {/* Decorative grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(17,58,91,1) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(17,58,91,1) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Login card */}
      <div
        className="relative z-10 w-full max-w-[500px] animate-in fade-in slide-in-from-bottom-4"
        style={{ animationDuration: '360ms' }}
      >
        <div className="surface-panel rounded-[var(--radius-xl)] p-12">

          {/* Brand mark */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="sidebar-brand-mark gradient-primary flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-outset-soft">
              <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                assured_workload
              </span>
            </div>

            <h1 className="font-sans font-bold tracking-tight text-2xl text-[#181c1c]">
              Hope, Inc.
            </h1>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#3f4948] mt-1.5">
              HR Management
            </p>

            <div className="mt-5 px-4 py-2 rounded-full bg-[var(--color-primary-soft)] shadow-inset">
              <p className="text-[11px] font-mono font-semibold text-[var(--color-primary-container)] tracking-wide">
                Authorized Personnel Only
              </p>
            </div>
          </div>

          {/* Error state */}
          {error && (
            <div className="mb-6 rounded-2xl bg-[var(--color-error-container)] border border-[var(--color-error)]/18 p-4 shadow-inset animate-in fade-in">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[var(--color-error)] text-[18px] mt-0.5 shrink-0">
                  error
                </span>
                <p className="text-[var(--color-on-error-container)] text-sm font-medium leading-snug">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Google SSO button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="interactive-surface w-full flex items-center justify-center gap-3 rounded-2xl px-5 py-3.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[var(--color-primary-container)] focus:outline-none transition-all duration-[var(--motion-base)]"
            aria-label="Sign in with Google"
          >
            {loading ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin text-[var(--color-on-surface-variant)]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z" />
                </svg>
                <span className="text-sm font-semibold text-[var(--color-on-surface-variant)] tracking-wide">
                  Redirecting…
                </span>
              </>
            ) : (
              <>
                {/* Official Google "G" SVG from Simple Icons */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-5 h-5 shrink-0"
                  aria-hidden="true"
                >
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="#4285F4"
                  />
                </svg>
                <span className="text-sm font-semibold text-[var(--color-on-surface)] tracking-wide">
                  Continue with Google
                </span>
              </>
            )}
          </button>

          {/* Footer note */}
          <p className="text-center mt-7 text-[11px] text-[var(--color-on-surface-variant)] font-mono leading-relaxed">
            Access is managed by your administrator.
            <br />
            Contact HR if you need an account.
          </p>
        </div>

        {/* Below-card branding tag */}
        <p className="text-center mt-5 text-[10px] font-mono text-[var(--color-outline)] uppercase tracking-[0.22em]">
          Hope, Inc. · Internal Systems
        </p>
      </div>
    </div>
  );
}
