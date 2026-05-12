# Decision Log

Record major HopeHRS project decisions here.

## Template

```md
### Decision N: Decision Title

- Date:
- Owner:
- Status:
- Context:
- Options Considered:
- Decision:
- Reason:
- Impact:
```

## Decisions

### Decision 1: Use Soft Delete for HR Records

- Date:
- Owner: Team
- Status: Accepted by source documents
- Context: HR records must be recoverable and USER accounts must not see inactive rows.
- Options Considered: hard delete, archive tables, `record_status`
- Decision: Use `record_status = 'ACTIVE'` or `record_status = 'INACTIVE'` for HR deletion state.
- Reason: The project guide explicitly prohibits hard deletes and requires recovery.
- Impact:
  - No `.delete()` on HR tables.
  - No `DELETE FROM` HR statements.
  - Deleted Items must recover inactive rows.
  - RLS and UI must hide inactive rows from USER.

### Decision 2: New Users Are Inactive By Default

- Date:
- Owner: M4 Rights & Authentication Specialist
- Status: Accepted by source documents
- Context: Email/password and Google OAuth registrations must not immediately access HR data.
- Options Considered: active by default, manual database creation, trigger-based inactive provisioning
- Decision: Use a `provision_new_user()` trigger to create new users as `USER / INACTIVE`.
- Reason: The project guide requires inactive default accounts and login guard blocking.
- Impact:
  - Login guard must block inactive accounts for both auth methods.
  - ADMIN or SUPERADMIN must activate accounts.
  - VIEW-only rights are seeded by default.

### Decision 3: Use 17 Rights Across 5 Modules

- Date:
- Owner: M4 Rights & Authentication Specialist
- Status: Accepted by source documents
- Context: UI actions and database policies need consistent authorization.
- Options Considered: role-only checks, rights-only checks, role plus rights map
- Decision: Load 17 rights into a rights map after login and gate UI actions by right.
- Reason: The sprint deliverables require a 51-case rights matrix.
- Impact:
  - Add/Edit/Delete buttons must be gated.
  - RLS must enforce equivalent rights.
  - Sprint 2 requires documented 3 user types x 17 rights testing.

### Decision 4: Treat HopeDB SQL As Base Schema Only

- Date:
- Owner: M3 Backend / Database Engineer
- Status: Accepted by inspection
- Context: `HopeDB (3).sql` contains base fictitious company tables but not HopeHRS app security additions.
- Options Considered: treat SQL as complete, treat SQL as base seed, ignore SQL
- Decision: Use SQL for base table structures and seed data, then add HopeHRS migrations for soft delete, stamps, rights, RLS, triggers, and views.
- Reason: The SQL file lacks required project columns and policies.
- Impact:
  - Migration PRs must add `record_status` and `stamp`.
  - Migration PRs must add rights/auth structures.
  - Migration PRs must add RLS, triggers, and report views.

### Decision 5: Employee Count Conflict Remains Unresolved

- Date:
- Owner: Team
- Status: Open
- Context: Source materials disagree on employee seed count.
- Options Considered: follow project guide count of 31, follow SQL count of 32
- Decision: TODO: Team must confirm before grading or final documentation.
- Reason: The sprint guide says 31 employees, but `HopeDB (3).sql` contains 32 `INSERT INTO employee` statements.
- Impact:
  - DB verification PR must call out the conflict.
  - Final documentation should not silently change either source.

### Decision 7: Admin Employee Status Authority Split

- Date: 2026-05-10
- Owner: Team
- Status: Accepted
- Context: Task directive requires ADMIN and SUPERADMIN to edit employee active or inactive status within the Admin Panel Employees tab. AGENTS.md prohibits ADMIN from soft-deleting HR records.
- Options Considered: Grant both roles full deactivate and reactivate authority; restrict deactivation to SUPERADMIN only; block status changes from ADMIN entirely.
- Decision: SUPERADMIN retains exclusive authority to deactivate employees (set record_status to INACTIVE). ADMIN is granted authority to reactivate employees (set record_status to ACTIVE) within the Admin Panel Employees tab.
- Reason: Complies with AGENTS.md "ADMIN can recover where allowed" clause without violating the non-negotiable soft-delete security rule that limits deactivation to SUPERADMIN.
- Impact:
  - Admin.jsx gates the Deactivate button to SUPERADMIN only.
  - ADMIN sees a Reactivate button for INACTIVE employees only.
  - No change to RLS policies required; existing softDeleteEmployee and recoverEmployee service functions enforce role checks via Supabase RLS on the backend.

### Decision 8: Google OAuth as Exclusive Authentication Method

- Date: 2026-05-10
- Owner: Team
- Status: Accepted per task directive
- Context: The system directives explicitly require all users to authenticate exclusively using Google OAuth, removing the email/password sign-in path from the login page.
- Options Considered: Keep both methods; remove email/password UI only; disable email auth at Supabase level.
- Decision: Remove email input, password input, and the email/password submit handler from Login.jsx. Retain Google OAuth as the only sign-in mechanism. The /register route remains as a safe redirect to /login.
- Reason: Task directive overrides MVP.md which listed email/password as a feature. The inactive-user gate in AuthContext.jsx continues to block unapproved OAuth users.
- Impact:
  - Existing ACTIVE users provisioned via email/password no longer have a UI sign-in path. They must authenticate via Google OAuth using the same email address, or be re-provisioned by SUPERADMIN.
  - No Supabase Auth provider configuration changes are required; Google OAuth was already the working auth flow.
  - This deviates from MVP.md and ACCEPTANCE_CRITERIA.md which both list email/password as a feature.

### Decision 9: Stamp Format, Audit Log Removal, and Sepdate Auto-Soft-Delete

- Date: 2026-05-11
- Owner: Team
- Status: Accepted per task directive
- Context: The directive mandates new audit-stamp formats (`DEACTIVATED`, `REACTIVATED`, `CASCADE-DEL <empno> <ts>`, `CASCADE-RECOVER <empno> <ts>`) stored in the existing `stamp varchar(60)` column on each HR table, and forbids any unified Log panel. The previous implementation inlined `DELETED by <userId> at <ISO>` strings and exposed them via an Admin Panel "Log" tab parsed by `getAuditLog()`.
- Options Considered: keep the prior format and parser; widen the `stamp` column; replace the format and remove the Log tab.
- Decision:
  1. Add `src/utils/makeStamp.js` emitting `<ACTION> <actorShort8> <YYYY-MM-DDTHH:MM:SSZ>` (worst-case 47 chars, fits the 60-char column without alteration).
  2. Cascade trigger renamed to `cascade_employee_soft_delete()` (migration 012); writes `CASCADE-DEL <empno> <ts>` and `CASCADE-RECOVER <empno> <ts>`.
  3. Setting `sepdate` on an ACTIVE employee triggers a soft-delete in BOTH the service layer (`updateEmployee` in employeeService.js) AND a new BEFORE-UPDATE DB trigger (`sepdate_softdelete`, migration 012). The actual column is `sepdate` (not `sep_date`).
  4. Remove `getAuditLog()` and the Admin Panel `Log` tab. Replace with three new tabs in Admin: `Deleted Employees`, `Deleted Jobs`, `Deleted Departments`, all backed by the shared `DeletedRecordsTable` component. `DeletedItemsPage` continues to handle Job History recovery and is refactored to reuse the same shared component.
  5. The `stamp` column is rendered as a standard table column for ADMIN/SUPERADMIN only across `EmployeeListPage`, `JobListPage`, `DeptListPage`, `JobHistory`, and `JobHistoryPanel`. USER sees no `stamp` column anywhere.
  6. The unified Add/Edit modal pattern (`JobModal`, `DeptModal`, `JobHistoryModal` switching mode via `initialData`) satisfies the "Add and Edit modals" requirement; no separate `AddJobModal`/`EditJobModal` files are introduced.
  7. `Reports.jsx` is consolidated from 3 tabs into a single stacked layout with one `Export Combined Report PDF` button, served by `downloadCombinedReportsPDF()` in `reportService.js`.
- Reason: Strict directive compliance, with a single audit string per record (no separate audit table) and no schema-width changes to the stamp column.
- Impact:
  - Migrations 012 and 013 must be applied; existing `DELETED by ... at ...` stamps remain on legacy rows but new writes use the new format.
  - Existing Vitest expectation in `employeeService.test.js` updated to assert the new stamp prefix and the `sepdate` field changes.
  - New tests: `makeStamp.test.js`, `sepdateAutoSoftDelete.test.js`, `cascadeAndProvision.sql.test.js`, `softDeleteVisibility.test.js`.
  - The Admin Panel keeps its strict tab separation; `UserManagementPage` stays isolated and `DeletedItemsPage` remains the canonical Recovery Vault for Job History.

### Decision 6: Resolve ADMIN `ADM_USER` Conflict

- Date: 2026-05-09
- Owner: Team
- Status: Resolved
- Context: Sprint 3 requires Admin user management, but one rights matrix source lists `ADM_USER` as ADMIN = NO.
- Options Considered: ADMIN has ADM_USER, only SUPERADMIN has ADM_USER, split activation from rights management
- Decision: Only SUPERADMIN holds the ADM_USER right. ADMIN can access the Admin Panel but is denied the User Management tab. ADMIN can view the Employees tab and Log tab within the Admin Panel.
- Reason: Restricting user role changes and activation to SUPERADMIN prevents privilege escalation by ADMIN accounts. ADMIN retains visibility into the workforce via the Employees tab without being able to modify user accounts or roles.
- Impact:
  - Admin.jsx gates the Users tab to SUPERADMIN only. ADMIN sees Employees and Log tabs.
  - RLS on the user table must allow SUPERADMIN to update user_type; ADMIN updates are blocked.
  - UserManagementPage (Users tab) is inaccessible to ADMIN at the component level and must also be blocked by RLS.
