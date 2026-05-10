import { useState } from 'react';
import { addEmployee } from '../../services/employeeService';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export default function AddEmployeeModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    empno: '',
    firstname: '',
    lastname: '',
    gender: 'M',
    email: '',
    hiredate: '',
    birthdate: '',
    job_title: '',
    dept: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        setError('Employee No, First Name, and Last Name are required');
        setLoading(false);
        return;
      }

      const { error: submitError } = await addEmployee({
        empno: formData.empno,
        firstname: formData.firstname,
        lastname: formData.lastname,
        gender: formData.gender,
        email: formData.email || null,
        hiredate: formData.hiredate || null,
        birthdate: formData.birthdate || null,
        job_title: formData.job_title || null,
        dept: formData.dept || null,
        record_status: 'ACTIVE',
      });

      if (submitError) {
        setError(submitError.message);
      } else {
        setFormData({
          empno: '',
          firstname: '',
          lastname: '',
          gender: 'M',
          email: '',
          hiredate: '',
          birthdate: '',
          job_title: '',
          dept: '',
        });
        onSuccess?.();
        onClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overlay-scrim animate-in fade-in">
      <div className="modal-panel w-full max-w-2xl overflow-hidden rounded-[28px] animate-in zoom-in-95">
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
              placeholder="EMP-2026-001"
              icon="fingerprint"
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
            <Input label="First Name" name="firstname" value={formData.firstname} onChange={handleInputChange} placeholder="First name" icon="person" required />
            <Input label="Last Name" name="lastname" value={formData.lastname} onChange={handleInputChange} placeholder="Last name" icon="person" required />
          </div>

          <Input label="Email Address" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="employee@company.com" icon="mail" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Job Title" name="job_title" value={formData.job_title} onChange={handleInputChange} placeholder="Job title" icon="work" />
            <Input label="Hire Date" name="hiredate" type="date" value={formData.hiredate} onChange={handleInputChange} icon="calendar_today" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Birth Date" name="birthdate" type="date" value={formData.birthdate} onChange={handleInputChange} icon="cake" />
            <Input label="Department" name="dept" value={formData.dept} onChange={handleInputChange} placeholder="Department name" icon="domain" />
          </div>
        </form>

        <div className="px-8 py-6 bg-[var(--color-surface-bright)] border-t border-[var(--color-outline-variant)]/45 flex items-center justify-end gap-4 shadow-outset-top">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="add-employee-form" disabled={loading} loading={loading}>
            Create Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
