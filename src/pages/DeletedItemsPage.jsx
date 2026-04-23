import { useState } from 'react';

export default function DeletedItemsPage({ userRole = 'ADMIN' }) {
  const [activeTab, setActiveTab] = useState('Employees');

  // GATING: If a regular USER tries to access this URL, we show an Unauthorized state
  if (userRole === 'USER') {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center">
        <span className="material-symbols-outlined text-6xl text-error mb-4">shield_person</span>
        <h2 className="text-2xl font-black text-white">Access Restricted</h2>
        <p className="text-zinc-500 font-bold max-w-xs">Only Administrators can access the Recovery Vault.</p>
      </div>
    );
  }

  const tabs = ['Employees', 'Job History', 'Jobs', 'Departments'];

  return (
    <div className="animate-in fade-in duration-700">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Recovery Vault</h1>
        <p className="text-zinc-500 font-bold text-sm uppercase tracking-widest">Restore inactive or soft-deleted records</p>
      </header>

      {/* TABS NAVIGATION */}
      <div className="flex gap-8 border-b border-white/5 mb-8 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${
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

      {/* RECOVERY TABLE */}
      <div className="bg-[#1A1A24]/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
          <h3 className="text-lg font-black text-white">Archived {activeTab}</h3>
          <span className="text-[10px] font-black bg-error/10 text-error px-3 py-1 rounded-full border border-error/20">Retention: 90 Days</span>
        </div>
        
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/5 border-b border-white/5">
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Record Name/Code</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Deleted On</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {/* Mocking a row to show the "Recover" button */}
            <tr className="group hover:bg-white/[0.02] transition-colors">
              <td className="px-8 py-6">
                <div className="font-bold text-white">Sample_Archived_{activeTab}</div>
                <div className="text-[10px] text-zinc-600 font-black uppercase">Ref: #DEL-9921</div>
              </td>
              <td className="px-8 py-6 text-sm font-bold text-zinc-500">Oct 24, 2023 <span className="text-[9px] opacity-30 ml-2">by Admin-Alex</span></td>
              <td className="px-8 py-6 text-right">
                <button className="bg-[#2E5BFF]/10 text-primary border border-[#2E5BFF]/20 px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-[#2E5BFF] hover:text-white transition-all">
                  <span className="material-symbols-outlined text-sm align-middle mr-2">settings_backup_restore</span>
                  Recover
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}