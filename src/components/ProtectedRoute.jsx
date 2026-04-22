import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  // Temporarily hardcoded to false to test the Login redirect
  // TODO: Replace with actual Supabase authentication check
  const isAuthenticated = true;

  // If the user is authenticated, render the child routes (Outlet)
  // Otherwise, kick them back to the login page
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}