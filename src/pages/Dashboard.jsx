import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEmployees } from '../services/employeeService';
import { getDepts } from '../services/departmentService';
import { getJobs } from '../services/jobService';
import { useRights } from '../context/UserRightsContext';

/**
 * Dashboard — Systems Overview
 * BUG-012 FIX: All metrics now fetched from Supabase via service layer.
 */
export default function Dashboard() {
  const { currentUser } = useRights();
  const navigate = useNavigate();
  const userType = currentUser?.user_type || 'USER';
  const [stats, setStats] = useState({ employees: 0, jobs: 0, departments: 0 });
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const [empRes, jobRes, deptRes] = await Promise.all([
          getEmployees(userType), getJobs(userType), getDepts(userType)
        ]);
        const employees = (empRes.data || []).filter(e => e.record_status === 'ACTIVE');
        setStats({
          employees: employees.length,
          jobs: (jobRes.data || []).filter(j => j.record_status === 'ACTIVE').length,
          departments: (deptRes.data || []).filter(d => d.record_status === 'ACTIVE').length
        });
        const sorted = [...employees].filter(e => e.hiredate)
          .sort((a, b) => new Date(b.hiredate) - new Date(a.hiredate)).slice(0, 3);
        setRecentEmployees(sorted);
      } catch (err) { console.error('Dashboard fetch error:', err); }
      finally { setLoading(false); }
    };
    if (currentUser) fetch();
  }, [currentUser, userType]);

  const statCards = [
    { label: "Active Workforce", val: stats.employees.toLocaleString(), sub: "Employees", icon: "badge", color: "from-[#2E5BFF] to-[#00C2FF]", glow: "shadow-[#2E5BFF]/20" },
    { label: "Job Roles", val: stats.jobs.toString(), sub: "Active", icon: "work", color: "from-[#B71BCF] to-[#FF3DBC]", glow: "shadow-[#B71BCF]/20" },
    { label: "Departments", val: stats.departments.toString(), sub: "Units", icon: "domain", color: "from-zinc-400 to-white", glow: "shadow-white/5" }
  ];

  return (
    <div className="animate-in fade-in duration-700">
      <header className="mb-10">
        <h1 className="text-4xl font-black tracking-tight text-white mb-2">Systems Overview</h1>
        <p className="text-zinc-400 max-w-2xl font-semibold opacity-80">Real-time HopeHRS ecosystem vitals.</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {statCards.map((card, i) => (
          <div key={i} className={`bg-[#1A1A24]/60 backdrop-blur-md border border-white/10 p-8 rounded-3xl relative overflow-hidden group hover:border-white/30 transition-all hover:-translate-y-1 shadow-xl ${card.glow}`}>
            <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${card.color} opacity-10 blur-2xl rounded-full`}></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-lg`}>
                  <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>{card.icon}</span>
                </div>
                <span className="text-zinc-400 font-black uppercase text-[10px] tracking-[0.2em]">{card.label}</span>
              </div>
              <div className="flex items-end gap-2">
                {loading ? <div className="h-10 w-20 bg-white/5 rounded-xl animate-pulse"></div>
                  : <span className="text-4xl font-black text-white">{card.val}</span>}
                <span className="text-transparent bg-gradient-to-r from-white to-zinc-500 bg-clip-text font-bold text-xs mb-1.5 opacity-60">{card.sub}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 bg-[#1A1A24]/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-black text-white tracking-tight">Recent Hires</h3>
            <button onClick={() => navigate('/employees')} className="text-[#2E5BFF] text-[10px] font-black uppercase tracking-[0.3em] hover:text-[#B71BCF] transition-colors">Full Directory →</button>
          </div>
          <div className="space-y-5">
            {loading ? [1,2,3].map(i => (
              <div key={i} className="flex items-center gap-6 p-5 rounded-3xl bg-white/[0.03] border border-white/5">
                <div className="w-14 h-14 rounded-full bg-white/5 animate-pulse shrink-0"></div>
                <div className="flex-1 space-y-2"><div className="h-5 w-1/3 bg-white/5 rounded-full animate-pulse"></div><div className="h-3 w-1/4 bg-white/5 rounded-full animate-pulse"></div></div>
              </div>
            )) : recentEmployees.length > 0 ? recentEmployees.map((emp, i) => {
              const colors = [{glow:"shadow-[#2E5BFF]/40",bg:"bg-[#2E5BFF]"},{glow:"shadow-[#B71BCF]/40",bg:"bg-[#B71BCF]"},{glow:"shadow-[#8A3DFF]/40",bg:"bg-[#8A3DFF]"}];
              const c = colors[i % 3];
              const initials = `${(emp.firstname||'')[0]||''}${(emp.lastname||'')[0]||''}`.toUpperCase();
              return (
                <div key={emp.empno} onClick={() => navigate(`/employees/${emp.empno}`)} className="flex items-center gap-6 p-5 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.07] transition-all group cursor-pointer">
                  <div className={`w-14 h-14 rounded-full shrink-0 ring-2 ring-white/10 ${c.glow} ${c.bg} flex items-center justify-center text-white font-black text-lg`}>{initials}</div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-white text-lg tracking-tight">{emp.firstname} {emp.lastname}</h4>
                    <p className="text-sm text-zinc-500 font-semibold">{emp.job_title || 'No title'} — {emp.dept || 'Unassigned'}</p>
                  </div>
                  <span className={`${c.bg} text-white px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase shadow-lg`}>Hired {emp.hiredate}</span>
                </div>
              );
            }) : <div className="text-center py-8"><p className="text-zinc-500 font-bold">No recent hires found.</p></div>}
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
          <div className="bg-[#1A1A24]/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 flex-grow shadow-2xl">
            <h3 className="text-xl font-black text-white mb-8 tracking-tight">Quick Navigation</h3>
            <div className="space-y-4">
              {[{label:"Employees",path:"/employees",icon:"badge",color:"from-[#2E5BFF] to-[#00C2FF]"},{label:"Departments",path:"/departments",icon:"domain",color:"from-[#B71BCF] to-[#FF3DBC]"},{label:"Reports",path:"/reports",icon:"analytics",color:"from-[#8A3DFF] to-[#B71BCF]"}].map((item,i) => (
                <button key={i} onClick={() => navigate(item.path)} className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.07] transition-all text-left group">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg`}><span className="material-symbols-outlined text-lg" style={{fontVariationSettings:"'FILL' 1"}}>{item.icon}</span></div>
                  <span className="text-sm font-black text-zinc-400 group-hover:text-white transition-colors uppercase tracking-widest">{item.label}</span>
                  <span className="material-symbols-outlined text-zinc-700 ml-auto group-hover:text-white transition-colors">arrow_forward</span>
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => navigate('/employees')} className="bg-gradient-to-r from-[#2E5BFF] via-[#8A3DFF] to-[#B71BCF] text-white p-7 rounded-[2rem] flex items-center justify-between group shadow-[0_20px_40px_rgba(138,61,255,0.4)] hover:shadow-[0_25px_50px_rgba(138,61,255,0.6)] hover:-translate-y-1 active:translate-y-0.5 transition-all">
            <span className="font-black text-xl tracking-tight">View Employees</span>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-90 transition-transform"><span className="material-symbols-outlined text-2xl">arrow_forward</span></div>
          </button>
        </div>
      </div>
    </div>
  );
}