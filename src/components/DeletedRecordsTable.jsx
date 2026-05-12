import { useState, useEffect } from 'react';
import { useRights } from '../context/UserRightsContext';
import { getEmployees, recoverEmployee } from '../services/employeeService';
import { getJobs, recoverJob } from '../services/jobService';
import { getDepts, recoverDept } from '../services/departmentService';
import { getAllJobHistory, recoverJobHistory } from '../services/jobHistoryService';

/**
 * Shared inactive-records table used by DeletedItemsPage and the Admin Panel
 * Deleted-* tabs. Lists INACTIVE rows of the chosen kind and exposes a
 * Recover button (gated by ADMIN/SUPERADMIN).
 *
 * @param {{ kind: 'employee'|'job'|'department'|'jobhistory' }} props
 */
export default function DeletedRecordsTable({ kind }) {
  const { currentUser } = useRights();
  const userId = currentUser?.userid;
  const userType = currentUser?.user_type || 'USER';
  const canRecover = userType === 'ADMIN' || userType === 'SUPERADMIN';

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInactive = async () => {
    setLoading(true);
    setError(null);
    try {
      let res;
      if (kind === 'employee') res = await getEmployees('ADMIN');
      else if (kind === 'job') res = await getJobs('ADMIN');
      else if (kind === 'department') res = await getDepts('ADMIN');
      else if (kind === 'jobhistory') res = await getAllJobHistory('ADMIN');
      const data = (res?.data || []).filter(r => r.record_status === 'INACTIVE');
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInactive(); }, [kind]);

  const handleRecover = async (item) => {
    try {
      if (kind === 'employee') await recoverEmployee(item.empno, userId);
      else if (kind === 'job') await recoverJob(item.jobcode, userId);
      else if (kind === 'department') await recoverDept(item.deptcode, userId);
      else if (kind === 'jobhistory') await recoverJobHistory(item.empno, item.jobcode, item.effdate, userId);
      fetchInactive();
    } catch (err) {
      alert('Recovery failed: ' + err.message);
    }
  };

  const label = (item) => {
    if (kind === 'employee') return `${item.firstname || ''} ${item.lastname || ''}`.trim() || item.empno;
    if (kind === 'job') return item.jobdesc || item.jobcode;
    if (kind === 'department') return item.deptname || item.deptcode;
    if (kind === 'jobhistory') return `Emp #${item.empno} - ${item.jobcode || 'N/A'}`;
    return 'Unknown';
  };

  const code = (item) => {
    if (kind === 'employee') return `#${item.empno}`;
    if (kind === 'job') return item.jobcode;
    if (kind === 'department') return item.deptcode;
    if (kind === 'jobhistory') return `${item.empno} / ${item.jobcode} / ${item.effdate}`;
    return '';
  };

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
        <p className="text-red-400 font-bold text-sm">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1A24]/40 backdrop-blur-3xl rounded-[2rem] border border-white/5 overflow-hidden">
      <div className="p-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
        <h3 className="text-base font-black text-white uppercase tracking-widest">Inactive Records</h3>
        <span className="text-[10px] font-black bg-error/10 text-error px-3 py-1 rounded-full border border-error/20">
          {items.length} Record{items.length !== 1 ? 's' : ''}
        </span>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
        </div>
      ) : (
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/5 border-b border-white/5">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Name</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Identifier</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Stamp</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {items.length > 0 ? items.map((item, idx) => (
              <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-5 text-white font-bold">{label(item)}</td>
                <td className="px-6 py-5 text-zinc-500 text-xs font-mono">{code(item)}</td>
                <td className="px-6 py-5 text-zinc-500 text-[11px] font-mono">{item.stamp || '-'}</td>
                <td className="px-6 py-5 text-right">
                  {canRecover && (
                    <button
                      onClick={() => handleRecover(item)}
                      className="bg-[#2E5BFF]/10 text-primary border border-[#2E5BFF]/20 px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-[#2E5BFF] hover:text-white transition-all"
                    >
                      <span className="material-symbols-outlined text-sm align-middle mr-2">settings_backup_restore</span>
                      Recover
                    </button>
                  )}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="px-6 py-10 text-center text-zinc-500 font-bold">
                  No inactive records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
