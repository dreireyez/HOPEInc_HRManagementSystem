import { useState, useEffect, useCallback } from 'react';
import { getUsers, activateUser, deactivateUser } from '../services/adminService';
import { useRights } from '../context/UserRightsContext';
import { Table, Thead, Tbody, Tr, Th, Td } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Pagination } from '../components/ui/Pagination';

const PAGE_SIZE = 10;

export default function Admin() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { currentUser } = useRights();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchErr } = await getUsers(currentUser?.user_type || 'USER');
    if (fetchErr) setError(fetchErr.message);
    else setUsers(data || []);
    setLoading(false);
  }, [currentUser?.user_type]);

  useEffect(() => {
    if (currentUser && currentUser.user_type !== 'USER') {
      Promise.resolve().then(fetchUsers);
    }
  }, [currentUser, fetchUsers]);

  const handleActivate = async (userId) => {
    const { error: err } = await activateUser(userId);
    if (!err) fetchUsers();
    else alert(`Failed to activate user: ${err.message}`);
  };

  const handleDeactivate = async (userId) => {
    const { error: err } = await deactivateUser(userId);
    if (!err) fetchUsers();
    else alert(`Failed to deactivate user: ${err.message}`);
  };

  const filteredUsers = users.filter((user) => {
    const q = searchQuery.toLowerCase();
    return (
      (user.username && user.username.toLowerCase().includes(q)) ||
      (user.userid && user.userid.toLowerCase().includes(q))
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedUsers = filteredUsers.slice((safeCurrentPage - 1) * PAGE_SIZE, safeCurrentPage * PAGE_SIZE);

  if (currentUser && currentUser.user_type === 'USER') {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center">
        <span className="material-symbols-outlined text-6xl text-[var(--color-error)] mb-4">shield_person</span>
        <h2 className="text-2xl font-bold text-[var(--color-on-surface)] tracking-tight">Access Restricted</h2>
        <p className="text-[var(--color-on-surface-variant)] text-sm mt-2 max-w-xs">
          Only Administrators can access User Management.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-on-surface)] tracking-tight">User Management</h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">System access and privileges.</p>
        </div>
        <Input
          icon="search"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search users..."
          wrapperClassName="w-full md:w-[280px]"
        />
      </header>

      {error && (
        <div className="rounded-2xl bg-[var(--color-error-container)] border border-[var(--color-error)]/20 p-4 shadow-inset">
          <p className="text-[var(--color-on-error-container)] font-medium text-sm">Error: {error}</p>
        </div>
      )}

      {loading ? (
        <div className="surface-panel rounded-[var(--radius-xl)] py-20 flex items-center justify-center">
          <div className="skeleton h-10 w-10 rounded-full" />
        </div>
      ) : (
        <>
          <Table>
            <Thead>
              <Tr>
                <Th>User Details</Th>
                <Th>User Type</Th>
                <Th>Status</Th>
                <Th className="text-right">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => {
                  const initials = user.username ? user.username.substring(0, 2).toUpperCase() : 'U';
                  return (
                    <Tr key={user.userid}>
                      <Td>
                        <div className="flex items-center gap-3">
                          <div
                            className={`table-lead-token table-lead-token-md font-mono font-bold text-sm ${
                              user.user_type === 'SUPERADMIN' ? 'ring-2 ring-[var(--color-primary-container)]/18 ring-offset-2 ring-offset-[var(--color-surface)]' : ''
                            }`}
                          >
                            {initials}
                          </div>
                          <div>
                            <div className="font-bold text-[var(--color-on-surface)]">{user.username || 'Unknown'}</div>
                            <div className="text-[10px] font-mono text-[var(--color-on-surface-variant)] uppercase tracking-[0.22em] mt-1">
                              {user.userid}
                            </div>
                          </div>
                        </div>
                      </Td>
                      <Td>
                        <Badge
                          variant={
                            user.user_type === 'SUPERADMIN'
                              ? 'primary'
                              : user.user_type === 'ADMIN'
                                ? 'active'
                                : 'default'
                          }
                        >
                          <span className="flex items-center gap-1.5">
                            {user.user_type}
                            {user.user_type === 'SUPERADMIN' && (
                              <span className="material-symbols-outlined text-[12px]">lock</span>
                            )}
                          </span>
                        </Badge>
                      </Td>
                      <Td>
                        <Badge variant={user.record_status === 'ACTIVE' ? 'active' : 'inactive'}>
                          {user.record_status || 'INACTIVE'}
                        </Badge>
                      </Td>
                      <Td className="text-right">
                        {user.user_type === 'SUPERADMIN' ? (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] text-[10px] font-mono uppercase tracking-[0.2em] font-bold shadow-inset">
                            <span className="material-symbols-outlined text-[14px]">lock</span>
                            Protected
                          </div>
                        ) : user.record_status === 'ACTIVE' ? (
                          <Button onClick={() => handleDeactivate(user.userid)} variant="danger" size="sm" className="uppercase tracking-[0.18em]">
                            Deactivate
                          </Button>
                        ) : (
                          <Button onClick={() => handleActivate(user.userid)} variant="primary" size="sm" className="uppercase tracking-[0.18em]">
                            Activate
                          </Button>
                        )}
                      </Td>
                    </Tr>
                  );
                })
              ) : (
                <Tr>
                  <Td colSpan="4" className="py-10 text-center text-[var(--color-on-surface-variant)] font-medium">
                    No users found.
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
          <Pagination
            currentPage={safeCurrentPage}
            totalItems={filteredUsers.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
