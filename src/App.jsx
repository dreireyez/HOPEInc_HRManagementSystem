<Routes>
  {/* Public */}
  <Route path="/login" element={<LoginPlaceholder />} />
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