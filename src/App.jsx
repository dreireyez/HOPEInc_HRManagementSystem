import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const EmployeeListPage = lazy(() => import('./pages/EmployeeListPage'));
const EmployeeDetailPage = lazy(() => import('./pages/EmployeeDetailPage'));
const JobHistory = lazy(() => import('./pages/JobHistory'));
const JobListPage = lazy(() => import('./pages/JobListPage'));
const DeptListPage = lazy(() => import('./pages/DeptListPage'));
const Admin = lazy(() => import('./pages/Admin'));
const DeletedItemsPage = lazy(() => import('./pages/DeletedItemsPage'));
const Reports = lazy(() => import('./pages/Reports'));
const SystemStates = lazy(() => import('./pages/SystemStates'));

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface)] px-4">
      <div className="surface-panel flex items-center gap-3 rounded-[var(--radius-xl)] px-6 py-5 text-sm font-medium text-[var(--color-on-surface-variant)]">
        <div className="skeleton h-8 w-8 rounded-full" />
        Loading page...
      </div>
    </div>
  );
}

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
    <Suspense fallback={<RouteFallback />}>
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
            <Route path="/jobhistory" element={<JobHistory />} />
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
    </Suspense>
  );
}
