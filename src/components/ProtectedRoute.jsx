import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { UserRightsContext } from '../context/UserRightsContext';

const ProtectedRoute = ({ requiredRight }) => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const { can, loading: rightsLoading } = useContext(UserRightsContext);

  if (authLoading || rightsLoading) {
    return <div className="p-8 text-white font-black animate-pulse">VERIFYING PERMISSIONS...</div>;
  }

  // 1. Auth Guard
  if (!user) return <Navigate to="/login" replace />;

  // 2. Rights Guard: Check if the user has the specific permission (e.g., 'ADM_VIEW')
  if (requiredRight && !can(requiredRight)) {
    console.warn(`Access Denied: Missing right [${requiredRight}]`);
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;