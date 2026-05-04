import { useState, useEffect } from 'react';

export default function SystemStates() {
  const [showToast, setShowToast] = useState(true);

  // Auto-hide toast after 5 seconds for demonstration purposes
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <div className="animate-in fade-in duration-700 relative">
      
      {/* --- ERROR STATE: FLOATING TOAST --- */}
      {showToast && (
        <div className="fixed top-4 left-4 right-4 md:top-24 md:left-auto md:right-8 z-50 animate-in slide-in-from-top-8 fade-in duration-500">
          <div className="bg-[#1A1A24]/90 backdrop-blur-2xl border border-error/30 rounded-2xl p-4 flex items-start gap-4 shadow-[0_0_30px_rgba(255,180,171,0.15)] max-w-sm mx-auto md:mx-0">
            <div className="bg-error/10 p-2 rounded-full mt-0.5 border border-error/20">
              <span className="material-symbols-outlined text-error text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-black text-error uppercase tracking-widest mb-1">Connection Failed</h4>
              <p className="text-xs font-bold text-error/70 leading-relaxed">Unable to sync payroll data. Retrying connection in 5 seconds...</p>
            </div>
            <button onClick={() => setShowToast(false)} className="text-error/50 hover:text-error transition-colors">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        </div>
      )}

      {/* --- PAGE HEADER --- */}
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">
          Global UI <span className="bg-gradient-to-r from-[#2E5BFF] to-[#B71BCF] bg-clip-text text-transparent">States</span>
        </h1>
        <p className="text-zinc-500 font-bold text-sm uppercase tracking-widest">Component Behavior Showcase</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* --- LOADING STATES --- */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-primary">hourglass_empty</span>
            <h3 className="text-xl font-black text-white tracking-tight">Loading States</h3>
          </div>

          {/* Skeleton Profile Card */}
          <div className="bg-[#1A1A24]/40 backdrop-blur-3xl rounded-[2rem] p-8 border border-white/5 flex flex-col items-center gap-6 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent w-[200%] animate-[shimmer_2s_infinite] -z-10"></div>
            
            <div className="w-24 h-24 rounded-full bg-white/5 animate-pulse border-2 border-white/10"></div>
            <div className="w-full flex flex-col items-center gap-3">
              <div className="h-5 w-1/2 bg-white/5 rounded-full animate-pulse"></div>
              <div className="h-3 w-1/3 bg-white/5 rounded-full animate-pulse opacity-50"></div>
            </div>
            <div className="w-full flex justify-center gap-4 mt-2 pt-6 border-t border-white/5">
              <div className="h-10 w-24 bg-white/5 rounded-full animate-pulse"></div>
              <div className="h-10 w-24 bg-white/5 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Skeleton Data Table */}
          <div className="bg-[#1A1A24]/40 backdrop-blur-3xl rounded-[2rem] p-6 border border-white/5 shadow-2xl space-y-4">
            <div className="flex justify-between items-center mb-4 px-2">
              <div className="h-5 w-32 bg-white/5 rounded-full animate-pulse"></div>
              <div className="h-6 w-20 bg-white/5 rounded-full animate-pulse"></div>
            </div>
            
            {/* Skeleton Rows */}
            {[1, 2, 3].map((row, i) => (
              <div key={row} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex items-center gap-4" style={{ opacity: 1 - (i * 0.2) }}>
                <div className="w-10 h-10 rounded-xl bg-white/5 animate-pulse shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 bg-white/5 rounded-full animate-pulse"></div>
                  <div className="h-3 w-1/4 bg-white/5 rounded-full animate-pulse opacity-50"></div>
                </div>
                <div className="h-6 w-16 bg-white/5 rounded-full animate-pulse shrink-0"></div>
              </div>
            ))}
          </div>
        </section>

        {/* --- EMPTY STATE --- */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-[#B71BCF]">inbox</span>
            <h3 className="text-xl font-black text-white tracking-tight">Empty State</h3>
          </div>

          <div className="bg-[#1A1A24]/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 p-12 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden min-h-[500px]">
            
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#2E5BFF]/10 rounded-full blur-[80px] pointer-events-none"></div>
            
            {/* Glassmorphic Illustration */}
            <div className="relative w-32 h-32 mb-8 animate-in zoom-in-75 duration-1000">
              {/* Magnifying Glass Ring */}
              <div className="absolute top-0 left-0 w-24 h-24 rounded-full border border-white/10 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-xl shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] z-10 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-zinc-600">search_off</span>
              </div>
              {/* Handle */}
              <div className="absolute bottom-2 right-2 w-14 h-5 bg-gradient-to-r from-zinc-700 to-zinc-900 rotate-45 rounded-full shadow-lg border border-white/5"></div>
              {/* Floating Accents */}
              <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-[#B71BCF]/40 blur-[1px] animate-pulse"></div>
              <div className="absolute bottom-10 left-0 w-2 h-2 rounded-full bg-[#00ffcc]/40 blur-[1px] animate-pulse delay-75"></div>
            </div>

            <h4 className="text-2xl font-black text-white mb-2 tracking-tight">No records found</h4>
            <p className="text-sm font-bold text-zinc-500 max-w-xs mb-8 leading-relaxed">
              We couldn't find any data matching your current parameters. Try adjusting your search filters.
            </p>
            
            <button className="px-8 py-3 rounded-full bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-colors active:scale-95">
              Clear Filters
            </button>
          </div>
        </section>

      </div>
      
      {/* Toast trigger button (for testing) */}
      {!showToast && (
        <button 
          onClick={() => setShowToast(true)}
          className="fixed bottom-8 right-8 md:bottom-12 md:right-12 bg-surface-container-highest border border-white/10 text-zinc-400 p-4 rounded-full hover:text-white transition-colors shadow-2xl z-50"
          title="Trigger Error Toast"
        >
          <span className="material-symbols-outlined">refresh</span>
        </button>
      )}

      {/* Global CSS for the shimmer effect */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(50%); }
        }
      `}} />
    </div>
  );
}