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

  // Show a loading screen while we determine identity and rights
  if (authLoading || rightsLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0B0B0F]">
        <div className="text-white font-black animate-pulse tracking-[0.3em] text-[10px] uppercase">
          Verifying Security Clearance...
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