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
  return (
    <Routes>
      {/* --- PUBLIC ROUTES --- */}
      <Route path="/login" element={<Login />} /> 
      <Route path="/register" element={<Register />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* --- PRIVATE ROUTES --- */}
      {/* Wrapped in ProtectedRoute for security and Layout for the Sidebar/Navbar */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          {/* This is the new Bento-style Systems Overview */}
          <Route path="/" element={<Dashboard />} />
          
          {/* HR Modules - Placeholders are already in your project */}
          <Route path="/employees" element={<EmployeeListPage userRole="ADMIN" />} />
          <Route path="/employees/:id" element={<EmployeeDetailPage userRole="ADMIN" />} />
          <Route path="/jobhistory" element={<JobHistory />} />
          <Route path="/jobs" element={<JobListPage userRole="ADMIN" />} />
          <Route path="/departments" element={<DeptListPage userRole="ADMIN" />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/deleted-items" element={<DeletedItemsPage userRole="ADMIN" />} />
        </Route>
      </Route>

      {/* --- CATCH-ALL --- */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}