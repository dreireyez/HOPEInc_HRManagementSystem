# Role PR Map

This file is the exact source of truth for AI agents creating branches and draft PRs.

Rules:

- Use the exact branch listed here when working on a matching sprint deliverable.
- Target `dev` unless this file says otherwise.
- Use module-sized PRs.
- Do not invent PR titles for listed work.
- A PR counts only after review and merge into `dev`.

## Sprint 1 - Setup, Database, and Authentication

### M1 - Project Lead / Full-Stack Developer

#### PR-01
Title: `PR-01: Project Scaffold`
Branch: `feat/project-scaffold`
Target: `dev`
Deliverable: Vite, React 18, Tailwind CSS initial setup.

#### PR-02
Title: `PR-02: Supabase Client`
Branch: `feat/supabase-client`
Target: `dev`
Deliverable: Supabase client initialization and `.env.example` configuration.

#### PR-03
Title: `PR-03: Routing Skeleton`
Branch: `feat/routing-skeleton`
Target: `dev`
Deliverable: HR routes, `ProtectedRoute`, and placeholder pages.

#### PR-04
Title: `PR-04: GitHub Branch Protection`
Branch: `chore/github-branch-protection`
Target: `dev`
Deliverable: Branch protection rules and PR template.

### M2 - Frontend Developer

#### PR-01
Title: `PR-01: UI Login Page`
Branch: `feat/ui-login-page`
Target: `dev`
Deliverable: Login form with email/password and Google OAuth button.

#### PR-02
Title: `PR-02: UI Register Page`
Branch: `feat/ui-register-page`
Target: `dev`
Deliverable: Registration form with validation and Google registration button.

#### PR-03
Title: `PR-03: UI App Shell`
Branch: `feat/ui-app-shell`
Target: `dev`
Deliverable: Navbar, sidebar HR navigation, and layout wrapper.

#### PR-04
Title: `PR-04: UI Auth Callback`
Branch: `feat/ui-auth-callback`
Target: `dev`
Deliverable: `/auth/callback` loading page.

### M3 - Backend / Database Engineer

#### PR-01
Title: `PR-01: Initial Schema`
Branch: `db/initial-schema`
Target: `dev`
Deliverable: HopeDB HR tables plus `record_status` and `stamp` columns.

#### PR-02
Title: `PR-02: Rights Seed`
Branch: `db/rights-seed`
Target: `dev`
Deliverable: Module, rights, user rights, and SUPERADMIN seed data.

#### PR-03
Title: `PR-03: Database ERD`
Branch: `docs/db-erd`
Target: `dev`
Deliverable: ERD diagram and schema notes.

#### PR-04
Title: `PR-04: Verify Seed`
Branch: `db/verify-seed`
Target: `dev`
Deliverable: SQL verification queries for row counts and FK integrity.

### M4 - Rights & Authentication Specialist

#### PR-01
Title: `PR-01: Auth Context`
Branch: `feat/auth-context`
Target: `dev`
Deliverable: AuthContext, session listener, and currentUser state.

#### PR-02
Title: `PR-02: Email Signup Auth`
Branch: `feat/auth-email-signup`
Target: `dev`
Deliverable: Email sign-up and sign-in wired to Register/Login.

#### PR-03
Title: `PR-03: Google OAuth Auth`
Branch: `feat/auth-google-oauth`
Target: `dev`
Deliverable: Google OAuth, `/auth/callback`, and redirect URL setup.

#### PR-04
Title: `PR-04: Provision User Trigger`
Branch: `db/trigger-provision-user`
Target: `dev`
Deliverable: `provision_new_user()` trigger with USER/INACTIVE defaults.

### M5 - QA / Documentation Specialist

#### PR-01
Title: `PR-01: Sprint 1 Auth Flows`
Branch: `test/sprint1-auth-flows`
Target: `dev`
Deliverable: Email auth, Google OAuth, and login guard test cases.

#### PR-02
Title: `PR-02: Sprint 1 Log and README`
Branch: `docs/sprint1-log-readme`
Target: `dev`
Deliverable: Sprint 1 log and README setup instructions.

## Sprint 2 - HR CRUD, Rights, and Soft Delete

### M1 - Project Lead / Full-Stack Developer

#### PR-01
Title: `PR-01: Employee API`
Branch: `feat/employee-api`
Target: `dev`
Deliverable: Employee service functions for get, add, update, soft-delete, and recover.

#### PR-02
Title: `PR-02: Job History API`
Branch: `feat/jobhistory-api`
Target: `dev`
Deliverable: Job History service functions.

#### PR-03
Title: `PR-03: Job and Department API`
Branch: `feat/job-dept-api`
Target: `dev`
Deliverable: Job and Department service functions.

#### PR-04
Title: `PR-04: Deleted Items Route Guard`
Branch: `feat/route-guard-deleted`
Target: `dev`
Deliverable: `/deleted-items` route guard blocking USER accounts.

### M2 - Frontend Developer

#### PR-01
Title: `PR-01: UI Employee List`
Branch: `feat/ui-employee-list`
Target: `dev`
Deliverable: Employee list with stamp gating and inactive filter.

#### PR-02
Title: `PR-02: UI Employee Detail and Job History`
Branch: `feat/ui-employee-detail-jh`
Target: `dev`
Deliverable: Employee detail page, JobHistoryPanel, and AddJobHistoryForm.

#### PR-03
Title: `PR-03: UI Job and Department`
Branch: `feat/ui-job-dept`
Target: `dev`
Deliverable: Job and Department pages and modals.

#### PR-04
Title: `PR-04: UI Deleted Items`
Branch: `feat/ui-deleted-items`
Target: `dev`
Deliverable: Deleted Items page with four tabs and recovery buttons.

#### PR-05
Title: `PR-05: UI Sidebar Gating`
Branch: `fix/ui-sidebar-gating`
Target: `dev`
Deliverable: Hide Deleted Items and Admin links for USER.

### M3 - Backend / Database Engineer

#### PR-01
Title: `PR-01: RLS Employee`
Branch: `db/rls-employee`
Target: `dev`
Deliverable: Employee SELECT, INSERT, UPDATE, deactivate, and recover policies.

#### PR-02
Title: `PR-02: RLS Job History Job Department`
Branch: `db/rls-jobhistory-job-dept`
Target: `dev`
Deliverable: Matching RLS policy pattern for Job History, Job, and Department.

#### PR-03
Title: `PR-03: Cascade Soft Delete Trigger`
Branch: `db/trigger-cascade-softdelete`
Target: `dev`
Deliverable: Employee to Job History status sync trigger.

#### PR-04
Title: `PR-04: Employee Current Job View`
Branch: `db/view-employee-current-job`
Target: `dev`
Deliverable: `employee_current_job` SQL view.

### M4 - Rights & Authentication Specialist

#### PR-01
Title: `PR-01: Rights Context`
Branch: `feat/rights-context`
Target: `dev`
Deliverable: UserRightsContext and `useRights()` hook.

#### PR-02
Title: `PR-02: Rights Employee Job History`
Branch: `feat/rights-employee-jh`
Target: `dev`
Deliverable: Button gating for Employee and Job History modules.

#### PR-03
Title: `PR-03: Rights Job Department`
Branch: `feat/rights-job-dept`
Target: `dev`
Deliverable: Button gating for Job and Department modules.

#### PR-04
Title: `PR-04: Rights Stamp Sidebar`
Branch: `feat/rights-stamp-sidebar`
Target: `dev`
Deliverable: Stamp column visibility and sidebar link gating.

### M5 - QA / Documentation Specialist

#### PR-01
Title: `PR-01: Sprint 2 Rights 51 Cases`
Branch: `test/sprint2-rights-51-cases`
Target: `dev`
Deliverable: Full 51-case rights matrix.

#### PR-02
Title: `PR-02: Sprint 2 Cascade Visibility`
Branch: `test/sprint2-cascade-visibility`
Target: `dev`
Deliverable: Cascade, recovery, API bypass, and stamp visibility tests.

#### PR-03
Title: `PR-03: Sprint 2 Log`
Branch: `docs/sprint2-log`
Target: `dev`
Deliverable: Sprint 2 findings and resolutions.

## Sprint 3 - Admin, Reports, Deployment, and Documentation

### M1 - Project Lead / Full-Stack Developer

#### PR-01
Title: `PR-01: Admin API`
Branch: `feat/admin-api`
Target: `dev`
Deliverable: `getUsers`, `activateUser`, and `deactivateUser` with SUPERADMIN blocking.

#### PR-02
Title: `PR-02: Reports API`
Branch: `feat/reports-api`
Target: `dev`
Deliverable: Headcount, salary summary, and employee full history queries.

#### PR-03
Title: `PR-03: Production Deploy`
Branch: `chore/production-deploy`
Target: `dev`
Deliverable: Vercel/Netlify config, env vars, and production redirect URLs.

### M2 - Frontend Developer

#### PR-01
Title: `PR-01: UI Admin Users`
Branch: `feat/ui-admin-users`
Target: `dev`
Deliverable: UserManagementPage with SUPERADMIN row protection.

#### PR-02
Title: `PR-02: UI Reports`
Branch: `feat/ui-reports`
Target: `dev`
Deliverable: Headcount, Salary Summary, and Employee History report pages.

#### PR-03
Title: `PR-03: UI Final Polish`
Branch: `fix/ui-final-polish`
Target: `dev`
Deliverable: Loading, empty, error, and responsive fixes.

### M3 - Backend / Database Engineer

#### PR-01
Title: `PR-01: Report Views`
Branch: `db/views-reports`
Target: `dev`
Deliverable: `headcount_by_dept`, `salary_summary_by_job`, and full history views.

#### PR-02
Title: `PR-02: Admin User Management RLS`
Branch: `db/rls-admin-user-mgmt`
Target: `dev`
Deliverable: User and UserModule_Rights RLS with SUPERADMIN guard.

#### PR-03
Title: `PR-03: Final RLS Audit`
Branch: `docs/final-rls-audit`
Target: `dev`
Deliverable: Final RLS checklist and hard-delete audit.

### M4 - Rights & Authentication Specialist

#### PR-01
Title: `PR-01: Admin Rights Gating`
Branch: `feat/rights-admin-gating`
Target: `dev`
Deliverable: Admin sidebar gating and disabled SUPERADMIN actions.

#### PR-02
Title: `PR-02: Production Rights Regression`
Branch: `test/rights-production-regression`
Target: `dev`
Deliverable: Production checks for all three user types and 17 rights.

#### PR-03
Title: `PR-03: Auth Production Verification`
Branch: `test/auth-production-verification`
Target: `dev`
Deliverable: Email/password and Google OAuth production verification.

### M5 - QA / Documentation Specialist

#### PR-01
Title: `PR-01: Final E2E QA`
Branch: `test/final-e2e-qa`
Target: `dev`
Deliverable: Production E2E tests across users, HR modules, reports, and admin.

#### PR-02
Title: `PR-02: Final User Manual`
Branch: `docs/final-user-manual`
Target: `dev`
Deliverable: User manual with screenshots from the live app.

#### PR-03
Title: `PR-03: Sprint Guide and Presentation`
Branch: `docs/sprint-guide-presentation`
Target: `dev`
Deliverable: Sprint guide and 12-slide presentation deck.
