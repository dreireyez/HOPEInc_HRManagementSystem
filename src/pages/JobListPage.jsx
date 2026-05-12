import { useState, useEffect, useCallback } from 'react';
import { useRights } from '../context/UserRightsContext';
import JobModal from '../components/modals/JobModal';

import {
  getJobs,
  softDeleteJob,
} from '../services/jobService';

import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Pagination } from '../components/ui/Pagination';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { ToastContainer } from '../components/ui/Toast';
import { useToast } from '../components/ui/useToast';

const PAGE_SIZE = 10;

/** Sort presets for the unified Sort By dropdown. */
const SORT_OPTIONS = [
  { label: 'Job Code (A–Z)',       field: 'jobCode', dir: 'asc'  },
  { label: 'Job Code (Z–A)',       field: 'jobCode', dir: 'desc' },
  { label: 'Description (A–Z)',   field: 'jobDesc', dir: 'asc'  },
  { label: 'Description (Z–A)',   field: 'jobDesc', dir: 'desc' },
];

export default function JobListPage() {
  const { can, currentUser } = useRights();
  const toast = useToast();
  const canSeeAdminMetadata =
    currentUser?.user_type &&
    currentUser.user_type !== 'USER';
  const canManageRows =
    can('JOB_EDIT') || can('JOB_DEL');

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState(null);

  const [editingJob, setEditingJob] =
    useState(null);

  const [sortField, setSortField] =
    useState('jobCode');

  const [sortDir, setSortDir] =
    useState('asc');

  const [currentPage, setCurrentPage] =
    useState(1);

  const [searchQuery, setSearchQuery] =
    useState('');

  const [statusFilter, setStatusFilter] =
    useState('ALL');

  const [openMenuId, setOpenMenuId] =
    useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null); // { code, desc }
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } =
        await getJobs(
          currentUser?.user_type || 'USER'
        );

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setJobs(data || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.user_type]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleOpenModal = (job = null) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingJob(null);
    fetchJobs();
  };

  const handleSoftDelete = (jobCode, jobDesc) => {
    setDeleteTarget({ code: jobCode, desc: jobDesc });
  };

  const confirmSoftDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    const { error: delErr } = await softDeleteJob(deleteTarget.code);
    setDeleteLoading(false);
    if (delErr) {
      toast.push(`Failed to deactivate: ${delErr.message}`, 'error');
    } else {
      toast.push(`Job "${deleteTarget.code}" has been deactivated.`);
      fetchJobs();
    }
    setDeleteTarget(null);
  };

  const sortKey = `${sortField}__${sortDir}`;

  const handleSortChange = (e) => {
    const [field, dir] = e.target.value.split('__');
    setSortField(field);
    setSortDir(dir);
  };

  const f = (row, camel, snake) =>
    row[camel.toLowerCase()] ??
    row[camel] ??
    row[snake] ??
    '';

  const filteredJobs = jobs
    .filter((job) => {
      const code = f(
        job,
        'jobCode',
        'job_code'
      );

      const desc = f(
        job,
        'jobDesc',
        'job_desc'
      );

      if (
        statusFilter !== 'ALL' &&
        job.record_status !== statusFilter
      ) {
        return false;
      }

      if (!searchQuery) {
        return true;
      }

      const q =
        searchQuery.toLowerCase();

      return (
        code.toLowerCase().includes(q) ||
        desc.toLowerCase().includes(q)
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

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (
          bVal || ''
        ).toLowerCase();
      }

      if (aVal < bVal)
        return sortDir === 'asc'
          ? -1
          : 1;

      if (aVal > bVal)
        return sortDir === 'asc'
          ? 1
          : -1;

      return 0;
    });

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredJobs.length / PAGE_SIZE
    )
  );

  const paginatedJobs =
    filteredJobs.slice(
      (currentPage - 1) * PAGE_SIZE,
      currentPage * PAGE_SIZE
    );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    setCurrentPage((page) =>
      Math.min(page, totalPages)
    );
  }, [totalPages]);


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
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Job Catalogue
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Organizational role
            management
          </p>
        </div>

        {can('JOB_ADD') && (
          <Button
            onClick={() =>
              handleOpenModal()
            }
            className="px-5 py-2"
          >
            + Post New Job
          </Button>
        )}
      </header>

      {/* FILTERS + SORT BY — unified control panel */}
      <div className="relative rounded-[1.8rem] px-5 pt-4 pb-3 flex flex-col gap-3 border border-slate-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.10)] hover:-translate-y-0.5 transition-all duration-300 bg-white">
        <div className="flex flex-wrap items-end gap-3">
          {/* Search */}
          <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
            <label className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400 font-bold">Search</label>
            <input
              type="text"
              placeholder="Search job code or description"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition-all duration-200 hover:border-slate-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
            />
          </div>

          {/* Status — admin only */}
          {canSeeAdminMetadata && (
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
          <SelectWrap className="flex-1 min-w-[170px]">
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
              {filteredJobs.length} result{filteredJobs.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* ACTIVE FILTER CHIPS */}
        {(searchQuery || statusFilter !== 'ALL') && (
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400 font-bold mr-1">Filters</span>
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="inline-flex items-center gap-1.5 rounded-full bg-[#1e3a5f]/10 text-[#1e3a5f] border border-[#1e3a5f]/10 px-3 py-1.5 text-xs font-semibold hover:bg-[#1e3a5f]/15 hover:-translate-y-0.5 transition-all duration-200">
                "{searchQuery}" <span className="opacity-60">×</span>
              </button>
            )}
            {statusFilter !== 'ALL' && (
              <button onClick={() => setStatusFilter('ALL')} className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1.5 text-xs font-semibold hover:bg-slate-200 hover:-translate-y-0.5 transition-all duration-200">
                {statusFilter} <span className="opacity-60">×</span>
              </button>
            )}
            <button
              onClick={() => { setSearchQuery(''); setStatusFilter('ALL'); }}
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
                canSeeAdminMetadata
                  ? 'grid-cols-[160px_1fr_120px_140px_60px]'
                  : canManageRows
                    ? 'grid-cols-[160px_1fr_60px]'
                    : 'grid-cols-[160px_1fr]'
              }`}
            >
              <ColHeader label="Job Code" />
              <ColHeader label="Description" />
              {canSeeAdminMetadata && <ColHeader label="Status" align="center" />}
              {canSeeAdminMetadata && <ColHeader label="Stamp" align="center" />}
              {canManageRows && <div />}
            </div>

            {/* ROWS */}
            {paginatedJobs.map((job) => {
              const code = f(
                job,
                'jobCode',
                'job_code'
              );

              const desc = f(
                job,
                'jobDesc',
                'job_desc'
              );

              return (
                <div
                  key={
                    code ||
                    job.id ||
                    desc
                  }
                  className={`
                    group
                    grid items-center gap-4
                    ${canSeeAdminMetadata
                      ? 'grid-cols-[160px_1fr_120px_140px_60px]'
                      : canManageRows
                        ? 'grid-cols-[160px_1fr_60px]'
                        : 'grid-cols-[160px_1fr]'
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
                  {/* CODE */}
                  <div className="font-mono font-bold text-[15px] text-slate-700 truncate">
                    {code}
                  </div>

                  {/* DESCRIPTION */}
                  <div className="text-[14px] font-semibold text-slate-700 truncate">
                    {desc}
                  </div>

                  {/* STATUS */}
                  {canSeeAdminMetadata && (
                    <div className="flex justify-center">
                      <Badge
                        variant={
                          job.record_status ===
                            'ACTIVE'
                            ? 'active'
                            : 'inactive'
                        }
                      >
                        {
                          job.record_status
                        }
                      </Badge>
                    </div>
                  )}

                  {/* STAMP */}
                  {canSeeAdminMetadata && (
                    <div className="flex flex-col items-center justify-center text-center">
                      {(() => {
                        const stampStr = job.stamp || '';
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

                  {/* ACTIONS */}
                  {canManageRows && (
                    <div className="relative flex justify-end">
                      <button
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId ===
                              code
                              ? null
                              : code
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

                      {openMenuId ===
                        code && (
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
                            {can(
                              'JOB_EDIT'
                            ) && (
                                <button
                                  onClick={() => {
                                    setOpenMenuId(
                                      null
                                    );

                                    handleOpenModal(
                                      job
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
                                  Edit Job
                                </button>
                              )}

                            {can(
                              'JOB_DEL'
                            ) &&
                              job.record_status ===
                              'ACTIVE' && (
                                <button
                                  onClick={() => {
                                    setOpenMenuId(
                                      null
                                    );

                                    handleSoftDelete(
                                      code
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
              totalItems={
                filteredJobs.length
              }
              pageSize={PAGE_SIZE}
              onPageChange={
                setCurrentPage
              }
            />
          </div>
        </div>
      )}

      <JobModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialData={editingJob}
      />

      {/* Deactivation confirmation dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        icon="work_off"
        title="Deactivate Job?"
        description={
          deleteTarget ? (
            <>
              You are about to deactivate job{' '}
              <strong className="text-[var(--color-on-surface)] font-mono">
                {deleteTarget.code}
              </strong>
              {deleteTarget.desc ? (
                <> — {deleteTarget.desc}</>
              ) : null}.
              <br /><br />
              This will set its status to{' '}
              <strong className="text-[var(--color-error)]">INACTIVE</strong> and
              hide it from standard views. It can be recovered from the Deleted Items page.
            </>
          ) : null
        }
        confirmLabel="Deactivate Job"
        confirmVariant="danger"
        onCancel={() => { if (!deleteLoading) setDeleteTarget(null); }}
        onConfirm={confirmSoftDelete}
        loading={deleteLoading}
      />

      <ToastContainer toasts={toast.toasts} onDismiss={toast.dismiss} />
    </div>
  );
}
