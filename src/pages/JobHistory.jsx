import { useRights } from '../context/UserRightsContext';
import { useAuth } from '../context/AuthContext'; // Added for identity check

export default function JobHistory() {
  const { can } = useRights();
  const { user } = useAuth(); // Get the current logged-in user

  const mockHistory = [
    { id: 1, name: "Alex Rivera", event: "Promotion", date: "2026-01-15", stamp: "JH_LOG_8821", userId: "ALEX_ID_123" },
    { id: 2, name: "Sam Chen", event: "Department Transfer", date: "2026-03-10", stamp: "JH_LOG_9012", userId: "SAM_ID_456" },
    // Adding a record for 'you' to test the filter
    { id: 3, name: "Current User", event: "System Access", date: "2026-04-23", stamp: "JH_LOG_9999", userId: user?.id },
  ];

  // PRIVACY FILTER: If user is Admin (JH_VIEW_ALL), show everything.
  // Otherwise, only show records where userId matches the logged-in user's ID.
  const filteredHistory = can('JH_VIEW_ALL') 
    ? mockHistory 
    : mockHistory.filter(item => item.userId === user?.id);

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-[#2E5BFF] to-[#B71BCF] bg-clip-text text-transparent">Job History</h1>
          <p className="text-zinc-500 text-sm">Audit trail for all position and salary changes.</p>
        </div>
        {can('JH_ADD') && (
          <button className="bg-gradient-to-r from-[#2E5BFF] to-[#B71BCF] text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-[#2E5BFF]/20 flex items-center gap-2 hover:opacity-90 transition-all">
            <span className="material-symbols-outlined text-sm">history_edu</span>
            Log New Event
          </button>
        )}
      </div>

      <div className="bg-[#16161E]/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-zinc-400 text-[10px] font-black uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Employee</th>
              <th className="px-6 py-4">Event Description</th>
              <th className="px-6 py-4">Effective Date</th>
              {can('ADM_USER') && <th className="px-6 py-4">System Stamp</th>}
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredHistory.map(item => (
              <tr key={item.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                <td className="px-6 py-4 font-bold text-white">{item.name}</td>
                <td className="px-6 py-4 text-zinc-400">{item.event}</td>
                <td className="px-6 py-4 text-zinc-400">{item.date}</td>
                {can('ADM_USER') && (
                  <td className="px-6 py-4 font-mono text-[10px] text-zinc-600">{item.stamp}</td>
                )}
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {can('JH_EDIT') && <button className="p-1.5 hover:text-[#2E5BFF] transition-colors"><span className="material-symbols-outlined text-lg">edit</span></button>}
                    {can('JH_DEL') && <button className="p-1.5 hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-lg">delete</span></button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredHistory.length === 0 && (
          <div className="p-12 text-center text-zinc-600 italic text-sm">No personal history records found.</div>
        )}
      </div>
    </div>
  );
}