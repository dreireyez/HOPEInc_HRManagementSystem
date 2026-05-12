import { useState, useEffect } from 'react';
import { useRights } from '../context/UserRightsContext';
import { getAllJobHistory } from '../services/jobHistoryService';

/**
 * JobHistory Page — Audit trail for all position and salary changes.
 * Supports both camelCase and snake_case column names from Supabase.
 */
export default function JobHistory() {
  const { can, currentUser } = useRights();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('eff_date');
  const [sortDir, setSortDir] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchErr } = await getAllJobHistory(currentUser?.user_type || 'USER');
        if (fetchErr) { setError(fetchErr.message); }
        else { setHistory(data || []); }
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    };
    if (currentUser) fetchAll();
  }, [currentUser]);

  // Helper to read fields supporting both camelCase and snake_case
  const f = (row, camel, snake) => row[camel] ?? row[snake] ?? '';

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const filtered = history
    .filter(item => {
      if (statusFilter !== 'ALL' && item.record_status !== statusFilter) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      const empNo = String(f(item, 'empNo', 'emp_no'));
      const jobCode = f(item, 'jobCode', 'job_code').toLowerCase();
      const deptCode = f(item, 'deptCode', 'dept_code').toLowerCase();
      return empNo.includes(q) || jobCode.includes(q) || deptCode.includes(q);
    })
    .sort((a, b) => {
      let aVal = f(a, sortField, sortField);
      let bVal = f(b, sortField, sortField);
      if (sortField === 'salary') { aVal = Number(aVal) || 0; bVal = Number(bVal) || 0; }
      else { aVal = String(aVal); bVal = String(bVal); }
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
    <div className="p-8 space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-[#2E5BFF] to-[#B71BCF] bg-clip-text text-transparent tracking-tight">Job History</h1>
          <p className="text-zinc-500 text-sm font-medium">Audit trail for all position and salary changes.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 text-sm">search</span>
            <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="bg-[#1A1A24] border border-white/5 rounded-full py-2.5 pl-10 pr-4 text-sm text-white outline-none w-48 placeholder:text-zinc-700 font-bold" />
          </div>
          {can('ADM_USER') && (
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="bg-[#1A1A24] border border-white/5 rounded-full py-2.5 px-4 text-sm text-white outline-none appearance-none font-bold">
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          )}
        </div>
      </div>

      {loading && <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div></div>}
      {error && <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6"><p className="text-red-400 font-bold text-sm">Error: {error}</p></div>}

      {!loading && !error && (
        <div className="bg-[#16161E]/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/5 text-zinc-400 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4 cursor-pointer select-none" onClick={() => toggleSort('emp_no')}>Employee No<SortIcon field="emp_no" /></th>
                <th className="px-6 py-4 cursor-pointer select-none" onClick={() => toggleSort('job_code')}>Job Code<SortIcon field="job_code" /></th>
                <th className="px-6 py-4 cursor-pointer select-none" onClick={() => toggleSort('dept_code')}>Dept Code<SortIcon field="dept_code" /></th>
                <th className="px-6 py-4 cursor-pointer select-none" onClick={() => toggleSort('eff_date')}>Effective Date<SortIcon field="eff_date" /></th>
                <th className="px-6 py-4 cursor-pointer select-none" onClick={() => toggleSort('salary')}>Salary<SortIcon field="salary" /></th>
                {can('ADM_USER') && <th className="px-6 py-4 text-[#B71BCF]">Status</th>}
              </tr>
            </thead>
            <tbody className="text-sm">
              {filtered.length > 0 ? filtered.map((item, idx) => (
                <tr key={item.id || idx} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-primary font-bold">#{f(item, 'empNo', 'emp_no')}</td>
                  <td className="px-6 py-4 font-bold text-white">{f(item, 'jobCode', 'job_code') || 'N/A'}</td>
                  <td className="px-6 py-4 text-zinc-400 font-medium">{f(item, 'deptCode', 'dept_code') || 'N/A'}</td>
                  <td className="px-6 py-4 text-zinc-500 font-mono text-xs">
                    {(f(item, 'effDate', 'eff_date')) ? new Date(f(item, 'effDate', 'eff_date')).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 font-bold text-white">${item.salary ? Number(item.salary).toLocaleString() : '0'}</td>
                  {can('ADM_USER') && (
                    <td className="px-6 py-4">
                      <span className={`font-mono text-[10px] px-2 py-1 rounded border ${
                        item.record_status === 'ACTIVE' ? 'text-green-400 bg-green-400/5 border-green-400/20' : 'text-red-400 bg-red-400/5 border-red-400/20'
                      }`}>{item.record_status}</span>
                    </td>
                  )}
                </tr>
              )) : (
                <tr><td colSpan="6" className="px-6 py-12 text-center text-zinc-500 font-bold">No job history records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}