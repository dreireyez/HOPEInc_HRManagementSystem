import { useState, useEffect } from 'react';
import { addDept, updateDept } from '../../services/departmentService';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
export default function DeptModal({ isOpen, onClose, initialData = null, onSuccess }) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    color: '#2E5BFF'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        code: initialData.deptcode || initialData.deptCode || initialData.code || '',
        name: initialData.deptname || initialData.deptName || initialData.name || '',
        color: initialData.color || '#2E5BFF'
      });
    } else {
      setFormData({
        code: '',
        name: '',
        color: '#2E5BFF'
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

  const handleColorSelect = (color) => {
    setFormData(prev => ({
      ...prev,
      color: color
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.code || !formData.name) {
        setError('Department Code and Name are required');
        setLoading(false);
        return;
      }

      let result;
      if (initialData) {
        result = await updateDept(initialData.deptcode || initialData.deptCode || initialData.code, {
          deptname: formData.name,
          record_status: formData.record_status || 'ACTIVE'
        });
      } else {
        result = await addDept({
          deptcode: formData.code,
          deptname: formData.name,
          record_status: 'ACTIVE'
        });
      }

      if (result.error) {
        setError(result.error.message || 'Failed to save department');
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
            <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[var(--color-primary-container)] font-bold mb-1 block">Department Directory</span>
            <h2 className="text-2xl font-bold text-[var(--color-on-surface)] tracking-tight">
              {initialData ? 'Edit Department' : 'Create Department'}
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

        <form id="dept-form" onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          <Input 
            label="Dept Code"
            name="code"
            value={formData.code}
            onChange={handleInputChange}
            placeholder="e.g. ENG-01"
            icon="pin"
            readOnly={!!initialData}
            required
            className={initialData ? 'opacity-60 cursor-not-allowed' : ''}
          />

          <Input 
            label="Dept Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Engineering & Development"
            icon="corporate_fare"
            required
          />

          <div className="space-y-3">
            <label className="text-[10px] font-mono font-bold uppercase tracking-[0.24em] text-[var(--color-on-surface-variant)] ml-1">Accent Color</label>
            <div className="field-shell flex gap-4 p-2 rounded-xl w-fit">
              {['#006666', '#004d4d', '#009999', '#003333'].map((color) => (
                <button 
                  key={color} 
                  type="button"
                  onClick={() => handleColorSelect(color)}
                  className={`w-8 h-8 rounded-full transition-transform hover:scale-110 active:scale-90 shadow-outset ${formData.color === color ? 'ring-2 ring-offset-2 ring-offset-[var(--color-surface)] ring-[var(--color-primary-container)]' : ''}`}
                  style={{ backgroundColor: color }}
                ></button>
              ))}
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
            form="dept-form"
            disabled={loading}
            loading={loading}
          >
            {initialData ? 'Save Changes' : 'Create Department'}
          </Button>
        </div>
      </div>
    </div>
  );
}
