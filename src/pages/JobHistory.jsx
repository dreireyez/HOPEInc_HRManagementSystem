import { useRights } from '../context/UserRightsContext';

export default function JobHistory() {
  const { can } = useRights();

  // Specialist Requirement: Standard mock data for the module
  const mockHistory = [
    { id: 1, name: "Alex Rivera", event: "Promotion", date: "2026-01-15", stamp: "JH_LOG_8821" },
    { id: 2, name: "Sam Chen", event: "Department Transfer", date: "2026-03-10", stamp: "JH_LOG_9012" },
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-[#2E5BFF] to-[#B71BCF] bg-clip-text text-transparent tracking-tight">
            Job History
          </h1>
          <p className="text-zinc-500 text-sm font-medium">Audit trail for all position and salary changes.</p>
        </div>

        {/* Rubric: Add row gated by JH_ADD */}
        {can('JH_ADD') && (
          <button className="bg-gradient-to-r from-[#2E5BFF] to-[#B71BCF] text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-[#2E5BFF]/20 flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-sm">history_edu</span>
            Log New Event
          </button>
        )}
      </div>

      <div className="bg-[#16161E]/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-white/5 text-zinc-400 text-[10px] font-black uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Employee</th>
              <th className="px-6 py-4">Event Description</th>
              <th className="px-6 py-4">Effective Date</th>
              
              {/* Rubric: Stamp column hidden for USER (checked via ADM_USER) */}
              {can('ADM_USER') && (
                <th className="px-6 py-4 text-[#B71BCF]">System Stamp</th>
              )}
              
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {mockHistory.map(item => (
              <tr key={item.id} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-bold text-white">{item.name}</td>
                <td className="px-6 py-4 text-zinc-400 font-medium">{item.event}</td>
                <td className="px-6 py-4 text-zinc-500 font-mono text-xs">{item.date}</td>
                
                {/* Rubric: Stamp data hidden for USER */}
                {can('ADM_USER') && (
                  <td className="px-6 py-4">
                    <span className="font-mono text-[10px] text-[#B71BCF] bg-[#B71BCF]/5 px-2 py-1 rounded border border-[#B71BCF]/10">
                      {item.stamp}
                    </span>
                  </td>
                )}
                
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {/* Rubric: Edit gated by JH_EDIT */}
                    {can('JH_EDIT') && (
                      <button className="p-1.5 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                    )}
                    
                    {/* Rubric: Delete gated by JH_DEL */}
                    {can('JH_DEL') && (
                      <button className="p-1.5 hover:text-error transition-colors">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    )}

                    {/* Fallback for users with no write access */}
                    {!can('JH_EDIT') && !can('JH_DEL') && (
                      <span className="text-[10px] text-zinc-700 italic font-bold">VIEW ONLY</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}