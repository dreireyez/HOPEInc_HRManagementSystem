import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient'; 

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIsError(false);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        setIsError(true);
        console.error("Login Error:", error.message);
      } else if (data.user) {
        console.log("Login Success! Redirecting to Home...");
        navigate('/'); 
      }
    } catch (err) {
      setIsError(true);
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) console.error("Google Auth Error:", error.message);
  };

  return (
    <div className="bg-background text-on-background font-body min-h-screen flex items-center justify-center overflow-hidden neon-flux-bg">
      <main className="relative z-10 w-full max-w-xl px-6 py-12">
        <div className="bg-[#1E1E2E]/60 backdrop-blur-3xl rounded-xl p-8 md:p-12 shadow-2xl ring-1 ring-on-surface/5">
          <div className="flex flex-col items-center mb-10">
            <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-container to-tertiary-container shadow-lg">
              <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>fluid</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[#2E5BFF] to-[#B71BCF] bg-clip-text text-transparent">HopeHRS</h1>
            <p className="text-on-surface-variant text-sm mt-2 font-medium tracking-wide">ENTER THE FLUX</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Email Address</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-xl group-focus-within:text-primary transition-colors">alternate_email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container-highest border-none rounded-lg py-4 pl-12 pr-4 text-on-surface focus:ring-2 focus:ring-primary-container/50 transition-all duration-300"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Password</label>
              </div>
              <div className="relative group">
                <span className={`absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-xl transition-colors ${isError ? 'text-error' : 'text-outline group-focus-within:text-primary-container'}`}>lock</span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (isError) setIsError(false); }}
                  className={`w-full bg-surface-container-highest border-none rounded-lg py-4 pl-12 pr-12 text-on-surface placeholder:text-outline transition-all duration-300 ${isError ? 'ring-2 ring-error' : 'focus:ring-2 focus:ring-primary-container/50'}`}
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

              {/* ✅ FIXED ERROR MESSAGE */}
              {isError && (
                <p
                  role="alert"
                  className="text-[11px] text-error font-medium flex items-center gap-1 mt-1 ml-1"
                >
                  <span className="material-symbols-outlined text-xs">info</span>
                  Invalid email or password
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-container to-tertiary-container text-white font-bold py-4 rounded-full shadow-lg hover:opacity-90 transition-all duration-200 uppercase tracking-widest text-sm disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Login"}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-on-surface-variant text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-container font-bold hover:text-tertiary ml-1">
                Register
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}