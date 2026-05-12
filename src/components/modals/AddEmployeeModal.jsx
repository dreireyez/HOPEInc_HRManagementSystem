import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { addEmployee } from '../../services/employeeService';
import { getJobs } from '../../services/jobService';
import { getDepts } from '../../services/departmentService';
import { getAverageSalaryByJob } from '../../services/jobHistoryService';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const pick = (row, ...keys) => {
  for (const key of keys) {
    if (row?.[key] !== undefined && row?.[key] !== null && row?.[key] !== '') {
      return row[key];
    }
  }

  return '';
};

const formatSalaryInput = (value) => {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return '';
  }

  return numeric.toFixed(2);
};

const normalizeEmployeeNumber = (value) => value.toUpperCase().replace(/\s+/g, '').slice(0, 5);

export default function AddEmployeeModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    empno: '',
    firstname: '',
    lastname: '',
    gender: 'M',
    email: '',
    phone_number: '',
    hiredate: '',
    birthdate: '',
    jobcode: '',
    deptcode: '',
    salary: '',
  });
  const [jobs, setJobs] = useState([]);
  const [depts, setDepts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [error, setError] = useState(null);
  const [salaryHint, setSalaryHint] = useState('Select a job to prefill the salary.');

  const selectedJob = useMemo(
    () => jobs.find((job) => pick(job, 'jobcode', 'jobCode', 'job_code') === formData.jobcode) || null,
    [jobs, formData.jobcode]
  );
  const selectedDept = useMemo(
    () => depts.find((dept) => pick(dept, 'deptcode', 'deptCode', 'dept_code') === formData.deptcode) || null,
    [depts, formData.deptcode]
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const loadOptions = async () => {
      setLoadingOptions(true);
      try {
        const [jobsRes, deptsRes] = await Promise.all([
          getJobs('ADMIN'),
          getDepts('ADMIN'),
        ]);

        setJobs((jobsRes.data || []).filter((job) => job.record_status === 'ACTIVE'));
        setDepts((deptsRes.data || []).filter((dept) => dept.record_status === 'ACTIVE'));
      } catch (err) {
        setError(err.message || 'Failed to load job and department options.');
      } finally {
        setLoadingOptions(false);
      }
    };

    loadOptions();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        empno: '',
        firstname: '',
        lastname: '',
        gender: 'M',
        email: '',
        phone_number: '',
        hiredate: '',
        birthdate: '',
        jobcode: '',
        deptcode: '',
        salary: '',
      });
      setError(null);
      setSalaryHint('Select a job to prefill the salary.');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!formData.jobcode) {
      setFormData((prev) => ({ ...prev, salary: '' }));
      setSalaryHint('Select a job to prefill the salary.');
      return;
    }

    const loadAverageSalary = async () => {
      const { data, error: avgError } = await getAverageSalaryByJob(formData.jobcode);

      if (avgError) {
        setSalaryHint('Unable to load the average salary for this job yet.');
        return;
      }

      if (data === null) {
        setFormData((prev) => ({ ...prev, salary: '' }));
        setSalaryHint('No salary history found for this job. Enter a starting salary manually.');
        return;
      }

      const formattedSalary = formatSalaryInput(data);
      setFormData((prev) => ({ ...prev, salary: formattedSalary }));
      setSalaryHint(`Defaulted to the current average salary for ${pick(selectedJob, 'jobdesc', 'jobDesc', 'job_code') || 'this job'}.`);
    };

    loadAverageSalary();
  }, [formData.jobcode, selectedJob]);

  if (!isOpen) {
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'empno' ? normalizeEmployeeNumber(value) : value,
    }));
  };

  const handleGenderChange = (gender) => {
    setFormData((prev) => ({ ...prev, gender }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.empno || !formData.firstname || !formData.lastname) {
        setError('Employee No, First Name, and Last Name are required.');
        setLoading(false);
        return;
      }

      if (formData.empno.length > 5) {
        setError('Employee No must be 5 characters or fewer.');
        setLoading(false);
        return;
      }

      if (!formData.jobcode || !formData.deptcode || !formData.hiredate) {
        setError('Initial job, department, and hire date are required.');
        setLoading(false);
        return;
      }

      const { error: submitError } = await addEmployee({
        empno: formData.empno,
        firstname: formData.firstname,
        lastname: formData.lastname,
        gender: formData.gender,
        email: formData.email || null,
        phone_number: formData.phone_number || null,
        hiredate: formData.hiredate || null,
        birthdate: formData.birthdate || null,
        jobcode: formData.jobcode,
        deptcode: formData.deptcode,
        effdate: formData.hiredate,
        salary: formData.salary ? parseFloat(formData.salary) : null,
      });

      if (submitError) {
        setError(submitError.message);
      } else {
        onSuccess?.();
        onClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#181c1c]/40 backdrop-blur-sm animate-in fade-in">
      <div 
        className="modal-panel w-full max-w-3xl overflow-hidden rounded-[28px] animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-8 pt-8 pb-6 border-b border-[var(--color-outline-variant)]/45 bg-[var(--color-surface-container-low)] flex justify-between items-start">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[var(--color-primary-container)] font-bold mb-1 block">
              Staff Management
            </span>
            <h2 className="text-2xl font-bold text-[var(--color-on-surface)] tracking-tight">Add New Employee</h2>
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

        <form id="add-employee-form" onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Employee No"
              name="empno"
              value={formData.empno}
              onChange={handleInputChange}
              placeholder="E0001"
              icon="fingerprint"
              maxLength={5}
              hint="Use up to 5 characters to match the database format."
              required
            />
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase tracking-[0.24em] text-[var(--color-on-surface-variant)] ml-1">
                Gender
              </label>
              <div className="field-shell rounded-xl p-1 flex gap-2">
                {['M', 'F'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => handleGenderChange(g)}
                    className={`flex-1 rounded-xl px-3 py-2.5 text-xs font-mono font-bold uppercase tracking-[0.2em] transition-all ${
                      formData.gender === g
                        ? 'bg-[var(--color-primary-container)] text-white shadow-outset-soft'
                        : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-bright)] hover:text-[var(--color-on-surface)]'
                    }`}
                  >
                    {g === 'M' ? 'Male' : 'Female'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="name@hope.com"
              icon="mail"
            />
            <Input
              label="Phone Number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              placeholder="+639#########"
              icon="call"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="First Name" name="firstname" value={formData.firstname} onChange={handleInputChange} placeholder="First name" icon="person" required />
            <Input label="Last Name" name="lastname" value={formData.lastname} onChange={handleInputChange} placeholder="Last name" icon="person" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Hire Date" name="hiredate" type="date" value={formData.hiredate} onChange={handleInputChange} icon="calendar_today" required />
            <Input label="Birth Date" name="birthdate" type="date" value={formData.birthdate} onChange={handleInputChange} icon="cake" />
          </div>

          <div className="rounded-[24px] border border-[var(--color-outline-variant)]/30 bg-[rgba(245,248,252,0.78)] p-6 shadow-inset">
            <div className="flex flex-col gap-2 mb-5">
              <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[var(--color-primary-container)] font-bold">
                Initial Assignment
              </span>
              <p className="text-sm text-[var(--color-on-surface-variant)]">
                The employee profile and first job history entry will be created together.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)] ml-1">
                  Job
                </label>
                <div className="relative group">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[var(--color-outline)] text-[20px] group-focus-within:text-[var(--color-primary-container)] transition-colors">
                    work
                  </span>
                  <select
                    name="jobcode"
                    value={formData.jobcode}
                    onChange={handleInputChange}
                    className="field-shell w-full rounded-xl py-3 pl-10 pr-10 text-[var(--color-on-surface)] font-medium text-sm focus:ring-2 focus:ring-[var(--color-primary-container)] transition-shadow outline-none appearance-none bg-transparent"
                    required
                    disabled={loadingOptions}
                  >
                    <option value="">{loadingOptions ? 'Loading jobs...' : 'Select a job...'}</option>
                    {jobs.map((job) => (
                      <option
                        key={pick(job, 'jobcode', 'jobCode', 'job_code')}
                        value={pick(job, 'jobcode', 'jobCode', 'job_code')}
                      >
                        {pick(job, 'jobdesc', 'jobDesc', 'job_code')} ({pick(job, 'jobcode', 'jobCode', 'job_code')})
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[var(--color-outline-variant)] text-[20px] pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)] ml-1">
                  Department
                </label>
                <div className="relative group">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[var(--color-outline)] text-[20px] group-focus-within:text-[var(--color-primary-container)] transition-colors">
                    corporate_fare
                  </span>
                  <select
                    name="deptcode"
                    value={formData.deptcode}
                    onChange={handleInputChange}
                    className="field-shell w-full rounded-xl py-3 pl-10 pr-10 text-[var(--color-on-surface)] font-medium text-sm focus:ring-2 focus:ring-[var(--color-primary-container)] transition-shadow outline-none appearance-none bg-transparent"
                    required
                    disabled={loadingOptions}
                  >
                    <option value="">{loadingOptions ? 'Loading departments...' : 'Select a department...'}</option>
                    {depts.map((dept) => (
                      <option
                        key={pick(dept, 'deptcode', 'deptCode', 'dept_code')}
                        value={pick(dept, 'deptcode', 'deptCode', 'dept_code')}
                      >
                        {pick(dept, 'deptname', 'deptName', 'dept_code')} ({pick(dept, 'deptcode', 'deptCode', 'dept_code')})
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[var(--color-outline-variant)] text-[20px] pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Input
                label="Starting Salary"
                name="salary"
                type="number"
                step="0.01"
                min="0"
                value={formData.salary}
                onChange={handleInputChange}
                placeholder="0.00"
                icon="payments"
                hint={salaryHint}
              />
              <div className="rounded-2xl border border-[var(--color-outline-variant)]/24 bg-white/70 p-4 shadow-inset">
                <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-[var(--color-on-surface-variant)] font-bold">
                  Assignment Preview
                </p>
                <p className="mt-2 text-sm font-semibold text-[var(--color-on-surface)]">
                  {pick(selectedJob, 'jobdesc', 'jobDesc', 'job_code') || 'No job selected'}
                </p>
                <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">
                  {pick(selectedDept, 'deptname', 'deptName', 'dept_code') || 'No department selected'}
                </p>
                <p className="mt-3 text-xs text-[var(--color-on-surface-variant)]">
                  The hire date will also be used as the first job history effective date.
                </p>
              </div>
            </div>
          </div>
        </form>

        <div className="px-8 py-6 bg-[var(--color-surface-bright)] border-t border-[var(--color-outline-variant)]/45 flex items-center justify-end gap-4 shadow-outset-top">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="add-employee-form" disabled={loading || loadingOptions} loading={loading}>
            Create Profile
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
