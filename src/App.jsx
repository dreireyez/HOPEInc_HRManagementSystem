export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} /> 
      <Route path="/register" element={<Register />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      <Route element={<ProtectedRoute />}>
        {/* No more userRole prop passed here! */}
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/jobs" element={<JobListPage />} />
          <Route path="/departments" element={<DeptListPage />} />
          <Route path="/employees" element={<EmployeeListPage />} />
          <Route path="/jobhistory" element={<JobHistory />} />

          {/* Admin Gating */}
          <Route element={<ProtectedRoute requiredRight="ADM_VIEW" />}>
            <Route path="/admin" element={<Admin />} />
          </Route>

          {/* Deleted Items Gating */}
          <Route element={<ProtectedRoute requiredRight="DEL_VIEW" />}>
            <Route path="/deleted-items" element={<DeletedItemsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}