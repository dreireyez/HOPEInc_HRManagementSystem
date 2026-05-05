import { useState, useEffect } from 'react';
import { getUsers, activateUser, deactivateUser } from '../services/adminService';
import { useRights } from '../context/UserRightsContext';

/**
 * Admin Page — User Management Console
 * 
 * BUG-002 FIX: Component-level authorization guard via useRights().
 * HOOKS FIX: All hooks are called before any conditional returns to
 * comply with React's Rules of Hooks.
 */
export default function Admin() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useRights();

  useEffect(() => {
    if (currentUser && currentUser.user_type !== 'USER') {
      fetchUsers();
    }
  }, [currentUser?.user_type]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchErr } = await getUsers(currentUser?.user_type || 'USER');
    if (fetchErr) { setError(fetchErr.message); }
    else { setUsers(data || []); }
    setLoading(false);
  };

  const handleActivate = async (userId) => {
    const { error: err } = await activateUser(userId);
    if (!err) fetchUsers();
    else alert("Failed to activate user: " + err.message);
  };

  const handleDeactivate = async (userId) => {
    const { error: err } = await deactivateUser(userId);
    if (!err) fetchUsers();
    else alert("Failed to deactivate user: " + err.message);
  };

  // Defense-in-depth: block USER access at component level (AFTER all hooks)
  if (currentUser && currentUser.user_type === 'USER') {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center">
        <span className="material-symbols-outlined text-6xl text-error mb-4">shield_person</span>
        <h2 className="text-2xl font-black text-white">Access Restricted</h2>
        <p className="text-zinc-500 font-bold max-w-xs">Only Administrators can access User Management.</p>
      </div>
    );
  }

  const filteredUsers = users.filter(user => {
    const q = searchQuery.toLowerCase();
    return (user.username && user.username.toLowerCase().includes(q)) ||
           (user.userid && user.userid.toLowerCase().includes(q));
  });

  return (
    <div className="animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">
            User <span className="bg-gradient-to-r from-[#2E5BFF] to-[#B71BCF] bg-clip-text text-transparent">Management</span>
          </h1>
          <p className="text-zinc-500 font-bold text-sm uppercase tracking-widest">System Access & Privileges</p>
        </div>
        <div className="relative group w-full md:w-auto">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary transition-colors text-sm">search</span>
          <input type="text" placeholder="Search users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#1A1A24] border border-white/5 rounded-full py-3 pl-12 pr-6 text-sm text-white focus:ring-2 focus:ring-primary/20 transition-all outline-none w-full md:w-64 placeholder:text-zinc-700 font-bold" />
        </div>
      </header>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary mx-auto"></div>
        </div>
      )}
      {error && (
        <div className="p-8 bg-red-500/10 border-t border-red-500/20 rounded-2xl mb-8">
          <p className="text-red-400 font-bold text-sm">Error: {error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="bg-[#1A1A24]/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl mb-10">
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
              {filteredUsers.map((user) => {
                const initials = user.username ? user.username.substring(0, 2).toUpperCase() : 'U';
                return (
                  <tr key={user.userid} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border border-white/5 ${user.user_type === 'SUPERADMIN' ? 'bg-gradient-to-br from-[#2E5BFF] to-[#B71BCF] text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                          {initials}
                        </div>
                        <div>
                          <div className="font-bold text-white text-base">{user.username || 'Unknown'}</div>
                          <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{user.userid}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        user.user_type === 'SUPERADMIN' ? 'bg-[#B71BCF]/10 text-[#B71BCF] border-[#B71BCF]/20' :
                        user.user_type === 'ADMIN' ? 'bg-[#2E5BFF]/10 text-[#2E5BFF] border-[#2E5BFF]/20' :
                        'bg-zinc-800 text-zinc-400 border-white/5'
                      }`}>
                        {user.user_type}
                        {user.user_type === 'SUPERADMIN' && <span className="material-symbols-outlined text-[10px]">lock</span>}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${user.record_status === 'ACTIVE' ? 'bg-[#00ffcc] shadow-[0_0_8px_rgba(0,255,204,0.6)]' : 'bg-zinc-600'}`}></div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${user.record_status === 'ACTIVE' ? 'text-white' : 'text-zinc-500'}`}>
                          {user.record_status || 'INACTIVE'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      {user.user_type === 'SUPERADMIN' ? (
                        <button disabled title="SUPERADMIN accounts cannot be modified."
                          className="px-6 py-2 rounded-full bg-zinc-800/50 text-zinc-600 font-black text-[10px] uppercase tracking-widest border border-white/5 cursor-not-allowed flex items-center gap-2 ml-auto">
                          <span className="material-symbols-outlined text-sm">lock</span>Protected
                        </button>
                      ) : user.record_status === 'ACTIVE' ? (
                        <button onClick={() => handleDeactivate(user.userid)}
                          className="px-6 py-2 rounded-full bg-error/10 text-error hover:bg-error/20 border border-error/20 font-black text-[10px] uppercase tracking-widest transition-all">
                          Deactivate
                        </button>
                      ) : (
                        <button onClick={() => handleActivate(user.userid)}
                          className="px-6 py-2 rounded-full bg-[#00ffcc]/10 text-[#00ffcc] hover:bg-[#00ffcc]/20 border border-[#00ffcc]/20 font-black text-[10px] uppercase tracking-widest transition-all">
                          Activate
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}