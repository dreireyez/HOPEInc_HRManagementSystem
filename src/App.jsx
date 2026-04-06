import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login'; 
import Register from './pages/Register';

import ProtectedRoute from './components/ProtectedRoute';
import AuthCallback from './pages/AuthCallback';
import Employees from './pages/Employees';
import JobHistory from './pages/JobHistory';
import Jobs from './pages/Jobs';
import Departments from './pages/Departments';
import Admin from './pages/Admin';
import DeletedItems from './pages/DeletedItems';

export default function App() {
  return (
    <Routes>
      {/* Public */}
      {/* Update this line to use your new Login component */}
      <Route path="/login" element={<Login />} /> 
      <Route path="/register" element={<Register />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Private - Redirects to /login if session is null */}
      <Route element={<ProtectedRoute />}>
        <Route path="/employees" element={<Employees />} />
        <Route path="/jobhistory" element={<JobHistory />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/deleted-items" element={<DeletedItems />} />
        
        {/* Default logged-in landing page */}
        <Route path="/" element={<Navigate to="/employees" replace />} />
      </Route>

      {/* Catch-all for any undefined route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}