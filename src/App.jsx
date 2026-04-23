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
import EmployeeListPage from './pages/EmployeeListPage';
import EmployeeDetailPage from './pages/EmployeeDetailPage';
import JobHistory from './pages/JobHistory';
import JobListPage from './pages/JobListPage';
import DeptListPage from './pages/DeptListPage';
import Admin from './pages/Admin';
import DeletedItemsPage from './pages/DeletedItemsPage';

export default function App() {
  // To test PR-05 Sidebar Gating:
  // 1. Set to "ADMIN" to see all 7 sidebar links.
  // 2. Set to "USER" to hide "Admin" and "Deleted" links.
  const currentUserRole = "USER";

  return (
    <Routes>
      {/* --- PUBLIC ROUTES --- */}
      <Route path="/login" element={<Login />} /> 
      <Route path="/register" element={<Register />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* --- PRIVATE ROUTES --- */}
      <Route element={<ProtectedRoute />}>
      {/* We pass userRole here so the Sidebar/Layout can gate the links (PR-05) */}
        <Route element={<Layout userRole={currentUserRole}/>}>
          {/* This is the new Bento-style Systems Overview */}
          <Route path="/" element={<Dashboard />} />
          
          {/* HR Modules - Placeholders are already in your project */}
          <Route path="/jobs" element={<JobListPage userRole="ADMIN" />} />
          <Route path="/departments" element={<DeptListPage userRole="ADMIN" />} />
          <Route path="/employees" element={<EmployeeListPage userRole="ADMIN" />} />
          <Route path="/employees/:id" element={<EmployeeDetailPage userRole="ADMIN" />} />

          <Route path="/jobhistory" element={<JobHistory />} />
          {/* Admin-only Routes - require ADMIN or SUPERADMIN */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN']} />}>
            <Route path="/admin" element={<Admin />} />
            <Route path="/deleted-items" element={<DeletedItems />} />
          </Route>
        </Route>
      </Route>

      {/* --- CATCH-ALL --- */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}