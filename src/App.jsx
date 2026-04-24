import { Routes, Route, Navigate } from 'react-router-dom'; // Added Routes here

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
import JobHistory from './pages/JobHistory';
import JobListPage from './pages/JobListPage';
import DeptListPage from './pages/DeptListPage';
import Admin from './pages/Admin';
import DeletedItemsPage from './pages/DeletedItemsPage'; // Verified file name

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
          <Route path="/" element={<Dashboard />} />
          
          {/* HR Modules */}
          <Route path="/jobs" element={<JobListPage />} />
          <Route path="/departments" element={<DeptListPage />} />
          <Route path="/employees" element={<EmployeeListPage />} />
          <Route path="/jobhistory" element={<JobHistory />} />

          {/* Specialist Gating: Admin Page */}
          <Route element={<ProtectedRoute requiredRight="ADM_VIEW" />}>
            <Route path="/admin" element={<Admin />} />
          </Route>

          {/* Specialist Gating: Deleted Items */}
          <Route element={<ProtectedRoute requiredRight="DEL_VIEW" />}>
            <Route path="/deleted-items" element={<DeletedItemsPage />} />
          </Route>
        </Route>
      </Route>

      {/* --- CATCH-ALL --- */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}