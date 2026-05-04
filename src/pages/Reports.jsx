import { useState } from 'react';

// --- MOCK DATA ---
const HEADCOUNT_DATA = [
  { dept: 'Engineering', count: 45, percent: '46.4%', width: '45%', color: 'from-[#00ffcc] to-[#2E5BFF]', shadow: 'shadow-[#00ffcc]/40' },
  { dept: 'Marketing', count: 22, percent: '22.7%', width: '22%', color: 'from-[#B71BCF] to-[#8A3DFF]', shadow: 'shadow-[#B71BCF]/40' },
  { dept: 'Finance', count: 18, percent: '18.5%', width: '18%', color: 'from-[#2E5BFF] to-[#8A3DFF]', shadow: 'shadow-[#2E5BFF]/40' },
  { dept: 'Human Resources', count: 12, percent: '12.4%', width: '12%', color: 'from-[#45464f] to-[#8f909a]', shadow: 'shadow-zinc-500/20' },
];

const SALARY_DATA = [
  { job: 'Senior Software Engineer', icon: 'code', min: '$120,000', max: '$180,000', avg: '$145,000', color: 'text-[#00ffcc]', bg: 'bg-[#00ffcc]/10' },
  { job: 'Product Marketing Manager', icon: 'campaign', min: '$95,000', max: '$145,000', avg: '$118,000', color: 'text-[#B71BCF]', bg: 'bg-[#B71BCF]/10' },
  { job: 'Financial Analyst', icon: 'account_balance', min: '$75,000', max: '$115,000', avg: '$92,000', color: 'text-[#2E5BFF]', bg: 'bg-[#2E5BFF]/10' },
];

const HISTORY_DATA = [
  { title: 'Sr. Data Engineer', dept: 'Engineering Dept', date: 'Feb 2023 - Present', salary: '$145,000', active: true },
  { title: 'Data Engineer II', dept: 'Data Science Dept', date: 'Feb 2021 - Jan 2023', salary: '$120,000', active: false },
  { title: 'Data Analyst', dept: 'Operations Dept', date: 'Aug 2019 - Feb 2021', salary: '$95,000', active: false },
];

export default function Reports() {
  const [activeTab, setActiveTab] = useState('Headcount');
  const tabs = ['Headcount', 'Salary Summary', 'Employee History'];

  return (
    <div className="animate-in fade-in duration-700">
      
      {/* --- PAGE HEADER --- */}
      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">
          Analytics & <span className="bg-gradient-to-r from-[#2E5BFF] to-[#00ffcc] bg-clip-text text-transparent">Reports</span>
        </h1>
        <p className="text-zinc-500 font-bold text-sm uppercase tracking-widest">Organizational Insights</p>
      </header>

      {/* --- TAB NAVIGATION --- */}
      <div className="flex gap-8 border-b border-white/5 mb-8 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap ${
              activeTab === tab ? 'text-primary' : 'text-zinc-600 hover:text-zinc-400'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary shadow-[0_0_10px_rgba(46,91,255,0.5)]" />
            )}
          </button>
        ))}
      </div>

      {/* --- TAB CONTENT: HEADCOUNT --- */}
      {activeTab === 'Headcount' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-right-4 duration-500">
          
          {/* Bar Chart Widget */}
          <div className="lg:col-span-2 bg-[#1A1A24]/60 backdrop-blur-3xl rounded-[2rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <h2 className="text-2xl font-black text-white mb-8">Headcount Distribution</h2>
            
            <div className="space-y-6">
              {HEADCOUNT_DATA.map((item) => (
                <div key={item.dept}>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">
                    <span>{item.dept}</span>
                    <span className="text-white">{item.count} Employees</span>
                  </div>
                  <div className="h-3 w-full bg-[#0B0B0F] rounded-full overflow-hidden border border-white/5">
                    <div 
                      className={`h-full bg-gradient-to-r ${item.color} ${item.shadow} shadow-lg rounded-full relative`}
                      style={{ width: item.width }}
                    >
                      <div className="absolute inset-0 bg-white/20 w-1/2 rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Table Widget */}
          <div className="lg:col-span-1 bg-[#1A1A24]/60 backdrop-blur-3xl rounded-[2rem] p-8 border border-white/5 shadow-2xl flex flex-col">
            <h2 className="text-2xl font-black text-white mb-6">Summary</h2>
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-zinc-600">
                    <th className="pb-3 text-[10px] font-black uppercase tracking-widest">Dept</th>
                    <th className="pb-3 text-[10px] font-black uppercase tracking-widest text-right">Total</th>
                    <th className="pb-3 text-[10px] font-black uppercase tracking-widest text-right">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white font-bold text-sm">
                  {HEADCOUNT_DATA.map((item) => (
                    <tr key={item.dept} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4">{item.dept}</td>
                      <td className="py-4 text-right font-black">{item.count}</td>
                      <td className="py-4 text-right text-zinc-500">{item.percent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB CONTENT: SALARY SUMMARY --- */}
      {activeTab === 'Salary Summary' && (
        <div className="bg-[#1A1A24]/60 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/5 shadow-2xl animate-in slide-in-from-right-4 duration-500">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-white">Salary Bands Overview</h2>
            <button className="text-primary hover:text-white text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-colors">
              Export CSV <span className="material-symbols-outlined text-sm">download</span>
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="py-4 px-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest rounded-tl-2xl">Job Description</th>
                  <th className="py-4 px-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Min Salary</th>
                  <th className="py-4 px-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Max Salary</th>
                  <th className="py-4 px-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right rounded-tr-2xl">Avg Salary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-bold text-sm text-white">
                {SALARY_DATA.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-5 px-6 flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl ${row.bg} flex items-center justify-center ${row.color}`}>
                        <span className="material-symbols-outlined text-lg">{row.icon}</span>
                      </div>
                      <span className="text-base">{row.job}</span>
                    </td>
                    <td className="py-5 px-6 text-zinc-400 text-right">{row.min}</td>
                    <td className="py-5 px-6 text-zinc-400 text-right">{row.max}</td>
                    <td className="py-5 px-6 text-right">
                      <span className={`inline-flex items-center px-4 py-1.5 rounded-full ${row.bg} ${row.color} font-black border border-white/5`}>
                        {row.avg}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB CONTENT: EMPLOYEE HISTORY --- */}
      {activeTab === 'Employee History' && (
        <div className="max-w-3xl mx-auto animate-in slide-in-from-right-4 duration-500">
          
          {/* Employee Selector */}
          <div className="bg-[#1A1A24]/80 backdrop-blur-xl rounded-[2rem] p-4 border border-white/5 shadow-2xl flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_CAPsiV427mjm-RdjhtnPLiduxqeGiERCdIYaah6H_NFc-Zk4q5S3cLZyCuY7vZcuy3pXAhfwTEaVD5_Smfgu1bXFD2qGW2RfxVEEDr_OqRHfk1xqtZDno3Rw0SIBCXpZiEkjut9JRkPGrah-IkhmFCqlTqmcROssMMui-tWR0WxGHD_nhZkLq_h-dQEpuDpblZ2OXClVIYyEwtlqGZSnbNPGP89Xw3X_CI7DkgAAm7STrPqeY2IlBKroIAxV3jnCBT46hpqYJdCz" alt="Employee" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="text-white font-black text-lg leading-tight">Marcus Vance</div>
                <div className="text-[10px] font-black text-[#00ffcc] uppercase tracking-widest">Sr. Data Engineer</div>
              </div>
            </div>
            <button className="w-10 h-10 rounded-full bg-[#0B0B0F] flex items-center justify-center text-zinc-400 hover:text-white transition-colors border border-white/5">
              <span className="material-symbols-outlined">unfold_more</span>
            </button>
          </div>

          {/* Chronological Timeline */}
          <div>
            <h2 className="text-[10px] font-black text-zinc-500 mb-8 tracking-[0.2em] uppercase ml-2">Career Progression Timeline</h2>
            
            <div className="relative border-l-2 border-white/10 ml-5 pl-8 space-y-10 pb-8">
              {HISTORY_DATA.map((node, idx) => (
                <div key={idx} className="relative">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[41px] top-4 w-4 h-4 rounded-full ring-4 ring-[#0B0B0F] ${node.active ? 'bg-[#00ffcc] shadow-[0_0_15px_rgba(0,255,204,0.6)]' : 'bg-zinc-600'}`}></div>
                  
                  {/* Timeline Card */}
                  <div className={`rounded-[2rem] p-6 relative overflow-hidden group border ${node.active ? 'bg-[#1A1A24] border-[#00ffcc]/20 shadow-2xl' : 'bg-[#1A1A24]/40 border-white/5 opacity-80'}`}>
                    
                    {/* Background Glow for Active Node */}
                    {node.active && (
                      <div className="absolute top-0 right-0 w-48 h-48 bg-[#00ffcc]/5 blur-3xl -z-10 rounded-full pointer-events-none"></div>
                    )}

                    <div className="flex justify-between items-start mb-4">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-md border ${node.active ? 'text-[#00ffcc] bg-[#00ffcc]/10 border-[#00ffcc]/20' : 'text-zinc-500 bg-[#0B0B0F] border-white/5'}`}>
                        {node.date}
                      </span>
                      <span className={`font-black tracking-tight ${node.active ? 'text-white' : 'text-zinc-400'}`}>
                        {node.salary}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-black text-white mb-1">{node.title}</h3>
                    <p className="text-sm font-bold text-zinc-500 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">domain</span>
                      {node.dept}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}