import { Routes, Route, Navigate } from 'react-router-dom';

// Layout & Auth Guards
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Public Pages
import Login from './pages/Login';
import Register from './pages/Register';
import AuthCallback from './pages/AuthCallback';

// Private Pages
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import JobHistory from './pages/JobHistory';
import Jobs from './pages/Jobs';
import Departments from './pages/Departments';
import Admin from './pages/Admin';
import DeletedItems from './pages/DeletedItems';

export default function App() {
  return (
    <Routes>
      {/* --- PUBLIC ROUTES --- */}
      <Route path="/login" element={<Login />} /> 
      <Route path="/register" element={<Register />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* --- PRIVATE ROUTES --- */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          {/* Main Redirect from root to Dashboard */}
          <Route path="/" element={<Dashboard />} />
          
          <Route path="/employees" element={<Employees />} />
          <Route path="/jobhistory" element={<JobHistory />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/deleted-items" element={<DeletedItems />} />
        </Route>
      </Route>

      {/* --- CATCH-ALL --- */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}