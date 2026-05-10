import { useState, useEffect } from 'react';
import { getHeadcountByDept, getSalarySummaryByJob, getEmployeeFullHistory } from '../services/reportService';
import { getEmployees } from '../services/employeeService';
import { useRights } from '../context/UserRightsContext';
import { Table, Thead, Tbody, Tr, Th, Td } from '../components/ui/Table';
import { Card } from '../components/ui/Card';
import { Pagination } from '../components/ui/Pagination';

const PAGE_SIZE = 10;

export default function Reports() {
  const { currentUser } = useRights();
  const [activeTab, setActiveTab] = useState('Headcount');
  const tabs = ['Headcount', 'Salary Summary', 'Employee History'];

  const [headcountData, setHeadcountData] = useState([]);
  const [salaryData, setSalaryData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmpNo, setSelectedEmpNo] = useState('');
  const [loading, setLoading] = useState(false);
  const [headcountPage, setHeadcountPage] = useState(1);
  const [salaryPage, setSalaryPage] = useState(1);

  const getHeadcount = (row) => row.activeheadcount ?? row.headcount ?? row.count ?? 0;
  const getDeptName = (row) => row.deptname ?? row.dept_name ?? 'Unknown';

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const [hcRes, salRes, empRes] = await Promise.all([
          getHeadcountByDept(),
          getSalarySummaryByJob(),
          getEmployees(currentUser?.user_type || 'USER'),
        ]);
        setHeadcountData(hcRes.data || []);
        setSalaryData(salRes.data || []);
        setEmployees((empRes.data || []).filter((e) => e.record_status === 'ACTIVE'));
      } catch (err) {
        console.error('Report fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser) fetchReports();
  }, [currentUser]);

  useEffect(() => {
    if (!selectedEmpNo) {
      setHistoryData([]);
      return;
    }
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const { data } = await getEmployeeFullHistory(selectedEmpNo);
        setHistoryData(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [selectedEmpNo]);

  const totalHeadcount = headcountData.reduce((sum, d) => sum + getHeadcount(d), 0);
  const paginatedHeadcount = headcountData.slice((headcountPage - 1) * PAGE_SIZE, headcountPage * PAGE_SIZE);
  const paginatedSalary = salaryData.slice((salaryPage - 1) * PAGE_SIZE, salaryPage * PAGE_SIZE);

  useEffect(() => {
    setHeadcountPage((page) => Math.min(page, Math.max(1, Math.ceil(headcountData.length / PAGE_SIZE))));
  }, [headcountData]);

  useEffect(() => {
    setSalaryPage((page) => Math.min(page, Math.max(1, Math.ceil(salaryData.length / PAGE_SIZE))));
  }, [salaryData]);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-[var(--color-on-surface)] tracking-tight">Analytics & Reports</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Organizational insights.</p>
      </header>

      <div className="flex flex-wrap gap-2 rounded-2xl surface-panel p-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab-trigger px-4 py-2 text-xs font-mono font-bold uppercase tracking-[0.2em] cursor-pointer ${
              activeTab === tab
                ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary-container)] shadow-inset'
                : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading && (
        <div className="surface-panel rounded-[var(--radius-xl)] py-20 flex items-center justify-center">
          <div className="skeleton h-10 w-10 rounded-full" />
        </div>
      )}

      {!loading && activeTab === 'Headcount' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2" padding="md">
            <h2 className="text-lg font-bold text-[var(--color-on-surface)] mb-6">Headcount Distribution</h2>
            <div className="space-y-5">
              {headcountData.length > 0 ? (
                headcountData.map((item, idx) => {
                  const count = getHeadcount(item);
                  const pct = totalHeadcount > 0 ? ((count / totalHeadcount) * 100).toFixed(1) : 0;
                  return (
                    <div key={item.deptcode || getDeptName(item) || idx} className="interactive-surface rounded-2xl p-4">
                      <div className="flex justify-between text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)] mb-2">
                        <span>{getDeptName(item)}</span>
                        <span className="text-[var(--color-on-surface)]">{count} Employees</span>
                      </div>
                      <div className="h-2.5 w-full bg-[var(--color-surface-container)] rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--color-primary-container)] rounded-full transition-all duration-700 ease-out" style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-[var(--color-on-surface-variant)] font-medium text-sm">No headcount data available.</p>
              )}
            </div>
          </Card>

          <Card className="lg:col-span-1" padding="md">
            <h2 className="text-lg font-bold text-[var(--color-on-surface)] mb-4">Summary</h2>
            <Table className="shadow-none border-none bg-transparent" dense>
              <Thead>
                <Tr>
                  <Th>Dept</Th>
                  <Th className="text-right">Total</Th>
                  <Th className="text-right">%</Th>
                </Tr>
              </Thead>
              <Tbody>
                {paginatedHeadcount.map((item, idx) => {
                  const count = getHeadcount(item);
                  const pct = totalHeadcount > 0 ? ((count / totalHeadcount) * 100).toFixed(1) : '0';
                  return (
                    <Tr key={item.deptcode || idx}>
                      <Td>
                        <div className="font-bold text-[var(--color-on-surface)]">{getDeptName(item)}</div>
                      </Td>
                      <Td className="text-right font-mono font-bold">{count}</Td>
                      <Td className="text-right text-[var(--color-on-surface-variant)] font-mono">{pct}%</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
            <Pagination
              currentPage={headcountPage}
              totalItems={headcountData.length}
              pageSize={PAGE_SIZE}
              onPageChange={setHeadcountPage}
              className="mt-4"
            />
          </Card>
        </div>
      )}

      {!loading && activeTab === 'Salary Summary' && (
        <Card className="p-0 overflow-hidden" padding="md">
          <div className="px-6 pt-6 pb-4 border-b border-[var(--color-outline-variant)]/55">
            <h2 className="text-lg font-bold text-[var(--color-on-surface)]">Salary Bands Overview</h2>
          </div>
          <div className="px-6 pb-6">
            <Table className="shadow-none rounded-none border-none bg-transparent">
              <Thead>
                <Tr>
                  <Th>Job Description</Th>
                  <Th className="text-right">Min Salary</Th>
                  <Th className="text-right">Max Salary</Th>
                  <Th className="text-right">Avg Salary</Th>
                </Tr>
              </Thead>
              <Tbody>
                {salaryData.length > 0 ? (
                  paginatedSalary.map((row, idx) => (
                    <Tr key={idx}>
                      <Td>
                        <div className="flex items-center gap-3">
                          <div className="table-lead-token table-lead-token-sm">
                            <span className="material-symbols-outlined text-[16px]">work</span>
                          </div>
                          <span className="font-medium text-[var(--color-on-surface)]">{row.job_desc || row.jobdesc || row.job_title || 'N/A'}</span>
                        </div>
                      </Td>
                      <Td className="text-right font-mono text-[var(--color-on-surface-variant)]">${(row.min_salary || row.minsalary || 0).toLocaleString()}</Td>
                      <Td className="text-right font-mono text-[var(--color-on-surface-variant)]">${(row.max_salary || row.maxsalary || 0).toLocaleString()}</Td>
                      <Td className="text-right">
                        <span className="inline-flex rounded-full bg-[var(--color-primary-soft)] px-3 py-1 text-[var(--color-primary-container)] font-mono font-bold text-xs border border-[var(--color-primary-container)]/12">
                          ${(row.avg_salary || row.avgsalary || 0).toLocaleString()}
                        </span>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan="4" className="py-8 text-center text-[var(--color-on-surface-variant)] font-medium">
                      No salary data available.
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
            <Pagination
              currentPage={salaryPage}
              totalItems={salaryData.length}
              pageSize={PAGE_SIZE}
              onPageChange={setSalaryPage}
              className="mt-4"
            />
          </div>
        </Card>
      )}

      {!loading && activeTab === 'Employee History' && (
        <div className="max-w-3xl mx-auto w-full">
          <Card className="mb-8 flex flex-col md:flex-row items-center gap-4" padding="md">
            <div className="w-10 h-10 rounded-full bg-[var(--color-surface-container)] flex items-center justify-center text-[var(--color-primary-container)] shadow-inset shrink-0">
              <span className="material-symbols-outlined">person</span>
            </div>
            <div className="field-shell rounded-xl w-full">
              <select
                value={selectedEmpNo}
                onChange={(e) => setSelectedEmpNo(e.target.value)}
                className="w-full bg-transparent rounded-xl py-3 px-4 text-[var(--color-on-surface)] font-medium text-sm outline-none cursor-pointer"
              >
                <option value="">Select an employee...</option>
                {employees.map((emp) => (
                  <option key={emp.empno} value={emp.empno}>
                    {emp.firstname} {emp.lastname} (#{emp.empno})
                  </option>
                ))}
              </select>
            </div>
          </Card>

          {selectedEmpNo && historyData.length > 0 && (
            <div>
              <h2 className="text-[10px] font-mono font-bold text-[var(--color-on-surface-variant)] mb-6 tracking-[0.24em] uppercase pl-4">
                Career Progression Timeline
              </h2>
              <div className="relative border-l-2 border-[var(--color-outline-variant)]/55 ml-6 pl-8 space-y-6 pb-8">
                {historyData.map((node, idx) => (
                  <div key={idx} className="relative">
                    <div className={`absolute -left-[38px] top-5 w-3.5 h-3.5 rounded-full ring-4 ring-[var(--color-surface)] ${idx === 0 ? 'bg-[var(--color-primary-container)]' : 'bg-[var(--color-outline)]'}`}></div>
                    <Card padding="md" interactive={idx === 0} className={idx === 0 ? 'border border-[var(--color-primary-container)]/20' : ''}>
                      <div className="flex justify-between items-start mb-3 gap-3">
                        <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-[0.2em] ${idx === 0 ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary-container)]' : 'bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]'}`}>
                          {node.eff_date || node.effdate || 'N/A'}
                        </span>
                        <span className={`font-mono font-bold tracking-tight ${idx === 0 ? 'text-[var(--color-on-surface)]' : 'text-[var(--color-on-surface-variant)]'}`}>
                          ${(node.salary || 0).toLocaleString()}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-[var(--color-on-surface)] mb-1 leading-tight">{node.job_desc || node.jobdesc || node.job_title || 'N/A'}</h3>
                      <p className="text-sm font-medium text-[var(--color-on-surface-variant)] flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]">domain</span>
                        {node.dept_name || node.deptname || 'N/A'}
                      </p>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedEmpNo && historyData.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-[var(--color-on-surface-variant)] font-medium text-sm">No history records found for this employee.</p>
            </div>
          )}

          {!selectedEmpNo && (
            <div className="text-center py-12">
              <p className="text-[var(--color-on-surface-variant)] font-medium text-sm">Select an employee above to view their career timeline.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
