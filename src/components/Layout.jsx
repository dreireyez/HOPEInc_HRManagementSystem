import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useRights } from '../context/UserRightsContext';
import supabase from '../lib/supabaseClient';
import { ConfirmDialog } from './ui/ConfirmDialog';

/**
 * Layout
 *
 * Application shell: fixed sidebar (desktop), bottom nav (mobile),
 * and a neumorphic logout confirmation dialog.
 */
export default function Layout() {
  const { can, rights } = useRights();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const confirmLogout = async () => {
    try {
      setLoggingOut(true);
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // We don't necessarily need navigate('/login') here because 
      // ProtectedRoute will catch the null user and redirect automatically.
    } catch (err) {
      console.error('Logout failed:', err.message);
      setLoggingOut(false);
      setShowLogoutDialog(false);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: 'grid_view' },
    { name: 'Employees', path: '/employees', icon: 'badge' },
    { name: 'History', path: '/jobhistory', icon: 'history' },
    { name: 'Jobs', path: '/jobs', icon: 'work' },
    { name: 'Departments', path: '/departments', icon: 'domain' },
    { name: 'Reports', path: '/reports', icon: 'analytics' },
  ];

  const visibleNavItems = navItems.filter((item) => !item.right || can(item.right));

  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-on-surface)] flex selection:bg-[var(--color-primary-container)]/20">
      <aside className="sidebar-frame fixed left-0 top-0 hidden h-full w-[260px] lg:flex flex-col px-4 py-6 z-40">
        <div className="surface-panel gradient-primary-soft sidebar-shell flex h-full flex-col rounded-[28px] px-4 py-5">
          <button
            type="button"
            className="interactive-surface flex items-center gap-3 rounded-2xl px-4 py-3 text-left"
            onClick={() => navigate('/')}
          >
            <div className="sidebar-brand-mark gradient-primary flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-outset-soft">
              <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                assured_workload
              </span>
            </div>
            <div>
              <div className="font-sans font-bold tracking-tight text-xl text-[#181c1c]">Hope, Inc.</div>
              <div className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#3f4948]">
                HR Management
              </div>
            </div>
          </button>

          <nav className="mt-6 flex flex-col gap-1.5 flex-1">
            {visibleNavItems.map((item, index) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `nav-item-surface flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold animate-in fade-in slide-in-from-left-2 ${isActive
                    ? 'gradient-primary text-white shadow-outset-soft'
                    : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-bright)] hover:text-[var(--color-on-surface)] hover:shadow-outset-soft'
                  }`
                }
                style={{ animationDelay: `${index * 45}ms` }}
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`absolute left-1 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-[var(--color-primary-container)] transition-all duration-[var(--motion-base)] ${isActive ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-50'
                        }`}
                    />
                    <span
                      className={`nav-item-icon material-symbols-outlined text-[20px] transition-transform duration-[var(--motion-fast)] ${isActive ? 'scale-110' : 'group-hover:scale-105'
                        }`}
                    >
                      {item.icon}
                    </span>
                    <span className="nav-item-label relative z-10">{item.name}</span>
                  </>
                )}
              </NavLink>
            ))}

            {(rights?.ADM_USER === 1 || rights?.ADM_USER === true) && (
              <div className="mt-5 border-t border-[var(--color-outline-variant)]/55 pt-4 flex flex-col gap-1.5">
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `nav-item-surface flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold ${isActive
                      ? 'gradient-primary text-white shadow-outset-soft'
                      : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-bright)] hover:text-[var(--color-on-surface)] hover:shadow-outset-soft'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`absolute left-1 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-[var(--color-primary-container)] transition-all duration-[var(--motion-base)] ${isActive ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-50'
                          }`}
                      />
                      <span className="nav-item-icon material-symbols-outlined text-[20px]">admin_panel_settings</span>
                      <span className="nav-item-label">Admin</span>
                    </>
                  )}
                </NavLink>

                <NavLink
                  to="/deleted-items"
                  className={({ isActive }) =>
                    `nav-item-surface flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold ${isActive
                      ? 'gradient-primary text-white shadow-outset-soft'
                      : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-bright)] hover:text-[var(--color-on-surface)] hover:shadow-outset-soft'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`absolute left-1 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-[var(--color-primary-container)] transition-all duration-[var(--motion-base)] ${isActive ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-50'
                          }`}
                      />
                      <span className="nav-item-icon material-symbols-outlined text-[20px]">delete</span>
                      <span className="nav-item-label">Archive</span>
                    </>
                  )}
                </NavLink>
              </div>
            )}
          </nav>

          <div className="mt-4 shrink-0 border-t border-[var(--color-outline-variant)]/55 pt-4">
            <button
              onClick={() => setShowLogoutDialog(true)}
              className="nav-item-surface flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-[var(--color-on-surface-variant)] hover:bg-[var(--color-error-container)] hover:text-[var(--color-error)] cursor-pointer"
            >
              <span className="nav-item-icon material-symbols-outlined text-[20px] transition-transform duration-[var(--motion-fast)] group-hover:rotate-6">
                logout
              </span>
              <span className="nav-item-label">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="min-h-screen flex-1 px-4 pb-24 pt-4 lg:ml-[260px] lg:px-7 lg:pb-8 lg:pt-6">
        <div className="mx-auto w-full max-w-[1280px]">
          <div key={location.pathname} className="animate-in fade-in slide-in-from-bottom-4">
            <Outlet />
          </div>
        </div>
      </main>

      <nav className="fixed bottom-3 left-3 right-3 z-[100] lg:hidden">
        <div className="surface-panel flex h-16 items-center justify-around rounded-[22px] px-2">
          {visibleNavItems.slice(0, 5).map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `nav-item-surface relative flex h-full min-w-0 flex-1 flex-col items-center justify-center rounded-2xl ${isActive
                  ? 'gradient-primary text-white shadow-outset-soft'
                  : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-bright)] hover:text-[var(--color-on-surface)]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`absolute top-1 h-1.5 w-8 rounded-full bg-[var(--color-primary-container)] transition-transform duration-[var(--motion-base)] ${isActive ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                      }`}
                  />
                  <span className={`material-symbols-outlined text-[22px] transition-transform duration-[var(--motion-fast)] ${isActive ? '-translate-y-0.5' : ''}`}>
                    {item.icon}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showLogoutDialog}
        icon="logout"
        title="Sign Out?"
        description="Your session will be ended and you'll be returned to the login screen."
        confirmLabel="Yes, Sign Out"
        confirmVariant="danger"
        onCancel={() => setShowLogoutDialog(false)}
        onConfirm={confirmLogout}
        loading={loggingOut}
      />
    </div>
  );
}
