import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import { useRights } from '../context/UserRightsContext';

/**
 * ProtectedRoute Component
 * 
 * Guards routes behind authentication and optional authorization checks.
 * Supports two authorization modes:
 *   - allowedRoles: Array of user_type values that can access the route (e.g. ['ADMIN', 'SUPERADMIN'])
 *   - requiredRight: A specific right_id the user must have (e.g. 'EMP_ADD')
 * 
 * @param {Object} props
 * @param {string[]} [props.allowedRoles] - User types allowed to access the route
 * @param {string} [props.requiredRight] - Specific right_id required for access
 * @returns {JSX.Element} Outlet for authorized users, Navigate redirect otherwise
 */
const ProtectedRoute = ({ allowedRoles, requiredRight }) => {
  const { user, loading: authLoading } = useAuth();
  const { can, currentUser, loading: rightsLoading } = useRights();

  if (authLoading || rightsLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[var(--color-surface)]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full border-[3px] border-[var(--color-outline-variant)]/40 border-t-[var(--color-primary-container)] animate-spin" />
          </div>
          <p className="text-[10px] font-mono font-bold uppercase tracking-[0.26em] text-[var(--color-on-surface-variant)] animate-pulse">
            Loading…
          </p>
        </div>
      </div>
    );
  }

  // 1. If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. If specific roles are required, check user_type against the allowed list
  if (allowedRoles && allowedRoles.length > 0) {
    const userType = currentUser?.user_type;
    if (!userType || !allowedRoles.includes(userType)) {
      console.warn(`Access Denied: Role [${userType}] not in allowed roles [${allowedRoles.join(', ')}]`);
      return <Navigate to="/" replace />;
    }
  }

  // 3. If a specific right is required but the user doesn't have it
  if (requiredRight && !can(requiredRight)) {
    console.warn(`Access Denied: Missing right [${requiredRight}]`);
    return <Navigate to="/" replace />; 
  }

  // Permission granted
  return <Outlet />;
};

export default ProtectedRoute;