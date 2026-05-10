import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEmployees } from '../services/employeeService';
import { getDepts } from '../services/departmentService';
import { getJobs } from '../services/jobService';
import { useRights } from '../context/UserRightsContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function Dashboard() {
  const { currentUser } = useRights();
  const navigate = useNavigate();
  const userType = currentUser?.user_type || 'USER';
  const [stats, setStats] = useState({ employees: 0, jobs: 0, departments: 0 });
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const [empRes, jobRes, deptRes] = await Promise.all([
          getEmployees(userType),
          getJobs(userType),
          getDepts(userType),
        ]);
        const employees = (empRes.data || []).filter((e) => e.record_status === 'ACTIVE');
        setStats({
          employees: employees.length,
          jobs: (jobRes.data || []).filter((j) => j.record_status === 'ACTIVE').length,
          departments: (deptRes.data || []).filter((d) => d.record_status === 'ACTIVE').length,
        });

        // Restored to 4 since the bottom button removal freed up enough space
        const sorted = [...employees]
          .filter((e) => e.hiredate)
          .sort((a, b) => new Date(b.hiredate) - new Date(a.hiredate))
          .slice(0, 4);
        setRecentEmployees(sorted);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) fetch();
  }, [currentUser, userType]);

  const statCards = [
    { label: 'Active Workforce', val: stats.employees.toLocaleString(), sub: 'Employees', icon: 'badge', path: '/employees', accent: 'ring-[var(--color-primary-container)]/16' },
    { label: 'Job Roles', val: stats.jobs.toString(), sub: 'Active', icon: 'work', path: '/jobs', accent: 'ring-[rgba(28,78,121,0.16)]' },
    { label: 'Departments', val: stats.departments.toString(), sub: 'Units', icon: 'domain', path: '/departments', accent: 'ring-[rgba(115,131,153,0.18)]' },
  ];

  return (
    <div className="flex flex-col gap-6 h-full">
      <header className="mb-1">
        <span className="text-[10px] font-mono uppercase tracking-[0.26em] text-[var(--color-primary-container)] font-bold"></span>
        <h1 className="mt-1.5 text-3xl font-black text-[var(--color-on-surface)] tracking-tight">Systems Overview</h1>
        <p className="text-[var(--color-on-surface-variant)] text-sm mt-1 max-w-2xl">
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {statCards.map((card, i) => (
          <Card
            key={i}
            interactive
            padding="md"
            role="button"
            tabIndex={0}
            onClick={() => navigate(card.path)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') navigate(card.path);
            }}
            className="relative overflow-hidden flex items-center gap-4"
          >
            <div className={`absolute right-4 top-4 h-16 w-16 rounded-full bg-[var(--color-primary-soft)] opacity-80 blur-2xl ${card.accent}`} />
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl gradient-primary text-white shadow-outset-soft">
              <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                {card.icon}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-[var(--color-on-surface-variant)]/85 mb-1">
                {card.label}
              </p>
              <div className="flex items-end justify-between gap-3">
                {loading ? (
                  <div className="skeleton h-8 w-16 rounded-lg" />
                ) : (
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-black text-[var(--color-on-surface)] leading-none tracking-[-0.04em]">{card.val}</span>
                    <span className="text-xs font-semibold text-[var(--color-outline)] mb-0.5">{card.sub}</span>
                  </div>
                )}
                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-primary-soft)] px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.18em] text-[var(--color-primary-container)] shadow-inset">
                  Live
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-grow pb-2">
        <div className="col-span-1 md:col-span-8">
          <Card className="h-full bg-[rgba(255,255,255,0.84)] flex flex-col" padding="md">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-xl font-black text-[var(--color-on-surface)] tracking-tight">Recent Hires</h3>
                <p className="text-sm text-[var(--color-on-surface-variant)]/90 mt-0.5">Newest people added to the active workforce.</p>
              </div>
              <Button onClick={() => navigate('/employees')} variant="ghost" size="sm" className="text-sm py-2">
                Full Directory
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Button>
            </div>

            <div className="space-y-3 flex-grow">
              {loading
                ? [1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-3.5 rounded-2xl bg-[rgba(255,255,255,0.92)] shadow-inset">
                    <div className="skeleton h-11 w-11 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="skeleton h-4 w-1/3 rounded-md" />
                      <div className="skeleton h-3 w-1/4 rounded-md" />
                    </div>
                  </div>
                ))
                : recentEmployees.length > 0
                  ? recentEmployees.map((emp) => {
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
                            {emp.job_title || 'No title'} • {emp.dept || 'Unassigned'}
                          </p>
                        </div>
                        <span className="rounded-full bg-[var(--color-surface-container)] px-3 py-1.5 text-[10px] font-mono font-medium text-[var(--color-on-surface-variant)] uppercase tracking-[0.24em] shadow-inset shrink-0">
                          {emp.hiredate}
                        </span>
                      </button>
                    );
                  })
                  : (
                    <div className="surface-panel rounded-2xl py-8 text-center bg-[rgba(255,255,255,0.82)] h-full flex flex-col justify-center">
                      <p className="text-[var(--color-on-surface-variant)] font-medium text-sm">No recent hires found.</p>
                    </div>
                  )}
            </div>
          </Card>
        </div>

        <div className="col-span-1 md:col-span-4">
          <Card className="h-full bg-[rgba(248,251,255,0.96)] flex flex-col" padding="md">
            <h3 className="text-xl font-black text-[var(--color-on-surface)] tracking-tight mb-1">Quick Navigation</h3>
            <p className="text-sm text-[var(--color-on-surface-variant)]/88 mb-6">Jump into the busiest areas of the system.</p>
            <div className="space-y-3.5 flex-grow">
              {[
                { label: 'Employees', path: '/employees', icon: 'badge' },
                { label: 'Departments', path: '/departments', icon: 'domain' },
                { label: 'Reports', path: '/reports', icon: 'analytics' },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => navigate(item.path)}
                  className="interactive-surface flex w-full items-center gap-4 rounded-2xl p-3.5 text-left"
                >
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white shadow-outset-soft">
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {item.icon}
                    </span>
                  </div>
                  <span className="text-[15px] font-semibold text-[var(--color-on-surface)]">{item.label}</span>
                  <span className="material-symbols-outlined ml-auto text-[var(--color-outline)] text-[18px]">arrow_forward</span>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}