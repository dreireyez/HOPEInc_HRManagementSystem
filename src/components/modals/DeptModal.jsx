import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { addDept, updateDept } from '../../services/departmentService';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export default function DeptModal({ isOpen, onClose, initialData, onSuccess }) {
  const [formData, setFormData] = useState({
    deptcode: '',
    deptname: '',
    location: '',
    mgrno: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          deptcode: initialData.deptcode || initialData.deptCode || '',
          deptname: initialData.deptname || initialData.deptName || '',
          location: initialData.location || '',
          mgrno: initialData.mgrno || '',
        });
      } else {
        setFormData({ deptcode: '', deptname: '', location: '', mgrno: '' });
      }
      setError(null);
    }
  }, [isOpen, initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'deptcode' ? value.toUpperCase().replace(/\s+/g, '').slice(0, 3) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.deptcode || !formData.deptname) {
        setError('Department Code and Name are required.');
        setLoading(false);
        return;
      }

      const { error: submitError } = initialData
        ? await updateDept(initialData.deptcode || initialData.deptCode, formData)
        : await addDept(formData);

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
              Department Management
            </span>
            <h2 className="text-2xl font-bold text-[var(--color-on-surface)] tracking-tight">
              {initialData ? 'Edit Department' : 'Create New Department'}
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

        <form id="dept-form" onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Dept Code"
              name="deptcode"
              value={formData.deptcode}
              onChange={handleInputChange}
              placeholder="D01"
              icon="fingerprint"
              maxLength={3}
              hint="3 character unique identifier."
              required
              disabled={!!initialData}
            />
            <Input
              label="Dept Name"
              name="deptname"
              value={formData.deptname}
              onChange={handleInputChange}
              placeholder="Engineering"
              icon="corporate_fare"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Manila"
              icon="location_on"
            />
            <Input
              label="Manager ID"
              name="mgrno"
              value={formData.mgrno}
              onChange={handleInputChange}
              placeholder="E0001"
              icon="person_pin"
            />
          </div>

          <div className="mt-8 rounded-2xl border border-[var(--color-outline-variant)]/20 bg-[var(--color-surface-container-lowest)] p-4 flex gap-4 items-start shadow-inset">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-surface)] shadow-outset flex items-center justify-center text-[var(--color-primary-container)] shrink-0">
              <span className="material-symbols-outlined text-[20px]">info</span>
            </div>
            <p className="text-xs text-[var(--color-on-surface-variant)] leading-relaxed font-medium">
              Departments organize your workforce into logical groups. Ensure the Department Code matches your existing ERP or payroll system identifiers.
            </p>
          </div>
        </form>

        <div className="px-8 py-6 bg-[var(--color-surface-bright)] border-t border-[var(--color-outline-variant)]/45 flex items-center justify-end gap-4 shadow-outset-top">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="dept-form" disabled={loading} loading={loading}>
            {initialData ? 'Save Changes' : 'Create Department'}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
