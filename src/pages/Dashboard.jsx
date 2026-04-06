export default function Dashboard() {
  return (
    <div className="animate-in fade-in duration-700">
      <header className="mb-10">
        <h1 className="text-4xl font-black tracking-tight text-white mb-2 drop-shadow-sm">Systems Overview</h1>
        <p className="text-zinc-400 max-w-2xl font-semibold opacity-80">Welcome back, Alex. Monitoring real-time HopeHRS ecosystem vitals.</p>
      </header>

      {/* BENTO GRID: With Neon Accents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: "Total Workforce", val: "1,284", sub: "+12%", icon: "badge", color: "from-[#2E5BFF] to-[#00C2FF]", glow: "shadow-[#2E5BFF]/20" },
          { label: "Recruitment", val: "42", sub: "8 Urgent", icon: "work", color: "from-[#B71BCF] to-[#FF3DBC]", glow: "shadow-[#B71BCF]/20" },
          { label: "Data Pipeline", val: "156", sub: "Pending", icon: "history", color: "from-[#8A3DFF] to-[#B71BCF]", glow: "shadow-[#8A3DFF]/20" },
          { label: "Structure", val: "14", sub: "Global", icon: "domain", color: "from-zinc-400 to-white", glow: "shadow-white/5" }
        ].map((card, i) => (
          <div key={i} className={`bg-[#1A1A24]/60 backdrop-blur-md border border-white/10 p-8 rounded-3xl relative overflow-hidden group hover:border-white/30 transition-all hover:-translate-y-1 shadow-xl ${card.glow}`}>
            {/* Corner Glow */}
            <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${card.color} opacity-10 blur-2xl rounded-full`}></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-lg`}>
                  <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>{card.icon}</span>
                </div>
                <span className="text-zinc-400 font-black uppercase text-[10px] tracking-[0.2em]">{card.label}</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-black text-white">{card.val}</span>
                <span className="text-transparent bg-gradient-to-r from-white to-zinc-500 bg-clip-text font-bold text-xs mb-1.5 opacity-60">{card.sub}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* RECENT ACTIVITY: Tinted container */}
        <div className="col-span-12 lg:col-span-8 bg-[#1A1A24]/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-black text-white tracking-tight">Recent Activity</h3>
            <button className="text-[#2E5BFF] text-[10px] font-black uppercase tracking-[0.3em] hover:text-[#B71BCF] transition-colors">Full Directory →</button>
          </div>
          <div className="space-y-5">
            {[
              { name: "Sarah Jenkins", role: "Promoted to Senior UX Architect", status: "PROMOTED", glow: "shadow-[#2E5BFF]/40", bg: "bg-[#2E5BFF]" },
              { name: "Marcus Chen", role: "Joined as Lead DevOps Engineer", status: "ONBOARDING", glow: "shadow-[#B71BCF]/40", bg: "bg-[#B71BCF]" },
              { name: "Elena Rodriguez", role: "Updated Personal Records", status: "UPDATED", glow: "shadow-[#8A3DFF]/40", bg: "bg-[#8A3DFF]" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-6 p-5 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.07] transition-all group">
                <div className={`w-14 h-14 rounded-full overflow-hidden shrink-0 ring-2 ring-white/10 group-hover:ring-offset-2 group-hover:ring-offset-[#0B0B0F] group-hover:ring-white/40 transition-all ${item.glow}`}>
                   <img src={`http://googleusercontent.com/profile/picture/${i+1}`} className="w-full h-full object-cover" alt={item.name}/>
                </div>
                <div className="flex-grow">
                  <h4 className="font-bold text-white text-lg tracking-tight">{item.name}</h4>
                  <p className="text-sm text-zinc-500 font-semibold">{item.role}</p>
                </div>
                <span className={`${item.bg} text-white px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase shadow-lg animate-pulse`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* TALENT GROWTH & ACTION */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
          <div className="bg-[#1A1A24]/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 flex-grow shadow-2xl">
            <h3 className="text-xl font-black text-white mb-8 tracking-tight">Talent Growth</h3>
            <div className="space-y-8">
              {[
                { label: "Engineering", value: 85, color: "from-[#2E5BFF] to-[#00C2FF]" },
                { label: "Design & UX", value: 60, color: "from-[#B71BCF] to-[#FF3DBC]" },
                { label: "Sales & Marketing", value: 92, color: "from-[#8A3DFF] to-[#B71BCF]" }
              ].map((bar, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[11px] font-black mb-3">
                    <span className="text-zinc-500 uppercase tracking-[0.2em]">{bar.label}</span>
                    <span className="text-white">{bar.value}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/5">
                    <div className={`h-full rounded-full bg-gradient-to-r ${bar.color} shadow-[0_0_10px_rgba(46,91,255,0.3)]`} style={{ width: `${bar.value}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button className="bg-gradient-to-r from-[#2E5BFF] via-[#8A3DFF] to-[#B71BCF] text-white p-7 rounded-[2rem] flex items-center justify-between group shadow-[0_20px_40px_rgba(138,61,255,0.4)] hover:shadow-[0_25px_50px_rgba(138,61,255,0.6)] hover:-translate-y-1 active:translate-y-0.5 transition-all">
            <span className="font-black text-xl tracking-tight">Add New Employee</span>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-90 transition-transform">
              <span className="material-symbols-outlined text-2xl">add</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}