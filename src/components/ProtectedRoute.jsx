// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Created in Sprint 1
import { UserRightsContext } from '../context/UserRightsContext'; // Created in Sprint 2

const ProtectedRoute = ({ allowedRoles }) => {
  const { session, loading: authLoading } = useContext(AuthContext);
  const { currentUser, loading: rightsLoading } = useContext(UserRightsContext);

  // Wait for both authentication and rights to load
  if (authLoading || rightsLoading) return <div>Loading...</div>;

  // 1. Basic Login Guard: Kick to login if no session exists
  if (!session) return <Navigate to="/login" replace />;

  // 2. Role Guard: If specific roles are required, check against currentUser
  if (allowedRoles && currentUser) {
    const isAuthorized = allowedRoles.includes(currentUser.user_type);
    
    // Kick unauthorized users back to a safe default page
    if (!isAuthorized) return <Navigate to="/employees" replace />;
  }

  // Pass all checks
  return <Outlet />;
};

export default ProtectedRoute;