import { useState, useEffect, useCallback } from 'react';
import { useRights } from '../context/UserRightsContext';

import {
  getAllJobHistory,
  softDeleteJobHistory,
} from '../services/jobHistoryService';

import { Badge } from '../components/ui/Badge';
import { Pagination } from '../components/ui/Pagination';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { ToastContainer } from '../components/ui/Toast';
import { useToast } from '../components/ui/useToast';

import JobHistoryModal from '../components/modals/JobHistoryModal';

const PAGE_SIZE = 10;

/** Sort presets for the unified Sort By dropdown. */
const SORT_OPTIONS = [
  { label: 'Eff. Date (Newest)',  field: 'effdate',  dir: 'desc' },
  { label: 'Eff. Date (Oldest)',  field: 'effdate',  dir: 'asc'  },
  { label: 'Employee ID (Asc)',   field: 'empno',    dir: 'asc'  },
  { label: 'Employee ID (Desc)',  field: 'empno',    dir: 'desc' },
  { label: 'Job Code (A–Z)',      field: 'jobcode',  dir: 'asc'  },
  { label: 'Dept Code (A–Z)',     field: 'deptcode', dir: 'asc'  },
  { label: 'Salary (High–Low)',   field: 'salary',   dir: 'desc' },
  { label: 'Salary (Low–High)',   field: 'salary',   dir: 'asc'  },
];

export default function JobHistory() {
  const { can, currentUser } = useRights();
  const toast = useToast();
  const canSeeAllStatuses =
    currentUser?.user_type &&
    currentUser.user_type !== 'USER';
  const canManageRows =
    can('JH_EDIT') || can('JH_DEL');

  const [history, setHistory] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  const [searchQuery, setSearchQuery] =
    useState('');

  const [sortField, setSortField] =
    useState('effdate');

  const [sortDir, setSortDir] =
    useState('desc');

  const [statusFilter, setStatusFilter] =
    useState('ALL');

  const [jobFilter, setJobFilter] =
    useState('ALL');

  const [deptFilter, setDeptFilter] =
    useState('ALL');

  const [currentPage, setCurrentPage] =
    useState(1);

  const [editingRecord, setEditingRecord] =
    useState(null);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [openMenuId, setOpenMenuId] =
    useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null); // item to soft-delete
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const {
        data,
        error: fetchErr,
      } = await getAllJobHistory(
        currentUser?.user_type || 'USER'
      );

      if (fetchErr) {
        setError(fetchErr.message);
      } else {
        setHistory(data || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.user_type]);

  useEffect(() => {
    if (currentUser) fetchAll();
  }, [currentUser, fetchAll]);

  const f = (
    row,
    camel,
    snake
  ) =>
    row[camel.toLowerCase()] ??
    row[camel] ??
    row[snake] ??
    '';

  const getCreatedAt = (row) =>
    f(row, 'createdAt', 'created_at');

  const handleSoftDelete = (item) => {
    setDeleteTarget(item);
  };

  const confirmSoftDelete = async () => {
    if (!deleteTarget) return;
    const label = `Emp #${f(deleteTarget, 'empNo', 'emp_no')}`;
    setDeleteLoading(true);
    const id = {
      empno: f(deleteTarget, 'empNo', 'emp_no'),
      jobcode: f(deleteTarget, 'jobCode', 'job_code'),
      effdate: f(deleteTarget, 'effDate', 'eff_date'),
    };
    const { error: delErr } = await softDeleteJobHistory(id);
    setDeleteLoading(false);
    if (delErr) {
      toast.push(`Failed to deactivate: ${delErr.message}`, 'error');
    } else {
      toast.push(`Record ${label} has been deactivated.`);
      fetchAll();
    }
    setDeleteTarget(null);
  };

  const handleEdit = (item) => {
    setEditingRecord({
      empno: f(
        item,
        'empNo',
        'emp_no'
      ),
      jobCode: f(
        item,
        'jobCode',
        'job_code'
      ),
      deptCode: f(
        item,
        'deptCode',
        'dept_code'
      ),
      effDate: f(
        item,
        'effDate',
        'eff_date'
      ),
      salary: item.salary,

      id: {
        empno: f(
          item,
          'empNo',
          'emp_no'
        ),
        jobcode: f(
          item,
          'jobCode',
          'job_code'
        ),
        effdate: f(
          item,
          'effDate',
          'eff_date'
        ),
      },
    });

    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
    fetchAll();
  };

  const sortKey = `${sortField}__${sortDir}`;

  const handleSortChange = (e) => {
    const [field, dir] = e.target.value.split('__');
    setSortField(field);
    setSortDir(dir);
  };

  const filtered = history
    .filter((item) => {
      if (
        statusFilter !== 'ALL' &&
        item.record_status !==
        statusFilter
      )
        return false;

      if (
        jobFilter !== 'ALL' &&
        f(
          item,
          'jobCode',
          'job_code'
        ) !== jobFilter
      )
        return false;

      if (
        deptFilter !== 'ALL' &&
        f(
          item,
          'deptCode',
          'dept_code'
        ) !== deptFilter
      )
        return false;

      if (!searchQuery)
        return true;

      const q =
        searchQuery.toLowerCase();

      return (
        String(
          f(
            item,
            'empNo',
            'emp_no'
          )
        ).includes(q) ||
        f(
          item,
          'jobCode',
          'job_code'
        )
          .toLowerCase()
          .includes(q) ||
        f(
          item,
          'deptCode',
          'dept_code'
        )
          .toLowerCase()
          .includes(q)
      );
    })
    .sort((a, b) => {
      let aVal = f(
        a,
        sortField,
        sortField
      );

      let bVal = f(
        b,
        sortField,
        sortField
      );

      if (sortField === 'salary') {
        aVal = Number(aVal) || 0;
        bVal = Number(bVal) || 0;
      } else if (sortField === 'effdate') {
        aVal = aVal ? new Date(aVal).getTime() : 0;
        bVal = bVal ? new Date(bVal).getTime() : 0;
      } else {
        aVal = String(aVal);
        bVal = String(bVal);
      }

      if (aVal < bVal)
        return sortDir === 'asc'
          ? -1
          : 1;

      if (aVal > bVal)
        return sortDir === 'asc'
          ? 1
          : -1;

      if (sortField === 'effdate') {
        const aCreated = getCreatedAt(a);
        const bCreated = getCreatedAt(b);
        const aCreatedVal = aCreated ? new Date(aCreated).getTime() : 0;
        const bCreatedVal = bCreated ? new Date(bCreated).getTime() : 0;
        if (aCreatedVal < bCreatedVal) return sortDir === 'asc' ? -1 : 1;
        if (aCreatedVal > bCreatedVal) return sortDir === 'asc' ? 1 : -1;
      }

      return 0;
    });

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    statusFilter,
    jobFilter,
    deptFilter,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filtered.length / PAGE_SIZE
    )
  );

  useEffect(() => {
    setCurrentPage((page) =>
      Math.min(page, totalPages)
    );
  }, [totalPages]);

  const paginatedHistory =
    filtered.slice(
      (currentPage - 1) *
      PAGE_SIZE,
      currentPage * PAGE_SIZE
    );


  const selectCls = `
    w-full bg-white rounded-xl border border-slate-200 pl-3 pr-8 py-2.5
    text-sm font-medium text-slate-700 outline-none appearance-none
    transition-all duration-200 hover:border-slate-300
    hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)]
    focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]
  `;

  /** Shared chevron wrapper — chevron centred inside the select field. */
  const SelectWrap = ({ children, className = '' }) => {
    const kids = Array.isArray(children) ? children : [children];
    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        {kids[0]}
        <div className="relative">
          {kids.slice(1)}
          <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-slate-400">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
      </div>
    );
  };

  /** Flat mono column header — matches Employees table style. */
  const ColHeader = ({ label, align = 'left' }) => (
    <div className={`font-mono uppercase text-[#3f4948] font-medium tracking-[0.05em] text-xs ${
      align === 'center' ? 'text-center' : 'text-left'
    }`}>{label}</div>
  );

  return (
    <div className="flex flex-col gap-6">
      {/* PAGE HEADER */}
      <header className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Job History</h1>
          <p className="text-sm text-slate-500 mt-1">Full employment history records across all employees.</p>
        </div>
      </header>

      {/* FILTER + SORT BY — unified control panel */}
      <div className="relative rounded-[1.8rem] px-5 pt-4 pb-3 flex flex-col gap-3 border border-slate-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.10)] hover:-translate-y-0.5 transition-all duration-300 bg-white">
        <div className="flex flex-wrap items-end gap-3">
          {/* Search */}
          <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
            <label className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400 font-bold">Search</label>
            <input
              type="text"
              placeholder="Employee, job, or department"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition-all duration-200 hover:border-slate-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
            />
          </div>

          {/* Job Filter */}
          <SelectWrap className="flex-1 min-w-[130px]">
            <label className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400 font-bold">Job Code</label>
            <select value={jobFilter} onChange={(e) => setJobFilter(e.target.value)} className={selectCls}>
              <option value="ALL">All jobs</option>
              {[...new Set(history.map((i) => f(i, 'jobCode', 'job_code')))]
                .filter(Boolean).sort()
                .map((job) => <option key={job} value={job}>{job}</option>)}
            </select>
          </SelectWrap>

          {/* Department Filter */}
          <SelectWrap className="flex-1 min-w-[130px]">
            <label className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400 font-bold">Department</label>
            <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className={selectCls}>
              <option value="ALL">All depts</option>
              {[...new Set(history.map((i) => f(i, 'deptCode', 'dept_code')))]
                .filter(Boolean).sort()
                .map((dept) => <option key={dept} value={dept}>{dept}</option>)}
            </select>
          </SelectWrap>

          {/* Status — admin only */}
          {canSeeAllStatuses && (
            <SelectWrap className="flex-1 min-w-[110px]">
              <label className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400 font-bold">Status</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectCls}>
                <option value="ALL">All</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </SelectWrap>
          )}

          {/* Sort By */}
          <SelectWrap className="flex-1 min-w-[160px]">
            <label className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400 font-bold">Sort By</label>
            <select value={sortKey} onChange={handleSortChange} className={selectCls}>
              {SORT_OPTIONS.map((opt) => (
                <option key={`${opt.field}__${opt.dir}`} value={`${opt.field}__${opt.dir}`}>
                  {opt.label}
                </option>
              ))}
            </select>
          </SelectWrap>

          {/* Results pill */}
          <div className="flex items-end shrink-0">
            <div className="bg-slate-100 rounded-full px-4 py-2.5 text-[12px] font-semibold text-slate-500 border border-slate-200 whitespace-nowrap">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* ACTIVE FILTER CHIPS */}
        {(searchQuery || statusFilter !== 'ALL' || jobFilter !== 'ALL' || deptFilter !== 'ALL') && (
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400 font-bold mr-1">Filters</span>
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="inline-flex items-center gap-1.5 rounded-full bg-[#1e3a5f]/10 text-[#1e3a5f] border border-[#1e3a5f]/10 px-3 py-1.5 text-xs font-semibold hover:bg-[#1e3a5f]/15 hover:-translate-y-0.5 transition-all duration-200">
                "{searchQuery}" <span className="opacity-60">×</span>
              </button>
            )}
            {jobFilter !== 'ALL' && (
              <button onClick={() => setJobFilter('ALL')} className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1.5 text-xs font-semibold hover:bg-slate-200 hover:-translate-y-0.5 transition-all duration-200">
                {jobFilter} <span className="opacity-60">×</span>
              </button>
            )}
            {deptFilter !== 'ALL' && (
              <button onClick={() => setDeptFilter('ALL')} className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1.5 text-xs font-semibold hover:bg-slate-200 hover:-translate-y-0.5 transition-all duration-200">
                {deptFilter} <span className="opacity-60">×</span>
              </button>
            )}
            {statusFilter !== 'ALL' && (
              <button onClick={() => setStatusFilter('ALL')} className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1.5 text-xs font-semibold hover:bg-slate-200 hover:-translate-y-0.5 transition-all duration-200">
                {statusFilter} <span className="opacity-60">×</span>
              </button>
            )}
            <button
              onClick={() => { setSearchQuery(''); setStatusFilter('ALL'); setJobFilter('ALL'); setDeptFilter('ALL'); }}
              className="text-[11px] font-semibold text-slate-400 hover:text-red-500 transition-colors ml-1"
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

            {/* TABLE HEADER — flat mono labels, consistent with Employees page */}
            <div
              className={`grid items-center gap-4 px-4 pt-3 pb-4 border-b border-[#bec9c8]/50 ${
                canSeeAllStatuses
                  ? 'grid-cols-[1.1fr_1fr_1fr_1.3fr_1.1fr_120px_140px_60px]'
                  : canManageRows
                    ? 'grid-cols-[1.3fr_1.2fr_1.2fr_1.5fr_1.3fr_60px]'
                    : 'grid-cols-[1.3fr_1.2fr_1.2fr_1.5fr_1.3fr]'
              }`}
            >
              <ColHeader label="Emp. ID" />
              <ColHeader label="Job Code" />
              <ColHeader label="Dept Code" />
              <ColHeader label="Eff. Date" align="center" />
              <ColHeader label="Salary" />
              {canSeeAllStatuses && <ColHeader label="Status" align="center" />}
              {canSeeAllStatuses && <ColHeader label="Stamp" align="center" />}
              {canManageRows && <div />}
            </div>

            {/* ROWS */}
            {paginatedHistory.map(
              (item, idx) => {
                const rowId = `${f(
                  item,
                  'empNo',
                  'emp_no'
                )}-${idx}`;
                const isMenuOpen =
                  openMenuId === rowId;

                return (
                  <div
                    key={rowId}
                    className={`
                group
                grid items-center gap-4
                    ${canSeeAllStatuses
                        ? 'grid-cols-[1.1fr_1fr_1fr_1.3fr_1.1fr_120px_140px_60px]'
                        : canManageRows
                          ? 'grid-cols-[1.3fr_1.2fr_1.2fr_1.5fr_1.3fr_60px]'
                          : 'grid-cols-[1.3fr_1.2fr_1.2fr_1.5fr_1.3fr]'
                      }
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
                    <div className="font-mono font-bold text-[15px] text-slate-700 truncate">
                      #
                      {f(
                        item,
                        'empNo',
                        'emp_no'
                      )}
                    </div>

                    <div className="text-[14px] font-semibold text-slate-700 truncate">
                      {f(
                        item,
                        'jobCode',
                        'job_code'
                      )}
                    </div>

                    <div className="text-[14px] font-medium text-slate-600 truncate">
                      {f(
                        item,
                        'deptCode',
                        'dept_code'
                      )}
                    </div>

                    <div className="font-mono text-[13px] text-slate-600 flex justify-center">
                      {new Date(
                        f(
                          item,
                          'effDate',
                          'eff_date'
                        )
                      ).toLocaleDateString()}
                    </div>

                    <div className="font-mono font-semibold text-slate-700">
                      $
                      {Number(
                        item.salary || 0
                      ).toLocaleString()}
                    </div>

                    {canSeeAllStatuses && (
                      <div className="flex justify-center">
                        <Badge
                          variant={
                            item.record_status ===
                              'ACTIVE'
                              ? 'active'
                              : 'inactive'
                          }
                        >
                          {
                            item.record_status
                          }
                        </Badge>
                      </div>
                    )}

                    {canSeeAllStatuses && (
                      <div className="flex flex-col items-center justify-center text-center">
                        {(() => {
                          const stampStr = item.stamp || '';
                          const spaceIdx = stampStr.indexOf(' ');
                          const datePart = spaceIdx === -1 ? stampStr : stampStr.substring(0, spaceIdx);
                          const timePart = spaceIdx === -1 ? '' : stampStr.substring(spaceIdx + 1);
                          
                          return (
                            <>
                              <span className="font-mono text-[11px] font-bold text-[#3f4948] leading-tight">
                                {datePart || '—'}
                              </span>
                              {timePart && (
                                <span className="font-mono text-[9px] font-medium text-[#6f7979] mt-0.5 leading-tight">
                                  {timePart}
                                </span>
                              )}
                            </>
                          );
                        })() || '—'}
                      </div>
                    )}

                    {canManageRows && (
                      <div className="relative flex justify-end">
                        <button
                          onClick={() =>
                            setOpenMenuId(
                              isMenuOpen
                                ? null
                                : rowId
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
                            {can('JH_EDIT') && (
                              <button
                                onClick={() => {
                                  setOpenMenuId(
                                    null
                                  );
                                  handleEdit(item);
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
                                Edit Record
                              </button>
                            )}

                            {can('JH_DEL') &&
                              item.record_status ===
                                'ACTIVE' && (
                                <button
                                  onClick={() => {
                                    setOpenMenuId(
                                      null
                                    );
                                    handleSoftDelete(
                                      item
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
              }
            )}
          </div>

          {/* PAGINATION */}
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalItems={filtered.length}
              pageSize={PAGE_SIZE}
              onPageChange={
                setCurrentPage
              }
            />
          </div>
        </div>
      )}

      <JobHistoryModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        empNo={editingRecord?.empno}
        initialData={editingRecord}
        onSuccess={handleModalClose}
      />

      {/* Deactivation confirmation dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        icon="history_toggle_off"
        title="Deactivate History Record?"
        description={
          deleteTarget ? (
            <>
              You are about to deactivate the job history record for{' '}
              <strong className="text-[var(--color-on-surface)]">
                Employee #{f(deleteTarget, 'empNo', 'emp_no')}
              </strong>
              {' '}—{' '}
              <span className="font-mono">
                {f(deleteTarget, 'jobCode', 'job_code')}
              </span>
              {' '}in{' '}
              <span className="font-mono">
                {f(deleteTarget, 'deptCode', 'dept_code')}
              </span>
              {' '}effective{' '}
              <span className="font-mono">
                {new Date(f(deleteTarget, 'effDate', 'eff_date')).toLocaleDateString()}
              </span>.
              <br /><br />
              This will set the record to{' '}
              <strong className="text-[var(--color-error)]">INACTIVE</strong>.
              It can be recovered from the Deleted Items page.
            </>
          ) : null
        }
        confirmLabel="Deactivate Record"
        confirmVariant="danger"
        onCancel={() => { if (!deleteLoading) setDeleteTarget(null); }}
        onConfirm={confirmSoftDelete}
        loading={deleteLoading}
      />

      <ToastContainer toasts={toast.toasts} onDismiss={toast.dismiss} />
    </div>
  );
}
