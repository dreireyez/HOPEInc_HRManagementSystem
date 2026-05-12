import { useState } from 'react';
import { useRights } from '../context/UserRightsContext';
import DeletedRecordsTable from '../components/DeletedRecordsTable';

/**
 * DeletedItemsPage — Recovery Vault.
 * Tabs: Employees, Job History, Jobs, Departments. Each tab is rendered by
 * the shared DeletedRecordsTable component (also reused by the Admin Panel).
 */
export default function DeletedItemsPage() {
  const { currentUser } = useRights();
  const userRole = currentUser?.user_type || 'USER';
  const [activeTab, setActiveTab] = useState('Employees');

  if (userRole === 'USER') {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center">
        <span className="material-symbols-outlined text-6xl text-error mb-4">shield_person</span>
        <h2 className="text-2xl font-black text-white">Access Restricted</h2>
        <p className="text-zinc-500 font-bold max-w-xs">Only Administrators can access the Recovery Vault.</p>
      </div>
    );
  }

  const tabs = [
    { label: 'Employees', kind: 'employee' },
    { label: 'Job History', kind: 'jobhistory' },
    { label: 'Jobs', kind: 'job' },
    { label: 'Departments', kind: 'department' },
  ];

  const active = tabs.find(t => t.label === activeTab) || tabs[0];

  return (
    <div className="animate-in fade-in duration-700">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Recovery Vault</h1>
        <p className="text-zinc-500 font-bold text-sm uppercase tracking-widest">Restore inactive or soft-deleted records</p>
      </header>

      <div className="flex gap-8 border-b border-white/5 mb-8 overflow-x-auto no-scrollbar">
        {tabs.map(({ label }) => (
          <button key={label} onClick={() => setActiveTab(label)}
            className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === label ? 'text-primary' : 'text-zinc-600 hover:text-zinc-400'}`}>
            {label}
            {activeTab === label && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary shadow-[0_0_10px_rgba(46,91,255,0.5)]" />}
          </button>
        ))}
      </div>

      <DeletedRecordsTable kind={active.kind} />
    </div>
  );
}
