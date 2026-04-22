import { useRights } from '../context/UserRightsContext';

export default function Jobs() {
  const { can } = useRights();

  const mockJobs = [
    { id: 1, title: "Senior Software Engineer", level: "L5", salary: "$145,000", stamp: "JOB_SPEC_V1" },
    { id: 2, title: "HR Business Partner", level: "L4", salary: "$95,000", stamp: "JOB_SPEC_V3" },
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-[#2E5BFF] to-[#B71BCF] bg-clip-text text-transparent">Job Definitions</h1>
          <p className="text-zinc-500 text-sm">Define roles, salary bands, and job levels.</p>
        </div>
        {can('JOB_ADD') && (
          <button className="bg-white/5 border border-white/10 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-white/10 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">work</span>
            Create Job Type
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockJobs.map(job => (
          <div key={job.id} className="bg-[#16161E]/50 p-6 rounded-2xl border border-white/5 group hover:border-[#2E5BFF]/30 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-white">{job.title}</h3>
                <span className="text-xs font-black text-[#2E5BFF] uppercase tracking-widest">{job.level}</span>
              </div>
              <div className="flex gap-1">
                {can('JOB_EDIT') && <button className="p-2 text-zinc-600 hover:text-white"><span className="material-symbols-outlined text-lg">edit</span></button>}
                {can('JOB_DEL') && <button className="p-2 text-zinc-600 hover:text-red-500"><span className="material-symbols-outlined text-lg">delete</span></button>}
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-xl font-mono text-white/90">{job.salary}</span>
              {can('ADM_USER') && <span className="text-[9px] font-mono text-zinc-700 uppercase tracking-tighter">{job.stamp}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}