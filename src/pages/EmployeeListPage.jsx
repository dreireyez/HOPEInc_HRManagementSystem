import { useState, useEffect, useCallback } from 'react';
import { useRights } from '../context/UserRightsContext';
import { useNavigate } from 'react-router-dom';

import {
  getEmployee,
  getEmployees,
  softDeleteEmployee,
} from '../services/employeeService';

import DeleteConfirmDialog from '../components/modals/DeleteConfirmDialog';
import AddEmployeeModal from '../components/modals/AddEmployeeModal';
import EditEmployeeModal from '../components/modals/EditEmployeeModal';

import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Pagination } from '../components/ui/Pagination';

const PAGE_SIZE = 10;

/** Sort presets displayed in the unified "Sort By" dropdown. */
const SORT_OPTIONS = [
  { label: 'Name (A–Z)',           field: 'lastname',  dir: 'asc'  },
  { label: 'Name (Z–A)',           field: 'lastname',  dir: 'desc' },
  { label: 'Employee ID (Asc)',    field: 'empno',     dir: 'asc'  },
  { label: 'Employee ID (Desc)',   field: 'empno',     dir: 'desc' },
  { label: 'Date Hired (Newest)',  field: 'hiredate',  dir: 'desc' },
  { label: 'Date Hired (Oldest)',  field: 'hiredate',  dir: 'asc'  },
  { label: 'Department (A–Z)',     field: 'deptname',  dir: 'asc'  },
  { label: 'Job Title (A–Z)',      field: 'jobdesc',   dir: 'asc'  },
  { label: 'Birthdate (Newest)',   field: 'birthdate', dir: 'desc' },
  { label: 'Birthdate (Oldest)',   field: 'birthdate', dir: 'asc'  },
];

export default function EmployeeListPage() {
  const { can, currentUser } = useRights();
  const navigate = useNavigate();
  
  const canSeeAdminMetadata = currentUser?.user_type && currentUser.user_type !== 'USER';
  const canManageRows = can('EMP_EDIT') || can('EMP_DEL');

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editEmployee, setEditEmployee] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('lastname');
  const [sortDir, setSortDir] = useState('asc');

  const [statusFilter, setStatusFilter] = useState('ACTIVE');
  const [genderFilter, setGenderFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [jobFilter, setJobFilter] = useState('ALL');

  const [openMenuId, setOpenMenuId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await getEmployees(
        currentUser?.user_type || 'USER'
      );

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
  }, [currentUser?.user_type]);

  useEffect(() => {
    if (currentUser?.user_type) {
      fetchEmployees();
    }
  }, [currentUser?.user_type, fetchEmployees]);

  /** Derive the current sort-preset key so the <select> stays in sync. */
  const sortKey = `${sortField}__${sortDir}`;

  const handleSortChange = (e) => {
    const [field, dir] = e.target.value.split('__');
    setSortField(field);
    setSortDir(dir);
  };

  const deptOptions = [...new Set(employees.map((e) => e.deptname).filter(Boolean))].sort();
  const jobOptions = [...new Set(employees.map((e) => e.jobdesc).filter(Boolean))].sort();

  const filtered = employees
    .filter((emp) => {
      if (statusFilter !== 'ALL' && emp.record_status !== statusFilter) return false;
      if (genderFilter !== 'ALL' && emp.gender !== genderFilter) return false;
      if (deptFilter !== 'ALL' && emp.deptname !== deptFilter) return false;
      if (jobFilter !== 'ALL' && emp.jobdesc !== jobFilter) return false;

      if (!searchQuery) return true;

      const q = searchQuery.toLowerCase();
      const fullName = `${emp.firstname || ''} ${emp.lastname || ''}`.toLowerCase();
      const empNo = String(emp.empno || '');

      return fullName.includes(q) || empNo.includes(q);
    })
    .sort((a, b) => {
      let aVal = a[sortField] ?? '';
      let bVal = b[sortField] ?? '';

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal || '').toLowerCase();
      }

      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, genderFilter, deptFilter, jobFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginatedEmployees = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const openDeleteDialog = (emp) => {
    setSelectedEmployee(emp);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEmployee) return;

    const { error: delErr } = await softDeleteEmployee(selectedEmployee.empno);
    if (delErr) alert(`Failed to deactivate: ${delErr.message}`);

    setIsDeleteOpen(false);
    setSelectedEmployee(null);
    fetchEmployees();
  };

  const handleAddEmployee = () => {
    setIsAddModalOpen(false);
    fetchEmployees();
  };

  const handleEditOpen = async (emp) => {
    try {
      const { data, error: fetchError } = await getEmployee(
        emp.empno,
        currentUser?.user_type || 'USER'
      );

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setEditEmployee(data);
      setIsEditModalOpen(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setEditEmployee(null);
    fetchEmployees();
  };

  const gridCols = canSeeAdminMetadata
    ? 'grid-cols-[64px_2fr_56px_100px_minmax(0,1.2fr)_minmax(0,1.1fr)_84px_84px_90px_70px_48px]'
    : canManageRows
      ? 'grid-cols-[64px_2fr_56px_100px_minmax(0,1.2fr)_minmax(0,1.1fr)_84px_84px_48px]'
      : 'grid-cols-[64px_2fr_56px_100px_minmax(0,1.2fr)_minmax(0,1.1fr)_84px_84px]';

  /* Column definitions — used by the flat header row. */
  const columns = [
    { label: 'ID',        align: 'left'   },
    { label: 'Employee',  align: 'left'   },
    { label: 'Gen',       align: 'center' },
    { label: 'Birthdate', align: 'center' },
    { label: 'Job',       align: 'left'   },
    { label: 'Dept.',     align: 'left'   },
    { label: 'Hired',     align: 'center' },
    { label: 'Sep.',      align: 'center' },
  ];

  const selectCls = `
    bg-white rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium
    text-slate-700 outline-none transition-all duration-200 hover:border-slate-300
    hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]
  `;

  return (
    <div className="flex flex-col gap-6">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Employees
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage workforce directory and personnel records.
          </p>
        </div>

        {can('EMP_ADD') && (
          <Button onClick={() => setIsAddModalOpen(true)} className="px-5 py-2">
            + Add Employee
          </Button>
        )}
      </header>

      {/* FILTERS + SORT BY — unified control panel */}
      <div className="relative rounded-[1.8rem] px-5 pt-4 pb-3 flex flex-col gap-3 border border-slate-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.10)] hover:-translate-y-0.5 transition-all duration-300 bg-white">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1 flex-1 min-w-[220px]">
            <label className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400 font-bold">Search</label>
            <input
              type="text"
              placeholder="Name or employee ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={selectCls}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400 font-bold">Gender</label>
            <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)} className={selectCls}>
              <option value="ALL">All</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400 font-bold">Department</label>
            <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className={selectCls}>
              <option value="ALL">All departments</option>
              {deptOptions.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400 font-bold">Job</label>
            <select value={jobFilter} onChange={(e) => setJobFilter(e.target.value)} className={selectCls}>
              <option value="ALL">All titles</option>
              {jobOptions.map((j) => (
                <option key={j} value={j}>{j}</option>
              ))}
            </select>
          </div>

          {canSeeAdminMetadata && (
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400 font-bold">Status</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectCls}>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="ALL">All</option>
              </select>
            </div>
          )}

          {/* Sort By — unified sort control replacing per-column sort arrows */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400 font-bold">Sort By</label>
            <select value={sortKey} onChange={handleSortChange} className={selectCls}>
              {SORT_OPTIONS.map((opt) => (
                <option key={`${opt.field}__${opt.dir}`} value={`${opt.field}__${opt.dir}`}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="ml-auto">
            <div className="bg-slate-100 rounded-full px-4 py-2 text-[12px] font-semibold text-slate-500 border border-slate-200">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* ACTIVE FILTERS CHIPS */}
        {(searchQuery || genderFilter !== 'ALL' || deptFilter !== 'ALL' || jobFilter !== 'ALL' || statusFilter !== 'ACTIVE') && (
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400 font-bold mr-1">Filters</span>
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="inline-flex items-center gap-1.5 rounded-full bg-[#1e3a5f]/10 text-[#1e3a5f] border border-[#1e3a5f]/10 px-3 py-1.5 text-xs font-semibold hover:bg-[#1e3a5f]/15 hover:-translate-y-0.5 transition-all duration-200">
                "{searchQuery}" <span className="opacity-60">×</span>
              </button>
            )}
            {genderFilter !== 'ALL' && (
              <button onClick={() => setGenderFilter('ALL')} className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1.5 text-xs font-semibold hover:bg-slate-200 hover:-translate-y-0.5 transition-all duration-200">
                {genderFilter === 'M' ? 'Male' : 'Female'} <span className="opacity-60">×</span>
              </button>
            )}
            {deptFilter !== 'ALL' && (
              <button onClick={() => setDeptFilter('ALL')} className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1.5 text-xs font-semibold hover:bg-slate-200 hover:-translate-y-0.5 transition-all duration-200">
                {deptFilter} <span className="opacity-60">×</span>
              </button>
            )}
            {jobFilter !== 'ALL' && (
              <button onClick={() => setJobFilter('ALL')} className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1.5 text-xs font-semibold hover:bg-slate-200 hover:-translate-y-0.5 transition-all duration-200">
                {jobFilter} <span className="opacity-60">×</span>
              </button>
            )}
            {statusFilter !== 'ACTIVE' && (
              <button onClick={() => setStatusFilter('ACTIVE')} className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1.5 text-xs font-semibold hover:bg-slate-200 hover:-translate-y-0.5 transition-all duration-200">
                {statusFilter} <span className="opacity-60">×</span>
              </button>
            )}
            <button
              onClick={() => { setSearchQuery(''); setGenderFilter('ALL'); setDeptFilter('ALL'); setJobFilter('ALL'); setStatusFilter('ACTIVE'); }}
              className="text-[11px] font-semibold text-slate-400 hover:text-red-500 transition-colors ml-1"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-10 h-10 border-2 border-slate-200 border-t-[#1e3a5f] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] p-5 border border-slate-100 shadow-[0_4px_40px_-10px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="flex flex-col gap-3">
            
            {/* TABLE HEADER — flat text labels, no pills / shadows / sort arrows */}
            <div
              className={`
                grid items-center gap-3 px-3 pb-4
                border-b border-[#bec9c8]/50
                ${gridCols}
              `}
            >
              {columns.map(({ label, align }) => (
                <div
                  key={label}
                  className={`
                    font-mono uppercase text-[#3f4948] font-medium tracking-[0.05em] text-xs
                    ${align === 'center' ? 'text-center' : 'text-left'}
                  `}
                >
                  {label}
                </div>
              ))}

              {canSeeAdminMetadata && (
                <>
                  <div className="font-mono uppercase text-[#3f4948] font-medium tracking-[0.05em] text-xs text-center">
                    Stat
                  </div>
                  <div className="font-mono uppercase text-[#3f4948] font-medium tracking-[0.05em] text-xs text-center">
                    Stamp
                  </div>
                </>
              )}

              {canManageRows && <div />}
            </div>

            {/* ROWS — raised neumorphic card-rows (PRESERVED) */}
            {paginatedEmployees.map((emp) => {
              const isActive = emp.record_status === 'ACTIVE';
              const initials = `${emp.firstname?.[0] || ''}${emp.lastname?.[0] || ''}`.toUpperCase();

              /* Split stamp string into date & time parts for stacked display. */
              const stampParts = (() => {
                if (!emp.stamp) return null;
                const raw = String(emp.stamp).trim();
                const dateMatch = raw.match(/^(\d{4}-\d{2}-\d{2})/);
                const datePart = dateMatch ? dateMatch[1] : raw;
                const timePart = dateMatch ? raw.slice(dateMatch[1].length).trim() : '';
                return { date: datePart, time: timePart };
              })();

              return (
                <div
                  key={emp.empno}
                  onClick={() => navigate(`/employees/${emp.empno}`)}
                  className={`
                    group
                    grid items-center gap-3
                    ${gridCols}
                    px-3 py-4
                    rounded-[1.6rem]
                    bg-white
                    border border-slate-100
                    shadow-[0_6px_18px_rgba(15,23,42,0.06),0_2px_6px_rgba(15,23,42,0.04)]
                    hover:border-slate-200
                    hover:shadow-[0_24px_50px_-12px_rgba(15,23,42,0.18),0_10px_24px_rgba(15,23,42,0.08)]
                    hover:-translate-y-1
                    transition-all duration-300
                    cursor-pointer
                  `}
                >
                  {/* ID */}
                  <div className="font-mono text-[12px] font-bold text-slate-400 truncate">
                    #{emp.empno}
                  </div>

                  {/* Employee */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#315784] text-white flex items-center justify-center text-[11px] font-black shrink-0 shadow-[0_6px_14px_rgba(30,58,95,0.25)] ring-1 ring-white/40 transition-all duration-300 group-hover:scale-105">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[15px] font-bold text-slate-800 leading-tight truncate">
                        {emp.firstname} {emp.lastname}
                      </div>
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="flex justify-center">
                    <span className="text-[12px] font-mono font-bold text-slate-600">
                      {emp.gender || '—'}
                    </span>
                  </div>

                  {/* Birthdate */}
                  <div className="flex justify-center">
                    <div className="text-[12px] font-mono font-medium text-slate-500">
                      {emp.birthdate ? emp.birthdate.split('T')[0] : '—'}
                    </div>
                  </div>

                  {/* Job */}
                  <div className="truncate text-[14px] font-medium text-slate-600">
                    {emp.jobdesc || 'No title'}
                  </div>

                  {/* Department */}
                  <div className="min-w-0">
                    <div className="truncate text-[13px] font-medium text-slate-600">
                      {emp.deptname || 'Unassigned'}
                    </div>
                  </div>

                  {/* Hired */}
                  <div className="flex justify-center">
                    <div className="text-[12px] font-mono font-medium text-slate-600">
                      {emp.hiredate ? emp.hiredate.split('T')[0] : '—'}
                    </div>
                  </div>

                  {/* Sep */}
                  <div className="flex justify-center">
                    <div className="text-[12px] font-mono font-medium text-slate-400">
                      {emp.sepdate ? emp.sepdate.split('T')[0] : '—'}
                    </div>
                  </div>

                  {/* Status */}
                  {canSeeAdminMetadata && (
                    <div className="flex justify-center">
                      <Badge variant={isActive ? 'active' : 'inactive'}>
                        {emp.record_status}
                      </Badge>
                    </div>
                  )}

                  {/* Stamp — stacked date / time+zone */}
                  {canSeeAdminMetadata && (
                    <div className="flex flex-col items-center">
                      {stampParts ? (
                        <>
                          <span className="font-mono text-[11px] font-bold text-[#3f4948] leading-tight">
                            {stampParts.date}
                          </span>
                          {stampParts.time && (
                            <span className="font-mono text-[9px] font-medium text-[#6f7979] mt-0.5 leading-tight">
                              {stampParts.time}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="font-mono text-[11px] text-slate-400">—</span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  {canManageRows && (
                    <div className="relative flex justify-end">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          setOpenMenuId(openMenuId === emp.empno ? null : emp.empno);
                        }}
                        className="
                          w-9 h-9
                          rounded-xl
                          flex items-center justify-center
                          text-slate-500
                          hover:bg-slate-100
                          hover:text-slate-800
                          transition-all duration-200
                        "
                      >
                        <span className="material-symbols-outlined text-[20px]">more_vert</span>
                      </button>

                      {openMenuId === emp.empno && (
                        <div
                          onClick={(event) => event.stopPropagation()}
                          className="
                            absolute right-0 top-full mt-2 z-50
                            bg-white
                            rounded-2xl
                            border border-slate-200
                            shadow-[0_20px_40px_-12px_rgba(0,0,0,0.2)]
                            overflow-hidden
                            min-w-[180px]
                          "
                        >
                          {can('EMP_EDIT') && (
                            <button
                              onClick={(event) => {
                                event.stopPropagation();
                                setOpenMenuId(null);
                                handleEditOpen(emp);
                              }}
                              className="
                                w-full text-left
                                px-4 py-3
                                text-sm font-medium
                                text-slate-700
                                hover:bg-slate-50
                                transition-colors
                              "
                            >
                              Edit Profile
                            </button>
                          )}

                          {can('EMP_DEL') && isActive && (
                            <button
                              onClick={(event) => {
                                event.stopPropagation();
                                setOpenMenuId(null);
                                openDeleteDialog(emp);
                              }}
                              className="
                                w-full text-left
                                px-4 py-3
                                text-sm font-medium
                                text-red-600
                                hover:bg-red-50
                                transition-colors
                              "
                            >
                              Deactivate
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* PAGINATION */}
          <div className="mt-5">
            <Pagination
              currentPage={currentPage}
              totalItems={filtered.length}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      )}

      <AddEmployeeModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSuccess={handleAddEmployee} />
      <DeleteConfirmDialog isOpen={isDeleteOpen} employeeName={selectedEmployee ? `${selectedEmployee.firstname} ${selectedEmployee.lastname}` : ''} onCancel={() => setIsDeleteOpen(false)} onConfirm={handleDeleteConfirm} />
      <EditEmployeeModal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setEditEmployee(null); }} initialData={editEmployee} onSuccess={handleEditSuccess} />
    </div>
  );
}