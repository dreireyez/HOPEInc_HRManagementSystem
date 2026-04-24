export default function DeleteConfirmDialog({ isOpen, onCancel, onConfirm, employeeName }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0B0B0F]/80 backdrop-blur-md">
      <div className="bg-[#1A1A24] border border-error/20 w-full max-w-md rounded-[2.5rem] p-10 relative overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
        {/* Glow Background */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-error/10 blur-[80px] rounded-full"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-3xl bg-error/10 border border-error/20 flex items-center justify-center text-error mb-6 shadow-[0_0_20px_rgba(255,61,188,0.2)]">
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
          </div>
          
          <h2 className="text-2xl font-black text-white mb-2">Deactivate Record?</h2>
          <p className="text-zinc-500 font-medium leading-relaxed mb-10 px-4">
            You are about to deactivate <span className="text-white font-bold">{employeeName}</span>. 
            This employee will be moved to the <span className="text-primary font-bold">Deleted Items</span> directory.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button 
              onClick={onConfirm}
              className="flex-1 py-4 bg-error text-white font-black rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-error/20"
            >
              Deactivate
            </button>
            <button 
              onClick={onCancel}
              className="flex-1 py-4 bg-white/5 text-zinc-400 font-bold rounded-2xl hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}