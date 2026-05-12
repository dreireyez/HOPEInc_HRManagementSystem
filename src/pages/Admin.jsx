import React, { useState, useEffect } from 'react';
import { getUsers, activateUser, deactivateUser, changeUserRole, getRightsSchema, getUserRights, updateUserRight } from '../services/adminService';
import { getEmployees, softDeleteEmployee, recoverEmployee } from '../services/employeeService';
import { useRights } from '../context/UserRightsContext';
import DeletedRecordsTable from '../components/DeletedRecordsTable';

/**
 * Admin Page — Tabbed Admin Panel
 *
 * Tab access by role:
 *   SUPERADMIN: Users, Employees, Log
 *   ADMIN:      Employees, Log
 *   USER:       Blocked at component level (defense-in-depth).
 *
 * Decision 6 (2026-05-09): Only SUPERADMIN holds ADM_USER.
 * ADMIN is denied the Users tab via inline gate and RLS.
 */
export default function Admin() {
  const { currentUser } = useRights();
  const isSuperAdmin = currentUser?.user_type === 'SUPERADMIN';
  const isAdmin = currentUser?.user_type === 'ADMIN';

  const [activeTab, setActiveTab] = useState(isSuperAdmin ? 'users' : 'employees');

  // --- Users tab state ---
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);

  // --- Employees tab state ---
  const [empSearch, setEmpSearch] = useState('');
  const [employees, setEmployees] = useState([]);
  const [empsLoading, setEmpsLoading] = useState(false);
  const [empsError, setEmpsError] = useState(null);

  // --- Rights panel state ---
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [userRightsMap, setUserRightsMap] = useState({});
  const [rightsLoading, setRightsLoading] = useState(false);
  const [rightsSchema, setRightsSchema] = useState([]);

  // Fetch data when tab becomes active
  useEffect(() => {
    if (!currentUser || currentUser.user_type === 'USER') return;
    if (activeTab === 'users' && isSuperAdmin) {
      fetchUsers();
      if (rightsSchema.length === 0) {
        getRightsSchema().then(res => setRightsSchema(res.data || []));
      }
    }
    if (activeTab === 'employees') fetchEmployees();
  }, [activeTab, currentUser?.user_type]);

  const fetchUsers = async () => {
    setUsersLoading(true);
    setUsersError(null);
    const { data, error } = await getUsers(currentUser?.user_type || 'USER');
    if (error) setUsersError(error.message);
    else setUsers(data || []);
    setUsersLoading(false);
  };

  const fetchEmployees = async () => {
    setEmpsLoading(true);
    setEmpsError(null);
    const { data, error } = await getEmployees(currentUser?.user_type || 'USER');
    if (error) setEmpsError(error.message);
    else setEmployees(data || []);
    setEmpsLoading(false);
  };

  const handleActivate = async (userId) => {
    const { error } = await activateUser(userId);
    if (!error) fetchUsers();
    else alert('Failed to activate user: ' + error.message);
  };

  const handleDeactivate = async (userId) => {
    const { error } = await deactivateUser(userId);
    if (!error) fetchUsers();
    else alert('Failed to deactivate user: ' + error.message);
  };

  const handleRoleChange = async (userId, newRole) => {
    const { error } = await changeUserRole(userId, newRole);
    if (!error) fetchUsers();
    else alert('Failed to change role: ' + error.message);
  };

  const handleToggleRights = async (userId) => {
    if (expandedUserId === userId) { setExpandedUserId(null); return; }
    setExpandedUserId(userId);
    if (userRightsMap[userId]) return;
    setRightsLoading(true);
    const { data } = await getUserRights(userId);
    if (data) {
      const map = Object.fromEntries(data.map(r => [r.right_id, r.right_value]));
      setUserRightsMap(prev => ({ ...prev, [userId]: map }));
    }
    setRightsLoading(false);
  };

  const handleRightToggle = async (userId, rightId, currentValue) => {
    const newValue = currentValue === 1 ? 0 : 1;
    setUserRightsMap(prev => ({
      ...prev,
      [userId]: { ...prev[userId], [rightId]: newValue },
    }));
    await updateUserRight(userId, rightId, newValue);
  };

  const handleEmpDeactivate = async (empno) => {
    const { error } = await softDeleteEmployee(empno, currentUser?.userid || currentUser?.id || 'admin');
    if (!error) fetchEmployees();
    else alert('Failed to deactivate employee: ' + error.message);
  };

  const handleEmpReactivate = async (empno) => {
    const { error } = await recoverEmployee(empno, currentUser?.userid || currentUser?.id || 'admin');
    if (!error) fetchEmployees();
    else alert('Failed to reactivate employee: ' + error.message);
  };

  // Defense-in-depth: block USER access AFTER all hooks
  if (currentUser && currentUser.user_type === 'USER') {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center">
        <span className="material-symbols-outlined text-6xl text-error mb-4">shield_person</span>
        <h2 className="text-2xl font-black text-white">Access Restricted</h2>
        <p className="text-zinc-500 font-bold max-w-xs">Only Administrators can access the Admin Panel.</p>
      </div>
    );
  }

  // Filtered users list
  const filteredUsers = users.filter((u) => {
    const q = userSearch.toLowerCase();
    const matchSearch = !q ||
      (u.username && u.username.toLowerCase().includes(q)) ||
      (u.userid && u.userid.toLowerCase().includes(q));
    const matchRole = roleFilter === 'ALL' || u.user_type === roleFilter;
    const matchStatus = statusFilter === 'ALL' || u.record_status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  // Filtered employees list
  const filteredEmployees = employees.filter((e) => {
    const q = empSearch.toLowerCase();
    return !q ||
      (e.lastname && e.lastname.toLowerCase().includes(q)) ||
      (e.firstname && e.firstname.toLowerCase().includes(q)) ||
      (e.empno && e.empno.toLowerCase().includes(q));
  });

  // Group rights schema by module for the rights panel
  const rightsGrouped = rightsSchema.reduce((acc, r) => {
    if (!acc[r.module_id]) acc[r.module_id] = [];
    acc[r.module_id].push(r);
    return acc;
  }, {});

  const tabs = [
    ...(isSuperAdmin ? [{ id: 'users', label: 'Users', icon: 'manage_accounts' }] : []),
    { id: 'employees', label: 'Employees', icon: 'badge' },
    { id: 'deleted_employees', label: 'Deleted Employees', icon: 'person_off' },
    { id: 'deleted_jobs', label: 'Deleted Jobs', icon: 'work_off' },
    { id: 'deleted_departments', label: 'Deleted Departments', icon: 'domain_disabled' },
  ];

  return (
    <div className="animate-in fade-in duration-700">
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">
          Admin <span className="bg-gradient-to-r from-[#2E5BFF] to-[#B71BCF] bg-clip-text text-transparent">Panel</span>
        </h1>
        <p className="text-zinc-500 font-bold text-sm uppercase tracking-widest">System Access and Administration</p>
      </header>

      {/* Tab navigation */}
      <div className="flex gap-1 mb-8 bg-[#1A1A24]/60 backdrop-blur rounded-2xl p-1.5 w-fit border border-white/5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-[#2E5BFF] to-[#B71BCF] text-white shadow-lg'
                : 'text-zinc-500 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-sm">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── USERS TAB ── */}
      {activeTab === 'users' && (
        <>
          {!isSuperAdmin ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <span className="material-symbols-outlined text-5xl text-zinc-600 mb-4">lock</span>
              <h2 className="text-xl font-black text-white mb-1">Access Restricted</h2>
              <p className="text-zinc-500 font-bold text-sm max-w-xs">User Management is restricted to Superadmin accounts.</p>
            </div>
          ) : (
            <>
              {/* Users tab controls */}
              <div className="flex flex-wrap gap-3 items-center mb-6">
                <div className="relative group flex-1 min-w-[200px]">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary transition-colors text-sm">search</span>
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full bg-[#1A1A24] border border-white/5 rounded-full py-3 pl-12 pr-6 text-sm text-white focus:ring-2 focus:ring-primary/20 transition-all outline-none placeholder:text-zinc-700 font-bold"
                  />
                </div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-[#1A1A24] border border-white/5 rounded-full py-3 px-5 text-sm text-white font-bold outline-none focus:ring-2 focus:ring-primary/20 min-w-[140px]"
                >
                  <option value="ALL">All Roles</option>
                  <option value="SUPERADMIN">Superadmin</option>
                  <option value="ADMIN">Admin</option>
                  <option value="USER">User</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#1A1A24] border border-white/5 rounded-full py-3 px-5 text-sm text-white font-bold outline-none focus:ring-2 focus:ring-primary/20 min-w-[140px]"
                >
                  <option value="ALL">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              {usersLoading && (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
                </div>
              )}
              {usersError && (
                <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-2xl mb-8">
                  <p className="text-red-400 font-bold text-sm">Error: {usersError}</p>
                </div>
              )}
              {!usersLoading && !usersError && (
                <div className="bg-[#1A1A24]/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl mb-10">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/5">
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">User Details</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Role</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Status</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredUsers.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-8 py-12 text-center text-zinc-600 font-bold text-sm">No users found.</td>
                        </tr>
                      )}
                      {filteredUsers.map((user) => {
                        const initials = user.username ? user.username.substring(0, 2).toUpperCase() : 'U';
                        const locked = user.user_type === 'SUPERADMIN';
                        return (
                          <React.Fragment key={user.userid}>
                          <tr className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border border-white/5 ${locked ? 'bg-gradient-to-br from-[#2E5BFF] to-[#B71BCF] text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                                  {initials}
                                </div>
                                <div>
                                  <div className="font-bold text-white text-base">{user.username || 'Unknown'}</div>
                                  <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{user.userid}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              {locked ? (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border bg-[#B71BCF]/10 text-[#B71BCF] border-[#B71BCF]/20">
                                  {user.user_type}
                                  <span className="material-symbols-outlined text-[10px]">lock</span>
                                </span>
                              ) : (
                                <select
                                  value={user.user_type}
                                  onChange={(e) => handleRoleChange(user.userid, e.target.value)}
                                  className={`bg-transparent border rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest outline-none cursor-pointer ${
                                    user.user_type === 'ADMIN'
                                      ? 'text-[#2E5BFF] border-[#2E5BFF]/30 bg-[#2E5BFF]/10'
                                      : 'text-zinc-400 border-white/10 bg-zinc-800/50'
                                  }`}
                                >
                                  <option value="ADMIN">ADMIN</option>
                                  <option value="USER">USER</option>
                                </select>
                              )}
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
                              <div className="flex items-center justify-end gap-2">
                                {!locked && (
                                  <button
                                    onClick={() => handleToggleRights(user.userid)}
                                    title="Manage rights"
                                    className={`p-2 rounded-xl transition-all ${expandedUserId === user.userid ? 'bg-primary/10 text-primary' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                                  >
                                    <span className="material-symbols-outlined text-lg">
                                      {expandedUserId === user.userid ? 'expand_less' : 'manage_accounts'}
                                    </span>
                                  </button>
                                )}
                                {locked ? (
                                  <button disabled title="SUPERADMIN accounts cannot be modified."
                                    className="px-6 py-2 rounded-full bg-zinc-800/50 text-zinc-600 font-black text-[10px] uppercase tracking-widest border border-white/5 cursor-not-allowed flex items-center gap-2">
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
                              </div>
                            </td>
                          </tr>
                          {expandedUserId === user.userid && !locked && (
                            <tr>
                              <td colSpan={4} className="px-8 pb-6 pt-0">
                                <div className="bg-[#0F0F14] rounded-2xl p-6 border border-white/5">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4">Module Rights</p>
                                  {rightsLoading && !userRightsMap[user.userid] ? (
                                    <p className="text-zinc-500 text-sm">Loading...</p>
                                  ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                      {Object.entries(rightsGrouped).map(([moduleId, moduleRights]) => (
                                        <div key={moduleId}>
                                          <p className="text-[9px] font-black uppercase tracking-widest text-primary mb-2">{moduleId.replace('_Mod', '')}</p>
                                          <div className="space-y-2">
                                            {moduleRights.map(({ right_id, right_name }) => {
                                              const val = userRightsMap[user.userid]?.[right_id] ?? 0;
                                              return (
                                                <button
                                                  key={right_id}
                                                  onClick={() => handleRightToggle(user.userid, right_id, val)}
                                                  className="flex items-center justify-between w-full px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition-all"
                                                >
                                                  <span className="text-xs font-bold text-zinc-300 text-left">{right_name}</span>
                                                  <span className={`relative w-8 h-4 rounded-full transition-colors shrink-0 ml-3 ${val === 1 ? 'bg-primary' : 'bg-zinc-700'}`}>
                                                    <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all ${val === 1 ? 'left-4' : 'left-0.5'}`} />
                                                  </span>
                                                </button>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* ── EMPLOYEES TAB ── */}
      {activeTab === 'employees' && (
        <>
          <div className="flex flex-wrap gap-3 items-center mb-6">
            <div className="relative group flex-1 min-w-[200px]">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary transition-colors text-sm">search</span>
              <input
                type="text"
                placeholder="Search employees..."
                value={empSearch}
                onChange={(e) => setEmpSearch(e.target.value)}
                className="w-full bg-[#1A1A24] border border-white/5 rounded-full py-3 pl-12 pr-6 text-sm text-white focus:ring-2 focus:ring-primary/20 transition-all outline-none placeholder:text-zinc-700 font-bold"
              />
            </div>
          </div>

          {empsLoading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
            </div>
          )}
          {empsError && (
            <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-2xl mb-8">
              <p className="text-red-400 font-bold text-sm">Error: {empsError}</p>
            </div>
          )}
          {!empsLoading && !empsError && (
            <div className="bg-[#1A1A24]/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl mb-10">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/5">
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Emp No</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Last Name</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">First Name</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Hire Date</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Status</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredEmployees.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-8 py-12 text-center text-zinc-600 font-bold text-sm">No employees found.</td>
                    </tr>
                  )}
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.empno} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-5 text-zinc-400 font-black text-[11px] uppercase tracking-widest">{emp.empno}</td>
                      <td className="px-8 py-5 text-white font-bold">{emp.lastname}</td>
                      <td className="px-8 py-5 text-white font-bold">{emp.firstname}</td>
                      <td className="px-8 py-5 text-zinc-400 font-bold text-sm">{emp.hiredate}</td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          emp.record_status === 'ACTIVE'
                            ? 'bg-[#00ffcc]/10 text-[#00ffcc] border-[#00ffcc]/20'
                            : 'bg-zinc-800 text-zinc-500 border-white/5'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${emp.record_status === 'ACTIVE' ? 'bg-[#00ffcc]' : 'bg-zinc-600'}`}></span>
                          {emp.record_status || 'INACTIVE'}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        {emp.record_status === 'ACTIVE' && isSuperAdmin && (
                          <button
                            onClick={() => handleEmpDeactivate(emp.empno)}
                            className="px-5 py-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 font-black text-[10px] uppercase tracking-widest transition-all"
                          >
                            Deactivate
                          </button>
                        )}
                        {emp.record_status === 'INACTIVE' && (isSuperAdmin || isAdmin) && (
                          <button
                            onClick={() => handleEmpReactivate(emp.empno)}
                            className="px-5 py-2 rounded-full bg-[#00ffcc]/10 text-[#00ffcc] hover:bg-[#00ffcc]/20 border border-[#00ffcc]/20 font-black text-[10px] uppercase tracking-widest transition-all"
                          >
                            Reactivate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ── DELETED EMPLOYEES TAB ── */}
      {activeTab === 'deleted_employees' && (
        <DeletedRecordsTable kind="employee" />
      )}

      {/* ── DELETED JOBS TAB ── */}
      {activeTab === 'deleted_jobs' && (
        <DeletedRecordsTable kind="job" />
      )}

      {/* ── DELETED DEPARTMENTS TAB ── */}
      {activeTab === 'deleted_departments' && (
        <DeletedRecordsTable kind="department" />
      )}
    </div>
  );
}
