import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import UserRightsContext from '../context/UserRightsContext';

/**
 * RoleGuard Component
 * 
 * Protects routes based on user type. Regular users (USER) are redirected
 * to /employees. Admins and super admins have access to protected routes.
 * 
 * @returns {JSX.Element} Outlet for authorized users or Navigate redirect for blocked users
 */
const RoleGuard = () => {
  const { currentUser } = useContext(UserRightsContext);

  // Block access for regular users
  if (currentUser?.user_type === 'USER') {
    return <Navigate to="/employees" replace />;
  }

  // Allow access for ADMIN and SUPERADMIN
  return <Outlet />;
};

export default RoleGuard;
