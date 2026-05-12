import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { addJob, updateJob } from '../../services/jobService';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export default function JobModal({ isOpen, onClose, initialData, onSuccess }) {
  const [formData, setFormData] = useState({
    jobcode: '',
    jobdesc: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          jobcode: initialData.jobcode || initialData.jobCode || '',
          jobdesc: initialData.jobdesc || initialData.jobDesc || '',
        });
      } else {
        setFormData({ jobcode: '', jobdesc: '' });
      }
      setError(null);
    }
  }, [isOpen, initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'jobcode' ? value.toUpperCase().replace(/\s+/g, '').slice(0, 5) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.jobcode || !formData.jobdesc) {
        setError('Both Job Code and Description are required.');
        setLoading(false);
        return;
      }

      const { error: submitError } = initialData
        ? await updateJob(initialData.jobcode || initialData.jobCode, formData)
        : await addJob(formData);

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

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#181c1c]/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="modal-panel w-full max-w-lg overflow-hidden rounded-[28px] animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        
        <div className="px-8 pt-8 pb-6 border-b border-[var(--color-outline-variant)]/45 bg-[var(--color-surface-container-low)] flex justify-between items-start">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[var(--color-primary-container)] font-bold mb-1 block">
              Job Catalogue
            </span>
            <h2 className="text-2xl font-bold text-[var(--color-on-surface)] tracking-tight">
              {initialData ? 'Edit Job' : 'Create New Job'}
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

        <form id="job-form" onSubmit={handleSubmit} className="p-8 space-y-6">
          <Input
            label="Job Code"
            name="jobcode"
            value={formData.jobcode}
            onChange={handleInputChange}
            placeholder="J0001"
            icon="fingerprint"
            maxLength={5}
            hint="5 character unique identifier."
            required
            disabled={!!initialData}
          />
          <Input
            label="Description"
            name="jobdesc"
            value={formData.jobdesc}
            onChange={handleInputChange}
            placeholder="Software Engineer"
            icon="work"
            required
          />

          <div className="mt-8 rounded-2xl border border-[var(--color-outline-variant)]/20 bg-[var(--color-surface-container-lowest)] p-4 flex gap-4 items-start shadow-inset">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-surface)] shadow-outset flex items-center justify-center text-[var(--color-primary-container)] shrink-0">
              <span className="material-symbols-outlined text-[20px]">info</span>
            </div>
            <p className="text-xs text-[var(--color-on-surface-variant)] leading-relaxed font-medium">
              Job descriptions are used globally across all employee profiles and job history records. Changing a description here will reflect everywhere immediately.
            </p>
          </div>
        </form>

        <div className="px-8 py-6 bg-[var(--color-surface-bright)] border-t border-[var(--color-outline-variant)]/45 flex items-center justify-end gap-4 shadow-outset-top">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="job-form" disabled={loading} loading={loading}>
            {initialData ? 'Save Changes' : 'Create Job'}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
