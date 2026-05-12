import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRights } from '../context/UserRightsContext';
import DeptModal from '../components/modals/DeptModal';
import { getDepts, softDeleteDept } from '../services/departmentService';
import { getEmployees } from '../services/employeeService';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { ToastContainer } from '../components/ui/Toast';
import { useToast } from '../components/ui/useToast';

/* ─── Aesthetic Color Palette (Restored) ─── */
// Subtle gradients, side streaks, and animated icon colors
const CARD_THEMES = [
  {
    gradient: 'from-blue-500/15 via-blue-500/5 to-transparent',
    iconText: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-50 dark:bg-blue-500/10',
    iconHover: 'group-hover:bg-blue-600 group-hover:text-white',
    streak: 'bg-blue-500',
  },
  {
    gradient: 'from-emerald-500/15 via-emerald-500/5 to-transparent',
    iconText: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-emerald-50 dark:bg-emerald-500/10',
    iconHover: 'group-hover:bg-emerald-600 group-hover:text-white',
    streak: 'bg-emerald-500',
  },
  {
    gradient: 'from-violet-500/15 via-violet-500/5 to-transparent',
    iconText: 'text-violet-600 dark:text-violet-400',
    iconBg: 'bg-violet-50 dark:bg-violet-500/10',
    iconHover: 'group-hover:bg-violet-600 group-hover:text-white',
    streak: 'bg-violet-500',
  },
  {
    gradient: 'from-amber-500/15 via-amber-500/5 to-transparent',
    iconText: 'text-amber-600 dark:text-amber-400',
    iconBg: 'bg-amber-50 dark:bg-amber-500/10',
    iconHover: 'group-hover:bg-amber-500 group-hover:text-white',
    streak: 'bg-amber-500',
  },
  {
    gradient: 'from-rose-500/15 via-rose-500/5 to-transparent',
    iconText: 'text-rose-600 dark:text-rose-400',
    iconBg: 'bg-rose-50 dark:bg-rose-500/10',
    iconHover: 'group-hover:bg-rose-600 group-hover:text-white',
    streak: 'bg-rose-500',
  },
  {
    gradient: 'from-cyan-500/15 via-cyan-500/5 to-transparent',
    iconText: 'text-cyan-600 dark:text-cyan-400',
    iconBg: 'bg-cyan-50 dark:bg-cyan-500/10',
    iconHover: 'group-hover:bg-cyan-600 group-hover:text-white',
    streak: 'bg-cyan-500',
  },
];

export default function DeptListPage() {
  const { can, currentUser } = useRights();
  const navigate = useNavigate();
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [depts, setDepts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingDept, setEditingDept] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); // { code, name }
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);
  const [employees, setEmployees] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const userType = currentUser?.user_type || 'USER';
      const [deptRes, empRes] = await Promise.all([
        getDepts(userType),
        getEmployees(userType)
      ]);

      if (deptRes.error) {
        setError(deptRes.error.message);
      } else {
        setDepts(deptRes.data || []);
      }

      if (empRes.error && !deptRes.error) {
        setError(empRes.error.message);
      } else {
        setEmployees(empRes.data || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.user_type]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenModal = (dept = null) => {
    setEditingDept(dept);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDept(null);
    fetchData();
  };

  /** Opens the confirmation dialog instead of window.confirm. */
  const handleSoftDelete = (deptCode, deptName) => {
    setDeleteTarget({ code: deptCode, name: deptName });
  };

  /** Executes the soft-delete after the user confirms in the dialog. */
  const confirmSoftDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    const { error: delErr } = await softDeleteDept(deleteTarget.code);
    setDeleteLoading(false);
    if (delErr) {
      toast.push(`Failed to deactivate: ${delErr.message}`, 'error');
    } else {
      toast.push(`"${deleteTarget.name}" has been deactivated.`);
      fetchData();
    }
    setDeleteTarget(null);
  };

  return (
    <div className="flex flex-col gap-6 h-full pb-6">
      {/* Header exactly matched to your Dashboard structure */}
      <header className="mb-1 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.26em] text-[var(--color-primary-container)] font-bold">
            Organization
          </span>
          <h1 className="mt-1.5 text-3xl font-black text-[var(--color-on-surface)] tracking-tight">
            Departments
          </h1>
          <p className="text-[var(--color-on-surface-variant)] text-sm mt-1 max-w-2xl">
            Operational business units and structured departments.
          </p>
        </div>

        {can('DEPT_ADD') && (
          <Button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 mt-2 md:mt-0"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Department
          </Button>
        )}
      </header>

      {error && (
        <div className="bg-[var(--color-error-container)] border border-[var(--color-error)]/20 rounded-2xl p-4 shadow-inset">
          <p className="text-[var(--color-on-error-container)] font-medium text-sm">Error: {error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[var(--color-primary-container)] mx-auto"></div>
        </div>
      ) : depts.length === 0 ? (
        <Card padding="md" className="py-16 text-center bg-[rgba(255,255,255,0.82)]">
          <p className="text-[var(--color-on-surface-variant)] font-medium text-sm">No departments found.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className={`transition-all duration-300 items-start content-start ${selectedDept === null ? 'lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5' : 'lg:col-span-5 grid grid-cols-1 gap-5'}`}>
            {depts.map((dept, index) => {
              const code = dept.deptcode ?? dept.deptCode ?? dept.dept_code ?? dept.code ?? '';
              const name = dept.deptname ?? dept.deptName ?? dept.dept_name ?? dept.name ?? 'Unnamed';

              // Assign theme dynamically
              const theme = CARD_THEMES[index % CARD_THEMES.length];
              const isActive = selectedDept === name;

              return (
                <div key={code || dept.id || name} className="cursor-pointer" onClick={() => setSelectedDept(isActive ? null : name)}>
                <Card
                  interactive
                  padding="md"
                  className={`group relative overflow-hidden flex flex-col justify-between min-h-[148px] hover:-translate-y-1 transition-all duration-300 ${isActive ? 'shadow-inset bg-[var(--color-surface-bright)] ring-2 ring-[var(--color-primary-container)]' : ''}`}
                >
                {/* 1. Aesthetic Mesh Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                {/* 2. Animated Side Streak */}
                <div className={`absolute left-0 top-0 bottom-0 w-[4px] rounded-l-2xl ${theme.streak} origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out z-10`} />

                {/* Top Row: Animated Icon + Dashboard styled buttons */}
                <div className="flex justify-between items-start mb-4 relative z-10">
                  {/* 3. Icon Box (Dashboard 11x11 size + Aesthetic hover colors + shadow-outset-soft on hover) */}
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 shadow-inset group-hover:shadow-outset-soft group-hover:scale-110 ${theme.iconBg} ${theme.iconText} ${theme.iconHover}`}>
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      corporate_fare
                    </span>
                  </div>

                  {/* Quick Actions (Fade in on hover, styled with dashboard shadows) */}
                  <div className="flex items-center gap-1 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 focus-within:opacity-100 focus-within:translate-y-0 transition-all duration-300">
                    {can('DEPT_EDIT') && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleOpenModal(dept); }}
                        className="cursor-pointer flex items-center justify-center w-8 h-8 rounded-lg text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)] hover:text-[var(--color-on-surface)] hover:shadow-inset transition-all"
                        title="Edit Department"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                    )}
                    {can('DEPT_DEL') && dept.record_status === 'ACTIVE' && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleSoftDelete(code, name); }}
                        className="cursor-pointer flex items-center justify-center w-8 h-8 rounded-lg text-[var(--color-outline)] hover:bg-red-50 hover:text-[var(--color-error)] hover:shadow-inset transition-all"
                        title="Deactivate Department"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Bottom Row: Exact Dashboard Typography */}
                <div className="relative z-10 transition-transform duration-300 group-hover:-translate-y-0.5">
                  <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-[var(--color-on-surface-variant)]/85 mb-1 truncate">
                    {code}
                  </p>
                  <div className="flex items-end justify-between gap-3">
                    <span className="text-xl font-black text-[var(--color-on-surface)] leading-none tracking-tight">
                      {name}
                    </span>

                    {/* Tiny status badge using Dashboard 'shadow-inset' */}
                    {dept.record_status !== 'ACTIVE' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-surface-container)] px-2 py-0.5 text-[9px] font-mono uppercase tracking-[0.18em] text-[var(--color-on-surface-variant)] shadow-inset">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
                </Card>
                </div>
              );
            })}
          </div>

          {/* Right Side: Drill-down Roster */}
          {selectedDept && (
            <div className="lg:col-span-7 flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
              <Card padding="lg" className="flex flex-col h-full bg-[rgba(255,255,255,0.84)] rounded-[28px]">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-[var(--color-outline-variant)]/50">
                  <div>
                    <h2 className="text-2xl font-black text-[var(--color-primary)]">{selectedDept}</h2>
                    <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Employee Roster</p>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedDept(null); }}
                    className="w-10 h-10 flex items-center justify-center rounded-xl text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)] hover:text-[var(--color-on-surface)] transition-all cursor-pointer"
                    title="Close panel"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {(() => {
                    const deptEmployees = employees
                      .filter(e => e.deptname === selectedDept)
                      .sort((a, b) => {
                        const nameA = ((a.firstname || '') + ' ' + (a.lastname || '')).trim().toLowerCase();
                        const nameB = ((b.firstname || '') + ' ' + (b.lastname || '')).trim().toLowerCase();
                        return nameA.localeCompare(nameB);
                      });

                    if (deptEmployees.length === 0) {
                      return (
                        <div className="p-8 text-center text-[var(--color-on-surface-variant)]/60 flex flex-col items-center justify-center">
                          <span className="material-symbols-outlined text-4xl mb-3 opacity-50">group_off</span>
                          <p>No employees found in this department.</p>
                        </div>
                      );
                    }
                    return deptEmployees.map(emp => {
                      const initials = `${(emp.firstname || '')[0] || ''}${(emp.lastname || '')[0] || ''}`.toUpperCase();
                      return (
                        <button
                          key={emp.empno}
                          type="button"
                          onClick={() => navigate(`/employees/${emp.empno}`)}
                          className="interactive-surface flex w-full items-center gap-4 rounded-2xl border border-transparent p-3.5 text-left focus-visible:ring-2 focus-visible:ring-[var(--color-primary-container)] odd:bg-[rgba(255,255,255,0.96)] even:bg-[rgba(245,248,252,0.94)]"
                        >
                          <div className="w-11 h-11 rounded-full shrink-0 gradient-primary border border-white/15 flex items-center justify-center text-white font-mono font-bold text-base shadow-outset-soft">
                            {initials}
                          </div>
                          <div className="flex-grow min-w-0">
                            <h4 className="font-bold text-[15px] text-[var(--color-on-surface)] truncate">
                              {emp.firstname} {emp.lastname}
                            </h4>
                            <p className="text-sm text-[var(--color-on-surface-variant)]/88 truncate">
                              {emp.jobdesc || 'No job assigned'}
                            </p>
                          </div>
                          <span className="rounded-full bg-[var(--color-surface-container)] px-3 py-1.5 text-[10px] font-mono font-medium text-[var(--color-on-surface-variant)] uppercase tracking-[0.24em] shadow-inset shrink-0">
                            {emp.empno}
                          </span>
                        </button>
                      );
                    });
                  })()}
                </div>
              </Card>
            </div>
          )}
        </div>
      )}

      <DeptModal isOpen={isModalOpen} onClose={handleCloseModal} initialData={editingDept} />

      {/* Deactivation confirmation dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        icon="domain_disabled"
        title="Deactivate Department?"
        description={
          deleteTarget ? (
            <>
              You are about to deactivate{' '}
              <strong className="text-[var(--color-on-surface)]">
                {deleteTarget.name}
              </strong>{' '}
              <span className="font-mono text-xs">({deleteTarget.code})</span>.
              <br /><br />
              This will set its status to{' '}
              <strong className="text-[var(--color-error)]">INACTIVE</strong> and
              hide it from standard views. It can be recovered from the Deleted Items page.
            </>
          ) : null
        }
        confirmLabel="Deactivate"
        confirmVariant="danger"
        onCancel={() => { if (!deleteLoading) setDeleteTarget(null); }}
        onConfirm={confirmSoftDelete}
        loading={deleteLoading}
      />

      <ToastContainer toasts={toast.toasts} onDismiss={toast.dismiss} />
    </div>
  );
}