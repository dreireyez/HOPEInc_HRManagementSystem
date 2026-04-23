import { useState } from 'react';
import JobModal from '../components/modals/JobModal';

const MOCK_JOBS = [
  { code: 'H-ENG-042', desc: 'Senior Systems Architect', status: 'Active' },
  { code: 'H-DES-012', desc: 'Lead UI/UX Designer', status: 'Active' },
  { code: 'H-MKT-089', desc: 'Growth Marketing Manager', status: 'Inactive' },
];

export default function JobListPage({ userRole = 'ADMIN' }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAdmin = userRole === 'ADMIN' || userRole === 'SUPERADMIN';

  return (
    <div className="animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-white mb-2">
            Job <span className="bg-gradient-to-r from-[#2E5BFF] to-[#B71BCF] bg-clip-text text-transparent">Catalogue</span>
          </h1>
          <p className="text-zinc-500 font-bold text-sm uppercase tracking-widest">Organizational Role Management</p>
        </div>
        
        {isAdmin && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-[#2E5BFF] to-[#B71BCF] text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest shadow-xl shadow-[#2E5BFF]/20 hover:scale-105 transition-all"
          >
            Post New Job
          </button>
        )}
      </header>

      <div className="bg-[#1A1A24]/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/5 border-b border-white/5">
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Job Code</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Description</th>
              {isAdmin && <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#B71BCF]">Record Status</th>}
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {MOCK_JOBS.map((job) => (
              <tr key={job.code} className="group hover:bg-white/[0.02] transition-colors">
                <td className="px-8 py-6 font-mono text-xs text-primary font-bold">{job.code}</td>
                <td className="px-8 py-6 text-white font-bold text-lg">{job.desc}</td>
                {isAdmin && (
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${job.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-error/10 text-error border-error/20'}`}>
                      {job.status}
                    </span>
                  </td>
                )}
                <td className="px-8 py-6 text-right">
                  {isAdmin && (
                    <button className="p-2 text-zinc-500 hover:text-white transition-all"><span className="material-symbols-outlined">edit</span></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <JobModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}