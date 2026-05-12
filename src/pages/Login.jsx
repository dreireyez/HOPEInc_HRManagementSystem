import { useState } from 'react';
import supabase from '../lib/supabaseClient';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/auth/callback'
        }
      });
      if (error) throw error;
    } catch (err) {
      console.error('Google Auth Error:', err.message);
      setErrorMessage(err.message || 'Failed to sign in with Google. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-[440px] bg-[#16161E]/80 backdrop-blur-xl border border-white/5 p-10 rounded-[2.5rem] shadow-2xl">
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2E5BFF] to-[#B71BCF] flex items-center justify-center shadow-lg mx-auto mb-6">
            <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>fluid</span>
          </div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-2 tracking-tighter">
            HopeHRS
          </h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">Secure Access Portal</p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
            <span className="material-symbols-outlined text-red-400 text-lg shrink-0">warning</span>
            <p className="text-red-400 text-sm font-bold">{errorMessage}</p>
          </div>
        )}

        <div className="space-y-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-2xl transition-all border border-white/10 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
            ) : (
              <img alt="Google" className="w-5 h-5 group-hover:scale-110 transition-transform" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" />
            )}
            <span className="text-[11px] uppercase tracking-widest font-black">
              {loading ? 'Redirecting...' : 'Continue with Google'}
            </span>
          </button>
        </div>

        <p className="text-center mt-10 text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
          Access is granted by a system administrator
        </p>
      </div>
    </div>
  );
}
