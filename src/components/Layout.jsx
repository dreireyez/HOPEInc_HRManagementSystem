import { Outlet, NavLink } from 'react-router-dom';

export default function Layout({ userRole = 'ADMIN' }) { // Accepts userRole as a prop
  const navItems = [
    { name: 'Dashboard', path: '/', icon: 'grid_view' },
    { name: 'Employees', path: '/employees', icon: 'badge' },
    { name: 'History', path: '/jobhistory', icon: 'history' },
    { name: 'Jobs', path: '/jobs', icon: 'work' },
    { name: 'Units', path: '/departments', icon: 'domain' },
    // GATED ITEMS (Only for ADMIN/SUPERADMIN)
    { name: 'Admin', path: '/admin', icon: 'admin_panel_settings', adminOnly: true },
    { name: 'Deleted', path: '/deleted-items', icon: 'delete_sweep', adminOnly: true },
  ];

  // Logic: Filter items based on user role
  const visibleItems = navItems.filter(item => {
    if (item.adminOnly) {
      return userRole === 'ADMIN' || userRole === 'SUPERADMIN';
    }
    return true; // Everyone sees standard items
  });

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#e2e2e2] relative overflow-x-hidden font-body">
      
      {/* Background Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#2E5BFF]/10 blur-[120px] rounded-full z-0 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#B71BCF]/5 blur-[150px] rounded-full z-0 pointer-events-none"></div>

      {/* Top Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#16161E]/90 backdrop-blur-xl border-b border-white/5 flex justify-between items-center px-6 md:px-12 h-20">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2E5BFF] via-[#8A3DFF] to-[#B71BCF] flex items-center justify-center shadow-lg shadow-[#2E5BFF]/20">
            <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>fluid</span>
          </div>
          <span className="text-xl md:text-2xl font-black bg-gradient-to-r from-[#2E5BFF] to-[#B71BCF] bg-clip-text text-transparent tracking-tighter">HopeHRS</span>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="bg-white/5 border border-white/10 text-white px-4 md:px-6 py-2 rounded-full font-bold text-xs md:text-sm hover:bg-white/10 transition-all">
            Logout
          </button>
          <div className="h-10 w-10 rounded-full border-2 border-[#2E5BFF] overflow-hidden hidden sm:block">
             <img alt="User" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfY4Grs8AjDvtyQfOGKsO3_KS5WbalsK-a0d9bRKVcoBe_aAETtD3zoL3KfEba4YgSswWi1ig71UBkMh1GnDaBece1WYr8a2YdPBwU4nNtPzwDBnETDdF76wEwN5ZzLptvuqp4ECh6W8n6FysOZQy3u5SpnE_aeFDKhPCeyaCnbAorZylWx9Bm8cN-KGrYqcBXXXQpHkUparUV6WBu_GCVoggo0cp75xtQ6g5u1ZNUrg6HTA_9od32qNP--2B8bSaDgGBPMI8E5lwY" className="w-full h-full object-cover"/>
          </div>
        </div>
      </nav>

      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 h-full w-72 hidden lg:flex flex-col pt-24 pb-8 px-4 bg-[#0F0F14]/95 backdrop-blur-3xl border-r border-white/5 z-40">
        <div className="px-6 mb-8 mt-4">
          <h2 className="text-[#2E5BFF] font-black text-xl tracking-tight">Management</h2>
          <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">System Navigation</p>
        </div>
        <nav className="flex flex-col gap-1 flex-grow">
          {visibleItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-4 px-6 py-3.5 rounded-full transition-all duration-300
                ${isActive 
                  ? 'bg-gradient-to-r from-[#2E5BFF] to-[#B71BCF] text-white shadow-xl shadow-[#8A3DFF]/20' 
                  : 'text-zinc-500 hover:text-white hover:bg-white/5'}
              `}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: item.adminOnly ? "'FILL' 1" : "" }}>{item.icon}</span>
              <span className="text-sm font-bold">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full h-20 lg:hidden bg-[#16161E] border-t border-white/10 flex justify-around items-center z-[100] px-2">
        {visibleItems.map((item) => (
          <NavLink 
            key={item.name} 
            to={item.path} 
            className={({ isActive }) => `flex flex-col items-center gap-1 flex-1 ${isActive ? 'text-[#8A3DFF]' : 'text-zinc-500'}`}
          >
            <span className="material-symbols-outlined text-2xl">{item.icon}</span>
            <span className="text-[9px] font-black uppercase tracking-tighter">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Main Content Area */}
      <main className="lg:ml-72 pt-28 px-6 md:px-12 pb-32 lg:pb-12 min-h-screen relative z-10">
        <Outlet />
      </main>
    </div>
  );
}