export default function AddEmployeeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-[#0B0B0F]/80 backdrop-blur-sm overflow-y-auto">
      {/* Modal Container */}
      <div className="bg-[#1A1A24] border border-white/5 relative w-full max-w-2xl rounded-[2.5rem] overflow-hidden flex flex-col shadow-[0_40px_80px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-300">
        
        {/* Background Decorative Liquid Elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#2E5BFF]/10 rounded-full blur-[80px] -z-10 pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#B71BCF]/10 rounded-full blur-[80px] -z-10 pointer-events-none"></div>

        {/* Modal Header */}
        <div className="px-8 pt-10 pb-6 flex justify-between items-start">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#B71BCF] font-black mb-1 block">Staff Management</span>
            <h2 className="text-3xl font-black text-white tracking-tight">Add New Employee</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/5 transition-colors text-zinc-500 hover:text-white"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Modal Content (Form) */}
        <div className="px-8 pb-10 space-y-8 overflow-y-auto max-h-[70vh]">
          
          {/* Section: Personal Identity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Employee No</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary/50 text-xl group-focus-within:text-primary transition-colors">fingerprint</span>
                <input 
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-700 focus:ring-2 focus:ring-primary/20 transition-all outline-none font-bold" 
                  placeholder="EMP-2026-001" 
                  type="text"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Gender</label>
              <div className="flex gap-2 p-1 bg-white/[0.03] border border-white/5 rounded-2xl">
                {['Male', 'Female', 'Other'].map((g) => (
                  <button key={g} className="flex-1 py-3 rounded-xl text-zinc-500 text-xs font-black hover:text-white hover:bg-white/5 transition-all uppercase tracking-tighter">
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section: Full Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Full Name</label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary/50 text-xl group-focus-within:text-primary transition-colors">person</span>
              <input 
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-700 focus:ring-2 focus:ring-primary/20 transition-all outline-none font-bold" 
                placeholder="Enter complete legal name" 
                type="text"
              />
            </div>
          </div>

          {/* Section: Roles & Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Job Designation</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary/50 text-xl group-focus-within:text-primary transition-colors">work</span>
                <select className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-10 text-white focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none font-bold">
                  <option className="bg-[#1A1A24]">Software Engineer</option>
                  <option className="bg-[#1A1A24]">HR Specialist</option>
                  <option className="bg-[#1A1A24]">Product Manager</option>
                  <option className="bg-[#1A1A24]">UX Designer</option>
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-zinc-600 pointer-events-none">expand_more</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Joining Date</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary/50 text-xl group-focus-within:text-primary transition-colors">calendar_today</span>
                <input 
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-primary/20 transition-all outline-none [color-scheme:dark] font-bold" 
                  type="date"
                />
              </div>
            </div>
          </div>

          {/* Section: Advanced */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Birth Date</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary/50 text-xl group-focus-within:text-primary transition-colors">cake</span>
                <input 
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-primary/20 transition-all outline-none [color-scheme:dark] font-bold" 
                  type="date"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Department</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary/50 text-xl group-focus-within:text-primary transition-colors">domain</span>
                <select className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-10 text-white focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none font-bold">
                  <option className="bg-[#1A1A24]">Technology</option>
                  <option className="bg-[#1A1A24]">Operations</option>
                  <option className="bg-[#1A1A24]">Human Resources</option>
                  <option className="bg-[#1A1A24]">Sales & Marketing</option>
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-zinc-600 pointer-events-none">expand_more</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-8 py-8 bg-white/[0.02] backdrop-blur-md flex items-center justify-end gap-4 border-t border-white/5">
          <button 
            onClick={onClose}
            className="px-8 py-3 rounded-full text-zinc-400 font-bold text-sm hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
          <button className="px-10 py-3 rounded-full bg-gradient-to-r from-[#2E5BFF] to-[#B71BCF] text-white font-black text-sm shadow-xl shadow-[#8A3DFF]/20 hover:scale-105 active:scale-95 transition-all">
            Create Profile
          </button>
        </div>
      </div>
    </div>
  );
}