import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useRights } from '../context/UserRightsContext';
import { supabase } from '../lib/supabaseClient';

export default function Layout() {
  const { can } = useRights();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: 'grid_view' },
    { name: 'Employees', path: '/employees', icon: 'badge' },
    { name: 'History', path: '/jobhistory', icon: 'history' },
    { name: 'Jobs', path: '/jobs', icon: 'work' },
    { name: 'Units', path: '/departments', icon: 'domain' },
    { name: 'Admin', path: '/admin', icon: 'admin_panel_settings', right: 'ADM_VIEW' },
    { name: 'Deleted', path: '/deleted-items', icon: 'delete_sweep', right: 'DEL_VIEW' },
  ];

  const visibleItems = navItems.filter(item => {
    if (item.right) {
      return can(item.right);
    }
    return true; 
  });

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#e2e2e2] relative font-body">
      {/* Background Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#2E5BFF]/10 blur-[120px] rounded-full z-0 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#B71BCF]/5 blur-[150px] rounded-full z-0 pointer-events-none"></div>

      {/* Top Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#16161E]/90 backdrop-blur-xl border-b border-white/5 flex justify-between items-center px-12 h-20">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2E5BFF] to-[#B71BCF] flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>fluid</span>
          </div>
          <span className="text-2xl font-black bg-gradient-to-r from-[#2E5BFF] to-[#B71BCF] bg-clip-text text-transparent tracking-tighter">HopeHRS</span>
        </div>
        
        <button 
          onClick={handleLogout}
          className="bg-white/5 border border-white/10 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all cursor-pointer"
        >
          Logout
        </button>
      </nav>

      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 h-full w-72 hidden lg:flex flex-col pt-24 pb-8 px-4 bg-[#0F0F14]/95 backdrop-blur-3xl border-r border-white/5 z-40">
        <nav className="flex flex-col gap-1 mt-4">
          {visibleItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-4 px-6 py-3.5 rounded-full transition-all duration-300
                ${isActive ? 'bg-gradient-to-r from-[#2E5BFF] to-[#B71BCF] text-white shadow-xl shadow-[#8A3DFF]/20' : 'text-zinc-500 hover:text-white hover:bg-white/5'}
              `}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-sm font-black">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="lg:ml-72 pt-28 px-12 pb-12 min-h-screen relative z-10">
        <Outlet />
      </main>
    </div>
  );
}