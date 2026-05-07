# 6-Week Sprint Deliverables

Source documents:

- `HopeHRS_Sprint_Deliverables_and_PR_Expectations_CS (3).docx`
- `HopeHRS_Project_Development_Guide_CS (2).docx`

This Markdown file is the AI-friendly sprint plan for HopeHRS.

## Team

| Member | Role | Total PRs |
|---|---|---:|
| M1 | Project Lead / Full-Stack Developer | 11 |
| M2 | Frontend Developer | 12 |
| M3 | Backend / Database Engineer | 11 |
| M4 | Rights & Authentication Specialist | 11 |
| M5 | QA / Documentation Specialist | 8 |

Team total: minimum 53 PRs across 6 weeks.

## Global Rules

- PRs target `dev`.
- No direct feature merge to `main`.
- End-of-sprint release branches may PR from `dev` to `main`.
- Each PR must be reviewed by at least one teammate before merge.
- Draft or unmerged PRs do not count toward sprint minimums.
- Branches and PR titles should match `docs/project/ROLE_PR_MAP.md`.
- Database triggers, RLS policies, seed scripts, and SQL views should be separate `db/` PRs.
- Each HR module feature should be kept in a module-sized PR.
- The 51-case rights matrix must be committed as one documented `test/` PR in Sprint 2.
- Every sprint must end with a demonstrable integrated slice.

## Sprint 1 - Setup, HR Database, and Authentication

Weeks 1-2.

Gate: Database is seeded, auth works through email/password and Google OAuth, login guard blocks inactive users, and placeholder HR routes exist.

Required Sprint 1 checks:

- React/Vite/Tailwind app runs locally.
- Supabase client exists and uses `.env.example` variables.
- HR seed data is loaded.
- Email/password registration and login work.
- Google OAuth works.
- Login guard blocks `INACTIVE` users.
- Placeholder pages exist for all required routes.

### M1 Expected Outputs

- GitHub branching strategy documented.
- React 18 + Vite + Tailwind scaffold.
- Supabase JS client initialized.
- React Router v6 with `ProtectedRoute`.
- Placeholder routes for Employees, Job History, Jobs, Departments, Admin, Deleted Items, and auth callback.
- Branch protection and PR template.

### M2 Expected Outputs

- Login page with email/password and Google OAuth button.
- Register page with validation and Google registration button.
- App shell with navbar, logged-in user name, logout button, and HR sidebar links.
- `/auth/callback` loading page.
- Responsive layout across desktop and mobile.

### M3 Expected Outputs

- Supabase project created.
- HopeDB HR tables loaded from SQL.
- `record_status` and `stamp` columns added to `employee`, `jobHistory`, `job`, and `department`.
- Rights tables created and seeded.
- Five modules and 17 rights seeded.
- SUPERADMIN `jcesperanza@neu.edu.ph` seeded with all 17 rights enabled.
- SQL migrations committed under `db/migrations`.
- ERD or schema notes committed under `docs`.

### M4 Expected Outputs

- AuthContext with session listener.
- Email/password sign-up and sign-in wired.
- Google OAuth wired.
- `/auth/callback` exchanges OAuth session and runs login guard.
- `provision_new_user()` trigger creates `USER / INACTIVE` accounts with view-only defaults.
- Google OAuth redirect URLs configured for local and production.

### M5 Expected Outputs

- Vitest and React Testing Library configured.
- Test cases for email registration, Google OAuth, inactive login block, and active login pass.
- Sprint 1 log.
- README setup instructions.

## Sprint 2 - HR CRUD, Rights Enforcement, and Soft Delete

Weeks 3-4.

Gate: All 51 rights test cases pass. Employee soft-delete and recovery cascade are verified. USER cannot see inactive rows or stamp fields.

Required Sprint 2 checks:

- CRUD service functions and UI exist for all four HR modules.
- Rights gating works for all 17 rights.
- USER cannot see inactive rows in UI, service responses, or RLS-protected access.
- USER cannot see `stamp` columns.
- Soft-delete and recovery work.
- Employee soft-delete cascades to Job History.
- Deleted Items is blocked from USER.
- No hard delete usage exists in app or database code.

### M1 Expected Outputs

- Employee service functions: get, add, update, soft-delete, recover.
- Job History service functions.
- Job service functions.
- Department service functions.
- `getX()` functions filter active rows for USER and return all rows for ADMIN/SUPERADMIN.
- UserRightsContext integrated at app level.
- `/deleted-items` route guard blocks USER.

### M2 Expected Outputs

- EmployeeListPage with current job, stamp gating, and inactive filtering.
- EmployeeDetailPage with JobHistoryPanel.
- Add/Edit/SoftDelete controls gated by rights.
- Job and Department list pages with modals.
- DeletedItemsPage with Employees, Job History, Jobs, and Departments tabs.
- Sidebar hides Deleted Items and Admin links for USER.

### M3 Expected Outputs

- RLS SELECT policy for USER active-only visibility and ADMIN/SUPERADMIN all-row visibility.
- RLS INSERT/UPDATE/deactivate/recover patterns for all four HR tables.
- Employee soft-delete cascade trigger updates related Job History rows.
- `employee_current_job` view.
- RLS tested with each user type.

### M4 Expected Outputs

- UserRightsContext queries all 17 rights after login.
- `useRights()` hook returns rights map.
- Add/Edit/Delete buttons gated for Employee, Job History, Job, and Department.
- Stamp columns hidden for USER.
- Deleted Items and Admin navigation hidden for USER where required.

### M5 Expected Outputs

- 51-case rights matrix documented.
- Soft-delete cascade test.
- Recovery cascade test.
- USER visibility bypass test.
- Stamp visibility test.
- Hard delete audit.
- Sprint 2 log.

## Sprint 3 - Admin, Reports, Deployment, and Final Documentation

Weeks 5-6.

Gate: Live app is accessible, all user types can log in, rights are enforced in production, reports and admin management work, SUPERADMIN protection is verified, and final documentation is submitted.

Required Sprint 3 checks:

- Admin user management works.
- SUPERADMIN protection is enforced in UI and database policies.
- HR reports work.
- Production deployment is live.
- Email/password and Google OAuth work in production.
- 17 rights enforced in production.
- No hard deletes exist.
- User manual, sprint guide, sprint logs, and presentation are complete.

### M1 Expected Outputs

- Admin API: get users, activate user, deactivate user, block SUPERADMIN operations.
- Reports API for headcount by department, salary summary by job, and employee full history.
- Vercel or Netlify deployment.
- Production Supabase env vars and redirect URLs configured.
- Release PR from `dev` to `main`.
- Stale branches cleaned up.

### M2 Expected Outputs

- UserManagementPage with Activate/Deactivate buttons and disabled SUPERADMIN rows.
- HeadcountByDeptPage.
- SalaryReportPage.
- EmployeeHistoryReportPage.
- Final UI polish for loading, empty, error, and mobile states.

### M3 Expected Outputs

- `headcount_by_dept` SQL view.
- `salary_summary_by_job` SQL view.
- Full employee history view or query.
- Admin user management RLS.
- Final RLS audit.
- Hard delete audit.
- Database backup verified.

### M4 Expected Outputs

- Admin sidebar link gated by `ADM_USER`.
- SUPERADMIN action buttons disabled regardless of logged-in user.
- Production rights regression for all three user types.
- Google OAuth production verification.

### M5 Expected Outputs

- Final production E2E test.
- SUPERADMIN protection test.
- User manual with screenshots.
- Sprint guide.
- 12-slide presentation deck.
