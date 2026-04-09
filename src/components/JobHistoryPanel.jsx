import { useState } from 'react';
import JobHistoryModal from './modals/JobHistoryModal';

const MOCK_HISTORY = [
  { id: 1, title: 'Tech Lead', dept: 'Core Engineering', date: 'Jan 12, 2024', salary: '$165,000', type: 'PROMOTION' },
  { id: 2, title: 'Senior Developer', dept: 'Product Dev', date: 'Mar 15, 2022', salary: '$142,000', type: 'STABLE' },
  { id: 3, title: 'Junior Developer', dept: 'Internal Tools', date: 'May 01, 2021', salary: '$85,000', type: 'NEW_HIRE' }
];

export default function JobHistoryPanel({ userRole }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between px-4">
        <div>
          <h3 className="text-2xl font-black text-white">Job History</h3>
          <p className="text-sm text-zinc-500 font-bold uppercase tracking-tighter">Career progression & compensation</p>
        </div>
        
        {/* GATING: JH_ADD */}
        {userRole === 'ADMIN' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/20 text-primary font-black text-xs hover:bg-primary hover:text-white transition-all"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Add Record
          </button>
        )}
      </div>

      <div className="bg-[#1A1A24]/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/5">
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Designation</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Department</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Effective Date</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Salary</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {MOCK_HISTORY.map((row) => (
              <tr key={row.id} className="group hover:bg-white/[0.02] transition-colors">
                <td className="px-8 py-6">
                  <div className="font-bold text-white text-base">{row.title}</div>
                  <div className={`text-[9px] font-black px-2 py-0.5 rounded-full w-fit mt-1 ${row.type === 'PROMOTION' ? 'bg-[#B71BCF]/10 text-[#B71BCF]' : 'bg-zinc-800 text-zinc-500'}`}>
                    {row.type}
                  </div>
                </td>
                <td className="px-8 py-6 text-sm font-bold text-zinc-400">{row.dept}</td>
                <td className="px-8 py-6">
                  <p className="text-sm font-black text-white">{row.date}</p>
                  {row.id === 1 && <p className="text-[9px] text-primary font-black uppercase tracking-widest">Active Position</p>}
                </td>
                <td className="px-8 py-6 font-bold text-white">{row.salary}</td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-primary hover:bg-primary/10 rounded-xl transition-all"><span className="material-symbols-outlined">edit</span></button>
                    <button className="p-2 text-error hover:bg-error/10 rounded-xl transition-all"><span className="material-symbols-outlined">delete</span></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <JobHistoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}