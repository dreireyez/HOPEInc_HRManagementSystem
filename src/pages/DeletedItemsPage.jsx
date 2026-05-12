import { useState, useEffect, useCallback } from 'react';
import { useRights } from '../context/UserRightsContext';
import { getEmployees, recoverEmployee } from '../services/employeeService';
import { getJobs, recoverJob } from '../services/jobService';
import { getDepts, recoverDept } from '../services/departmentService';
import { getAllJobHistory, recoverJobHistory } from '../services/jobHistoryService';
import { Button } from '../components/ui/Button';
import { Pagination } from '../components/ui/Pagination';

const PAGE_SIZE = 10;

export default function DeletedItemsPage() {
  const { currentUser } = useRights();
  const userRole = currentUser?.user_type || 'USER';
  const [activeTab, setActiveTab] = useState('Employees');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const tabs = ['Employees', 'Job History', 'Jobs', 'Departments'];

  const pick = (item, ...keys) => {
    for (const key of keys) {
      if (item?.[key] !== undefined && item?.[key] !== null && item?.[key] !== '') {
        return item[key];
      }
    }
    return '';
  };

  const fetchInactiveItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data = [];
      if (activeTab === 'Employees') {
        const res = await getEmployees('ADMIN');
        data = (res.data || []).filter((r) => r.record_status === 'INACTIVE');
      } else if (activeTab === 'Jobs') {
        const res = await getJobs('ADMIN');
        data = (res.data || []).filter((r) => r.record_status === 'INACTIVE');
      } else if (activeTab === 'Departments') {
        const res = await getDepts('ADMIN');
        data = (res.data || []).filter((r) => r.record_status === 'INACTIVE');
      } else if (activeTab === 'Job History') {
        const res = await getAllJobHistory('ADMIN');
        data = (res.data || []).filter((r) => r.record_status === 'INACTIVE');
      }
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    if (userRole !== 'USER') {
      fetchInactiveItems();
    }
  }, [fetchInactiveItems, userRole]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const paginatedItems = items.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const handleRecover = async (item) => {
    let result;

    try {
      if (activeTab === 'Employees') {
        result = await recoverEmployee(pick(item, 'empno', 'empNo', 'emp_no'));
      } else if (activeTab === 'Jobs') {
        result = await recoverJob(pick(item, 'jobcode', 'jobCode', 'job_code'));
      } else if (activeTab === 'Departments') {
        result = await recoverDept(pick(item, 'deptcode', 'deptCode', 'dept_code'));
      } else if (activeTab === 'Job History') {
        result = await recoverJobHistory({
          empno: pick(item, 'empno', 'empNo', 'emp_no'),
          jobcode: pick(item, 'jobcode', 'jobCode', 'job_code'),
          effdate: pick(item, 'effdate', 'effDate', 'eff_date'),
        });
      }

      if (result?.error) {
        throw result.error;
      }

      fetchInactiveItems();
    } catch (err) {
      alert(`Recovery failed: ${err.message}`);
    }
  };

  const getItemLabel = (item) => {
    if (activeTab === 'Employees') return `${item.firstname || ''} ${item.lastname || ''}`.trim() || pick(item, 'empno', 'empNo', 'emp_no');
    if (activeTab === 'Jobs') return pick(item, 'jobdesc', 'jobDesc', 'job_code', 'jobCode', 'jobcode');
    if (activeTab === 'Departments') return pick(item, 'deptname', 'deptName', 'dept_code', 'deptCode', 'deptcode');
    if (activeTab === 'Job History') return `Emp #${pick(item, 'empno', 'empNo', 'emp_no')} - ${pick(item, 'jobcode', 'jobCode', 'job_code') || 'N/A'}`;
    return 'Unknown';
  };

  const getItemCode = (item) => {
    if (activeTab === 'Employees') return `#${pick(item, 'empno', 'empNo', 'emp_no')}`;
    if (activeTab === 'Jobs') return pick(item, 'jobcode', 'jobCode', 'job_code');
    if (activeTab === 'Departments') return pick(item, 'deptcode', 'deptCode', 'dept_code');
    if (activeTab === 'Job History') {
      return [
        `#${pick(item, 'empno', 'empNo', 'emp_no')}`,
        pick(item, 'jobcode', 'jobCode', 'job_code'),
        pick(item, 'effdate', 'effDate', 'eff_date'),
      ].filter(Boolean).join(' / ');
    }
    return '';
  };

  /** Returns the Material Symbols icon name for the active tab category. */
  const getTabIcon = () => {
    if (activeTab === 'Employees') return 'person_off';
    if (activeTab === 'Jobs') return 'work_off';
    if (activeTab === 'Departments') return 'domain_disabled';
    if (activeTab === 'Job History') return 'history_toggle_off';
    return 'inventory_2';
  };

  if (userRole === 'USER') {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center">
        <span className="material-symbols-outlined text-6xl text-[var(--color-error)] mb-4">shield_person</span>
        <h2 className="text-2xl font-bold text-[var(--color-on-surface)] tracking-tight">Access Restricted</h2>
        <p className="text-[var(--color-on-surface-variant)] text-sm mt-2 max-w-xs">
          Only Administrators can access the Recovery Vault.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* HEADER — matches Employee/Dept pages */}
      <header className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.26em] text-[var(--color-primary-container)] font-bold">
            Administration
          </span>
          <h1 className="mt-1.5 text-3xl font-black text-[var(--color-on-surface)] tracking-tight">
            Recovery Vault
          </h1>
          <p className="text-[var(--color-on-surface-variant)] text-sm mt-1 max-w-2xl">
            Restore inactive or soft-deleted records across all modules.
          </p>
        </div>

        {/* Results pill — matches Employee/Job filter bar pill */}
        <div className="bg-slate-100 rounded-full px-4 py-2 text-[12px] font-semibold text-slate-500 border border-slate-200 self-start mt-2 md:mt-0">
          {items.length} archived record{items.length !== 1 ? 's' : ''}
        </div>
      </header>

      {/* TAB BAR */}
      <div className="flex gap-4 border-b border-[var(--color-outline-variant)]/30 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-xs font-mono font-bold uppercase tracking-widest transition-all relative whitespace-nowrap cursor-pointer ${
              activeTab === tab
                ? 'text-[var(--color-primary-container)]'
                : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-primary-container)] rounded-t-sm" />
            )}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-[var(--color-error-container)] border border-[var(--color-error)]/20 rounded-2xl p-4 shadow-inset">
          <p className="text-[var(--color-on-error-container)] font-medium text-sm">Error: {error}</p>
        </div>
      )}

      {/* MAIN CONTENT — neumorphic card container matching Employee/Job pages */}
      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-10 h-10 border-2 border-slate-200 border-t-[#1e3a5f] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] p-5 border border-slate-100 shadow-[0_4px_40px_-10px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="flex flex-col gap-3">

            {/* Column Headers — pill-style like Employee/Job pages */}
            <div className="grid items-center gap-3 px-3 py-2 grid-cols-[2fr_1fr_100px]">
              {[
                ['Record', 'left'],
                ['Identifier', 'left'],
                ['Action', 'right'],
              ].map(([label, align]) => (
                <div
                  key={label}
                  className={`
                    inline-flex items-center gap-1
                    text-[11px]
                    font-mono
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-slate-500
                    bg-slate-50
                    border border-slate-200
                    rounded-full
                    px-3 py-1.5
                    shadow-[0_4px_10px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]
                    ${align === 'right' ? 'justify-end ml-auto w-fit' : 'justify-start w-fit'}
                  `}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* ROWS — neumorphic card-rows matching Employee/Job pages */}
            {paginatedItems.length > 0 ? (
              paginatedItems.map((item, idx) => (
                <div
                  key={idx}
                  className="
                    group
                    grid items-center gap-3
                    grid-cols-[2fr_1fr_100px]
                    px-4 py-4
                    rounded-[1.6rem]
                    bg-white
                    border border-slate-100
                    shadow-[0_6px_18px_rgba(15,23,42,0.06),0_2px_6px_rgba(15,23,42,0.04)]
                    hover:border-slate-200
                    hover:shadow-[0_24px_50px_-12px_rgba(15,23,42,0.18),0_10px_24px_rgba(15,23,42,0.08)]
                    hover:-translate-y-1
                    transition-all duration-300
                  "
                >
                  {/* Record Name */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#315784] text-white flex items-center justify-center shrink-0 shadow-[0_6px_14px_rgba(30,58,95,0.25)] ring-1 ring-white/40 transition-all duration-300 group-hover:scale-105">
                      <span className="material-symbols-outlined text-[18px]">inventory_2</span>
                    </div>
                    <div className="min-w-0">
                      <div className="text-[15px] font-bold text-slate-800 leading-tight truncate">
                        {getItemLabel(item)}
                      </div>
                    </div>
                  </div>

                  {/* Identifier */}
                  <div className="text-[12px] font-mono font-bold text-slate-400 truncate uppercase tracking-wider">
                    {getItemCode(item)}
                  </div>

                  {/* Action */}
                  <div className="flex justify-end">
                    <Button
                      onClick={() => handleRecover(item)}
                      variant="ghost"
                      className="text-[var(--color-primary-container)] hover:bg-[var(--color-primary-container)]/10 inline-flex items-center gap-2 justify-end"
                    >
                      <span className="material-symbols-outlined text-[18px]">settings_backup_restore</span>
                      <span className="text-xs uppercase tracking-wider font-semibold">Recover</span>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              /* Empty state — centered within the neumorphic container */
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">{getTabIcon()}</span>
                <p className="text-slate-500 font-medium text-sm">
                  No inactive {activeTab.toLowerCase()} found.
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  Deactivated records will appear here for recovery.
                </p>
              </div>
            )}
          </div>

          {/* PAGINATION */}
          <div className="mt-5">
            <Pagination
              currentPage={currentPage}
              totalItems={items.length}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      )}
    </div>
  );
}
