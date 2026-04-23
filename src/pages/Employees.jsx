import { useRights } from '../context/UserRightsContext';

export default function Employees() {
  const { can } = useRights();

  // Temporary mock data for testing
  const mockEmployees = [
    { id: 1, name: "Alex Rivera", role: "Software Engineer", status: "Active", stamp: "2026-04-20T10:00Z" },
    { id: 2, name: "Sam Chen", role: "Product Manager", status: "Active", stamp: "2026-04-21T14:30Z" },
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-[#2E5BFF] to-[#B71BCF] bg-clip-text text-transparent">
            Employee Management
          </h1>
          <p className="text-zinc-500 text-sm">Manage your workforce and access levels.</p>
        </div>

        {/* TASK #35: Gate the 'Add' button */}
        {can('EMP_ADD') && (
          <button className="bg-gradient-to-r from-[#2E5BFF] to-[#B71BCF] text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-[#2E5BFF]/20 flex items-center gap-2 hover:opacity-90 transition-all active:scale-95">
            <span className="material-symbols-outlined text-sm">add</span>
            Add Employee
          </button>
        )}
      </div>

      {/* Table Section */}
      <div className="bg-[#16161E]/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 text-zinc-400 text-[10px] font-black uppercase tracking-widest">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              
              {/* TASK #39: Gate the 'Stamp' column header */}
              {can('ADM_USER') && <th className="px-6 py-4">System Stamp</th>}
              
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {mockEmployees.map((emp) => (
              <tr key={emp.id} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-bold text-white">{emp.name}</td>
                <td className="px-6 py-4 text-zinc-400">{emp.role}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase">
                    {emp.status}
                  </span>
                </td>

                {/* TASK #39: Gate the 'Stamp' data cell */}
                {can('ADM_USER') && (
                  <td className="px-6 py-4 font-mono text-[10px] text-zinc-600">
                    {emp.stamp}
                  </td>
                )}

                <td className="px-6 py-4">
                  <div className="flex justify-end gap-3">
                    {/* TASK #35: Gate Edit and Delete */}
                    {can('EMP_EDIT') && (
                      <button className="p-2 rounded-lg bg-white/5 text-zinc-400 hover:text-[#2E5BFF] transition-colors">
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                    )}
                    {can('EMP_DEL') && (
                      <button className="p-2 rounded-lg bg-white/5 text-zinc-400 hover:text-red-500 transition-colors">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    )}
                    {!can('EMP_EDIT') && !can('EMP_DEL') && (
                      <span className="text-[10px] text-zinc-700 italic">View Only</span>
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