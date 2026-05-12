import { useState, useEffect } from 'react';
import JobHistoryModal from './modals/JobHistoryModal';
import { getEmployeeFullHistory } from '../services/reportService';
import { useRights } from '../context/UserRightsContext';

export default function JobHistoryPanel({ empNo }) {
  const { can, currentUser } = useRights();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const pick = (row, ...keys) => {
    for (const key of keys) {
      if (row?.[key] !== undefined && row?.[key] !== null && row?.[key] !== '') {
        return row[key];
      }
    }
    return '';
  };

  const fetchHistory = async () => {
    if (!empNo) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await getEmployeeFullHistory(empNo);

      if (fetchError) {
        setError(fetchError.message);
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
    fetchHistory();
  }, [empNo, currentUser?.user_type]);

  const handleEdit = (row) => {
    const empNoField = pick(row, 'empno', 'empNo', 'emp_no');
    const jobCode = pick(row, 'jobcode', 'jobCode', 'job_code');
    const deptCode = pick(row, 'deptcode', 'deptCode', 'dept_code');
    const effDate = pick(row, 'effdate', 'effDate', 'eff_date');

    setEditingRecord({
      empno: empNoField,
      jobCode,
      deptCode,
      effDate,
      salary: row.salary,
      id: {
        empno: empNoField,
        jobcode: jobCode,
        effdate: effDate,
      },
    });
    setIsModalOpen(true);
  };

  return (
    <div className="bg-[var(--color-surface)] rounded-2xl p-8 shadow-outset h-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[var(--color-primary-container)]">timeline</span>
          <h3 className="font-sans text-2xl font-bold text-[var(--color-on-surface)]">Job History</h3>
        </div>
        {can('JH_ADD') && (
          <button 
            onClick={() => {
              setEditingRecord(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 rounded-md bg-[var(--color-surface)] shadow-outset hover:shadow-outset-hover active:shadow-inset transition-all font-mono text-[11px] font-bold uppercase tracking-widest text-[var(--color-primary-container)] flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add</span> Add Role
          </button>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[var(--color-primary-container)]"></div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-[var(--color-error-container)] rounded-md shadow-inset text-[var(--color-on-error-container)]">
          <p className="font-medium text-sm">Error loading job history: {error}</p>
        </div>
      )}

      {!loading && !error && history.length === 0 && (
        <div className="p-12 text-center">
          <p className="text-[var(--color-on-surface-variant)] font-medium">No job history records found.</p>
        </div>
      )}

      {!loading && !error && history.length > 0 && (
        <div className="relative pl-6 border-l-2 border-[var(--color-surface-container-highest)] space-y-8 mt-6">
          {history.map((row, idx) => {
            const isCurrent = idx === 0;
            const jobTitle = pick(row, 'job_desc', 'jobdesc', 'job_title') || 'N/A';
            const deptName = pick(row, 'dept_name', 'deptname', 'department_name') || 'N/A';
            const effDate = pick(row, 'effdate', 'effDate', 'eff_date') || null;
            const empNoField = pick(row, 'empno', 'empNo', 'emp_no');
            const jobCode = pick(row, 'jobcode', 'jobCode', 'job_code');
            const deptCode = pick(row, 'deptcode', 'deptCode', 'dept_code');
            
            return (
              <div key={`${empNoField}-${jobCode}-${effDate}-${idx}`} className="relative group">
                {/* Timeline Node */}
                {isCurrent ? (
                  <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[var(--color-primary-container)] border-4 border-[var(--color-surface)] shadow-[0_0_0_2px_var(--color-primary-container)] transition-transform group-hover:scale-110"></div>
                ) : (
                  <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[var(--color-surface-variant)] border-4 border-[var(--color-surface)] shadow-[0_0_0_2px_var(--color-surface-variant)] transition-transform group-hover:scale-110"></div>
                )}

                {/* Timeline Card */}
                <div className={`bg-[var(--color-surface)] rounded-xl p-5 transition-all duration-300 ${isCurrent ? 'shadow-inset border-l-4 border-[var(--color-primary-container)]' : 'border border-[var(--color-outline-variant)]/20 hover:shadow-inset'}`}>
                  <div className="flex justify-between items-start mb-2 flex-wrap gap-4">
                    <div>
                      <h4 className="font-sans text-lg font-bold text-[var(--color-on-surface)] flex items-center gap-3">
                        {jobTitle}
                        {isCurrent && (
                          <span className="inline-block px-2 py-0.5 rounded-full bg-[var(--color-surface-dim)] font-mono text-[10px] text-[var(--color-on-surface)] font-bold uppercase tracking-wider shadow-inset">Current</span>
                        )}
                      </h4>
                      <p className="font-mono text-[11px] font-bold text-[var(--color-primary-container)] uppercase tracking-widest mt-1">
                        {deptName}
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-end gap-1">
                      <p className="font-mono text-[12px] font-medium text-[var(--color-on-surface-variant)]">
                        {effDate ? new Date(effDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'} {isCurrent ? '- Present' : ''}
                      </p>
                      <p className="font-sans text-sm font-bold text-[var(--color-on-surface)]">
                        ${row.salary ? Number(row.salary).toLocaleString() : '0'} / yr
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons (Hover Reveal) */}
                  <div className="flex justify-end gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {can('JH_EDIT') && (
                      <button
                        onClick={() => handleEdit({
                          ...row,
                          empno: empNoField || row.empno,
                          jobcode: jobCode || row.jobcode,
                          deptcode: deptCode || row.deptcode,
                          effdate: effDate || row.effdate,
                        })}
                        className="p-2 text-[var(--color-primary-container)] bg-[var(--color-surface)] shadow-outset hover:shadow-outset-hover rounded-md transition-all cursor-pointer flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                      </button>
                    )}
                    {can('JH_DEL') && (
                      <button className="p-2 text-[var(--color-error)] bg-[var(--color-surface)] shadow-outset hover:shadow-outset-hover hover:shadow-glow rounded-md transition-all cursor-pointer flex items-center justify-center">
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <JobHistoryModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingRecord(null);
        }}
        empNo={empNo}
        initialData={editingRecord}
        onSuccess={() => {
          setIsModalOpen(false);
          setEditingRecord(null);
          fetchHistory();
        }}
      />
    </div>
  );
}
