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
import JobHistory from './pages/JobHistory';
import JobListPage from './pages/JobListPage';
import DeptListPage from './pages/DeptListPage';
import Admin from './pages/Admin';
import DeletedItems from './pages/DeletedItems';
import Reports from './pages/Reports';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} /> 
      <Route path="/register" element={<Register />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/jobs" element={<JobListPage />} />
          <Route path="/departments" element={<DeptListPage />} />
          <Route path="/employees" element={<EmployeeListPage />} />
          <Route path="/employees/:id" element={<EmployeeDetailPage />} />
          <Route path="/jobhistory" element={<JobHistory />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/deleted-items" element={<DeletedItems />} />
          <Route path="/reports" element={<Reports />} />
          
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