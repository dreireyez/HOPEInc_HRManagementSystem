import { useState, useEffect } from 'react';
import { useRights } from '../context/UserRightsContext';
import { useNavigate } from 'react-router-dom';
import { getEmployees } from '../services/employeeService';
import DeleteConfirmDialog from '../components/modals/DeleteConfirmDialog';
import AddEmployeeModal from '../components/modals/AddEmployeeModal';

export default function EmployeeListPage() {
  const { can, currentUser } = useRights();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch employees on mount
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error: fetchError } = await getEmployees(currentUser?.user_type || 'USER');
        
        if (fetchError) {
          setError(fetchError.message);
          setEmployees([]);
        } else {
          setEmployees(data || []);
        }
      } catch (err) {
        setError(err.message);
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.user_type) {
      fetchEmployees();
    }
  }, [currentUser?.user_type]);

  // Filtering Logic using permissions
  const filteredEmployees = employees.filter(emp => {
    const fullName = `${emp.firstname || ''} ${emp.lastname || ''}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase());
    
    // If user cannot view all (is a standard user), hide INACTIVE records
    if (!can('EMP_VIEW_ALL')) {
      return emp.record_status === 'ACTIVE' && matchesSearch;
    }
    return matchesSearch;
  });

  const openDeleteDialog = (emp) => {
    setSelectedEmployee(emp);
    setIsDeleteOpen(true);
  };

  const handleAddEmployee = () => {
    setIsAddModalOpen(false);
    // Refresh employee list after adding
    if (currentUser?.user_type) {
      // Re-fetch would happen here in a real app
    }
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

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary mx-auto mb-4"></div>
            <p className="text-zinc-500">Loading employees...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 mb-8">
          <p className="text-red-400 font-bold">Error loading employees: {error}</p>
        </div>
      )}

      {/* Employee Table */}
      {!loading && !error && (
        <div className="hidden lg:block bg-[#1A1A24]/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">ID</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Full Name</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Hire Date</th>
                {/* Stamp column hidden for USER (ADM_USER right) */}
                {can('ADM_USER') && (
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#B71BCF]">Status</th>
                )}
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <tr key={emp.empno} className="group hover:bg-white/[0.02] transition-all">
                    <td className="px-8 py-6 font-mono text-[11px] text-primary font-black">#{emp.empno}</td>
                    <td className="px-8 py-6">
                      <div className="font-bold text-white text-base">{emp.lastname}, {emp.firstname}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-bold text-white">{emp.hiredate || 'N/A'}</div>
                    </td>
                    {can('ADM_USER') && (
                      <td className="px-8 py-6">
                        <div className={`flex items-center gap-2 font-mono text-[10px] px-3 py-1.5 rounded-xl border w-fit ${
                          emp.record_status === 'ACTIVE' 
                            ? 'text-green-400 bg-green-400/5 border-green-400/20'
                            : 'text-red-400 bg-red-400/5 border-red-400/20'
                        }`}>
                          {emp.record_status}
                        </div>
                      </td>
                    )}
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        {/* View/Edit by EMP_EDIT */}
                        {can('EMP_EDIT') && (
                          <button 
                            onClick={() => navigate(`/employees/${emp.empno}`)}
                            className="p-2.5 rounded-xl hover:bg-primary/10 text-primary"
                          >
                            <span className="material-symbols-outlined text-xl">edit_square</span>
                          </button>
                        )}
                        {/* Delete by EMP_DEL */}
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
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-8 py-12 text-center text-zinc-500">
                    No employees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Button */}
      {can('EMP_ADD') && (
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="fixed bottom-12 right-12 bg-gradient-to-r from-[#2E5BFF] to-[#B71BCF] text-white px-8 py-5 rounded-full flex items-center gap-3 shadow-lg z-50 group hover:scale-105 transition-all"
        >
          <span className="material-symbols-outlined font-black group-hover:rotate-90 transition-transform">person_add</span>
          <span className="font-black text-sm uppercase">Add Employee</span>
        </button>
      )}

      <AddEmployeeModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSuccess={handleAddEmployee} />
      <DeleteConfirmDialog 
        isOpen={isDeleteOpen}
        employeeName={selectedEmployee ? `${selectedEmployee.firstname} ${selectedEmployee.lastname}` : ""}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}