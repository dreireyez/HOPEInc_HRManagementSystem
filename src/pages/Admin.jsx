import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getUsers,
  getActivityLogs,
  activateUser,
  deactivateUser,
  changeUserRole,
} from '../services/adminService';
import { useRights } from '../context/UserRightsContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { ToastContainer } from '../components/ui/Toast';
import { useToast } from '../components/ui/useToast';
import { formatPhtDateTime } from '../lib/dateTime.js';

const TABS = [
  { key: 'all', label: 'All Users', icon: 'group' },
  { key: 'pending', label: 'Pending', icon: 'pending_actions' },
  { key: 'active', label: 'Active', icon: 'verified_user' },
  { key: 'activity', label: 'Activity Logs', icon: 'history' },
];

const PAGE_SIZE = 8;
const ENTITY_FILTERS = ['ALL', 'EMPLOYEE', 'JOB_HISTORY', 'JOB', 'DEPARTMENT', 'USER'];
const ACTION_FILTERS = ['ALL', 'ADD', 'EDIT', 'DEACTIVATE', 'RECOVER', 'ACTIVATE_USER', 'DEACTIVATE_USER', 'ROLE_CHANGE'];

function StatCard({ icon, label, value, accent, loading }) {
  return (
    <Card padding="md" className="relative overflow-hidden flex items-center gap-4">
      <div className={`absolute right-4 top-4 h-16 w-16 rounded-full opacity-70 blur-2xl ${accent}`} />
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl gradient-primary text-white shadow-outset-soft">
        <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-[var(--color-on-surface-variant)]/85 mb-1">{label}</p>
        {loading ? (
          <div className="skeleton h-8 w-12 rounded-lg" />
        ) : (
          <span className="text-3xl font-black text-[var(--color-on-surface)] leading-none tracking-[-0.04em]">{value}</span>
        )}
      </div>
    </Card>
  );
}

function RoleSelector({ currentRole, onSelect, disabled }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const roles = ['USER', 'ADMIN'];

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl bg-[var(--color-surface-container)] px-3 py-2 text-xs font-bold text-[var(--color-on-surface)] border border-[var(--color-outline-variant)]/40 shadow-inset transition-all duration-200 hover:border-[var(--color-primary-container)]/40 hover:bg-[var(--color-primary-soft)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
          {currentRole === 'ADMIN' ? 'admin_panel_settings' : 'person'}
        </span>
        {currentRole}
        <span className={`material-symbols-outlined text-sm transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>expand_more</span>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1.5 z-50 w-44 rounded-2xl modal-panel p-1.5 animate-in zoom-in-95 fade-in">
          {roles.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => {
                onSelect(role);
                setOpen(false);
              }}
              className={`cursor-pointer w-full flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold transition-colors duration-150 ${
                role === currentRole
                  ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary-container)]'
                  : 'text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)]'
              }`}
            >
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                {role === 'ADMIN' ? 'admin_panel_settings' : 'person'}
              </span>
              {role}
              {role === currentRole && (
                <span className="material-symbols-outlined text-sm ml-auto">check</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function UserCard({ user, actorUserId, actorRole, isSuperadminActor, onActivate, onDeactivate, onRoleChange, busyId }) {
  const initials = user.username ? user.username.substring(0, 2).toUpperCase() : 'U';
  const isBusy = busyId === user.userid;
  const isPending = user.record_status !== 'ACTIVE';
  const isSuperadmin = user.user_type === 'SUPERADMIN';
  const canChangeRole = isSuperadminActor && !isSuperadmin && !isPending;
  const isSelf = actorUserId === user.userid;
  const isAdminActor = actorRole === 'ADMIN';
  const isAdminTarget = user.user_type === 'ADMIN';
  const canManageStatus = isSuperadminActor || (isAdminActor && user.user_type === 'USER');
  const statusRestrictionLabel = isSuperadmin
    ? 'Protected'
    : isSelf
      ? 'Self account'
      : isAdminTarget
        ? 'ADMIN account'
        : null;

  return (
    <div className={`group flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl p-4 transition-all duration-[var(--motion-base)] ease-[var(--ease-standard)] border ${
      isPending
        ? 'bg-gradient-to-r from-amber-50/80 to-white/90 border-amber-200/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_4px_12px_rgba(245,158,11,0.08)]'
        : 'bg-[rgba(255,255,255,0.92)] border-[var(--color-outline-variant)]/20 shadow-inset hover:shadow-outset-soft hover:-translate-y-[2px]'
    } ${isSuperadmin ? 'ring-1 ring-[var(--color-primary-container)]/15' : ''}`}>
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        <div className={`table-lead-token table-lead-token-md font-mono font-bold text-sm shrink-0 ${
          isSuperadmin ? 'ring-2 ring-[var(--color-primary-container)]/20 ring-offset-2 ring-offset-white' : ''
        }`}>
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-bold text-[15px] text-[var(--color-on-surface)] truncate">{user.username || 'Unknown'}</h4>
            {isPending && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 border border-amber-300/40 px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-[0.22em] text-amber-700">
                <span className="material-symbols-outlined text-[10px]">schedule</span>
                Pending
              </span>
            )}
          </div>
          <p className="text-[10px] font-mono text-[var(--color-on-surface-variant)] uppercase tracking-[0.22em] mt-0.5 truncate">
            {user.userid}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Badge variant={isSuperadmin ? 'primary' : user.user_type === 'ADMIN' ? 'active' : 'default'}>
          <span className="flex items-center gap-1.5">
            {user.user_type}
            {isSuperadmin && <span className="material-symbols-outlined text-[11px]">lock</span>}
          </span>
        </Badge>
        <Badge variant={isPending ? 'inactive' : 'active'}>
          {user.record_status || 'INACTIVE'}
        </Badge>
      </div>

      <div className="flex items-center gap-2 shrink-0 sm:ml-2">
        {isSuperadmin ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] text-[10px] font-mono uppercase tracking-[0.2em] font-bold shadow-inset">
            <span className="material-symbols-outlined text-[14px]">lock</span>
            Protected
          </div>
        ) : (
          <>
            {canManageStatus ? (
              isPending ? (
                <Button
                  onClick={() => onActivate(user.userid)}
                  variant="primary"
                  size="sm"
                  loading={isBusy}
                  disabled={isBusy}
                  className="min-w-[110px]"
                >
                  <span className="material-symbols-outlined text-base">person_add</span>
                  Activate
                </Button>
              ) : (
                <Button
                  onClick={() => onDeactivate(user.userid)}
                  variant="danger"
                  size="sm"
                  loading={isBusy}
                  disabled={isBusy}
                  className="min-w-[110px]"
                >
                  <span className="material-symbols-outlined text-base">person_off</span>
                  Deactivate
                </Button>
              )
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant={isPending ? 'primary' : 'danger'}
                  size="sm"
                  disabled
                  className="min-w-[110px]"
                >
                  <span className="material-symbols-outlined text-base">{isPending ? 'person_add' : 'person_off'}</span>
                  {isPending ? 'Activate' : 'Deactivate'}
                </Button>
                {statusRestrictionLabel && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] text-[10px] font-mono uppercase tracking-[0.2em] font-bold shadow-inset">
                    <span className="material-symbols-outlined text-[14px]">
                      {isSelf ? 'person' : isAdminTarget ? 'admin_panel_settings' : 'lock'}
                    </span>
                    {statusRestrictionLabel}
                  </span>
                )}
              </div>
            )}

            {canChangeRole && (
              <RoleSelector
                currentRole={user.user_type}
                onSelect={(role) => onRoleChange(user.userid, user.username, user.user_type, role)}
                disabled={isBusy}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ConfirmDialog({ isOpen, title, description, icon, confirmLabel, confirmVariant = 'primary', onCancel, onConfirm, loading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 overlay-scrim animate-in fade-in">
      <div className="modal-panel w-full max-w-md rounded-[28px] p-8 animate-in zoom-in-95">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-3xl bg-[var(--color-primary-soft)] flex items-center justify-center text-[var(--color-primary-container)] mb-6 shadow-inset">
            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
          </div>
          <h2 className="text-xl font-bold text-[var(--color-on-surface)] mb-3 tracking-tight">{title}</h2>
          <p className="text-[var(--color-on-surface-variant)] font-medium text-sm leading-relaxed mb-8 px-2">{description}</p>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button onClick={onCancel} variant="ghost" className="flex-1" disabled={loading}>Cancel</Button>
            <Button onClick={onConfirm} variant={confirmVariant} className="flex-1" loading={loading}>{confirmLabel}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityLogCard({ log }) {
  const actorEmail = log.actor_email || 'SYSTEM';

  return (
    <div className="rounded-2xl border border-[var(--color-outline-variant)]/20 bg-[rgba(255,255,255,0.92)] p-4 shadow-inset">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="active">{String(log.action_type || '').replaceAll('_', ' ')}</Badge>
            <Badge variant="default">{String(log.entity_type || '').replaceAll('_', ' ')}</Badge>
          </div>
          <p className="mt-3 text-sm font-bold text-[var(--color-on-surface)] break-words">{log.summary}</p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-mono uppercase tracking-[0.16em] text-[var(--color-on-surface-variant)]">
            <span>Record {log.entity_id}</span>
            <span>Actor {actorEmail}</span>
            <span>Role {log.actor_role || 'SYSTEM'}</span>
          </div>
        </div>
        <div className="shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-mono font-bold tracking-[0.18em] text-slate-600">
          {formatPhtDateTime(log.created_at)}
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [busyId, setBusyId] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [activityLogs, setActivityLogs] = useState([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityError, setActivityError] = useState(null);
  const [activityLoaded, setActivityLoaded] = useState(false);
  const [entityFilter, setEntityFilter] = useState('ALL');
  const [actionFilter, setActionFilter] = useState('ALL');
  const { currentUser } = useRights();
  const toast = useToast();

  const isSuperadminActor = currentUser?.user_type === 'SUPERADMIN';
  const actorUserId = currentUser?.userid;
  const actorRole = currentUser?.user_type;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchErr } = await getUsers();
    if (fetchErr) {
      setError(fetchErr.message);
      setUsers([]);
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  }, []);

  const fetchActivityLogs = useCallback(async () => {
    setActivityLoading(true);
    setActivityError(null);
    const { data, error: fetchErr } = await getActivityLogs();
    if (fetchErr) {
      setActivityError(fetchErr.message);
      setActivityLogs([]);
    } else {
      setActivityLogs(data || []);
    }
    setActivityLoaded(true);
    setActivityLoading(false);
  }, []);

  useEffect(() => {
    if (currentUser && currentUser.user_type !== 'USER') {
      Promise.resolve().then(fetchUsers);
    }
  }, [currentUser, fetchUsers]);

  useEffect(() => {
    if (activeTab === 'activity' && currentUser && currentUser.user_type !== 'USER' && !activityLoading && !activityLoaded) {
      Promise.resolve().then(fetchActivityLogs);
    }
  }, [activeTab, currentUser, activityLoading, activityLoaded, fetchActivityLogs]);

  const handleActivate = async (userId) => {
    setBusyId(userId);
    const { error: err } = await activateUser(userId);
    setBusyId(null);
    if (!err) {
      toast.push('User activated successfully');
      fetchUsers();
      if (activeTab === 'activity') {
        fetchActivityLogs();
      }
    } else {
      toast.push(`Failed to activate: ${err.message}`, 'error');
    }
  };

  const handleDeactivate = async (userId) => {
    setBusyId(userId);
    const { error: err } = await deactivateUser(userId);
    setBusyId(null);
    if (!err) {
      toast.push('User deactivated');
      fetchUsers();
      if (activeTab === 'activity') {
        fetchActivityLogs();
      }
    } else {
      toast.push(`Failed to deactivate: ${err.message}`, 'error');
    }
  };

  const handleRoleChangeRequest = (userId, username, currentRole, targetRole) => {
    if (currentRole === targetRole) {
      return;
    }
    setConfirmAction({ userId, username, currentRole, targetRole });
  };

  const executeRoleChange = async () => {
    if (!confirmAction) {
      return;
    }

    setBusyId(confirmAction.userId);
    const { error: err } = await changeUserRole(confirmAction.userId, confirmAction.targetRole);
    setBusyId(null);

    if (!err) {
      toast.push(`${confirmAction.username || 'User'} is now ${confirmAction.targetRole}`);
      setConfirmAction(null);
      fetchUsers();
      if (activeTab === 'activity') {
        fetchActivityLogs();
      }
    } else {
      toast.push(`Role change failed: ${err.message}`, 'error');
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || (u.username && u.username.toLowerCase().includes(q)) || (u.userid && u.userid.toLowerCase().includes(q));
    if (!matchesSearch) return false;
    if (activeTab === 'pending') return u.record_status !== 'ACTIVE';
    if (activeTab === 'active') return u.record_status === 'ACTIVE';
    return true;
  });

  const filteredActivityLogs = activityLogs.filter((log) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      String(log.actor_email || '').toLowerCase().includes(q) ||
      String(log.entity_id || '').toLowerCase().includes(q) ||
      String(log.summary || '').toLowerCase().includes(q);

    if (!matchesSearch) return false;
    if (entityFilter !== 'ALL' && log.entity_type !== entityFilter) return false;
    if (actionFilter !== 'ALL' && log.action_type !== actionFilter) return false;
    return true;
  });

  const activeRows = activeTab === 'activity' ? filteredActivityLogs : filteredUsers;
  const totalPages = Math.max(1, Math.ceil(activeRows.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedUsers = filteredUsers.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const paginatedActivityLogs = filteredActivityLogs.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const pendingCount = users.filter((u) => u.record_status !== 'ACTIVE').length;
  const activeCount = users.filter((u) => u.record_status === 'ACTIVE').length;
  const adminCount = users.filter((u) => u.user_type === 'ADMIN' || u.user_type === 'SUPERADMIN').length;
  const activityCount = activityLogs.length;

  const selectCls = `
    bg-white
    rounded-xl
    border border-slate-200
    px-3 py-2.5
    text-sm
    font-medium
    text-slate-700
    outline-none
    transition-all duration-200
    hover:border-slate-300
    hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)]
    focus:ring-2
    focus:ring-[#1e3a5f]/20
    focus:border-[#1e3a5f]
  `;

  if (currentUser && currentUser.user_type === 'USER') {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center">
        <span className="material-symbols-outlined text-6xl text-[var(--color-error)] mb-4">shield_person</span>
        <h2 className="text-2xl font-bold text-[var(--color-on-surface)] tracking-tight">Access Restricted</h2>
        <p className="text-[var(--color-on-surface-variant)] text-sm mt-2 max-w-xs">Only Administrators can access User Management.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.26em] text-[var(--color-primary-container)] font-bold">Administration</span>
          <h1 className="mt-1.5 text-3xl font-black text-[var(--color-on-surface)] tracking-tight">
            {activeTab === 'activity' ? 'Activity Logs' : 'User Management'}
          </h1>
          <p className="text-[var(--color-on-surface-variant)] text-sm mt-1">
            {activeTab === 'activity'
              ? 'Review HR changes and user management actions across the system.'
              : 'Activate accounts, assign roles, and manage system access.'}
          </p>
        </div>
        <Input
          icon="search"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          placeholder={activeTab === 'activity' ? 'Search by actor email, record ID, or summary...' : 'Search by name or ID...'}
          wrapperClassName="w-full md:w-[320px]"
        />
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon="group" label="Total Users" value={users.length} accent="bg-[var(--color-primary-soft)]" loading={loading} />
        <StatCard icon="pending_actions" label="Pending Activation" value={pendingCount} accent="bg-amber-100" loading={loading} />
        <StatCard icon="admin_panel_settings" label="Administrators" value={adminCount} accent="bg-[var(--color-primary-soft)]" loading={loading} />
      </div>

      <div className="flex items-center gap-1 p-1 rounded-2xl bg-[var(--color-surface-container)]/60 shadow-inset w-fit">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const count =
            tab.key === 'pending'
              ? pendingCount
              : tab.key === 'active'
                ? activeCount
                : tab.key === 'activity'
                  ? activityCount
                  : users.length;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setActiveTab(tab.key);
                setCurrentPage(1);
              }}
              className={`cursor-pointer inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'gradient-primary text-white shadow-outset-soft'
                  : 'text-[var(--color-on-surface-variant)] hover:bg-white/60 hover:text-[var(--color-on-surface)]'
              }`}
            >
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>{tab.icon}</span>
              {tab.label}
              <span className={`ml-0.5 text-[10px] font-mono font-bold rounded-full px-2 py-0.5 ${
                isActive ? 'bg-white/20 text-white' : 'bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)]'
              }`}>
                {loading && tab.key !== 'activity' ? '–' : count}
              </span>
            </button>
          );
        })}
      </div>

      {error && (
        <div className="rounded-2xl bg-[var(--color-error-container)] border border-[var(--color-error)]/20 p-4 shadow-inset flex items-center gap-3">
          <span className="material-symbols-outlined text-[var(--color-error)]">error</span>
          <p className="text-[var(--color-on-error-container)] font-medium text-sm">{error}</p>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="flex flex-wrap items-end gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400 font-bold">Entity</label>
            <select
              value={entityFilter}
              onChange={(e) => {
                setEntityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className={selectCls}
            >
              {ENTITY_FILTERS.map((value) => (
                <option key={value} value={value}>
                  {value === 'ALL' ? 'All entities' : value.replaceAll('_', ' ')}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400 font-bold">Action</label>
            <select
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value);
                setCurrentPage(1);
              }}
              className={selectCls}
            >
              {ACTION_FILTERS.map((value) => (
                <option key={value} value={value}>
                  {value === 'ALL' ? 'All actions' : value.replaceAll('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {activeTab === 'pending' && !loading && pendingCount > 0 && (
        <div className="rounded-2xl border border-amber-200/70 bg-gradient-to-r from-amber-50 to-white p-4 flex items-start gap-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_8px_rgba(245,158,11,0.08)]">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>pending_actions</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-amber-800">
              {pendingCount} account{pendingCount !== 1 ? 's' : ''} awaiting activation
            </p>
            <p className="text-xs text-amber-700/80 mt-0.5 leading-relaxed">
              New users register as <strong>INACTIVE</strong> by default. Review each account and click <strong>Activate</strong> to grant them system access. Once activated, their role can be changed to <strong>ADMIN</strong> by a SUPERADMIN.
            </p>
          </div>
        </div>
      )}

      <Card padding="md" className="flex-1 bg-[rgba(255,255,255,0.84)] flex flex-col min-h-0">
        {activeTab === 'activity' ? (
          activityLoading ? (
            <div className="space-y-3 py-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-2xl bg-white/60 p-4">
                  <div className="skeleton h-4 w-1/4 rounded-md" />
                  <div className="mt-3 skeleton h-3 w-1/2 rounded-md" />
                </div>
              ))}
            </div>
          ) : activityError ? (
            <div className="rounded-2xl bg-[var(--color-error-container)] border border-[var(--color-error)]/20 p-4 shadow-inset flex items-center gap-3">
              <span className="material-symbols-outlined text-[var(--color-error)]">error</span>
              <p className="text-[var(--color-on-error-container)] font-medium text-sm">{activityError}</p>
            </div>
          ) : paginatedActivityLogs.length > 0 ? (
            <div className="space-y-3 flex-1">
              {paginatedActivityLogs.map((log) => (
                <ActivityLogCard key={log.id} log={log} />
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
              <span className="material-symbols-outlined text-5xl text-[var(--color-outline)] mb-4">history</span>
              <p className="text-[var(--color-on-surface-variant)] font-semibold text-sm">
                {searchQuery || entityFilter !== 'ALL' || actionFilter !== 'ALL'
                  ? 'No activity logs match the current filters.'
                  : 'No activity logs found.'}
              </p>
            </div>
          )
        ) : loading ? (
          <div className="space-y-3 py-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/60">
                <div className="skeleton h-11 w-11 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-1/3 rounded-md" />
                  <div className="skeleton h-3 w-1/4 rounded-md" />
                </div>
                <div className="skeleton h-8 w-24 rounded-xl" />
              </div>
            ))}
          </div>
        ) : paginatedUsers.length > 0 ? (
          <div className="space-y-2.5 flex-1">
            {paginatedUsers.map((user, idx) => (
              <div key={user.userid} className={`animate-in fade-in slide-in-from-bottom-4 stagger-${Math.min(idx + 1, 5)}`}>
                <UserCard
                  user={user}
                  actorUserId={actorUserId}
                  actorRole={actorRole}
                  isSuperadminActor={isSuperadminActor}
                  onActivate={handleActivate}
                  onDeactivate={handleDeactivate}
                  onRoleChange={handleRoleChangeRequest}
                  busyId={busyId}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
            <span className="material-symbols-outlined text-5xl text-[var(--color-outline)] mb-4">person_search</span>
            <p className="text-[var(--color-on-surface-variant)] font-semibold text-sm">
              {searchQuery ? 'No users match your search.' : `No ${activeTab === 'all' ? '' : activeTab} users found.`}
            </p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-[var(--color-outline-variant)]/20">
            <p className="text-xs font-mono text-[var(--color-on-surface-variant)]">
              {activeRows.length} {activeTab === 'activity' ? 'log' : 'user'}{activeRows.length !== 1 ? 's' : ''} • Page {safePage} of {totalPages}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage(safePage - 1)}
                className="cursor-pointer inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] transition-colors hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary-container)] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-lg">chevron_left</span>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).slice(
                Math.max(0, safePage - 3),
                Math.min(totalPages, safePage + 2)
              ).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setCurrentPage(p)}
                  className={`cursor-pointer inline-flex items-center justify-center w-9 h-9 rounded-xl text-sm font-bold transition-all duration-200 ${
                    p === safePage
                      ? 'gradient-primary text-white shadow-outset-soft'
                      : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)]'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setCurrentPage(safePage + 1)}
                className="cursor-pointer inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] transition-colors hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary-container)] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </Card>

      <ConfirmDialog
        isOpen={!!confirmAction}
        icon="swap_horiz"
        title="Change User Role?"
        description={confirmAction
          ? <>You are about to change <strong>{confirmAction.username || 'this user'}</strong> from <strong>{confirmAction.currentRole}</strong> to <strong className="text-[var(--color-primary-container)]">{confirmAction.targetRole}</strong>. Only active non-SUPERADMIN accounts can have their roles changed.</>
          : ''
        }
        confirmLabel={confirmAction?.targetRole === 'ADMIN' ? 'Promote to ADMIN' : 'Set as USER'}
        onCancel={() => {
          if (!busyId) {
            setConfirmAction(null);
          }
        }}
        onConfirm={executeRoleChange}
        loading={!!busyId}
      />

      <ToastContainer toasts={toast.toasts} onDismiss={toast.dismiss} />
    </div>
  );
}
