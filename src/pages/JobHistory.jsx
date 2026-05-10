import { useState, useEffect } from 'react';
import { useRights } from '../context/UserRightsContext';

import {
  getAllJobHistory,
  softDeleteJobHistory,
} from '../services/jobHistoryService';

import { Badge } from '../components/ui/Badge';
import { Pagination } from '../components/ui/Pagination';

import JobHistoryModal from '../components/modals/JobHistoryModal';

const PAGE_SIZE = 10;

export default function JobHistory() {
  const { can, currentUser } = useRights();

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

  const fetchAll = async () => {
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
  };

  useEffect(() => {
    if (currentUser) fetchAll();
  }, [currentUser]);

  const f = (
    row,
    camel,
    snake
  ) =>
    row[camel.toLowerCase()] ??
    row[camel] ??
    row[snake] ??
    '';

  const handleSoftDelete = async (
    item
  ) => {
    const label = `Emp #${f(
      item,
      'empNo',
      'emp_no'
    )}`;

    if (
      !window.confirm(
        `Deactivate record: ${label}?`
      )
    )
      return;

    const id = {
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
    };

    const { error: delErr } =
      await softDeleteJobHistory(id);

    if (delErr) {
      alert(
        `Failed to deactivate: ${delErr.message}`
      );
    } else {
      fetchAll();
    }
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

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) =>
        d === 'asc'
          ? 'desc'
          : 'asc'
      );
    } else {
      setSortField(field);
      setSortDir('asc');
    }
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

  const paginatedHistory =
    filtered.slice(
      (currentPage - 1) *
      PAGE_SIZE,
      currentPage * PAGE_SIZE
    );

  const SortIcon = ({
    field,
  }) => (
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
        <div className="flex flex-wrap items-end gap-4">
          {/* SEARCH */}
          <div className="flex flex-col gap-1 flex-1 min-w-[240px]">
            <label className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400 font-bold">
              Search
            </label>

            <input
              type="text"
              placeholder="Employee, job, or department"
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(
                  e.target.value
                )
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

          {/* JOB FILTER */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400 font-bold">
              Job
            </label>

            <select
              value={jobFilter}
              onChange={(e) =>
                setJobFilter(
                  e.target.value
                )
              }
              className={selectCls}
            >
              <option value="ALL">
                All jobs
              </option>

              {[
                ...new Set(
                  history.map((i) =>
                    f(
                      i,
                      'jobCode',
                      'job_code'
                    )
                  )
                ),
              ]
                .filter(Boolean)
                .sort()
                .map((job) => (
                  <option
                    key={job}
                    value={job}
                  >
                    {job}
                  </option>
                ))}
            </select>
          </div>

          {/* DEPARTMENT FILTER */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400 font-bold">
              Department
            </label>

            <select
              value={deptFilter}
              onChange={(e) =>
                setDeptFilter(
                  e.target.value
                )
              }
              className={selectCls}
            >
              <option value="ALL">
                All departments
              </option>

              {[
                ...new Set(
                  history.map((i) =>
                    f(
                      i,
                      'deptCode',
                      'dept_code'
                    )
                  )
                ),
              ]
                .filter(Boolean)
                .sort()
                .map((dept) => (
                  <option
                    key={dept}
                    value={dept}
                  >
                    {dept}
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
                  setStatusFilter(
                    e.target.value
                  )
                }
                className={selectCls}
              >
                <option value="ALL">
                  All
                </option>

                <option value="ACTIVE">
                  Active
                </option>

                <option value="INACTIVE">
                  Inactive
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
          statusFilter !== 'ALL' ||
          jobFilter !== 'ALL' ||
          deptFilter !== 'ALL') && (
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

              {statusFilter !== 'ALL' && (
                <button
                  onClick={() =>
                    setStatusFilter(
                      'ALL'
                    )
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

              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter(
                    'ALL'
                  );
                  setJobFilter('ALL');
                  setDeptFilter(
                    'ALL'
                  );
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

            {/* HEADER */}
            <div
              className={`
          grid items-center gap-4 px-4 py-2
          ${can('ADM_USER')
                  ? 'grid-cols-[1.1fr_1fr_1fr_1.3fr_1.1fr_120px_60px]'
                  : 'grid-cols-[1.3fr_1.2fr_1.2fr_1.5fr_1.3fr]'
                }
        `}
            >
              {[
                ['empno', 'Employee'],
                ['jobcode', 'Job'],
                ['deptcode', 'Department'],
                ['effdate', 'Effective'],
                ['salary', 'Salary'],
              ].map(([field, label]) => (
                <button
                  key={field}
                  onClick={() =>
                    toggleSort(field)
                  }
                  className="
              inline-flex items-center gap-1
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
              hover:-translate-y-0.5
              hover:shadow-[0_8px_18px_rgba(0,0,0,0.10),0_2px_6px_rgba(0,0,0,0.05)]
              shadow-[0_4px_10px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]
              w-fit
            "
                >
                  {label}
                  <SortIcon field={field} />
                </button>
              ))}

              {can('ADM_USER') && (
                <div className="text-center text-[11px] font-mono font-bold uppercase tracking-[0.18em] text-slate-500">
                  Status
                </div>
              )}

              {can('ADM_USER') && <div />}
            </div>

            {/* ROWS */}
            {paginatedHistory.map(
              (item, idx) => {
                const rowId = `${f(
                  item,
                  'empNo',
                  'emp_no'
                )}-${idx}`;

                return (
                  <div
                    key={rowId}
                    className={`
                group
                grid items-center gap-4
                ${can('ADM_USER')
                        ? 'grid-cols-[1.1fr_1fr_1fr_1.3fr_1.1fr_120px_60px]'
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

                    <div className="font-mono text-[13px] text-slate-600">
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

                    {can('ADM_USER') && (
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

                    {can('ADM_USER') && (
                      <div className="relative flex justify-end">
                        <button
                          onClick={() =>
                            setOpenMenuId(
                              openMenuId ===
                                rowId
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
    </div>
  );
}