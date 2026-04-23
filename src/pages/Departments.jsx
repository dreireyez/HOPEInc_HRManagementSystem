import { useRights } from '../context/UserRightsContext';

export default function Departments() {
  const { can } = useRights();

  const mockDepts = [
    { id: 1, name: "Engineering", head: "Dr. Victor Stone", count: 42, stamp: "UNIT_DEPT_ENG" },
    { id: 2, name: "Operations", head: "Elena Fisher", count: 18, stamp: "UNIT_DEPT_OPS" },
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-[#2E5BFF] to-[#B71BCF] bg-clip-text text-transparent">Organizational Units</h1>
          <p className="text-zinc-500 text-sm">Manage company departments and leadership.</p>
        </div>
        {can('DEPT_ADD') && (
          <button className="bg-gradient-to-r from-[#2E5BFF] to-[#B71BCF] text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-[#2E5BFF]/20 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">corporate_fare</span>
            New Department
          </button>
        )}
      </div>

      <div className="bg-[#16161E]/50 border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-zinc-400 text-[10px] font-black uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Department Name</th>
              <th className="px-6 py-4">Dept. Head</th>
              <th className="px-6 py-4">Headcount</th>
              {can('ADM_USER') && <th className="px-6 py-4">Ref Code</th>}
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {mockDepts.map(dept => (
              <tr key={dept.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                <td className="px-6 py-4 font-bold text-white">{dept.name}</td>
                <td className="px-6 py-4 text-zinc-400">{dept.head}</td>
                <td className="px-6 py-4 text-zinc-400">{dept.count} members</td>
                {can('ADM_USER') && (
                  <td className="px-6 py-4 font-mono text-[10px] text-zinc-600">{dept.stamp}</td>
                )}
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {can('DEPT_EDIT') && <button className="p-1.5 hover:text-[#2E5BFF]"><span className="material-symbols-outlined text-lg">edit</span></button>}
                    {can('DEPT_DEL') && <button className="p-1.5 hover:text-red-500"><span className="material-symbols-outlined text-lg">delete_sweep</span></button>}
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