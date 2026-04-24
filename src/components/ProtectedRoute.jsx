import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import { useRights } from '../context/UserRightsContext';

const ProtectedRoute = ({ requiredRight }) => {
  const { user, loading: authLoading } = useAuth();
  const { can, loading: rightsLoading } = useRights();

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

  // 2. If a specific right is required but the user doesn't have it
  if (requiredRight && !can(requiredRight)) {
    console.warn(`Access Denied: Missing right [${requiredRight}]`);
    return <Navigate to="/" replace />; 
  }

  // Permission granted
  return <Outlet />;
};

export default ProtectedRoute;