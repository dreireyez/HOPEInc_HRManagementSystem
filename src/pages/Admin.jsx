import { useState } from 'react';

// Mock Data for User Management
const MOCK_USERS = [
  { id: 'USR-8829', name: 'Sarah Jenkins', email: 's.jenkins@hopehrs.com', type: 'USER', status: 'ACTIVE', initials: 'SJ' },
  { id: 'USR-7411', name: 'Marcus Trent', email: 'm.trent@hopehrs.com', type: 'ADMIN', status: 'INACTIVE', initials: 'MT' },
  { id: 'SYS-0001', name: 'System Root', email: 'root@hopehrs.com', type: 'SUPERADMIN', status: 'ACTIVE', initials: 'SR' },
  { id: 'USR-88925', name: 'Jane Doe', email: 'j.doe@hopehrs.com', type: 'USER', status: 'ACTIVE', initials: 'JD' }
];

export default function Admin() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = MOCK_USERS.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-700">
      
      {/* Page Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">
            User <span className="bg-gradient-to-r from-[#2E5BFF] to-[#B71BCF] bg-clip-text text-transparent">Management</span>
          </h1>
          <p className="text-zinc-500 font-bold text-sm uppercase tracking-widest">System Access & Privileges</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group w-full md:w-auto">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary transition-colors text-sm">search</span>
            <input 
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#1A1A24] border border-white/5 rounded-full py-3 pl-12 pr-6 text-sm text-white focus:ring-2 focus:ring-primary/20 transition-all outline-none w-full md:w-64 placeholder:text-zinc-700 font-bold"
            />
          </div>
          <button className="hidden md:flex bg-gradient-to-r from-[#2E5BFF] to-[#B71BCF] text-white px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all items-center gap-2">
            <span className="material-symbols-outlined text-sm">add</span>
            Add User
          </button>
        </div>
      </header>

      {/* --- DESKTOP VIEW (Table) --- */}
      <div className="hidden md:block bg-[#1A1A24]/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl mb-10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/5">
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">User Details</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">User Type</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Status</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                
                {/* User Info */}
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border border-white/5 ${user.type === 'SUPERADMIN' ? 'bg-gradient-to-br from-[#2E5BFF] to-[#B71BCF] text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                      {user.initials}
                    </div>
                    <div>
                      <div className="font-bold text-white text-base">{user.name}</div>
                      <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{user.id} • {user.email}</div>
                    </div>
                  </div>
                </td>

                {/* User Type */}
                <td className="px-8 py-6">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    user.type === 'SUPERADMIN' ? 'bg-[#B71BCF]/10 text-[#B71BCF] border-[#B71BCF]/20' : 
                    user.type === 'ADMIN' ? 'bg-[#2E5BFF]/10 text-[#2E5BFF] border-[#2E5BFF]/20' : 
                    'bg-zinc-800 text-zinc-400 border-white/5'
                  }`}>
                    {user.type}
                    {user.type === 'SUPERADMIN' && <span className="material-symbols-outlined text-[10px]">lock</span>}
                  </span>
                </td>

                {/* Status */}
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${user.status === 'ACTIVE' ? 'bg-[#00ffcc] shadow-[0_0_8px_rgba(0,255,204,0.6)]' : 'bg-zinc-600'}`}></div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${user.status === 'ACTIVE' ? 'text-white' : 'text-zinc-500'}`}>
                      {user.status}
                    </span>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-8 py-6 text-right">
                  {user.type === 'SUPERADMIN' ? (
                    <button 
                      disabled
                      title="SUPERADMIN accounts cannot be modified."
                      className="px-6 py-2 rounded-full bg-zinc-800/50 text-zinc-600 font-black text-[10px] uppercase tracking-widest border border-white/5 cursor-not-allowed flex items-center gap-2 ml-auto"
                    >
                      <span className="material-symbols-outlined text-sm">lock</span>
                      Protected
                    </button>
                  ) : user.status === 'ACTIVE' ? (
                    <button className="px-6 py-2 rounded-full bg-error/10 text-error hover:bg-error/20 border border-error/20 font-black text-[10px] uppercase tracking-widest transition-all">
                      Deactivate
                    </button>
                  ) : (
                    <button className="px-6 py-2 rounded-full bg-[#00ffcc]/10 text-[#00ffcc] hover:bg-[#00ffcc]/20 border border-[#00ffcc]/20 font-black text-[10px] uppercase tracking-widest shadow-[0_0_15px_rgba(0,255,204,0.1)] transition-all">
                      Activate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MOBILE VIEW (Card Stack) --- */}
      <div className="md:hidden space-y-4 mb-24">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-[#1A1A24] border border-white/5 p-6 rounded-[2rem] relative overflow-hidden flex flex-col gap-5">
            
            {/* Superadmin Background Glow */}
            {user.type === 'SUPERADMIN' && (
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#B71BCF]/10 rounded-full blur-3xl pointer-events-none"></div>
            )}

            <div className="flex items-start gap-4 relative z-10">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg border border-white/5 shrink-0 ${user.type === 'SUPERADMIN' ? 'bg-gradient-to-br from-[#2E5BFF] to-[#B71BCF] text-white shadow-lg' : 'bg-zinc-800 text-zinc-400'}`}>
                {user.initials}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-white truncate">{user.name}</h3>
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{user.id}</p>
              </div>
              <div className="shrink-0 flex flex-col items-end gap-2">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded bg-white/5 text-[9px] font-black uppercase tracking-widest border border-white/5 ${user.type === 'SUPERADMIN' ? 'text-[#B71BCF]' : 'text-zinc-400'}`}>
                  {user.type}
                  {user.type === 'SUPERADMIN' && <span className="material-symbols-outlined text-[10px]">lock</span>}
                </span>
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  <span className={`w-2 h-2 rounded-full ${user.status === 'ACTIVE' ? 'bg-[#00ffcc] shadow-[0_0_8px_rgba(0,255,204,0.6)]' : 'bg-zinc-600'}`}></span>
                  {user.status}
                </div>
              </div>
            </div>

            {/* Mobile Actions (Full Width) */}
            {user.type === 'SUPERADMIN' ? (
              <button 
                disabled
                title="SUPERADMIN accounts cannot be modified."
                className="w-full py-3 rounded-xl bg-zinc-800/50 text-zinc-600 font-black text-xs uppercase tracking-widest border border-white/5 cursor-not-allowed flex justify-center items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">lock</span>
                Protected Account
              </button>
            ) : user.status === 'ACTIVE' ? (
              <button className="w-full py-3 rounded-xl bg-error/10 text-error font-black text-xs uppercase tracking-widest border border-error/20 hover:bg-error/20 transition-colors flex justify-center items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">block</span>
                Deactivate
              </button>
            ) : (
              <button className="w-full py-3 rounded-xl bg-[#00ffcc]/10 text-[#00ffcc] font-black text-xs uppercase tracking-widest border border-[#00ffcc]/20 hover:bg-[#00ffcc]/20 transition-colors flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(0,255,204,0.1)]">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                Activate
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Mobile FAB */}
      <button className="md:hidden fixed bottom-24 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-[#2E5BFF] to-[#B71BCF] text-white flex items-center justify-center shadow-lg shadow-[#2E5BFF]/30 z-40 active:scale-95 transition-transform">
        <span className="material-symbols-outlined">add</span>
      </button>

    </div>
  );
}