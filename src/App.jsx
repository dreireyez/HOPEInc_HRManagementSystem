import { Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import EmployeeListPage from './pages/EmployeeListPage';
import EmployeeDetailPage from './pages/EmployeeDetailPage';
import JobListPage from './pages/JobListPage';
import DeptListPage from './pages/DeptListPage';
import Admin from './pages/Admin';
import DeletedItemsPage from './pages/DeletedItemsPage';
import Reports from './pages/Reports';
import SystemStates from './pages/SystemStates';

/**
 * App Root Component
 * 
 * Defines all application routes with proper authorization nesting.
 * BUG-001 FIX: Removed duplicate route registrations that caused
 * the role-gated admin routes to be unreachable dead code.
 * BUG-011 FIX: Removed legacy mock-data page imports (Jobs, Departments,
 * Employees, DeletedItems) that shadowed real pages.
 */
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} /> 
      <Route path="/register" element={<Register />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* All authenticated routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          {/* Routes accessible to all authenticated users */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/employees" element={<EmployeeListPage />} />
          <Route path="/employees/:id" element={<EmployeeDetailPage />} />
          <Route path="/jobs" element={<JobListPage />} />
          <Route path="/departments" element={<DeptListPage />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/system-states" element={<SystemStates />} />

          {/* Admin-only routes (ADMIN + SUPERADMIN) */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN']} />}>
            <Route path="/admin" element={<Admin />} />
            <Route path="/deleted-items" element={<DeletedItemsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}