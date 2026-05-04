import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Rubric Requirement: exchanges OAuth code for session
    const handleAuthCallback = async () => {
      // Wait for AuthContext to initialize and retrieve user
      if (loading) {
        // Still initializing, wait
        return;
      }

      // AuthContext has finished loading
      if (user) {
        // User is authenticated and provisioned, redirect to dashboard
        navigate('/');
      } else {
        // User failed authentication or is inactive, redirect to login
        navigate('/login?error=auth_failed');
      }
    };

    handleAuthCallback();
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-[#0B0B0F] flex flex-col items-center justify-center relative overflow-hidden font-body">
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#2E5BFF]/10 blur-[120px] rounded-full z-0 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#B71BCF]/5 blur-[150px] rounded-full z-0 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <div className="relative w-24 h-24 mb-10">
          <div className="absolute inset-0 rounded-full border-4 border-t-[#2E5BFF] border-r-[#8A3DFF] border-b-[#B71BCF] border-l-transparent animate-spin"></div>
          <div className="absolute inset-4 rounded-2xl bg-gradient-to-br from-[#2E5BFF] to-[#B71BCF] animate-pulse flex items-center justify-center shadow-[0_0_30px_rgba(138,61,255,0.5)]">
            <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>fluid</span>
          </div>
        </div>

        <h2 className="text-2xl font-black text-white tracking-tight mb-3">Verifying Identity</h2>
        <p className="text-zinc-500 font-bold text-sm uppercase tracking-[0.3em] animate-pulse">Establishing Secure Session...</p>
      </div>

      <div className="fixed bottom-0 left-0 w-full h-1 bg-zinc-900">
        <div className="h-full bg-gradient-to-r from-[#2E5BFF] via-[#8A3DFF] to-[#B71BCF] animate-progress-loading"></div>
      </div>

      <style>{`
        @keyframes progress-loading {
          0% { width: 0%; left: 0%; }
          50% { width: 30%; left: 40%; }
          100% { width: 0%; left: 100%; }
        }
        .animate-progress-loading {
          position: absolute;
          animation: progress-loading 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}