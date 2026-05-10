import { useState, useEffect, useCallback } from 'react';
import { useRights } from '../context/UserRightsContext';
import { useNavigate } from 'react-router-dom';

import {
  getEmployees,
  softDeleteEmployee,
} from '../services/employeeService';

import DeleteConfirmDialog from '../components/modals/DeleteConfirmDialog';
import AddEmployeeModal from '../components/modals/AddEmployeeModal';

import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Pagination } from '../components/ui/Pagination';

const PAGE_SIZE = 10;

export default function EmployeeListPage() {
  const { can, currentUser } = useRights();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] =
    useState(false);

  const [isDeleteOpen, setIsDeleteOpen] =
    useState(false);

  const [selectedEmployee, setSelectedEmployee] =
    useState(null);

  const [searchQuery, setSearchQuery] =
    useState('');

  const [sortField, setSortField] =
    useState('lastname');

  const [sortDir, setSortDir] =
    useState('asc');

  const [statusFilter, setStatusFilter] =
    useState('ACTIVE');

  const [genderFilter, setGenderFilter] =
    useState('ALL');

  const [deptFilter, setDeptFilter] =
    useState('ALL');

  const [jobFilter, setJobFilter] =
    useState('ALL');

  const [openMenuId, setOpenMenuId] =
    useState(null);

  const [currentPage, setCurrentPage] =
    useState(1);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } =
        await getEmployees(
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

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDir((prev) =>
        prev === 'asc' ? 'desc' : 'asc'
      );
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const deptOptions = [
    ...new Set(
      employees
        .map((e) => e.deptname)
        .filter(Boolean)
    ),
  ].sort();

  const jobOptions = [
    ...new Set(
      employees
        .map((e) => e.jobdesc)
        .filter(Boolean)
    ),
  ].sort();

  const filtered = employees
    .filter((emp) => {
      if (
        statusFilter !== 'ALL' &&
        emp.record_status !== statusFilter
      ) {
        return false;
      }

      if (
        genderFilter !== 'ALL' &&
        emp.gender !== genderFilter
      ) {
        return false;
      }

      if (
        deptFilter !== 'ALL' &&
        emp.deptname !== deptFilter
      ) {
        return false;
      }

      if (
        jobFilter !== 'ALL' &&
        emp.jobdesc !== jobFilter
      ) {
        return false;
      }

      if (!searchQuery) {
        return true;
      }

      const q = searchQuery.toLowerCase();

      const fullName =
        `${emp.firstname || ''} ${emp.lastname || ''
          }`.toLowerCase();

      const empNo = String(emp.empno || '');

      return (
        fullName.includes(q) ||
        empNo.includes(q)
      );
    })
    .sort((a, b) => {
      let aVal = a[sortField] ?? '';
      let bVal = b[sortField] ?? '';

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal || '').toLowerCase();
      }

      if (aVal < bVal) {
        return sortDir === 'asc' ? -1 : 1;
      }

      if (aVal > bVal) {
        return sortDir === 'asc' ? 1 : -1;
      }

      return 0;
    });

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    statusFilter,
    genderFilter,
    deptFilter,
    jobFilter,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );

  const paginatedEmployees = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    setCurrentPage((page) =>
      Math.min(page, totalPages)
    );
  }, [totalPages]);

  const openDeleteDialog = (emp) => {
    setSelectedEmployee(emp);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEmployee) return;

    const { error: delErr } =
      await softDeleteEmployee(
        selectedEmployee.empno
      );

    if (delErr) {
      alert(
        `Failed to deactivate: ${delErr.message}`
      );
    }

    setIsDeleteOpen(false);
    setSelectedEmployee(null);

    fetchEmployees();
  };

  const handleAddEmployee = () => {
    setIsAddModalOpen(false);
    fetchEmployees();
  };

  const SortIcon = ({ field }) => (
    <span
      className={`material-symbols-outlined text-[14px] transition-all duration-200 ${sortField === field
        ? 'text-[#1e3a5f]'
        : 'text-slate-300'
        }`}
    >
      {sortField === field
        ? sortDir === 'asc'
          ? 'north'
          : 'south'
        : 'unfold_more'}
    </span>
  );

  const selectCls = `
    bg-white
    rounded-xl
    border border-slate-200
    px-3 py-2.5
    text-sm
    font-medium
    text-slate-700
    outline-none
    transition-all duration-200
    hover:border-slate-300
    hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)]
    focus:ring-2
    focus:ring-[#1e3a5f]/20
    focus:border-[#1e3a5f]
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
            Manage workforce directory and
            personnel records.
          </p>
        </div>

        {can('EMP_ADD') && (
          <Button
            onClick={() =>
              setIsAddModalOpen(true)
            }
            className="px-5 py-2"
          >
            + Add Employee
          </Button>
        )}
      </header>

      {/* FILTERS */}
      <div
        className="
          relative
          rounded-[1.8rem]
          px-5 pt-4 pb-3
          flex flex-col gap-3
          border border-slate-100
          shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]
          hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.10)]
          hover:-translate-y-0.5
          transition-all duration-300
          bg-white
        "
      >
        {/* TOP FILTER ROW */}
        <div className="flex flex-wrap items-end gap-4">
          {/* SEARCH */}
          <div className="flex flex-col gap-1 flex-1 min-w-[220px]">
            <label className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400 font-bold">
              Search
            </label>

            <input
              type="text"
              placeholder="Name or employee ID"
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              className="
                bg-white
                rounded-xl
                border border-slate-200
                px-4 py-3
                text-sm
                font-medium
                text-slate-700
                outline-none
                transition-all duration-200
                hover:border-slate-300
                hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)]
                focus:ring-2
                focus:ring-[#1e3a5f]/20
                focus:border-[#1e3a5f]
              "
            />
          </div>

          {/* GENDER */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400 font-bold">
              Gender
            </label>

            <select
              value={genderFilter}
              onChange={(e) =>
                setGenderFilter(e.target.value)
              }
              className={selectCls}
            >
              <option value="ALL">All</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>

          {/* DEPARTMENT */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400 font-bold">
              Department
            </label>

            <select
              value={deptFilter}
              onChange={(e) =>
                setDeptFilter(e.target.value)
              }
              className={selectCls}
            >
              <option value="ALL">
                All departments
              </option>

              {deptOptions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* JOB */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400 font-bold">
              Job
            </label>

            <select
              value={jobFilter}
              onChange={(e) =>
                setJobFilter(e.target.value)
              }
              className={selectCls}
            >
              <option value="ALL">
                All titles
              </option>

              {jobOptions.map((j) => (
                <option key={j} value={j}>
                  {j}
                </option>
              ))}
            </select>
          </div>

          {/* STATUS */}
          {can('ADM_USER') && (
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400 font-bold">
                Status
              </label>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className={selectCls}
              >
                <option value="ACTIVE">
                  Active
                </option>

                <option value="INACTIVE">
                  Inactive
                </option>

                <option value="ALL">
                  All
                </option>
              </select>
            </div>
          )}

          {/* COUNT */}
          <div className="ml-auto">
            <div
              className="
                bg-slate-100
                rounded-full
                px-4 py-2
                text-[12px]
                font-semibold
                text-slate-500
                border border-slate-200
              "
            >
              {filtered.length} result
              {filtered.length !== 1
                ? 's'
                : ''}
            </div>
          </div>
        </div>

        {/* ACTIVE FILTERS */}
        {(searchQuery ||
          genderFilter !== 'ALL' ||
          deptFilter !== 'ALL' ||
          jobFilter !== 'ALL' ||
          statusFilter !== 'ACTIVE') && (
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400 font-bold mr-1">
                Filters
              </span>

              {searchQuery && (
                <button
                  onClick={() =>
                    setSearchQuery('')
                  }
                  className="
                  inline-flex items-center gap-1.5
                  rounded-full
                  bg-[#1e3a5f]/10
                  text-[#1e3a5f]
                  border border-[#1e3a5f]/10
                  px-3 py-1.5
                  text-xs
                  font-semibold
                  hover:bg-[#1e3a5f]/15
                  hover:-translate-y-0.5
                  transition-all duration-200
                "
                >
                  "{searchQuery}"
                  <span className="opacity-60">
                    ×
                  </span>
                </button>
              )}

              {genderFilter !== 'ALL' && (
                <button
                  onClick={() =>
                    setGenderFilter('ALL')
                  }
                  className="
                  inline-flex items-center gap-1.5
                  rounded-full
                  bg-slate-100
                  text-slate-600
                  border border-slate-200
                  px-3 py-1.5
                  text-xs
                  font-semibold
                  hover:bg-slate-200
                  hover:-translate-y-0.5
                  transition-all duration-200
                "
                >
                  {genderFilter === 'M'
                    ? 'Male'
                    : 'Female'}
                  <span className="opacity-60">
                    ×
                  </span>
                </button>
              )}

              {deptFilter !== 'ALL' && (
                <button
                  onClick={() =>
                    setDeptFilter('ALL')
                  }
                  className="
                  inline-flex items-center gap-1.5
                  rounded-full
                  bg-slate-100
                  text-slate-600
                  border border-slate-200
                  px-3 py-1.5
                  text-xs
                  font-semibold
                  hover:bg-slate-200
                  hover:-translate-y-0.5
                  transition-all duration-200
                "
                >
                  {deptFilter}
                  <span className="opacity-60">
                    ×
                  </span>
                </button>
              )}

              {jobFilter !== 'ALL' && (
                <button
                  onClick={() =>
                    setJobFilter('ALL')
                  }
                  className="
                  inline-flex items-center gap-1.5
                  rounded-full
                  bg-slate-100
                  text-slate-600
                  border border-slate-200
                  px-3 py-1.5
                  text-xs
                  font-semibold
                  hover:bg-slate-200
                  hover:-translate-y-0.5
                  transition-all duration-200
                "
                >
                  {jobFilter}
                  <span className="opacity-60">
                    ×
                  </span>
                </button>
              )}

              {statusFilter !== 'ACTIVE' && (
                <button
                  onClick={() =>
                    setStatusFilter('ACTIVE')
                  }
                  className="
                  inline-flex items-center gap-1.5
                  rounded-full
                  bg-slate-100
                  text-slate-600
                  border border-slate-200
                  px-3 py-1.5
                  text-xs
                  font-semibold
                  hover:bg-slate-200
                  hover:-translate-y-0.5
                  transition-all duration-200
                "
                >
                  {statusFilter}
                  <span className="opacity-60">
                    ×
                  </span>
                </button>
              )}

              {/* CLEAR ALL */}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setGenderFilter('ALL');
                  setDeptFilter('ALL');
                  setJobFilter('ALL');
                  setStatusFilter('ACTIVE');
                }}
                className="
                text-[11px]
                font-semibold
                text-slate-400
                hover:text-red-500
                transition-colors
                ml-1
              "
              >
                Clear all
              </button>
            </div>
          )}
      </div>
      {/* ERROR */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600">
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-10 h-10 border-2 border-slate-200 border-t-[#1e3a5f] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] p-5 border border-slate-100 shadow-[0_4px_40px_-10px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="flex flex-col gap-3">

            {/* TABLE HEADER */}
            <div
              className={`
                grid items-center gap-4 px-4 py-2
                ${can('ADM_USER') 
                  ? 'grid-cols-[70px_2.4fr_1.5fr_1.3fr_110px_80px_90px_60px_40px]' 
                  : 'grid-cols-[70px_2.4fr_1.5fr_1.3fr_110px_80px]'}
              `}
            >
              {[
                ['empno', 'ID'],
                ['lastname', 'Employee'],
                ['jobdesc', 'Job'],
                ['deptname', 'Dept.'],
                ['hiredate', 'Hired'],
                ['sepdate', 'Sep.'],
              ].map(([field, label]) => (
                <button
                  key={field}
                  onClick={() =>
                    toggleSort(field)
                  }
                  className="
                    flex items-center gap-1
                    text-[11px]
                    font-mono
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-slate-500
                    hover:text-slate-800
                    bg-slate-50
                    hover:bg-slate-100
                    border border-slate-200
                    rounded-full
                    px-3 py-1.5
                    transition-all duration-200
                    shadow-[0_2px_8px_rgba(0,0,0,0.04)]
                    w-fit
                  "
                >
                  {label}
                  <SortIcon field={field} />
                </button>
              ))}

              {can('ADM_USER') && (
                <>
                  <div className="text-center text-[11px] font-mono font-bold uppercase tracking-[0.18em] text-slate-500">
                    Stat
                  </div>

                  <div className="text-center text-[11px] font-mono font-bold uppercase tracking-[0.18em] text-slate-500">
                    Stamp
                  </div>
                </>
              )}

              {can('ADM_USER') && <div />}
            </div>

            {/* ROWS */}
            {paginatedEmployees.map((emp) => {
              const isActive =
                emp.record_status ===
                'ACTIVE';

              const isMenuOpen =
                openMenuId === emp.empno;

              const initials = `${emp.firstname?.[0] || ''
                }${emp.lastname?.[0] || ''
                }`.toUpperCase();

              return (
                <div
                  key={emp.empno}
  className={`
  group
  grid items-center gap-4
  ${can('ADM_USER') 
    ? 'grid-cols-[70px_2.4fr_1.5fr_1.3fr_110px_80px_90px_60px_40px]' 
    : 'grid-cols-[70px_2.4fr_1.5fr_1.3fr_110px_80px]'}
  px-4 py-5
  rounded-[1.6rem]
  bg-white
  border border-slate-100
  shadow-[0_6px_18px_rgba(15,23,42,0.06),0_2px_6px_rgba(15,23,42,0.04)]
  hover:border-slate-200
  hover:shadow-[0_24px_50px_-12px_rgba(15,23,42,0.18),0_10px_24px_rgba(15,23,42,0.08)]
  hover:-translate-y-1
  transition-all duration-300
`}
                >
                  {/* ID */}
                  <div className="font-mono text-[12px] font-bold text-slate-400 truncate">
                    #{emp.empno}
                  </div>

                  {/* Employee */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="
    w-10 h-10
    rounded-2xl
    bg-gradient-to-br
    from-[#1e3a5f]
    to-[#315784]
    text-white
    flex items-center justify-center
    text-[11px]
    font-black
    shrink-0
    shadow-[0_6px_14px_rgba(30,58,95,0.25)]
    ring-1 ring-white/40
    transition-all duration-300
    group-hover:scale-105
  "
                    >
                      {initials}
                    </div>

                    <div className="min-w-0">
                      <div className="text-[15px] font-bold text-slate-800 leading-tight truncate">
                        {emp.firstname}{' '}
                        {emp.lastname}
                      </div>
                    </div>
                  </div>

                  {/* Job */}
                  <div className="truncate text-[14px] font-medium text-slate-600">
                    {emp.jobdesc ||
                      'No title'}
                  </div>

                  {/* Department */}
                  <div className="min-w-0">
                    <div
                      className="
                        inline-flex items-center
                        rounded-full
                        bg-slate-100
                        border border-slate-200
                        px-2.5 py-1
                        text-[12px]
                        font-medium
                        text-slate-600
                        whitespace-nowrap
                        overflow-hidden
                        text-ellipsis
                        max-w-full
                      "
                    >
                      {emp.deptname ||
                        'Unassigned'}
                    </div>
                  </div>

                  {/* Hired */}
                  <div className="flex justify-center">
                    <div
                      className="
                        rounded-full
                        bg-slate-100
                        px-2 py-1
                        text-[11px]
                        font-mono
                        font-bold
                        tracking-wider
                        text-slate-600
                      "
                    >
                      {emp.hiredate
                        ? emp.hiredate.split(
                          'T'
                        )[0]
                        : 'N/A'}
                    </div>
                  </div>

                  {/* Sep */}
                  <div className="flex justify-center">
                    <div
                      className="
                        rounded-full
                        bg-slate-100
                        px-2 py-1
                        text-[11px]
                        font-mono
                        font-bold
                        tracking-wider
                        text-slate-500
                      "
                    >
                      {emp.sepdate
                        ? emp.sepdate.split(
                          'T'
                        )[0]
                        : 'N/A'}
                    </div>
                  </div>

                  {/* Status */}
                  {can('ADM_USER') && (
                    <div className="flex justify-center">
                      <Badge
                        variant={
                          isActive
                            ? 'active'
                            : 'inactive'
                        }
                      >
                        {emp.record_status}
                      </Badge>
                    </div>
                  )}

                  {/* Stamp */}
                  {can('ADM_USER') && (
                    <div className="text-center">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 truncate max-w-[60px]">
                        {emp.stamp || '—'}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  {can('ADM_USER') && (
                    <div className="relative flex justify-center">
                      <button
                        onClick={() =>
                          setOpenMenuId(
                            isMenuOpen
                              ? null
                              : emp.empno
                          )
                        }
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
                        <span className="material-symbols-outlined text-[20px]">
                          more_vert
                        </span>
                      </button>

                      {isMenuOpen && (
                        <div
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
                              onClick={() => {
                                setOpenMenuId(
                                  null
                                );

                                navigate(
                                  `/employees/${emp.empno}`
                                );
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

                          {can('EMP_DEL') &&
                            isActive && (
                              <button
                                onClick={() => {
                                  setOpenMenuId(
                                    null
                                  );

                                  openDeleteDialog(
                                    emp
                                  );
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
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalItems={filtered.length}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      )}

      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() =>
          setIsAddModalOpen(false)
        }
        onSuccess={handleAddEmployee}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteOpen}
        employeeName={
          selectedEmployee
            ? `${selectedEmployee.firstname} ${selectedEmployee.lastname}`
            : ''
        }
        onCancel={() =>
          setIsDeleteOpen(false)
        }
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
