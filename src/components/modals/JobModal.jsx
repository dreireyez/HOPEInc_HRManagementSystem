import { useState, useEffect } from 'react';
import { addJob, updateJob } from '../../services/jobService';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
export default function JobModal({ isOpen, onClose, initialData = null, onSuccess }) {
  const [formData, setFormData] = useState({
    code: '',
    desc: '',
    record_status: 'ACTIVE'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        code: initialData.jobcode || initialData.jobCode || initialData.code || '',
        desc: initialData.jobdesc || initialData.jobDesc || initialData.desc || '',
        record_status: initialData.record_status || 'ACTIVE'
      });
    } else {
      setFormData({
        code: '',
        desc: '',
        record_status: 'ACTIVE'
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.code || !formData.desc) {
        setError('Job Code and Description are required');
        setLoading(false);
        return;
      }

      let result;
      if (initialData) {
        result = await updateJob(initialData.jobcode || initialData.jobCode || initialData.code, {
          jobdesc: formData.desc,
          record_status: formData.record_status
        });
      } else {
        result = await addJob({
          jobcode: formData.code,
          jobdesc: formData.desc,
          record_status: formData.record_status
        });
      }

      if (result.error) {
        setError(result.error.message || 'Failed to save job');
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
      <div className="modal-panel w-full max-w-lg overflow-hidden rounded-[28px] animate-in zoom-in-95 duration-300">
        
        <div className="px-8 pt-8 pb-6 border-b border-[var(--color-outline-variant)]/45 bg-[var(--color-surface-container-low)] flex justify-between items-start">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[var(--color-primary-container)] font-bold mb-1 block">Job Catalogue</span>
            <h2 className="text-2xl font-bold text-[var(--color-on-surface)] tracking-tight">
              {initialData ? 'Edit Job' : 'Create Job'}
            </h2>
          </div>
          <button onClick={onClose} className="interactive-surface rounded-xl p-2 text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {error && (
          <div className="mx-8 mt-6 p-4 rounded-2xl bg-[var(--color-error-container)] border border-[var(--color-error)]/20 shadow-inset">
            <p className="text-[var(--color-on-error-container)] text-sm font-medium">{error}</p>
          </div>
        )}

        <form id="job-form" onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          <Input 
            label="Job Code"
            name="code"
            value={formData.code}
            onChange={handleInputChange}
            placeholder="e.g. ENG-PLAT-001"
            icon="fingerprint"
            readOnly={!!initialData}
            required
            className={initialData ? 'opacity-60 cursor-not-allowed' : ''}
          />

          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)] ml-1">Job Description</label>
            <textarea 
              rows="4"
              className="field-shell w-full rounded-xl py-3 px-4 text-[var(--color-on-surface)] font-medium text-sm placeholder:text-[var(--color-outline)] focus:ring-2 focus:ring-[var(--color-primary-container)] transition-shadow outline-none resize-none" 
              placeholder="Describe this role..."
              name="desc"
              value={formData.desc}
              onChange={handleInputChange}
              required
            />
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
            form="job-form"
            disabled={loading}
            loading={loading}
          >
            {initialData ? 'Save Changes' : 'Create Job'}
          </Button>
        </div>
      </div>
    </div>
  );
}
