export default function JobHistoryModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0B0B0F]/90 backdrop-blur-sm animate-in fade-in duration-300">
      {/* Modal Container */}
      <div className="bg-[#1A1A24] border border-white/5 relative w-full max-w-2xl rounded-[2.5rem] overflow-hidden flex flex-col shadow-[0_40px_80px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-300">
        
        {/* Neon Glow Accents */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#2E5BFF]/10 rounded-full blur-[80px] -z-10"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#B71BCF]/10 rounded-full blur-[80px] -z-10"></div>

        {/* Modal Header */}
        <div className="px-10 pt-10 pb-6 flex justify-between items-start">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#B71BCF] font-black mb-1 block">Career Tracking</span>
            <h2 className="text-3xl font-black text-white tracking-tight">Edit Job History</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/5 transition-colors text-zinc-500 hover:text-white"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form Content */}
        <form className="px-10 pb-10 space-y-8 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Job Title Dropdown */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Job Title</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary/50 text-xl group-focus-within:text-primary transition-colors">work</span>
                <select className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-10 text-white focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none font-bold">
                  <option className="bg-[#1A1A24]">Senior Software Architect</option>
                  <option className="bg-[#1A1A24]">Product Manager</option>
                  <option className="bg-[#1A1A24]">Backend Architect</option>
                  <option className="bg-[#1A1A24]">HR Specialist</option>
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-zinc-600 pointer-events-none">expand_more</span>
              </div>
            </div>

            {/* Department Dropdown */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Department</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary/50 text-xl group-focus-within:text-primary transition-colors">corporate_fare</span>
                <select className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-10 text-white focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none font-bold">
                  <option className="bg-[#1A1A24]">Engineering</option>
                  <option className="bg-[#1A1A24]">Design & Experience</option>
                  <option className="bg-[#1A1A24]">Human Resources</option>
                  <option className="bg-[#1A1A24]">Marketing</option>
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-zinc-600 pointer-events-none">expand_more</span>
              </div>
            </div>

            {/* Effective Date */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Effective Date</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary/50 text-xl group-focus-within:text-primary transition-colors">calendar_today</span>
                <input 
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-primary/20 transition-all outline-none [color-scheme:dark] font-bold" 
                  type="date"
                />
              </div>
            </div>

            {/* Salary Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Annual Salary</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary/50 text-xl group-focus-within:text-primary transition-colors">payments</span>
                <input 
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-16 text-white placeholder:text-zinc-700 focus:ring-2 focus:ring-primary/20 transition-all outline-none font-bold" 
                  placeholder="0.00" 
                  type="text"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 text-xs font-black">USD</span>
              </div>
            </div>
          </div>

          {/* Info Alert Panel */}
          <div className="bg-[#2E5BFF]/5 p-6 rounded-3xl border border-[#2E5BFF]/10 flex gap-4 items-start">
            <span className="material-symbols-outlined text-primary">info</span>
            <div className="space-y-1">
              <p className="text-sm font-black text-white uppercase tracking-tight">System Notice</p>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                Changes to career history will trigger an audit log. Ensure the effective date aligns with the start of the next payroll cycle to prevent processing delays.
              </p>
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-10 py-8 bg-white/[0.02] border-t border-white/5 flex items-center justify-end gap-4">
          <button 
            onClick={onClose}
            className="px-8 py-3 rounded-full text-zinc-500 font-bold text-sm hover:text-white transition-all"
          >
            Cancel
          </button>
          <button className="px-10 py-3 rounded-full bg-gradient-to-r from-[#2E5BFF] to-[#B71BCF] text-white font-black text-sm shadow-xl shadow-[#8A3DFF]/20 hover:scale-105 active:scale-95 transition-all">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}