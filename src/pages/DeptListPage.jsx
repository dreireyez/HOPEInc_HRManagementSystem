import { useState } from 'react';
import DeptModal from '../components/modals/DeptModal';

const MOCK_DEPTS = [
  { code: 'ENG-01', name: 'Engineering & Development' },
  { code: 'DSN-04', name: 'Product Design' },
  { code: 'MKT-02', name: 'Global Marketing' },
];

export default function DeptListPage({ userRole = 'ADMIN' }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAdmin = userRole === 'ADMIN' || userRole === 'SUPERADMIN';

  return (
    <div className="animate-in fade-in duration-700">
      <header className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-2">Departments</h1>
          <p className="text-zinc-500 font-bold text-sm uppercase tracking-widest font-body">Operational Business Units</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-white/5 border border-white/10 text-primary px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
          >
            Add Department
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_DEPTS.map((dept) => (
          <div key={dept.code} className="bg-[#1A1A24] border border-white/5 p-8 rounded-[2.5rem] group hover:border-primary/30 transition-all relative overflow-hidden">
             <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
             <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-lg shadow-primary/10">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>corporate_fare</span>
                </div>
                {isAdmin && <button className="text-zinc-600 hover:text-white transition-colors"><span className="material-symbols-outlined text-xl">edit</span></button>}
             </div>
             <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-1">{dept.code}</h3>
             <p className="text-xl font-bold text-white tracking-tight">{dept.name}</p>
          </div>
        ))}
      </div>

      <DeptModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}