import { useState, useEffect } from 'react';
import { addJob, updateJob } from '../../services/jobService';
import { getDepts } from '../../services/departmentService';

export default function JobModal({ isOpen, onClose, initialData = null, onSuccess, userRole = 'USER' }) {
  const [formData, setFormData] = useState({
    code: '',
    desc: '',
    record_status: 'ACTIVE',
    defaultdeptcode: ''
  });

  const [depts, setDepts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    getDepts(userRole).then(({ data }) => setDepts(data || []));
  }, [isOpen, userRole]);

  // Populate form when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        code: initialData.jobcode || '',
        desc: initialData.jobdesc || '',
        record_status: initialData.record_status || 'ACTIVE',
        defaultdeptcode: ''
      });
    } else {
      setFormData({
        code: '',
        desc: '',
        record_status: 'ACTIVE',
        defaultdeptcode: ''
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

  const handleStatusChange = (e) => {
    const status = e.target.checked ? 'ACTIVE' : 'INACTIVE';
    setFormData(prev => ({
      ...prev,
      record_status: status
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.code || !formData.desc) {
        setError('Job Code and Description are required');
        setLoading(false);
        return;
      }

      let result;
      if (initialData) {
        result = await updateJob(initialData.jobcode, {
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
        onSuccess?.(result.data, formData.defaultdeptcode);
        onClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0B0B0F]/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#1A1A24] border border-white/5 relative w-full max-w-2xl rounded-[2.5rem] overflow-hidden flex flex-col shadow-[0_40px_80px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-300">
        
        {/* Decorative Neon Orbs */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#2E5BFF]/10 rounded-full blur-[80px] -z-10"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#B71BCF]/10 rounded-full blur-[80px] -z-10"></div>

        {/* Modal Header */}
        <div className="px-10 pt-10 pb-6 flex justify-between items-start">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#2E5BFF] font-black mb-1 block">Architecture Config</span>
            <h2 className="text-3xl font-black text-white tracking-tight">
              {initialData ? 'Edit Job Identity' : 'Create Job Identity'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-zinc-500 hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-8 mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <p className="text-red-400 text-sm font-bold">{error}</p>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-10 pb-10 space-y-8 overflow-y-auto max-h-[70vh]">
          {/* Job Code */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-2">Job Code</label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary/50 text-xl group-focus-within:text-primary transition-colors">fingerprint</span>
              <input 
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-white placeholder:text-zinc-700 focus:ring-2 focus:ring-primary/20 transition-all outline-none font-bold" 
                placeholder="e.g. ENG-PLAT-001"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-2">Job Description</label>
            <textarea 
              rows="4"
              className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-6 text-white placeholder:text-zinc-700 focus:ring-2 focus:ring-primary/20 transition-all outline-none font-bold resize-none" 
              placeholder="Describe the essence of this role..."
              name="desc"
              value={formData.desc}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Default Department */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-2">Default Department (Optional)</label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary/50 text-xl group-focus-within:text-primary transition-colors">domain</span>
              <select
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-white focus:ring-2 focus:ring-primary/20 transition-all outline-none font-bold appearance-none [color-scheme:dark]"
                name="defaultdeptcode"
                value={formData.defaultdeptcode}
                onChange={handleInputChange}
              >
                <option value="">Select a department...</option>
                {depts.filter(d => d.record_status === 'ACTIVE').map(d => (
                  <option key={d.deptcode} value={d.deptcode}>
                    {d.deptcode} — {d.deptname}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Record Status Toggle */}
          <div className="flex items-center justify-between p-6 rounded-[2rem] bg-white/[0.02] border border-white/5">
            <div>
              <p className="font-black text-white text-sm uppercase tracking-tight">Record Status</p>
              <p className="text-xs text-zinc-500 font-medium">{formData.record_status === 'ACTIVE' ? 'Active' : 'Inactive'} - Toggle visibility for recruitment pipelines.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={formData.record_status === 'ACTIVE'}
                onChange={handleStatusChange}
              />
              <div className="w-14 h-7 bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#2E5BFF] peer-checked:to-[#B71BCF]"></div>
            </label>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-10 py-8 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
          <button 
            type="button"
            onClick={onClose}
            className="text-zinc-500 font-black text-xs uppercase tracking-widest hover:text-white transition-all"
          >
            Discard Changes
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="px-10 py-4 rounded-full bg-gradient-to-r from-[#2E5BFF] to-[#B71BCF] text-white font-black text-xs uppercase tracking-[0.15em] flex items-center gap-2 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating...' : 'Generate Identity'}
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
          </button>
        </div>
      </div>
    </div>
  );
}