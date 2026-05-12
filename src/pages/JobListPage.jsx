import { useState, useEffect } from 'react';
import { useRights } from '../context/UserRightsContext';
import JobModal from '../components/modals/JobModal';
import { getJobs, softDeleteJob } from '../services/jobService';

/**
 * JobListPage — Organizational Role Management
 * Features: sortable columns (Job Code, Description).
 */
export default function JobListPage() {
  const { can, currentUser } = useRights();
  const userType = currentUser?.user_type || 'USER';
  const showStamp = userType === 'ADMIN' || userType === 'SUPERADMIN';

  const handleDelete = async (jobcode) => {
    if (!window.confirm(`Soft-delete job ${jobcode}?`)) return;
    const { error } = await softDeleteJob(jobcode, currentUser?.userid);
    if (error) alert('Failed to delete: ' + error.message);
    else fetchJobs();
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await getJobs(currentUser?.user_type || 'USER');
      if (fetchError) { setError(fetchError.message); }
      else { setJobs(data || []); }
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchJobs(); }, [currentUser?.user_type]);

  const handleOpenModal = (job = null) => { setEditingJob(job); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setEditingJob(null); fetchJobs(); };

  const filtered = jobs.filter(job => {
    if (job.record_status !== 'ACTIVE') return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (job.jobdesc || '').toLowerCase().includes(q) || (job.jobcode || '').toLowerCase().includes(q);
  });

  return (
    <div className="animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-white mb-2">
            Job <span className="bg-gradient-to-r from-[#2E5BFF] to-[#B71BCF] bg-clip-text text-transparent">Catalogue</span>
          </h1>
          <p className="text-zinc-500 font-bold text-sm uppercase tracking-widest">Organizational Role Management</p>
        </div>
        {can('JOB_ADD') && (
          <button onClick={() => handleOpenModal()}
            className="bg-gradient-to-r from-[#2E5BFF] to-[#B71BCF] text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest shadow-xl shadow-[#2E5BFF]/20 hover:scale-105 transition-all">
            Post New Job
          </button>
        )}
      </header>

      <div className="relative group mb-8 max-w-md">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary text-sm">search</span>
        <input
          type="text"
          placeholder="Search by job title..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-[#1A1A24] border border-white/5 rounded-full py-3 pl-12 pr-6 text-sm text-white outline-none placeholder:text-zinc-700 font-bold focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary mx-auto mb-4"></div>
        </div>
      )}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 mb-8">
          <p className="text-red-400 font-bold">Error: {error}</p>
        </div>
      )}

      {!loading && filtered.length === 0 && jobs.length === 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 text-center">
          <p className="text-yellow-400 font-bold">No jobs found.</p>
        </div>
      )}

      {!loading && jobs.length > 0 && (
        <div className="bg-[#1A1A24]/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Job Code</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Description</th>
                {showStamp && (
                  <th data-testid="stamp-header" className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#B71BCF]">Stamp</th>
                )}
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((job) => {
                const code = job.jobcode ?? '';
                const desc = job.jobdesc ?? '';
                return (
                <tr key={job.jobcode} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-6 font-mono text-xs text-primary font-bold">{code}</td>
                  <td className="px-8 py-6 text-white font-bold text-lg">{desc}</td>
                  {showStamp && (
                    <td data-testid="stamp-cell" className="px-8 py-6 text-zinc-500 text-[11px] font-mono">{job.stamp || '-'}</td>
                  )}
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-1">
                      {can('JOB_EDIT') && (
                        <button onClick={() => handleOpenModal(job)} className="p-2 text-zinc-500 hover:text-white transition-all">
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                      )}
                      {can('JOB_DEL') && (
                        <button onClick={() => handleDelete(job.jobcode)} className="p-2 text-error hover:text-red-300 transition-all">
                          <span className="material-symbols-outlined">delete_sweep</span>
                        </button>
                      )}
                      {!can('JOB_EDIT') && !can('JOB_DEL') && <span className="text-[10px] text-zinc-800 font-black italic">VIEW</span>}
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <JobModal isOpen={isModalOpen} onClose={handleCloseModal} initialData={editingJob} />
    </div>
  );
}