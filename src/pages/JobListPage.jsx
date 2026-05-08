import { useState, useEffect, useCallback } from 'react';
import { useRights } from '../context/UserRightsContext';
import JobModal from '../components/modals/JobModal';
import { getJobs } from '../services/jobService';

/**
 * JobListPage — Organizational Role Management
 * Features: sortable columns (Job Code, Description).
 */
export default function JobListPage() {
  const { can, currentUser } = useRights();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [sortField, setSortField] = useState('jobCode');
  const [sortDir, setSortDir] = useState('asc');

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await getJobs(currentUser?.user_type || 'USER');
      if (fetchError) { setError(fetchError.message); }
      else { setJobs(data || []); }
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [currentUser?.user_type]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleOpenModal = (job = null) => { setEditingJob(job); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setEditingJob(null); fetchJobs(); };

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const f = (row, camel, snake) => row[camel.toLowerCase()] ?? row[camel] ?? row[snake] ?? '';

  const sorted = [...jobs].sort((a, b) => {
    let aVal = f(a, sortField, sortField);
    let bVal = f(b, sortField, sortField);
    if (typeof aVal === 'string') { aVal = aVal.toLowerCase(); bVal = (bVal || '').toLowerCase(); }
    if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ field }) => (
    <span className={`material-symbols-outlined text-[14px] ml-1 inline-block ${sortField === field ? 'text-primary' : 'text-zinc-700'}`}>
      {sortField === field ? (sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward') : 'swap_vert'}
    </span>
  );

  return (
    <div className="animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
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

      {!loading && jobs.length === 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 text-center">
          <p className="text-yellow-400 font-bold">No jobs found.</p>
        </div>
      )}

      {!loading && jobs.length > 0 && (
        <div className="bg-[#1A1A24]/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 cursor-pointer select-none" onClick={() => toggleSort('jobCode')}>
                  Job Code<SortIcon field="jobCode" />
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 cursor-pointer select-none" onClick={() => toggleSort('jobDesc')}>
                  Description<SortIcon field="jobDesc" />
                </th>
                {can('ADM_USER') && (
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#B71BCF]">Record Status</th>
                )}
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sorted.map((job) => {
                const code = f(job, 'jobCode', 'job_code');
                const desc = f(job, 'jobDesc', 'job_desc');
                return (
                  <tr key={code || job.id || desc} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-6 font-mono text-xs text-primary font-bold">{code}</td>
                  <td className="px-8 py-6 text-white font-bold text-lg">{desc}</td>
                  {can('ADM_USER') && (
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        job.record_status === 'ACTIVE' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-error/10 text-error border-error/20'
                      }`}>{job.record_status}</span>
                    </td>
                  )}
                  <td className="px-8 py-6 text-right">
                    {can('JOB_EDIT') && (
                      <button onClick={() => handleOpenModal(job)} className="p-2 text-zinc-500 hover:text-white transition-all">
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                    )}
                    {!can('JOB_EDIT') && <span className="text-[10px] text-zinc-800 font-black italic">VIEW</span>}
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
