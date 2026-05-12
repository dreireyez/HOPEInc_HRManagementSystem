import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import JobHistoryPanel from '../components/JobHistoryPanel';
import { getEmployee } from '../services/employeeService';
import { useRights } from '../context/UserRightsContext';
import EditEmployeeModal from '../components/modals/EditEmployeeModal';

export default function EmployeeDetailPage() {
  const { id } = useParams(); // id is actually emp_no from URL
  const navigate = useNavigate();
  const { currentUser, can } = useRights();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchEmployeeData = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await getEmployee(id, currentUser?.user_type || 'USER');

      if (fetchError) {
        setError(fetchError.message);
        setEmployee(null);
      } else {
        setEmployee(data);
      }
    } catch (err) {
      setError(err.message);
      setEmployee(null);
    } finally {
      setLoading(false);
    }
  }, [id, currentUser?.user_type]);

  useEffect(() => {
    fetchEmployeeData();
  }, [fetchEmployeeData]);

  const profile = employee ? {
    id: employee.empno,
    firstName: employee.firstname || 'N/A',
    lastName: employee.lastname || 'N/A',
    email: employee.email || 'Not provided',
    phone: employee.phone_number || 'Not provided',
    gender: employee.gender || 'N/A',
    birthdate: employee.birthdate ? new Date(employee.birthdate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Not specified',
    joined: employee.hiredate ? new Date(employee.hiredate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Not specified',
    role: employee.jobdesc || 'Not assigned',
    dept: employee.deptname || 'Not assigned',
    manager: employee.managerName || 'Unassigned',
    status: employee.record_status === 'ACTIVE' ? 'Active' : 'Inactive',
    empNo: employee.empno
  } : null;

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-500">

      {/* Action Bar */}
      <div className="flex justify-between items-center mb-2 flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/employees')}
            className="p-2 rounded-full bg-[var(--color-surface)] shadow-outset hover:shadow-outset-hover hover:-translate-y-[1px] active:shadow-inset transition-all text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary-container)] flex items-center justify-center h-8 w-8 cursor-pointer group"
          >
            <span className="material-symbols-outlined text-sm group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
          </button>
          <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--color-on-surface-variant)] font-bold">Back to Directory</span>
        </div>

        {profile && (
          <div className="flex gap-4">
            {can('EMP_EDIT') && (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-6 py-2 rounded-lg bg-[var(--color-surface)] shadow-outset hover:shadow-outset-hover active:shadow-inset font-mono text-[11px] uppercase tracking-widest font-bold text-[var(--color-primary-container)] hover:text-[var(--color-primary)] transition-all cursor-pointer flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">edit</span> Edit Profile
              </button>
            )}
            <button className="px-6 py-2 rounded-lg bg-[var(--color-primary-container)] shadow-outset hover:shadow-outset-hover hover:shadow-glow active:shadow-inset font-mono text-[11px] uppercase tracking-widest font-bold text-white hover:bg-[var(--color-primary)] transition-all cursor-pointer flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">download</span> Download PDF
            </button>
          </div>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[var(--color-primary-container)] mx-auto mb-4"></div>
        </div>
      )}

      {error && (
        <div className="bg-[var(--color-error-container)] border border-[var(--color-error)]/20 rounded-md p-4 shadow-inset">
          <p className="text-[var(--color-on-error-container)] font-medium text-sm">Error loading employee: {error}</p>
        </div>
      )}

      {!loading && !profile && !error && (
        <div className="bg-[var(--color-surface-dim)] rounded-md p-6 text-center shadow-inset">
          <p className="text-[var(--color-on-surface-variant)] font-medium font-sans">Employee not found.</p>
        </div>
      )}

      {!loading && profile && (
        <>
          {/* Profile Header Bento */}
          <div className="grid grid-cols-12 gap-6 mb-6">

            {/* Identity Card */}
            <div className="col-span-12 lg:col-span-8 bg-[var(--color-surface)] rounded-2xl p-8 shadow-outset flex flex-col md:flex-row gap-8 items-start relative overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-outset-hover">
              <div className="absolute top-0 left-0 w-2 h-full bg-[var(--color-primary-container)]"></div>

              <div className="relative shrink-0 mx-auto md:mx-0">
                {/* Initials avatar — no external image dependency */}
                <div className="w-24 h-24 rounded-full flex items-center justify-center bg-[#f7faf9] shadow-[4px_4px_8px_#d7dbda,-4px_-4px_8px_#ffffff] shrink-0">
                  <span className="font-mono font-black text-3xl text-[#004c4c] select-none">
                    {`${profile.firstName} ${profile.lastName}`
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </span>
                </div>
                <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-[var(--color-surface)] shadow-outset flex items-center justify-center">
                  <div className={`w-3 h-3 rounded-full shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2)] ${profile.status === 'Active' ? 'bg-[#15803d]' : 'bg-[#ba1a1a]'}`}></div>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between h-full py-2 w-full text-center md:text-left">
                <div>
                  <h2 className="font-sans text-[32px] leading-tight font-bold text-[var(--color-on-surface)] mb-1">
                    {profile.firstName} {profile.lastName}
                  </h2>
                  <p className="font-sans text-xl text-[var(--color-primary-container)] font-medium mb-4">{profile.role}</p>

                  <div className="flex flex-wrap gap-3 mb-6 justify-center md:justify-start">
                    <div className="px-3 py-1.5 rounded-full bg-[var(--color-surface)] shadow-inset flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px] text-[var(--color-on-surface-variant)]">domain</span>
                      <span className="font-mono text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest">{profile.dept}</span>
                    </div>
                    <div className="px-3 py-1.5 rounded-full bg-[var(--color-surface)] shadow-inset flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px] text-[var(--color-on-surface-variant)]">badge</span>
                      <span className="font-mono text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest">EMP-{profile.empNo}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap md:flex-nowrap gap-6 border-t border-[var(--color-outline-variant)]/20 pt-5 mt-auto w-full justify-center md:justify-start">
                  <div>
                    <p className="font-mono text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest mb-1">Direct Manager</p>
                    <p className="font-sans text-sm font-semibold text-[var(--color-on-surface)]">{profile.manager}</p>
                  </div>
                  <div className="hidden md:block w-px bg-[var(--color-outline-variant)]/20"></div>
                  <div>
                    <p className="font-mono text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest mb-1">Hire Date</p>
                    <p className="font-sans text-sm font-semibold text-[var(--color-on-surface)]">{profile.joined}</p>
                  </div>
                  <div className="hidden md:block w-px bg-[var(--color-outline-variant)]/20"></div>
                  <div>
                    <p className="font-mono text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest mb-1">Gender</p>
                    <p className="font-sans text-sm font-semibold text-[var(--color-on-surface)]">{profile.gender}</p>
                  </div>
                  <div className="hidden md:block w-px bg-[var(--color-outline-variant)]/20"></div>
                  <div>
                    <p className="font-mono text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest mb-1">Birth Date</p>
                    <p className="font-sans text-sm font-semibold text-[var(--color-on-surface)]">{profile.birthdate}</p>
                  </div>
                  <div className="hidden md:block w-px bg-[var(--color-outline-variant)]/20"></div>
                  <div>
                    <p className="font-mono text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest mb-1">Record Status</p>
                    <p className={`font-sans text-sm font-semibold ${profile.status === 'Active' ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'}`}>
                      {profile.status}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact / Status */}
            <div className="col-span-12 lg:col-span-4 bg-[var(--color-surface)] rounded-2xl p-8 shadow-outset flex flex-col gap-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-outset-hover">
              <div className="flex items-center justify-between border-b border-[var(--color-outline-variant)]/20 pb-4">
                <h3 className="font-sans text-xl font-bold text-[var(--color-on-surface)]">Contact Info</h3>
              </div>
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-surface)] shadow-inset flex items-center justify-center text-[var(--color-primary-container)] group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[18px]">mail</span>
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-mono text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest mb-0.5">Corporate Email</p>
                    <p className="font-sans text-sm font-medium text-[var(--color-on-surface)] truncate">{profile.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-surface)] shadow-inset flex items-center justify-center text-[var(--color-primary-container)] group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[18px]">call</span>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest mb-0.5">Mobile Phone</p>
                    <p className="font-sans text-sm font-medium text-[var(--color-on-surface)]">{profile.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lower Data Grid - Exclusively Job History for now since we removed unsupported sections */}
          <div className="grid grid-cols-12 gap-6 pb-8">
            <div className="col-span-12">
              <JobHistoryPanel empNo={profile.empNo} />
            </div>
          </div>
        </>
      )}

      {profile && (
        <EditEmployeeModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          initialData={employee}
          onSuccess={fetchEmployeeData}
        />
      )}
    </div>
  );
}
