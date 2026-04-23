import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Ensure this path is correct

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  // CRITICAL: While Supabase is checking if a session exists, 
  // we must wait. Otherwise, it defaults to "not logged in".
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center">
        <div className="animate-pulse text-zinc-500 font-bold uppercase tracking-widest">
          Securing Connection...
        </div>
      </div>
    );
  }

  // If there's a user, let them through; otherwise, send to login
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}