import { useState, useEffect } from 'react';
import { getHeadcountByDept, getSalarySummaryByJob, getEmployeeFullHistory } from '../services/reportService';
import { getEmployees } from '../services/employeeService';
import { useRights } from '../context/UserRightsContext';

/**
 * Reports Page — Analytics & Reports
 * BUG-013 FIX: All data now fetched from reportService views.
 * Previously used HEADCOUNT_DATA, SALARY_DATA, HISTORY_DATA mock constants.
 */
export default function Reports() {
  const { currentUser } = useRights();
  const [activeTab, setActiveTab] = useState('Headcount');
  const tabs = ['Headcount', 'Salary Summary', 'Employee History'];

  const [headcountData, setHeadcountData] = useState([]);
  const [salaryData, setSalaryData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmpNo, setSelectedEmpNo] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch headcount and salary on mount
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const [hcRes, salRes, empRes] = await Promise.all([
          getHeadcountByDept(),
          getSalarySummaryByJob(),
          getEmployees(currentUser?.user_type || 'USER')
        ]);
        setHeadcountData(hcRes.data || []);
        setSalaryData(salRes.data || []);
        setEmployees((empRes.data || []).filter(e => e.record_status === 'ACTIVE'));
      } catch (err) {
        console.error('Report fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser) fetchReports();
  }, [currentUser]);

  // Fetch employee history when selection changes
  useEffect(() => {
    if (!selectedEmpNo) { setHistoryData([]); return; }
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const { data } = await getEmployeeFullHistory(selectedEmpNo);
        setHistoryData(data || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchHistory();
  }, [selectedEmpNo]);

  const totalHeadcount = headcountData.reduce((sum, d) => sum + (d.headcount || d.count || 0), 0);
  const barColors = [
    { color: 'from-[#00ffcc] to-[#2E5BFF]', shadow: 'shadow-[#00ffcc]/40' },
    { color: 'from-[#B71BCF] to-[#8A3DFF]', shadow: 'shadow-[#B71BCF]/40' },
    { color: 'from-[#2E5BFF] to-[#8A3DFF]', shadow: 'shadow-[#2E5BFF]/40' },
    { color: 'from-[#45464f] to-[#8f909a]', shadow: 'shadow-zinc-500/20' },
  ];

  return (
    <div className="animate-in fade-in duration-700">
      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">
          Analytics & <span className="bg-gradient-to-r from-[#2E5BFF] to-[#00ffcc] bg-clip-text text-transparent">Reports</span>
        </h1>
        <p className="text-zinc-500 font-bold text-sm uppercase tracking-widest">Organizational Insights</p>
      </header>

      <div className="flex gap-8 border-b border-white/5 mb-8 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap ${activeTab === tab ? 'text-primary' : 'text-zinc-600 hover:text-zinc-400'}`}>
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary shadow-[0_0_10px_rgba(46,91,255,0.5)]" />}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary mx-auto"></div>
        </div>
      )}

      {/* HEADCOUNT TAB */}
      {!loading && activeTab === 'Headcount' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-right-4 duration-500">
          <div className="lg:col-span-2 bg-[#1A1A24]/60 backdrop-blur-3xl rounded-[2rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden group">
            <h2 className="text-2xl font-black text-white mb-8">Headcount Distribution</h2>
            <div className="space-y-6">
              {headcountData.length > 0 ? headcountData.map((item, idx) => {
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
          <div className="lg:col-span-1 bg-[#1A1A24]/60 backdrop-blur-3xl rounded-[2rem] p-8 border border-white/5 shadow-2xl flex flex-col">
            <h2 className="text-2xl font-black text-white mb-6">Summary</h2>
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="border-b border-white/5 text-zinc-600">
                  <th className="pb-3 text-[10px] font-black uppercase tracking-widest">Dept</th>
                  <th className="pb-3 text-[10px] font-black uppercase tracking-widest text-right">Total</th>
                  <th className="pb-3 text-[10px] font-black uppercase tracking-widest text-right">%</th>
                </tr></thead>
                <tbody className="divide-y divide-white/5 text-white font-bold text-sm">
                  {headcountData.map((item, idx) => {
                    const count = item.headcount || item.count || 0;
                    const pct = totalHeadcount > 0 ? ((count / totalHeadcount) * 100).toFixed(1) : '0';
                    return (
                      <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4">{item.dept_name || item.deptname || 'Unknown'}</td>
                        <td className="py-4 text-right font-black">{count}</td>
                        <td className="py-4 text-right text-zinc-500">{pct}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SALARY SUMMARY TAB */}
      {!loading && activeTab === 'Salary Summary' && (
        <div className="bg-[#1A1A24]/60 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/5 shadow-2xl animate-in slide-in-from-right-4 duration-500">
          <h2 className="text-2xl font-black text-white mb-8">Salary Bands Overview</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead><tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="py-4 px-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Job Description</th>
                <th className="py-4 px-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Min Salary</th>
                <th className="py-4 px-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Max Salary</th>
                <th className="py-4 px-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Avg Salary</th>
              </tr></thead>
              <tbody className="divide-y divide-white/5 font-bold text-sm text-white">
                {salaryData.length > 0 ? salaryData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-5 px-6 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-lg">work</span>
                      </div>
                      <span className="text-base">{row.job_desc || row.jobdesc || row.job_title || 'N/A'}</span>
                    </td>
                    <td className="py-5 px-6 text-zinc-400 text-right">${(row.min_salary || row.minsalary || 0).toLocaleString()}</td>
                    <td className="py-5 px-6 text-zinc-400 text-right">${(row.max_salary || row.maxsalary || 0).toLocaleString()}</td>
                    <td className="py-5 px-6 text-right">
                      <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary font-black border border-white/5">
                        ${(row.avg_salary || row.avgsalary || 0).toLocaleString()}
                      </span>
                    </td>
                  </tr>
                )) : <tr><td colSpan="4" className="py-8 text-center text-zinc-500">No salary data available.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EMPLOYEE HISTORY TAB */}
      {!loading && activeTab === 'Employee History' && (
        <div className="max-w-3xl mx-auto animate-in slide-in-from-right-4 duration-500">
          <div className="bg-[#1A1A24]/80 backdrop-blur-xl rounded-[2rem] p-4 border border-white/5 shadow-2xl flex items-center justify-between mb-10">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black">
                <span className="material-symbols-outlined">person</span>
              </div>
              <select value={selectedEmpNo} onChange={(e) => setSelectedEmpNo(e.target.value)}
                className="flex-1 bg-transparent border-none text-white font-bold text-lg outline-none appearance-none cursor-pointer">
                <option value="" className="bg-[#1A1A24]">Select an employee...</option>
                {employees.map(emp => (
                  <option key={emp.empno} value={emp.empno} className="bg-[#1A1A24]">
                    {emp.firstname} {emp.lastname} (#{emp.empno})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedEmpNo && historyData.length > 0 && (
            <div>
              <h2 className="text-[10px] font-black text-zinc-500 mb-8 tracking-[0.2em] uppercase ml-2">Career Progression Timeline</h2>
              <div className="relative border-l-2 border-white/10 ml-5 pl-8 space-y-10 pb-8">
                {historyData.map((node, idx) => (
                  <div key={idx} className="relative">
                    <div className={`absolute -left-[41px] top-4 w-4 h-4 rounded-full ring-4 ring-[#0B0B0F] ${idx === 0 ? 'bg-[#00ffcc] shadow-[0_0_15px_rgba(0,255,204,0.6)]' : 'bg-zinc-600'}`}></div>
                    <div className={`rounded-[2rem] p-6 relative overflow-hidden border ${idx === 0 ? 'bg-[#1A1A24] border-[#00ffcc]/20 shadow-2xl' : 'bg-[#1A1A24]/40 border-white/5 opacity-80'}`}>
                      {idx === 0 && <div className="absolute top-0 right-0 w-48 h-48 bg-[#00ffcc]/5 blur-3xl -z-10 rounded-full pointer-events-none"></div>}
                      <div className="flex justify-between items-start mb-4">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-md border ${idx === 0 ? 'text-[#00ffcc] bg-[#00ffcc]/10 border-[#00ffcc]/20' : 'text-zinc-500 bg-[#0B0B0F] border-white/5'}`}>
                          {node.eff_date || node.effdate || 'N/A'}
                        </span>
                        <span className={`font-black tracking-tight ${idx === 0 ? 'text-white' : 'text-zinc-400'}`}>
                          ${(node.salary || 0).toLocaleString()}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-white mb-1">{node.job_desc || node.jobdesc || node.job_title || 'N/A'}</h3>
                      <p className="text-sm font-bold text-zinc-500 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">domain</span>
                        {node.dept_name || node.deptname || 'N/A'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {selectedEmpNo && historyData.length === 0 && !loading && (
            <div className="text-center py-12"><p className="text-zinc-500 font-bold">No history records found for this employee.</p></div>
          )}
          {!selectedEmpNo && (
            <div className="text-center py-12"><p className="text-zinc-500 font-bold">Select an employee above to view their career timeline.</p></div>
          )}
        </div>
      )}
    </div>
  );
}