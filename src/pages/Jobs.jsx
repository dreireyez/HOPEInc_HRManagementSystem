import { useRights } from '../context/UserRightsContext';

export default function Jobs() {
  const { can } = useRights();

  // Mock data - in Sprint 3 you'll fetch this from Supabase
  const jobs = [{ id: 1, title: 'Software Engineer', department: 'IT' }];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Job Positions</h1>
        {/* ACTION GATING: Only show Add button if user has JOB_ADD right */}
        {can('JOB_ADD') && (
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            + Add Position
          </button>
        )}
      </div>

      <div className="bg-[#1E1E2E] rounded-xl overflow-hidden border border-white/5">
        <table className="w-full text-left text-zinc-300">
          <thead className="bg-white/5 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">Job Title</th>
              <th className="px-6 py-4 font-semibold">Department</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-white/5 transition">
                <td className="px-6 py-4">{job.title}</td>
                <td className="px-6 py-4">{job.department}</td>
                <td className="px-6 py-4 text-right space-x-3">
                  {/* ACTION GATING: Edit and Delete buttons */}
                  {can('JOB_EDIT') && <button className="text-blue-400 hover:underline">Edit</button>}
                  {can('JOB_DEL') && <button className="text-red-400 hover:underline">Delete</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}