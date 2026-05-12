import { useState, useEffect } from 'react';
import { getHeadcountByDept, getSalarySummaryByJob, downloadCombinedReportsPDF } from '../services/reportService';
import { getEmployees } from '../services/employeeService';
import { useRights } from '../context/UserRightsContext';

/**
 * Unified HR Analytics page. Single stacked layout (no tabs) per spec, with one
 * combined PDF export covering Headcount, Salary Summary, and Hires Trend.
 */
export default function Reports() {
  const { currentUser } = useRights();
  const [headcountData, setHeadcountData] = useState([]);
  const [salaryData, setSalaryData] = useState([]);
  const [hiresByMonth, setHiresByMonth] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deptFilter, setDeptFilter] = useState('');

  const computeHiresByMonth = (emps) => {
    const map = {};
    emps.forEach(emp => {
      if (!emp.hiredate) return;
      const month = emp.hiredate.slice(0, 7);
      map[month] = (map[month] || 0) + 1;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => {
        const [y, m] = month.split('-');
        const label = new Date(Number(y), Number(m) - 1).toLocaleString('default', { month: 'short', year: 'numeric' });
        return { month, label, count };
      });
  };

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const [hcRes, salRes, empRes] = await Promise.all([
          getHeadcountByDept(),
          getSalarySummaryByJob(),
          getEmployees(currentUser?.user_type || 'USER'),
        ]);
        setHeadcountData(hcRes.data || []);
        setSalaryData(salRes.data || []);
        const activeEmps = (empRes.data || []).filter(e => e.record_status === 'ACTIVE');
        setHiresByMonth(computeHiresByMonth(activeEmps));
      } catch (err) {
        console.error('Report fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser) fetchReports();
  }, [currentUser]);

  const deptNames = [...new Set(headcountData.map(d => d.dept_name || d.deptname).filter(Boolean))];
  const filteredHeadcount = deptFilter
    ? headcountData.filter(d => (d.dept_name || d.deptname) === deptFilter)
    : headcountData;
  const totalHeadcount = filteredHeadcount.reduce((sum, d) => sum + (d.headcount || d.count || 0), 0);
  const maxHires = hiresByMonth.length > 0 ? Math.max(...hiresByMonth.map(h => h.count)) : 1;

  const barColors = [
    { color: 'from-[#00ffcc] to-[#2E5BFF]', shadow: 'shadow-[#00ffcc]/40' },
    { color: 'from-[#B71BCF] to-[#8A3DFF]', shadow: 'shadow-[#B71BCF]/40' },
    { color: 'from-[#2E5BFF] to-[#8A3DFF]', shadow: 'shadow-[#2E5BFF]/40' },
    { color: 'from-[#45464f] to-[#8f909a]', shadow: 'shadow-zinc-500/20' },
  ];

  const exportCombined = () => {
    downloadCombinedReportsPDF({
      headcount: filteredHeadcount.map(d => ({
        label: d.dept_name || d.deptname || 'Unknown',
        count: d.headcount || d.count || 0,
      })),
      salary: salaryData,
      hires: hiresByMonth,
    });
  };

  return (
    <div className="animate-in fade-in duration-700 space-y-10">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-2">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">
            Analytics &amp; <span className="bg-gradient-to-r from-[#2E5BFF] to-[#00ffcc] bg-clip-text text-transparent">Reports</span>
          </h1>
          <p className="text-zinc-500 font-bold text-sm uppercase tracking-widest">Organizational Insights</p>
        </div>
        <button
          onClick={exportCombined}
          disabled={loading || (filteredHeadcount.length === 0 && salaryData.length === 0 && hiresByMonth.length === 0)}
          className="flex items-center gap-2 bg-gradient-to-r from-[#2E5BFF] to-[#B71BCF] text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest shadow-xl shadow-[#2E5BFF]/20 hover:scale-105 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-base">download</span>
          Export Combined Report PDF
        </button>
      </header>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary mx-auto"></div>
        </div>
      )}

      {!loading && (
        <>
          {/* HEADCOUNT */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-black text-white">Headcount Distribution</h2>
              <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)}
                className="bg-[#1A1A24] border border-white/5 rounded-full py-2 px-4 text-sm text-white outline-none appearance-none font-bold cursor-pointer">
                <option value="">All Departments</option>
                {deptNames.map(name => <option key={name} value={name}>{name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-[#1A1A24]/60 backdrop-blur-3xl rounded-[2rem] p-8 border border-white/5 shadow-2xl">
                <div className="space-y-6">
                  {filteredHeadcount.length > 0 ? filteredHeadcount.map((item, idx) => {
                    const count = item.headcount || item.count || 0;
                    const pct = totalHeadcount > 0 ? ((count / totalHeadcount) * 100).toFixed(1) : 0;
                    const c = barColors[idx % barColors.length];
                    return (
                      <div key={item.dept_name || item.deptname || idx}>
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">
                          <span>{item.dept_name || item.deptname || 'Unknown'}</span>
                          <span className="text-white">{count} Employees</span>
                        </div>
                        <div className="h-3 w-full bg-[#0B0B0F] rounded-full overflow-hidden border border-white/5">
                          <div className={`h-full bg-gradient-to-r ${c.color} ${c.shadow} shadow-lg rounded-full`} style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  }) : <p className="text-zinc-500 font-bold">No headcount data available.</p>}
                </div>
              </div>
              <div className="lg:col-span-1 bg-[#1A1A24]/60 backdrop-blur-3xl rounded-[2rem] p-8 border border-white/5 shadow-2xl">
                <h3 className="text-base font-black text-white mb-4 uppercase tracking-widest">Summary</h3>
                <table className="w-full text-left">
                  <thead><tr className="border-b border-white/5 text-zinc-600">
                    <th className="pb-3 text-[10px] font-black uppercase tracking-widest">Dept</th>
                    <th className="pb-3 text-[10px] font-black uppercase tracking-widest text-right">Total</th>
                    <th className="pb-3 text-[10px] font-black uppercase tracking-widest text-right">%</th>
                  </tr></thead>
                  <tbody className="divide-y divide-white/5 text-white font-bold text-sm">
                    {filteredHeadcount.map((item, idx) => {
                      const count = item.headcount || item.count || 0;
                      const pct = totalHeadcount > 0 ? ((count / totalHeadcount) * 100).toFixed(1) : '0';
                      return (
                        <tr key={idx}>
                          <td className="py-3">{item.dept_name || item.deptname || 'Unknown'}</td>
                          <td className="py-3 text-right font-black">{count}</td>
                          <td className="py-3 text-right text-zinc-500">{pct}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* SALARY SUMMARY */}
          <section>
            <h2 className="text-2xl font-black text-white mb-4">Salary Bands by Job</h2>
            <div className="bg-[#1A1A24]/60 backdrop-blur-3xl rounded-[2rem] p-6 border border-white/5 shadow-2xl overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead><tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="py-4 px-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Job Description</th>
                  <th className="py-4 px-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Min</th>
                  <th className="py-4 px-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Max</th>
                  <th className="py-4 px-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Avg</th>
                </tr></thead>
                <tbody className="divide-y divide-white/5 font-bold text-sm text-white">
                  {salaryData.length > 0 ? salaryData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02]">
                      <td className="py-4 px-4">{row.job_desc || row.jobdesc || row.job_title || 'N/A'}</td>
                      <td className="py-4 px-4 text-zinc-400 text-right">${(row.min_salary || row.minsalary || 0).toLocaleString()}</td>
                      <td className="py-4 px-4 text-zinc-400 text-right">${(row.max_salary || row.maxsalary || 0).toLocaleString()}</td>
                      <td className="py-4 px-4 text-right">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary font-black border border-white/5">
                          ${(row.avg_salary || row.avgsalary || 0).toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  )) : <tr><td colSpan="4" className="py-6 text-center text-zinc-500">No salary data available.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>

          {/* HIRES TREND */}
          <section>
            <h2 className="text-2xl font-black text-white mb-4">Hires per Month</h2>
            <div className="bg-[#1A1A24]/60 backdrop-blur-3xl rounded-[2rem] p-8 border border-white/5 shadow-2xl">
              {hiresByMonth.length > 0 ? (
                <div className="flex items-end gap-3 h-64 overflow-x-auto pb-4">
                  {hiresByMonth.map((entry, idx) => {
                    const heightPct = maxHires > 0 ? (entry.count / maxHires) * 100 : 0;
                    const c = barColors[idx % barColors.length];
                    return (
                      <div key={entry.month} className="flex flex-col items-center gap-2 shrink-0" style={{ minWidth: '56px' }}>
                        <span className="text-[10px] font-black text-white">{entry.count}</span>
                        <div className="w-10 relative" style={{ height: `${Math.max(heightPct * 1.8, 8)}px` }}>
                          <div className={`absolute inset-0 bg-gradient-to-t ${c.color} rounded-lg shadow-lg ${c.shadow}`}></div>
                        </div>
                        <span className="text-[9px] font-bold text-zinc-500 text-center leading-tight">{entry.label}</span>
                      </div>
                    );
                  })}
                </div>
              ) : <p className="text-zinc-500 font-bold">No hire data available.</p>}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
