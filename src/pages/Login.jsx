import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from "../lib/supabaseClient"; // Make sure this path is correct!

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIsError(false);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setIsError(true);
      setLoading(false);
    } else {
      // Success! Standard auth guard handles the redirect
      navigate('/employees');
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // This MUST match what you put in Google Cloud Console
        redirectTo: 'http://localhost:5173/auth/callback', 
      },
    });

    if (error) {
      console.error("Google Auth Error:", error.message);
      setIsError(true);
    }
  };

  return (
    <div className="bg-background text-on-background font-body min-h-screen flex items-center justify-center overflow-hidden neon-flux-bg">
      
      {/* Decorative Background Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-primary-container/20 blur-[120px] rounded-full z-0 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-tertiary-container/10 blur-[150px] rounded-full z-0 pointer-events-none"></div>

      <main className="relative z-10 w-full max-w-xl px-6 py-12">
        <div className="bg-[#1E1E2E]/60 backdrop-blur-3xl rounded-xl p-8 md:p-12 shadow-2xl ring-1 ring-on-surface/5">
          
          <div className="flex flex-col items-center mb-10">
            <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-container to-tertiary-container shadow-lg">
              <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                fluid
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[#2E5BFF] to-[#B71BCF] bg-clip-text text-transparent">
              HopeHRS
            </h1>
            <p className="text-on-surface-variant text-sm mt-2 font-medium tracking-wide">ENTER THE FLUX</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                Email Address
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-xl group-focus-within:text-primary transition-colors">
                  alternate_email
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container-highest border-none rounded-lg py-4 pl-12 pr-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary-container/50 transition-all duration-300"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  Password
                </label>
                <Link to="/forgot-password" size="text-[10px]" className="font-bold text-primary-container hover:text-tertiary transition-colors uppercase tracking-wider">
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <span className={`absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-xl transition-colors ${isError ? 'text-error' : 'text-outline group-focus-within:text-primary-container'}`}>
                  lock
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (isError) setIsError(false);
                  }}
                  className={`w-full bg-surface-container-highest border-none rounded-lg py-4 pl-12 pr-12 text-on-surface placeholder:text-outline transition-all duration-300 ${
                    isError 
                      ? 'ring-2 ring-error shadow-[0_0_15px_rgba(255,180,171,0.3)] focus:ring-error' 
                      : 'focus:ring-2 focus:ring-primary-container/50'
                  }`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline hover:text-on-surface transition-colors"
                >
                  {showPassword ? "visibility" : "visibility_off"}
                </button>
              </div>
              
              {isError && (
                <p className="text-[11px] text-error font-medium flex items-center gap-1 mt-1 ml-1">
                  <span className="material-symbols-outlined text-xs">info</span>
                  Invalid credentials. Please try again.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-container to-tertiary-container text-white font-bold py-4 rounded-full shadow-lg shadow-primary-container/20 hover:opacity-90 active:scale-[0.98] transition-all duration-200 uppercase tracking-widest text-sm disabled:opacity-50"
            >
              {loading ? "Processing..." : "Login"}
            </button>

            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-outline-variant/20"></div>
              <span className="flex-shrink mx-4 text-[10px] font-bold text-outline uppercase tracking-[0.2em]">or continue with</span>
              <div className="flex-grow border-t border-outline-variant/20"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 bg-surface-variant/50 hover:bg-surface-variant text-on-surface font-semibold py-4 rounded-lg transition-colors border border-outline-variant/10"
            >
              <img
                alt="Google Logo"
                className="w-5 h-5"
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              />
              <span className="text-sm tracking-tight">Sign in with Google</span>
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-on-surface-variant text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-container font-bold hover:text-tertiary transition-colors ml-1">
                Register
              </Link>
            </p>
          </div>
        </div>

        <footer className="mt-12 text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-outline">
            © 2026 Hope, Inc. All rights reserved.
          </p>
          <div className="flex justify-center gap-6 mt-4">
            <Link to="/privacy" className="text-[10px] text-outline hover:text-on-surface transition-colors uppercase tracking-widest">Privacy</Link>
            <Link to="/terms" className="text-[10px] text-outline hover:text-on-surface transition-colors uppercase tracking-widest">Terms</Link>
            <Link to="/support" className="text-[10px] text-outline hover:text-on-surface transition-colors uppercase tracking-widest">Support</Link>
          </div>
        </footer>
      </main>

      <div className="hidden lg:block fixed left-12 top-1/2 -translate-y-1/2 space-y-8 pointer-events-none">
        <div className="w-px h-32 bg-gradient-to-b from-transparent via-primary-container to-transparent opacity-30"></div>
        <div className="text-[10px] [writing-mode:vertical-lr] text-outline-variant tracking-[0.5em] font-bold uppercase">System Integrity: Nominal</div>
        <div className="w-px h-32 bg-gradient-to-b from-transparent via-tertiary-container to-transparent opacity-30"></div>
      </div>
    </div>
  );
}