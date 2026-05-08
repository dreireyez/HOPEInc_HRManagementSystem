import { useState, useEffect, useCallback } from 'react';
import { useRights } from '../context/UserRightsContext';
import { getEmployees, recoverEmployee } from '../services/employeeService';
import { getJobs, recoverJob } from '../services/jobService';
import { getDepts, recoverDept } from '../services/departmentService';
import { getAllJobHistory, recoverJobHistory } from '../services/jobHistoryService';

/**
 * DeletedItemsPage — Recovery Vault
 * BUG-014 FIX: Fetches real INACTIVE records from Supabase.
 * Recover buttons now call the appropriate recover service functions.
 * Previously displayed a single hardcoded mock row.
 */
export default function DeletedItemsPage() {
  const { currentUser } = useRights();
  const userRole = currentUser?.user_type || 'USER';
  const [activeTab, setActiveTab] = useState('Employees');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const tabs = ['Employees', 'Job History', 'Jobs', 'Departments'];

  const fetchInactiveItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data = [];
      if (activeTab === 'Employees') {
        const res = await getEmployees('ADMIN');
        data = (res.data || []).filter(r => r.record_status === 'INACTIVE');
      } else if (activeTab === 'Jobs') {
        const res = await getJobs('ADMIN');
        data = (res.data || []).filter(r => r.record_status === 'INACTIVE');
      } else if (activeTab === 'Departments') {
        const res = await getDepts('ADMIN');
        data = (res.data || []).filter(r => r.record_status === 'INACTIVE');
      } else if (activeTab === 'Job History') {
        const res = await getAllJobHistory('ADMIN');
        data = (res.data || []).filter(r => r.record_status === 'INACTIVE');
      }
      setItems(data);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [activeTab]);

  useEffect(() => {
    if (userRole !== 'USER') {
      fetchInactiveItems();
    }
  }, [fetchInactiveItems, userRole]);

  const handleRecover = async (item) => {
    try {
      if (activeTab === 'Employees') await recoverEmployee(item.empno);
      else if (activeTab === 'Jobs') await recoverJob(item.jobCode);
      else if (activeTab === 'Departments') await recoverDept(item.deptCode);
      else if (activeTab === 'Job History') await recoverJobHistory(item.id);
      fetchInactiveItems();
    } catch (err) { alert('Recovery failed: ' + err.message); }
  };

  const getItemLabel = (item) => {
    if (activeTab === 'Employees') return `${item.firstname || ''} ${item.lastname || ''}`.trim() || item.empno;
    if (activeTab === 'Jobs') return item.jobDesc || item.jobCode;
    if (activeTab === 'Departments') return item.deptName || item.deptCode;
    if (activeTab === 'Job History') return `Emp #${item.emp_no} — ${item.jobCode || 'N/A'}`;
    return 'Unknown';
  };

  const getItemCode = (item) => {
    if (activeTab === 'Employees') return `#${item.empno}`;
    if (activeTab === 'Jobs') return item.jobCode;
    if (activeTab === 'Departments') return item.deptCode;
    if (activeTab === 'Job History') return `ID: ${item.id}`;
    return '';
  };

  if (userRole === 'USER') {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center">
        <span className="material-symbols-outlined text-6xl text-error mb-4">shield_person</span>
        <h2 className="text-2xl font-black text-white">Access Restricted</h2>
        <p className="text-zinc-500 font-bold max-w-xs">Only Administrators can access the Recovery Vault.</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Recovery Vault</h1>
        <p className="text-zinc-500 font-bold text-sm uppercase tracking-widest">Restore inactive or soft-deleted records</p>
      </header>

      <div className="flex gap-8 border-b border-white/5 mb-8 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === tab ? 'text-primary' : 'text-zinc-600 hover:text-zinc-400'}`}>
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary shadow-[0_0_10px_rgba(46,91,255,0.5)]" />}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 mb-8">
          <p className="text-red-400 font-bold text-sm">Error: {error}</p>
        </div>
      )}

      <div className="bg-[#1A1A24]/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
          <h3 className="text-lg font-black text-white">Archived {activeTab}</h3>
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
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Record Name/Code</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Identifier</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {items.length > 0 ? items.map((item, idx) => (
                <tr key={idx} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-6">
                    <div className="font-bold text-white">{getItemLabel(item)}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-[10px] text-zinc-500 font-black uppercase">{getItemCode(item)}</div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button onClick={() => handleRecover(item)}
                      className="bg-[#2E5BFF]/10 text-primary border border-[#2E5BFF]/20 px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-[#2E5BFF] hover:text-white transition-all">
                      <span className="material-symbols-outlined text-sm align-middle mr-2">settings_backup_restore</span>
                      Recover
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="3" className="px-8 py-12 text-center text-zinc-500 font-bold">
                    No inactive {activeTab.toLowerCase()} found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
