import { useState, useEffect, useCallback } from 'react';
import { useRights } from '../context/UserRightsContext';
import DeptModal from '../components/modals/DeptModal';
import { getDepts, softDeleteDept } from '../services/departmentService';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function DeptListPage() {
  const { can, currentUser } = useRights();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [depts, setDepts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingDept, setEditingDept] = useState(null);

  const fetchDepts = useCallback(async () => {
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
  }, [currentUser?.user_type]);

  useEffect(() => {
    fetchDepts();
  }, [fetchDepts]);

  const handleOpenModal = (dept = null) => {
    setEditingDept(dept);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDept(null);
    fetchDepts();
  };

  /**
   * Soft-deletes a department by setting record_status to 'INACTIVE'.
   * Only SUPERADMIN has DEPT_DEL right per the 17-right model.
   * @param {string} deptCode
   * @param {string} deptName
   */
  const handleSoftDelete = async (deptCode, deptName) => {
    if (!window.confirm(`Deactivate department "${deptName}" (${deptCode})?\nThis will set its status to INACTIVE.`)) return;
    const { error: delErr } = await softDeleteDept(deptCode);
    if (delErr) {
      alert(`Failed to deactivate: ${delErr.message}`);
    } else {
      fetchDepts();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-on-surface)] tracking-tight">Departments</h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Operational Business Units</p>
        </div>

        {can('DEPT_ADD') && (
          <Button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Department
          </Button>
        )}
      </header>

      {error && (
        <div className="bg-[var(--color-error-container)] border border-[var(--color-error)]/20 rounded-md p-4 shadow-inset">
          <p className="text-[var(--color-on-error-container)] font-medium text-sm">Error: {error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[var(--color-primary-container)] mx-auto"></div>
        </div>
      ) : depts.length === 0 ? (
        <div className="bg-[var(--color-surface)] rounded-lg p-12 text-center shadow-outset">
          <p className="text-[var(--color-on-surface-variant)] font-medium">No departments found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {depts.map((dept) => {
            const code = dept.deptcode ?? dept.deptCode ?? dept.dept_code ?? dept.code ?? '';
            const name = dept.deptname ?? dept.deptName ?? dept.dept_name ?? dept.name ?? 'Unnamed';
            return (
              <div
                key={code || dept.id || name}
                className="group surface-panel relative overflow-hidden flex flex-col justify-between min-h-[148px] rounded-[var(--radius-xl)] p-6
                  transition-all duration-[var(--motion-base)] ease-[var(--ease-standard)]
                  hover:-translate-y-[5px] hover:shadow-[0_24px_52px_rgba(12,31,56,0.16),0_8px_20px_rgba(12,31,56,0.09)]
                  hover:border-[var(--color-primary-container)]/20"
                onMouseEnter={e => e.currentTarget.style.willChange = 'transform, box-shadow'}
                onMouseLeave={e => e.currentTarget.style.willChange = 'auto'}
              >
                {/* Teal accent streak — slides in from bottom on hover */}
                <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-[var(--radius-xl)]
                  bg-[var(--gradient-primary)] origin-bottom
                  scale-y-0 group-hover:scale-y-100
                  transition-transform duration-[var(--motion-base)] ease-[var(--ease-standard)]" />

                {/* Shimmer gloss overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100
                    transition-opacity duration-[var(--motion-slow)] pointer-events-none rounded-[var(--radius-xl)]"
                  style={{ background: 'linear-gradient(120deg, rgba(255,255,255,0.18) 0%, transparent 50%, rgba(17,58,91,0.06) 100%)' }}
                />

                {/* Top row: icon + action buttons */}
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="w-11 h-11 rounded-xl bg-[var(--color-surface-dim)] flex items-center justify-center
                    text-[var(--color-primary-container)] shadow-inset
                    transition-all duration-[var(--motion-base)] ease-[var(--ease-standard)]
                    group-hover:bg-[var(--color-primary-container)] group-hover:text-white
                    group-hover:shadow-outset-soft group-hover:scale-110">
                    <span
                      className="material-symbols-outlined text-[20px] transition-transform duration-[var(--motion-fast)] group-hover:scale-110"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      corporate_fare
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {can('DEPT_EDIT') && (
                      <button
                        onClick={() => handleOpenModal(dept)}
                        className="p-1.5 rounded-lg text-[var(--color-outline-variant)]
                          hover:bg-[var(--color-primary-container)] hover:text-white
                          transition-all duration-[var(--motion-fast)] cursor-pointer
                          opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0
                          focus-within:opacity-100"
                        title="Edit Department"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                    )}
                    {can('DEPT_DEL') && dept.record_status === 'ACTIVE' && (
                      <button
                        onClick={() => handleSoftDelete(code, name)}
                        className="p-1.5 rounded-lg text-[var(--color-error)]
                          hover:bg-[var(--color-error)] hover:text-white
                          transition-all duration-[var(--motion-fast)] cursor-pointer
                          opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0
                          focus-within:opacity-100"
                        title="Deactivate Department"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Bottom: dept code + name */}
                <div className="relative z-10 transition-transform duration-[var(--motion-base)] ease-[var(--ease-standard)] group-hover:-translate-y-0.5">
                  <h3 className="text-[10px] font-mono font-bold uppercase tracking-wider mb-1
                    text-[var(--color-on-surface-variant)] transition-colors duration-[var(--motion-fast)]
                    group-hover:text-[var(--color-primary-container)]">
                    {code}
                  </h3>
                  <p className="text-lg font-bold text-[var(--color-on-surface)] tracking-tight leading-tight">
                    {name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <DeptModal isOpen={isModalOpen} onClose={handleCloseModal} initialData={editingDept} />
    </div>
  );
}
