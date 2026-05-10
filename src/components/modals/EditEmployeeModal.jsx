import { useState, useEffect } from 'react';
import { updateEmployee } from '../../services/employeeService';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export default function EditEmployeeModal({ isOpen, onClose, initialData, onSuccess }) {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    gender: 'M',
    hiredate: '',
    birthdate: '',
    sepDate: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstname: initialData.firstname || '',
        lastname: initialData.lastname || '',
        gender: initialData.gender || 'M',
        hiredate: initialData.hiredate || '',
        birthdate: initialData.birthdate || '',
        sepDate: initialData.sepDate || ''
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

  const handleGenderChange = (gender) => {
    setFormData(prev => ({
      ...prev,
      gender: gender
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.firstname || !formData.lastname) {
        setError('First Name and Last Name are required');
        setLoading(false);
        return;
      }

      const payload = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        gender: formData.gender,
        hiredate: formData.hiredate || null,
        birthdate: formData.birthdate || null,
        sepdate: formData.sepDate || null
      };

      const { error: submitError } = await updateEmployee(initialData.empno, payload);

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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overlay-scrim animate-in fade-in duration-300">
      <div className="modal-panel w-full max-w-2xl overflow-hidden rounded-[28px] animate-in zoom-in-95 duration-300">
        
        <div className="px-8 pt-8 pb-6 border-b border-[var(--color-outline-variant)]/45 bg-[var(--color-surface-container-low)] flex justify-between items-start">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[var(--color-primary-container)] font-bold mb-1 block">Staff Management</span>
            <h2 className="text-2xl font-bold text-[var(--color-on-surface)] tracking-tight">Edit Employee</h2>
            <p className="text-[var(--color-on-surface-variant)] font-mono text-sm mt-1">Employee #{initialData?.empno}</p>
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

        <form id="edit-employee-form" onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="First Name"
              name="firstname"
              value={formData.firstname}
              onChange={handleInputChange}
              placeholder="First name"
              icon="person"
              required
            />
            <Input 
              label="Last Name"
              name="lastname"
              value={formData.lastname}
              onChange={handleInputChange}
              placeholder="Last name"
              icon="person"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold uppercase tracking-[0.24em] text-[var(--color-on-surface-variant)] ml-1">Gender</label>
            <div className="field-shell rounded-xl p-1 flex gap-2">
              {['M', 'F'].map((g) => (
                <button 
                  key={g}
                  type="button"
                  onClick={() => handleGenderChange(g)}
                  className={`flex-1 py-2.5 rounded-md text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                    formData.gender === g
                      ? 'bg-[var(--color-primary-container)] text-white shadow-outset-soft'
                      : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-bright)]'
                  }`}
                >
                  {g === 'M' ? 'Male' : 'Female'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Birth Date"
              name="birthdate"
              type="date"
              value={formData.birthdate}
              onChange={handleInputChange}
              icon="cake"
            />
            <Input 
              label="Hire Date"
              name="hiredate"
              type="date"
              value={formData.hiredate}
              onChange={handleInputChange}
              icon="calendar_today"
            />
          </div>

          <div className="space-y-1">
            <Input 
              label="Separation Date"
              name="sepDate"
              type="date"
              value={formData.sepDate}
              onChange={handleInputChange}
              icon="logout"
            />
            <p className="text-[10px] text-[var(--color-outline-variant)] font-mono font-bold ml-1 mt-1">Leave blank if currently employed.</p>
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
            form="edit-employee-form"
            disabled={loading}
            loading={loading}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
