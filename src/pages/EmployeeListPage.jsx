import { useState } from 'react';
import DeleteConfirmDialog from '../components/modals/DeleteConfirmDialog';
// Note: You will need to create AddEmployeeModal.jsx using the Stitch code provided earlier
import AddEmployeeModal from '../components/modals/AddEmployeeModal';

const MOCK_DATA = [
  { id: '8291', lastName: 'Sterling', firstName: 'Julianne', gender: 'Female', hireDate: '2021-01-12', sepDate: null, job: 'Principal Engineer', dept: 'Engineering', status: 'ACTIVE', stamp: 'ADMIN_V1' },
  { id: '7742', lastName: 'Vance', firstName: 'Marcus', gender: 'Male', hireDate: '2019-03-05', sepDate: null, job: 'Creative Director', dept: 'Marketing', status: 'ACTIVE', stamp: 'ADMIN_V2' },
  { id: '9001', lastName: 'Choi', firstName: 'Soo-Min', gender: 'Non-Binary', hireDate: '2022-08-21', sepDate: null, job: 'Data Analyst', dept: 'BI', status: 'ACTIVE', stamp: 'ADMIN_V1' },
  { id: '1123', lastName: 'Abebe', firstName: 'Elias', gender: 'Male', hireDate: '2018-06-14', sepDate: '2023-12-01', job: 'HR Manager', dept: 'Operations', status: 'INACTIVE', stamp: 'SYS_RETIRED' },
];

export default function EmployeeListPage({ userRole = 'ADMIN' }) {
  // --- STATE MANAGEMENT ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // --- GATING LOGIC ---
  // 1. Filter out INACTIVE rows if the user is a standard USER
  const filteredEmployees = MOCK_DATA.filter(emp => {
    const matchesSearch = `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
    if (userRole === 'USER') {
      return emp.status === 'ACTIVE' && matchesSearch;
    }
    return matchesSearch; // ADMIN/SUPERADMIN see all matching search
  });

  const isAdmin = userRole === 'ADMIN' || userRole === 'SUPERADMIN';

  // --- HANDLERS ---
  const openDeleteDialog = (emp) => {
    setSelectedEmployee(emp);
    setIsDeleteOpen(true);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* PAGE HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">Employees</h1>
          <p className="text-zinc-500 font-bold text-sm uppercase tracking-widest">
            Workforce Directory <span className="text-primary ml-2"></span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary transition-colors text-sm">search</span>
            <input 
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#1A1A24] border border-white/5 rounded-full py-3 pl-12 pr-6 text-sm text-white focus:ring-2 focus:ring-primary/20 transition-all outline-none w-full md:w-64 placeholder:text-zinc-700 font-bold"
            />
          </div>
          <button className="bg-[#1A1A24] border border-white/5 p-3 rounded-full text-zinc-400 hover:text-white transition-all hover:bg-white/5">
            <span className="material-symbols-outlined">filter_list</span>
          </button>
        </div>
      </header>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden lg:block bg-[#1A1A24]/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/5">
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">ID</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Full Name</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Gender</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Hire Date</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Separation</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Job Details</th>
              
              {/* GATING: ADMIN STAMP */}
              {isAdmin && (
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#B71BCF]">Admin Stamp</th>
              )}
              
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredEmployees.map((emp) => (
              <tr key={emp.id} className={`group hover:bg-white/[0.02] transition-all duration-300 ${emp.status === 'INACTIVE' ? 'opacity-40 grayscale-[0.5]' : ''}`}>
                <td className="px-8 py-6 font-mono text-[11px] text-primary font-black">#{emp.id}</td>
                <td className="px-8 py-6">
                  <div className="font-bold text-white text-base">{emp.lastName}, {emp.firstName}</div>
                  {emp.status === 'INACTIVE' && (
                    <span className="text-[8px] font-black bg-error/10 text-error px-2 py-0.5 rounded-full tracking-tighter">INACTIVE</span>
                  )}
                </td>
                <td className="px-8 py-6">
                   <span className="text-[10px] font-black uppercase px-3 py-1 bg-white/5 rounded-full text-zinc-400 border border-white/5">{emp.gender}</span>
                </td>
                <td className="px-8 py-6 text-sm text-zinc-400 font-bold">{emp.hireDate}</td>
                <td className="px-8 py-6 text-sm font-bold">
                  {emp.sepDate ? <span className="text-error">{emp.sepDate}</span> : <span className="text-zinc-800">—</span>}
                </td>
                <td className="px-8 py-6">
                  <div className="text-sm font-black text-white">{emp.job}</div>
                  <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">{emp.dept}</div>
                </td>

                {/* GATING: STAMP COLUMN */}
                {isAdmin && (
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-[#B71BCF] font-mono text-[10px] font-black bg-[#B71BCF]/5 px-3 py-1.5 rounded-xl border border-[#B71BCF]/10 w-fit">
                      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                      {emp.stamp}
                    </div>
                  </td>
                )}

                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                    <button className="p-2.5 rounded-xl hover:bg-primary/10 text-primary transition-all">
                      <span className="material-symbols-outlined text-xl">edit_square</span>
                    </button>
                    {/* GATING: DELETE ACTION */}
                    {isAdmin && (
                      <button 
                        onClick={() => openDeleteDialog(emp)}
                        className="p-2.5 rounded-xl hover:bg-error/10 text-error transition-all"
                      >
                        <span className="material-symbols-outlined text-xl">delete_sweep</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="lg:hidden space-y-4">
        {filteredEmployees.map((emp) => (
          <div key={emp.id} className={`bg-[#1A1A24] border border-white/5 p-6 rounded-[2rem] relative overflow-hidden ${emp.status === 'INACTIVE' ? 'opacity-50' : ''}`}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-black text-white">{emp.firstName} {emp.lastName}</h3>
                <p className="text-xs text-primary font-mono font-black">#EMP-{emp.id}</p>
              </div>
              <div className="flex gap-1">
                 <button className="p-2 text-primary"><span className="material-symbols-outlined">edit_square</span></button>
                 {isAdmin && <button onClick={() => openDeleteDialog(emp)} className="p-2 text-error"><span className="material-symbols-outlined">delete_sweep</span></button>}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 border-t border-white/5 pt-6">
              <div>
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Department</p>
                <p className="text-sm font-bold text-zinc-300">{emp.dept}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Status</p>
                <p className={`text-sm font-black ${emp.status === 'ACTIVE' ? 'text-green-400' : 'text-error'}`}>{emp.status}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* GATING: FAB ADD BUTTON */}
      {isAdmin && (
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="fixed bottom-28 right-8 lg:bottom-12 lg:right-12 bg-gradient-to-r from-[#2E5BFF] to-[#B71BCF] text-white px-8 py-5 rounded-full flex items-center gap-3 shadow-[0_20px_40px_rgba(138,61,255,0.3)] hover:scale-105 active:scale-95 transition-all z-50 group"
        >
          <span className="material-symbols-outlined font-black group-hover:rotate-90 transition-transform">person_add</span>
          <span className="font-black text-sm uppercase tracking-tighter">Add Employee</span>
        </button>
      )}

      {/* MODALS */}
      <AddEmployeeModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />

      <DeleteConfirmDialog 
        isOpen={isDeleteOpen}
        employeeName={selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` : ""}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={() => {
          console.log("Deactivating employee...");
          setIsDeleteOpen(false);
        }}
      />
    </div>
  );
}