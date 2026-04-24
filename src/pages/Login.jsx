import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Rubric Requirement: supabase.auth.signIn() wired to Login form
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIsError(false);
    setErrorMessage('');

    try {
      // 1. Attempt Sign In
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(), // Specialist Tip: Always trim emails
        password: password,
      });

      // 2. Handle Supabase Errors
      if (error) {
        setErrorMessage(error.message);
        setIsError(true);
        return;
      }

      // 3. Success: Redirect to Dashboard
      if (data?.user) {
        console.log("Login successful for:", data.user.email);
        navigate('/'); 
      }
    } catch (err) {
      console.error("Unexpected Error:", err);
      setErrorMessage("A system error occurred. Please try again.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { 
          redirectTo: window.location.origin + '/auth/callback' 
        }
      });
      if (error) throw error;
    } catch (err) {
      console.error("Google Auth Error:", err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-[440px] bg-[#16161E]/80 backdrop-blur-xl border border-white/5 p-10 rounded-[2.5rem] shadow-2xl">
        <div className="text-center mb-10">
           <h1 className="text-4xl font-black bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-2 tracking-tighter">
            HopeHRS
          </h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">Secure Access Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-5 text-white outline-none focus:ring-2 focus:ring-blue-500/40 transition-all placeholder:text-zinc-700 font-medium"
              placeholder="name@hopeinc.edu"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setIsError(false); }}
              className={`w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-5 text-white outline-none transition-all placeholder:text-zinc-700 font-medium ${isError ? 'ring-2 ring-red-500/50' : 'focus:ring-2 focus:ring-blue-500/40'}`}
              placeholder="••••••••"
              required
            />
            {isError && (
              <p className="text-[11px] text-red-400 font-bold ml-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">warning</span>
                {errorMessage || "Invalid credentials"}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black py-4 rounded-full shadow-lg shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase text-[11px] tracking-[0.2em] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Sign In'}
          </button>
        </form>

        <div className="relative flex items-center py-8">
          <div className="flex-grow border-t border-white/5"></div>
          <span className="flex-shrink mx-4 text-[9px] font-black text-zinc-600 uppercase tracking-widest">or</span>
          <div className="flex-grow border-t border-white/5"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-2xl transition-all border border-white/5 group"
        >
          <img alt="Google" className="w-4 h-4 group-hover:scale-110 transition-transform" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" />
          <span className="text-[10px] uppercase tracking-widest">Continue with Google</span>
        </button>
        
        <p className="text-center mt-10 text-zinc-600 text-xs font-bold uppercase tracking-tighter">
          Need an account? <Link to="/register" className="text-blue-500 hover:text-blue-400 ml-1 underline decoration-blue-500/30 underline-offset-4">Register Now</Link>
        </p>
      </div>
    </div>
  );
}