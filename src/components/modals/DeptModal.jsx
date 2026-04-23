export default function DeptModal({ isOpen, onClose, initialData = null }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0B0B0F]/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#1A1A24] border border-white/5 relative w-full max-w-lg rounded-[2.5rem] overflow-hidden flex flex-col shadow-[0_40px_80px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-300">
        
        {/* Modal Header */}
        <div className="px-8 pt-10 pb-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              {initialData ? 'Edit Department' : 'New Department'}
            </h2>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Structural Metadata // HopeHRS</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-zinc-500 hover:text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form className="p-8 space-y-8">
          {/* Dept Code */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Dept Code</label>
            <div className="relative">
              <input 
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-primary/20 transition-all font-bold placeholder-zinc-700 outline-none" 
                placeholder="e.g. ENG-01"
                defaultValue={initialData?.code}
              />
              <span className="material-symbols-outlined absolute right-6 top-1/2 -translate-y-1/2 text-zinc-600">pin</span>
            </div>
            <p className="text-[9px] text-zinc-600 font-bold italic ml-1 underline decoration-primary/30 underline-offset-4">Unique identifier for payroll and API mapping.</p>
          </div>

          {/* Dept Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Dept Name</label>
            <div className="relative">
              <input 
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-primary/20 transition-all font-bold placeholder-zinc-700 outline-none" 
                placeholder="Engineering & Development"
                defaultValue={initialData?.name}
              />
              <span className="material-symbols-outlined absolute right-6 top-1/2 -translate-y-1/2 text-zinc-600">corporate_fare</span>
            </div>
          </div>

          {/* Brand Mapping */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Brand Mapping</label>
            <div className="flex gap-4 p-2 bg-white/[0.02] border border-white/5 rounded-full w-fit">
              {['#2E5BFF', '#B71BCF', '#7bd0ff', '#FF3DBC'].map((color, i) => (
                <button 
                  key={color} 
                  type="button"
                  className={`w-8 h-8 rounded-full transition-transform hover:scale-110 active:scale-90 ${i === 0 ? 'ring-4 ring-primary/20 border-2 border-white' : ''}`}
                  style={{ backgroundColor: color }}
                ></button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-white/5 text-zinc-500 hover:text-white transition-all"
            >
              Discard
            </button>
            <button 
              type="submit"
              className="flex-1 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-gradient-to-r from-[#2E5BFF] to-[#B71BCF] text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
            >
              Update Unit
            </button>
          </div>
        </form>
        
        {/* Bottom Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#2E5BFF] via-[#8A3DFF] to-[#B71BCF] opacity-50"></div>
      </div>
    </div>
  );
}