import { useRights } from '../context/UserRightsContext';

export default function Departments() {
  const { can } = useRights();
  const departments = [{ id: 1, name: 'Human Resources', head: 'Jane Doe' }];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Departments</h1>
        {/* ACTION GATING: DEPT_ADD */}
        {can('DEPT_ADD') && (
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
            + Add Department
          </button>
        )}
      </div>

      <div className="bg-[#1E1E2E] rounded-xl overflow-hidden border border-white/5">
        <table className="w-full text-left text-zinc-300">
          <thead className="bg-white/5 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">Department Name</th>
              <th className="px-6 py-4 font-semibold">Head of Dept</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {departments.map((dept) => (
              <tr key={dept.id} className="hover:bg-white/5 transition">
                <td className="px-6 py-4">{dept.name}</td>
                <td className="px-6 py-4">{dept.head}</td>
                <td className="px-6 py-4 text-right space-x-3">
                  {/* ACTION GATING: DEPT_EDIT and DEPT_DEL */}
                  {can('DEPT_EDIT') && <button className="text-purple-400 hover:underline">Edit</button>}
                  {can('DEPT_DEL') && <button className="text-red-400 hover:underline">Delete</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}