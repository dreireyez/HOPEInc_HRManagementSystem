import { useState, useEffect } from 'react';
import JobHistoryModal from './modals/JobHistoryModal';
import { getJobHistory } from '../services/jobHistoryService';
import { useRights } from '../context/UserRightsContext';

export default function JobHistoryPanel({ empNo }) {
  const { can, currentUser } = useRights();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch job history when empNo changes
  useEffect(() => {
    const fetchHistory = async () => {
      if (!empNo) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const { data, error: fetchError } = await getJobHistory(empNo, currentUser?.user_type || 'USER');
        
        if (fetchError) {
          setError(fetchError.message);
        } else {
          setHistory(data || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [empNo, currentUser?.user_type]);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between px-4">
        <div>
          <h3 className="text-2xl font-black text-white">Job History</h3>
          <p className="text-sm text-zinc-500 font-bold uppercase tracking-tighter">Career progression & compensation</p>
        </div>
        
        {/* GATING: JH_ADD */}
        {can('JH_ADD') && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/20 text-primary font-black text-xs hover:bg-primary hover:text-white transition-all"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Add Record
          </button>
        )}
      </div>

      <div className="bg-[#1A1A24]/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 overflow-hidden">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary mx-auto mb-3"></div>
              <p className="text-zinc-500 text-sm">Loading job history...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-8 bg-red-500/10 border-t border-red-500/20">
            <p className="text-red-400 font-bold text-sm">Error loading job history: {error}</p>
          </div>
        )}

        {!loading && !error && history.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-zinc-500 font-bold">No job history records found.</p>
          </div>
        )}

        {!loading && !error && history.length > 0 && (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Job Code</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Department</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Effective Date</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Salary</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {history.map((row, idx) => (
                <tr key={`${row.empNo}-${row.jobCode}-${row.effDate}`} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-6">
                    <div className="font-bold text-white text-base">{row.jobCode}</div>
                    {idx === 0 && <p className="text-[9px] text-primary font-black uppercase tracking-widest">Current</p>}
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-zinc-400">{row.deptCode || 'N/A'}</td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-white">{row.effDate ? new Date(row.effDate).toLocaleDateString() : 'N/A'}</p>
                  </td>
                  <td className="px-8 py-6 font-bold text-white">${row.salary ? row.salary.toLocaleString() : '0'}</td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Rubric: Edit gated by JH_EDIT */}
                      {can('JH_EDIT') && (
                        <button className="p-2 text-primary hover:bg-primary/10 rounded-xl transition-all"><span className="material-symbols-outlined">edit</span></button>
                      )}
                      {/* Rubric: Delete gated by JH_DEL */}
                      {can('JH_DEL') && (
                        <button className="p-2 text-error hover:bg-error/10 rounded-xl transition-all"><span className="material-symbols-outlined">delete</span></button>
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
        )}
      </div>

      <JobHistoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}