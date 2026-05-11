import { useState, useEffect } from 'react';
import { addJobHistory, updateJobHistory } from '../../services/jobHistoryService';
import { getJobs } from '../../services/jobService';
import { getDepts } from '../../services/departmentService';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
export default function JobHistoryModal({ isOpen, onClose, empNo, initialData = null, onSuccess }) {
  const pick = (row, ...keys) => {
    for (const key of keys) {
      if (row?.[key] !== undefined && row?.[key] !== null && row?.[key] !== '') {
        return row[key];
      }
    }
    return '';
  };

  const [formData, setFormData] = useState({
    jobCode: '',
    deptCode: '',
    effDate: '',
    salary: ''
  });

  const [jobs, setJobs] = useState([]);
  const [depts, setDepts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadOptions();
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        jobCode: pick(initialData, 'jobcode', 'jobCode', 'job_code'),
        deptCode: pick(initialData, 'deptcode', 'deptCode', 'dept_code'),
        effDate: pick(initialData, 'effdate', 'effDate', 'eff_date'),
        salary: initialData.salary?.toString() || ''
      });
    } else {
      setFormData({ jobCode: '', deptCode: '', effDate: '', salary: '' });
    }
  }, [initialData, isOpen]);

  const loadOptions = async () => {
    setLoadingOptions(true);
    try {
      const [jobsRes, deptsRes] = await Promise.all([
        getJobs('ADMIN'),
        getDepts('ADMIN')
      ]);
      setJobs(jobsRes.data?.filter(j => j.record_status === 'ACTIVE') || []);
      setDepts(deptsRes.data?.filter(d => d.record_status === 'ACTIVE') || []);
    } catch (err) {
      console.error('Failed to load options:', err);
    } finally {
      setLoadingOptions(false);
    }
  };

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.jobCode || !formData.deptCode || !formData.effDate) {
        setError('Job, Department, and Effective Date are required');
        setLoading(false);
        return;
      }

      const payload = {
        empno: empNo,
        jobcode: formData.jobCode,
        deptcode: formData.deptCode,
        effdate: formData.effDate,
        salary: formData.salary ? parseFloat(formData.salary) : null,
        record_status: 'ACTIVE'
      };

      let result;
      if (initialData?.id) {
        result = await updateJobHistory(initialData.id, payload);
      } else {
        result = await addJobHistory(payload);
      }

      if (result.error) {
        setError(result.error.message || 'Failed to save job history');
      } else {
        onSuccess?.(result.data);
        onClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overlay-scrim animate-in fade-in duration-300">
      <div className="modal-panel w-full max-w-2xl overflow-hidden rounded-[28px] animate-in zoom-in-95 duration-300">
        
        <div className="px-8 pt-8 pb-6 border-b border-[var(--color-outline-variant)]/45 bg-[var(--color-surface-container-low)] flex justify-between items-start">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[var(--color-primary-container)] font-bold mb-1 block">Career Tracking</span>
            <h2 className="text-2xl font-bold text-[var(--color-on-surface)] tracking-tight">
              {initialData ? 'Edit Job History' : 'Add Job History'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="interactive-surface rounded-xl p-2 text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {error && (
          <div className="mx-8 mt-6 p-4 rounded-2xl bg-[var(--color-error-container)] border border-[var(--color-error)]/20 shadow-inset">
            <p className="text-[var(--color-on-error-container)] text-sm font-medium">{error}</p>
          </div>
        )}

        <form id="job-history-form" onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)] ml-1">Job Title</label>
              <div className="relative group">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[var(--color-outline)] text-[20px] group-focus-within:text-[var(--color-primary-container)] transition-colors">work</span>
                <select 
                  name="jobCode"
                  value={formData.jobCode}
                  onChange={handleInputChange}
                  className="field-shell w-full rounded-xl py-2.5 pl-10 pr-10 text-[var(--color-on-surface)] font-medium text-sm focus:ring-2 focus:ring-[var(--color-primary-container)] transition-shadow outline-none appearance-none"
                  required
                >
                  <option value="">Select a job...</option>
                  {loadingOptions ? (
                    <option disabled>Loading...</option>
                  ) : (
                    jobs.map(job => (
                      <option
                        key={pick(job, 'jobcode', 'jobCode', 'job_code')}
                        value={pick(job, 'jobcode', 'jobCode', 'job_code')}
                      >
                        {pick(job, 'jobdesc', 'jobDesc', 'job_code')} ({pick(job, 'jobcode', 'jobCode', 'job_code')})
                      </option>
                    ))
                  )}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[var(--color-outline-variant)] text-[20px] pointer-events-none">expand_more</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)] ml-1">Department</label>
              <div className="relative group">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[var(--color-outline)] text-[20px] group-focus-within:text-[var(--color-primary-container)] transition-colors">corporate_fare</span>
                <select 
                  name="deptCode"
                  value={formData.deptCode}
                  onChange={handleInputChange}
                  className="field-shell w-full rounded-xl py-2.5 pl-10 pr-10 text-[var(--color-on-surface)] font-medium text-sm focus:ring-2 focus:ring-[var(--color-primary-container)] transition-shadow outline-none appearance-none"
                  required
                >
                  <option value="">Select a department...</option>
                  {loadingOptions ? (
                    <option disabled>Loading...</option>
                  ) : (
                    depts.map(dept => (
                      <option
                        key={pick(dept, 'deptcode', 'deptCode', 'dept_code')}
                        value={pick(dept, 'deptcode', 'deptCode', 'dept_code')}
                      >
                        {pick(dept, 'deptname', 'deptName', 'dept_code')} ({pick(dept, 'deptcode', 'deptCode', 'dept_code')})
                      </option>
                    ))
                  )}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[var(--color-outline-variant)] text-[20px] pointer-events-none">expand_more</span>
              </div>
            </div>

            <Input 
              label="Effective Date"
              name="effDate"
              type="date"
              value={formData.effDate}
              onChange={handleInputChange}
              icon="calendar_today"
              required
            />

            <Input 
              label="Annual Salary"
              name="salary"
              type="number"
              step="0.01"
              value={formData.salary}
              onChange={handleInputChange}
              placeholder="0.00"
              icon="payments"
            />
          </div>

          <div className="bg-[var(--color-primary-soft)] p-5 rounded-2xl border border-[var(--color-primary-container)]/12 flex gap-4 items-start">
            <span className="material-symbols-outlined text-[var(--color-primary-container)]">info</span>
            <div className="space-y-1">
              <p className="text-sm font-bold text-[var(--color-on-surface)]">Update Guidance</p>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                Review the effective date and assignment details before saving so the employee timeline stays accurate and easy to audit.
              </p>
            </div>
          </div>
        </form>

        <div className="px-8 py-6 bg-[var(--color-surface-bright)] border-t border-[var(--color-outline-variant)]/45 flex items-center justify-end gap-4 shadow-outset-top">
          <Button 
            type="button"
            variant="ghost"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            form="job-history-form"
            disabled={loading}
            loading={loading}
          >
            {initialData ? 'Save Changes' : 'Add Record'}
          </Button>
        </div>
      </div>
    </div>
  );
}
