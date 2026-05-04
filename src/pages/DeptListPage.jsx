import { useState, useEffect } from 'react';
import { useRights } from '../context/UserRightsContext';
import DeptModal from '../components/modals/DeptModal';
import { getDepts } from '../services/departmentService';

export default function DeptListPage() {
  const { can, currentUser } = useRights();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [depts, setDepts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingDept, setEditingDept] = useState(null);

  // Fetch departments on mount and when modal closes
  const fetchDepts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await getDepts(currentUser?.user_type || 'USER');
      
      if (fetchError) {
        setError(fetchError.message);
      } else {
        setDepts(data || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepts();
  }, [currentUser?.user_type]);

  const handleOpenModal = (dept = null) => {
    setEditingDept(dept);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDept(null);
    // Refresh data after modal closes
    fetchDepts();
  };

  return (
    <div className="animate-in fade-in duration-700">
      <header className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-2">Departments</h1>
          <p className="text-zinc-500 font-bold text-sm uppercase tracking-widest font-body">Operational Business Units</p>
        </div>
        
        {/* Rubric: Add gated by DEPT_ADD */}
        {can('DEPT_ADD') && (
          <button 
            onClick={() => handleOpenModal()}
            className="bg-white/5 border border-white/10 text-primary px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
          >
            Add Department
          </button>
        )}
      </header>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary mx-auto mb-4"></div>
            <p className="text-zinc-500">Loading departments...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 mb-8">
          <p className="text-red-400 font-bold">Error loading departments: {error}</p>
        </div>
      )}

      {!loading && depts.length === 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 text-center">
          <p className="text-yellow-400 font-bold">No departments found.</p>
        </div>
      )}

      {!loading && depts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {depts.map((dept) => (
            <div key={dept.deptCode} className="bg-[#1A1A24] border border-white/5 p-8 rounded-[2.5rem] group hover:border-primary/30 transition-all relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-lg shadow-primary/10">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>corporate_fare</span>
                </div>
                
                {/* Rubric: Edit gated by DEPT_EDIT */}
                {can('DEPT_EDIT') && (
                  <button onClick={() => handleOpenModal(dept)} className="text-zinc-600 hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-xl">edit</span>
                  </button>
                )}
              </div>
              <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-1">{dept.deptCode}</h3>
              <p className="text-xl font-bold text-white tracking-tight">{dept.deptName}</p>
            </div>
          ))}
        </div>
      )}

      <DeptModal isOpen={isModalOpen} onClose={handleCloseModal} initialData={editingDept} />
    </div>
  );
}