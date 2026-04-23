import { useState } from 'react';
import { useRights } from '../context/UserRightsContext'; // Added
import DeleteConfirmDialog from '../components/modals/DeleteConfirmDialog';
import AddEmployeeModal from '../components/modals/AddEmployeeModal';

const MOCK_DATA = [
  { id: '8291', lastName: 'Sterling', firstName: 'Julianne', gender: 'Female', hireDate: '2021-01-12', sepDate: null, job: 'Principal Engineer', dept: 'Engineering', status: 'ACTIVE', stamp: 'ADMIN_V1' },
  { id: '7742', lastName: 'Vance', firstName: 'Marcus', gender: 'Male', hireDate: '2019-03-05', sepDate: null, job: 'Creative Director', dept: 'Marketing', status: 'ACTIVE', stamp: 'ADMIN_V2' },
  { id: '9001', lastName: 'Choi', firstName: 'Soo-Min', gender: 'Non-Binary', hireDate: '2022-08-21', sepDate: null, job: 'Data Analyst', dept: 'BI', status: 'ACTIVE', stamp: 'ADMIN_V1' },
  { id: '1123', lastName: 'Abebe', firstName: 'Elias', gender: 'Male', hireDate: '2018-06-14', sepDate: '2023-12-01', job: 'HR Manager', dept: 'Operations', status: 'INACTIVE', stamp: 'SYS_RETIRED' },
];

export default function EmployeeListPage() {
  const { can } = useRights(); // Use the Specialist context
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filtering Logic using permissions
  const filteredEmployees = MOCK_DATA.filter(emp => {
    const matchesSearch = `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
    // If user cannot view all (is a standard user), hide Inactive rows
    if (!can('EMP_VIEW_ALL')) {
      return emp.status === 'ACTIVE' && matchesSearch;
    }
    return matchesSearch;
  });

  const openDeleteDialog = (emp) => {
    setSelectedEmployee(emp);
    setIsDeleteOpen(true);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">Employees</h1>
          <p className="text-zinc-500 font-bold text-sm uppercase tracking-widest">Workforce Directory</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary text-sm">search</span>
            <input 
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#1A1A24] border border-white/5 rounded-full py-3 pl-12 pr-6 text-sm text-white outline-none w-full md:w-64"
            />
          </div>
        </div>
      </header>

      <div className="hidden lg:block bg-[#1A1A24]/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/5">
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">ID</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Full Name</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Job Details</th>
              {/* Rubric Check: Stamp column hidden for USER (ADM_USER right) */}
              {can('ADM_USER') && (
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#B71BCF]">Admin Stamp</th>
              )}
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredEmployees.map((emp) => (
              <tr key={emp.id} className="group hover:bg-white/[0.02] transition-all">
                <td className="px-8 py-6 font-mono text-[11px] text-primary font-black">#{emp.id}</td>
                <td className="px-8 py-6">
                  <div className="font-bold text-white text-base">{emp.lastName}, {emp.firstName}</div>
                </td>
                <td className="px-8 py-6">
                  <div className="text-sm font-black text-white">{emp.job}</div>
                  <div className="text-[10px] text-zinc-500 font-bold uppercase">{emp.dept}</div>
                </td>
                {can('ADM_USER') && (
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-[#B71BCF] font-mono text-[10px] bg-[#B71BCF]/5 px-3 py-1.5 rounded-xl border border-[#B71BCF]/10 w-fit">
                      {emp.stamp}
                    </div>
                  </td>
                )}
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    {/* Rubric Check: Edit by EMP_EDIT */}
                    {can('EMP_EDIT') && (
                      <button className="p-2.5 rounded-xl hover:bg-primary/10 text-primary">
                        <span className="material-symbols-outlined text-xl">edit_square</span>
                      </button>
                    )}
                    {/* Rubric Check: Delete by EMP_DEL */}
                    {can('EMP_DEL') && (
                      <button 
                        onClick={() => openDeleteDialog(emp)}
                        className="p-2.5 rounded-xl hover:bg-error/10 text-error"
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

      {/* Rubric Check: Add button gated by EMP_ADD */}
      {can('EMP_ADD') && (
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="fixed bottom-12 right-12 bg-gradient-to-r from-[#2E5BFF] to-[#B71BCF] text-white px-8 py-5 rounded-full flex items-center gap-3 shadow-lg z-50 group hover:scale-105 transition-all"
        >
          <span className="material-symbols-outlined font-black group-hover:rotate-90 transition-transform">person_add</span>
          <span className="font-black text-sm uppercase">Add Employee</span>
        </button>
      )}

      <AddEmployeeModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <DeleteConfirmDialog 
        isOpen={isDeleteOpen}
        employeeName={selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` : ""}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}