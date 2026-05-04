import { useState } from 'react';
import { addEmployee } from '../../services/employeeService';

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
    dept: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      // Validate required fields
      if (!formData.empno || !formData.firstname || !formData.lastname) {
        setError('Employee No, First Name, and Last Name are required');
        setLoading(false);
        return;
      }

      // Add employee to database
      const { data, error: submitError } = await addEmployee({
        empno: formData.empno,
        firstname: formData.firstname,
        lastname: formData.lastname,
        gender: formData.gender,
        email: formData.email || null,
        hiredate: formData.hiredate || null,
        birthdate: formData.birthdate || null,
        job_title: formData.job_title || null,
        dept: formData.dept || null,
        record_status: 'ACTIVE'
      });

      if (submitError) {
        setError(submitError.message);
      } else {
        // Reset form and close modal on success
        setFormData({
          empno: '',
          firstname: '',
          lastname: '',
          gender: 'M',
          email: '',
          hiredate: '',
          birthdate: '',
          job_title: '',
          dept: ''
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-[#0B0B0F]/80 backdrop-blur-sm overflow-y-auto">
      {/* Modal Container */}
      <div className="bg-[#1A1A24] border border-white/5 relative w-full max-w-2xl rounded-[2.5rem] overflow-hidden flex flex-col shadow-[0_40px_80px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-300">
        
        {/* Background Decorative Liquid Elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#2E5BFF]/10 rounded-full blur-[80px] -z-10 pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#B71BCF]/10 rounded-full blur-[80px] -z-10 pointer-events-none"></div>

        {/* Modal Header */}
        <div className="px-8 pt-10 pb-6 flex justify-between items-start">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#B71BCF] font-black mb-1 block">Staff Management</span>
            <h2 className="text-3xl font-black text-white tracking-tight">Add New Employee</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/5 transition-colors text-zinc-500 hover:text-white"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-8 mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <p className="text-red-400 text-sm font-bold">{error}</p>
          </div>
        )}

        {/* Modal Content (Form) */}
        <form onSubmit={handleSubmit} className="px-8 pb-10 space-y-8 overflow-y-auto max-h-[70vh]">
          
          {/* Section: Personal Identity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Employee No</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary/50 text-xl group-focus-within:text-primary transition-colors">fingerprint</span>
                <input 
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-700 focus:ring-2 focus:ring-primary/20 transition-all outline-none font-bold" 
                  placeholder="EMP-2026-001"
                  type="text"
                  name="empno"
                  value={formData.empno}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Gender</label>
              <div className="flex gap-2 p-1 bg-white/[0.03] border border-white/5 rounded-2xl">
                {['M', 'F'].map((g) => (
                  <button 
                    key={g}
                    type="button"
                    onClick={() => handleGenderChange(g)}
                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-tighter transition-all ${
                      formData.gender === g
                        ? 'bg-primary text-white'
                        : 'text-zinc-500 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {g === 'M' ? 'Male' : 'Female'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section: Full Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">First Name</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary/50 text-xl group-focus-within:text-primary transition-colors">person</span>
                <input 
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-700 focus:ring-2 focus:ring-primary/20 transition-all outline-none font-bold" 
                  placeholder="First name"
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Last Name</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary/50 text-xl group-focus-within:text-primary transition-colors">person</span>
                <input 
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-700 focus:ring-2 focus:ring-primary/20 transition-all outline-none font-bold" 
                  placeholder="Last name"
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Section: Email */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Email Address</label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary/50 text-xl group-focus-within:text-primary transition-colors">mail</span>
              <input 
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-700 focus:ring-2 focus:ring-primary/20 transition-all outline-none font-bold" 
                placeholder="employee@company.com"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Section: Roles & Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Job Title</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary/50 text-xl group-focus-within:text-primary transition-colors">work</span>
                <input 
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-700 focus:ring-2 focus:ring-primary/20 transition-all outline-none font-bold"
                  placeholder="Job title"
                  type="text"
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Hire Date</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary/50 text-xl group-focus-within:text-primary transition-colors">calendar_today</span>
                <input 
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-primary/20 transition-all outline-none [color-scheme:dark] font-bold"
                  type="date"
                  name="hiredate"
                  value={formData.hiredate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Section: Advanced */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Birth Date</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary/50 text-xl group-focus-within:text-primary transition-colors">cake</span>
                <input 
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-primary/20 transition-all outline-none [color-scheme:dark] font-bold"
                  type="date"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Department</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary/50 text-xl group-focus-within:text-primary transition-colors">domain</span>
                <input 
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-700 focus:ring-2 focus:ring-primary/20 transition-all outline-none font-bold"
                  placeholder="Department name"
                  type="text"
                  name="dept"
                  value={formData.dept}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-8 py-8 bg-white/[0.02] backdrop-blur-md flex items-center justify-end gap-4 border-t border-white/5">
          <button 
            onClick={onClose}
            type="button"
            className="px-8 py-3 rounded-full text-zinc-400 font-bold text-sm hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="px-10 py-3 rounded-full bg-gradient-to-r from-[#2E5BFF] to-[#B71BCF] text-white font-black text-sm shadow-xl shadow-[#8A3DFF]/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}