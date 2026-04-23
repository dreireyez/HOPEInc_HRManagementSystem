export default function JobModal({ isOpen, onClose, initialData = null }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0B0B0F]/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#1A1A24] border border-white/5 relative w-full max-w-2xl rounded-[2.5rem] overflow-hidden flex flex-col shadow-[0_40px_80px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-300">
        
        {/* Decorative Neon Orbs */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#2E5BFF]/10 rounded-full blur-[80px] -z-10"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#B71BCF]/10 rounded-full blur-[80px] -z-10"></div>

        {/* Modal Header */}
        <div className="px-10 pt-10 pb-6 flex justify-between items-start">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#2E5BFF] font-black mb-1 block">Architecture Config</span>
            <h2 className="text-3xl font-black text-white tracking-tight">
              {initialData ? 'Edit Job Identity' : 'Create Job Identity'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-zinc-500 hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="px-10 pb-10 space-y-8 overflow-y-auto max-h-[70vh]">
          {/* Job Code */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-2">Job Code</label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary/50 text-xl group-focus-within:text-primary transition-colors">fingerprint</span>
              <input 
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-white placeholder:text-zinc-700 focus:ring-2 focus:ring-primary/20 transition-all outline-none font-bold" 
                placeholder="e.g. ENG-PLAT-001" 
                defaultValue={initialData?.code}
              />
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-2">Job Description</label>
            <textarea 
              rows="4"
              className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-6 text-white placeholder:text-zinc-700 focus:ring-2 focus:ring-primary/20 transition-all outline-none font-bold resize-none" 
              placeholder="Describe the essence of this role..."
              defaultValue={initialData?.desc}
            />
          </div>

          {/* Record Status Toggle */}
          <div className="flex items-center justify-between p-6 rounded-[2rem] bg-white/[0.02] border border-white/5">
            <div>
              <p className="font-black text-white text-sm uppercase tracking-tight">Record Status</p>
              <p className="text-xs text-zinc-500 font-medium">Toggle visibility for recruitment pipelines.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-14 h-7 bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#2E5BFF] peer-checked:to-[#B71BCF]"></div>
            </label>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-10 py-8 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
          <button onClick={onClose} className="text-zinc-500 font-black text-xs uppercase tracking-widest hover:text-white transition-all">
            Discard Changes
          </button>
          <button className="px-10 py-4 rounded-full bg-gradient-to-r from-[#2E5BFF] to-[#B71BCF] text-white font-black text-xs uppercase tracking-[0.15em] flex items-center gap-2 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
            Generate Identity
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
          </button>
        </div>
      </div>
    </div>
  );
}