import { useState, useEffect, useRef } from 'react';
import { useRights } from '../context/UserRightsContext';
import { useNavigate } from 'react-router-dom';
import { getEmployees, softDeleteEmployee, getEmployeeDeptMap } from '../services/employeeService';
import { getDepts } from '../services/departmentService';
import DeleteConfirmDialog from '../components/modals/DeleteConfirmDialog';
import AddEmployeeModal from '../components/modals/AddEmployeeModal';

export default function EmployeeListPage() {
  const { currentUser, can } = useRights();
  const navigate = useNavigate();
  const userType = currentUser?.user_type || 'USER';
  const showStamp = userType === 'ADMIN' || userType === 'SUPERADMIN';

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('empno');
  const [sortDir, setSortDir] = useState('asc');
  const [depts, setDepts] = useState([]);
  const [deptFilter, setDeptFilter] = useState('');
  const [empDeptMap, setEmpDeptMap] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await getEmployees(userType);
      if (fetchError) { setError(fetchError.message); setEmployees([]); }
      else { setEmployees(data || []); }
    } catch (err) { setError(err.message); setEmployees([]); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (!currentUser?.user_type) return;
    fetchEmployees();
    getDepts(userType).then(res => setDepts((res.data || []).filter(d => d.record_status === 'ACTIVE')));
    getEmployeeDeptMap(userType).then(res => {
      const map = {};
      if (res.data) {
        res.data.forEach((deptCode, empNo) => { map[empNo] = deptCode; });
      }
      setEmpDeptMap(map);
    });
  }, [currentUser?.user_type]);

  const filtered = employees
    .filter(emp => {
      // Spec: hide record_status from list — page shows ACTIVE rows only.
      if (emp.record_status !== 'ACTIVE') return false;
      if (deptFilter && empDeptMap[emp.empno] !== deptFilter) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      const fullName = `${emp.firstname || ''} ${emp.lastname || ''}`.toLowerCase();
      const empNo = String(emp.empno || '');
      return fullName.includes(q) || empNo.includes(q);
    })
    .sort((a, b) => {
      let aVal = a[sortField] ?? '';
      let bVal = b[sortField] ?? '';
      if (typeof aVal === 'string') { aVal = aVal.toLowerCase(); bVal = (bVal || '').toLowerCase(); }
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  const openDeleteDialog = (emp) => { setSelectedEmployee(emp); setIsDeleteOpen(true); };

  const handleDeleteConfirm = async () => {
    if (!selectedEmployee) return;
    const { error: delErr } = await softDeleteEmployee(selectedEmployee.empno, currentUser?.userid);
    if (delErr) alert('Failed to deactivate: ' + delErr.message);
    setIsDeleteOpen(false);
    setSelectedEmployee(null);
    fetchEmployees();
  };

  const handleAddEmployee = () => { setIsAddModalOpen(false); fetchEmployees(); };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const deptCodeToName = Object.fromEntries(depts.map(d => [d.deptcode, d.deptname]));

  const sortOptions = [
    { label: 'Employee ID', value: 'empno' },
    { label: 'Last Name', value: 'lastname' },
    { label: 'Hire Date', value: 'hiredate' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-8">
        <h1 className="text-4xl font-black tracking-tight text-white mb-2">Employees</h1>
        <p className="text-zinc-500 font-bold text-sm uppercase tracking-widest">Workforce Directory</p>
      </header>

      {/* Search bar + unified filter icon */}
      <div className="flex gap-3 items-center w-full mb-8">
        <div className="relative group flex-1 min-w-[200px]">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary text-sm">search</span>
          <input type="text" placeholder="Search by name or ID..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#1A1A24] border border-white/5 rounded-full py-3 pl-12 pr-6 text-sm text-white outline-none placeholder:text-zinc-700 font-bold focus:ring-2 focus:ring-primary/20 transition-all" />
        </div>
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setFilterOpen(o => !o)}
            className={`p-3 rounded-full border transition-all ${filterOpen ? 'bg-primary/10 border-primary/40 text-primary' : 'bg-[#1A1A24] border-white/5 text-zinc-400 hover:text-white hover:border-white/20'}`}
            title="Filter and sort"
          >
            <span className="material-symbols-outlined text-xl">tune</span>
          </button>
          {filterOpen && (
            <div className="absolute right-0 top-14 z-50 bg-[#1A1A24] border border-white/10 rounded-3xl p-5 shadow-2xl min-w-[240px] space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Department</label>
                <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 px-4 text-sm text-white font-bold outline-none">
                  <option value="">All Departments</option>
                  {depts.map(dept => (
                    <option key={dept.deptcode} value={dept.deptcode}>{dept.deptname}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Sort By</label>
                <select value={sortField} onChange={e => setSortField(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 px-4 text-sm text-white font-bold outline-none">
                  {sortOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Direction</label>
                <select value={sortDir} onChange={e => setSortDir(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 px-4 text-sm text-white font-bold outline-none">
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary mx-auto mb-4"></div>
            <p className="text-zinc-500">Loading employees...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 mb-8">
          <p className="text-red-400 font-bold">Error: {error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="bg-[#1A1A24]/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">ID</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Full Name</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Department</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Hire Date</th>
                {showStamp && (
                  <th data-testid="stamp-header" className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#B71BCF]">Stamp</th>
                )}
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length > 0 ? filtered.map(emp => (
                <tr key={emp.empno} className="group hover:bg-white/[0.02] transition-all">
                  <td className="px-8 py-6 font-mono text-[11px] text-primary font-black">#{emp.empno}</td>
                  <td className="px-8 py-6">
                    <div className="font-bold text-white text-base">{emp.lastname}, {emp.firstname}</div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-bold text-zinc-300">
                      {deptCodeToName[empDeptMap[emp.empno]] || empDeptMap[emp.empno] || <span className="text-zinc-600">—</span>}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-bold text-white">{emp.hiredate || 'N/A'}</div>
                  </td>
                  {showStamp && (
                    <td data-testid="stamp-cell" className="px-8 py-6 text-zinc-500 text-[11px] font-mono">
                      {emp.stamp || '-'}
                    </td>
                  )}
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      {can('EMP_EDIT') && (
                        <button onClick={() => navigate(`/employees/${emp.empno}`)} className="p-2.5 rounded-xl hover:bg-primary/10 text-primary">
                          <span className="material-symbols-outlined text-xl">edit_square</span>
                        </button>
                      )}
                      {can('EMP_DEL') && (
                        <button onClick={() => openDeleteDialog(emp)} className="p-2.5 rounded-xl hover:bg-error/10 text-error">
                          <span className="material-symbols-outlined text-xl">delete_sweep</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={showStamp ? 6 : 5} className="px-8 py-12 text-center text-zinc-500">No employees found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {can('EMP_ADD') && (
        <button onClick={() => setIsAddModalOpen(true)}
          className="fixed bottom-12 right-12 bg-gradient-to-r from-[#2E5BFF] to-[#B71BCF] text-white px-8 py-5 rounded-full flex items-center gap-3 shadow-lg z-50 group hover:scale-105 transition-all">
          <span className="material-symbols-outlined font-black group-hover:rotate-90 transition-transform">person_add</span>
          <span className="font-black text-sm uppercase">Add Employee</span>
        </button>
      )}

      <AddEmployeeModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSuccess={handleAddEmployee} />
      <DeleteConfirmDialog isOpen={isDeleteOpen}
        employeeName={selectedEmployee ? `${selectedEmployee.firstname} ${selectedEmployee.lastname}` : ''}
        onCancel={() => setIsDeleteOpen(false)} onConfirm={handleDeleteConfirm} />
    </div>
  );
}
