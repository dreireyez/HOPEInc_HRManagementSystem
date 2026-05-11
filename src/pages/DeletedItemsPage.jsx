import { useState, useEffect, useCallback } from 'react';
import { useRights } from '../context/UserRightsContext';
import { getEmployees, recoverEmployee } from '../services/employeeService';
import { getJobs, recoverJob } from '../services/jobService';
import { getDepts, recoverDept } from '../services/departmentService';
import { getAllJobHistory, recoverJobHistory } from '../services/jobHistoryService';
import { Table, Thead, Tbody, Tr, Th, Td } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
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
      <header>
        <h1 className="text-2xl font-bold text-[var(--color-on-surface)] tracking-tight">Recovery Vault</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Restore inactive or soft-deleted records</p>
      </header>

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
        <div className="bg-[var(--color-error-container)] border border-[var(--color-error)]/20 rounded-md p-4 shadow-inset">
          <p className="text-[var(--color-on-error-container)] font-medium text-sm">Error: {error}</p>
        </div>
      )}

      <Card className="p-0 overflow-hidden border-none shadow-outset">
        <div className="p-6 border-b border-[var(--color-outline-variant)]/30 bg-[var(--color-surface-dim)] flex justify-between items-center shadow-inset">
          <h3 className="text-lg font-bold text-[var(--color-on-surface)] tracking-tight">Archived {activeTab}</h3>
          <span className="text-[10px] font-mono font-bold bg-[var(--color-error-container)] text-[var(--color-on-error-container)] px-3 py-1 rounded-full uppercase tracking-wider">
            {items.length} Record{items.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 bg-[var(--color-surface)]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[var(--color-primary-container)]"></div>
          </div>
        ) : (
          <Table className="shadow-none rounded-none">
            <Thead className="bg-[var(--color-surface)]">
              <Tr>
                <Th>Record Name/Code</Th>
                <Th>Identifier</Th>
                <Th className="text-right">Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedItems.length > 0 ? (
                paginatedItems.map((item, idx) => (
                  <Tr key={idx} className="group">
                    <Td>
                      <div className="flex items-center gap-3">
                        <div className="table-lead-token table-lead-token-md">
                          <span className="material-symbols-outlined text-[18px]">inventory_2</span>
                        </div>
                        <div className="font-bold text-[var(--color-on-surface)]">{getItemLabel(item)}</div>
                      </div>
                    </Td>
                    <Td>
                      <div className="text-[10px] font-mono text-[var(--color-on-surface-variant)] uppercase font-bold tracking-wider">
                        {getItemCode(item)}
                      </div>
                    </Td>
                    <Td className="text-right">
                      <Button
                        onClick={() => handleRecover(item)}
                        variant="ghost"
                        className="text-[var(--color-primary-container)] hover:bg-[var(--color-primary-container)]/10 flex items-center gap-2 justify-end ml-auto"
                      >
                        <span className="material-symbols-outlined text-[18px]">settings_backup_restore</span>
                        <span className="text-xs uppercase tracking-wider font-semibold">Recover</span>
                      </Button>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan="3" className="py-12 text-center text-[var(--color-on-surface-variant)] font-medium">
                    No inactive {activeTab.toLowerCase()} found.
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        )}
        {!loading && (
          <div className="px-6 pb-6">
            <Pagination
              currentPage={currentPage}
              totalItems={items.length}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </Card>
    </div>
  );
}
