import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  // 1. We pull the real-time status from your AuthContext
  const { user, loading } = useAuth();

  // 2. While the bouncer is checking the database for the user's status, 
  // we show a brief loading state so the app doesn't glitch.
  if (loading) {
    return (
      <div className="min-h-screen bg-[#1E1E2E] flex items-center justify-center">
        <div className="text-primary-container animate-pulse font-bold tracking-widest uppercase text-sm">
          Verifying Integrity...
        </div>
      </div>
    );
  }

  // 3. If a user exists (and passed the INACTIVE guard in AuthContext), 
  // they are allowed through to the Dashboard (Outlet).
  // Otherwise, they are sent back to the login page.
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}