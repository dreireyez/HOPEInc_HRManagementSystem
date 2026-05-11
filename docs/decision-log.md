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

### Decision 6: Resolve ADMIN `ADM_USER` Conflict

- Date: 2026-05-10
- Owner: Team
- Status: Accepted
- Context: Sprint 3 requires Admin user management, but one rights matrix source lists `ADM_USER` as ADMIN = NO.
- Options Considered: ADMIN has ADM_USER, only SUPERADMIN has ADM_USER, split activation from rights management
- Decision: ADMIN has `ADM_USER = 1` and can activate/deactivate regular users. SUPERADMIN also has `ADM_USER = 1` and retains full control, including management of ADMIN accounts when needed.
- Reason:
  - Section 3.1 explicitly states that ADMIN (HR Manager) can activate/deactivate USER accounts.
  - This matches standard HR workflow where HR managers approve and manage staff account activation.
  - The conflicting rights matrix entry is treated as a source typo.
  - SUPERADMIN remains the only role allowed to soft-delete HR records and modify SUPERADMIN accounts.
- Impact:
  - Admin route gating may allow both ADMIN and SUPERADMIN where `ADM_USER` is the controlling right.
  - UserManagementPage should allow ADMIN to activate/deactivate regular users.
  - RLS for user management should permit ADMIN changes for non-SUPERADMIN targets only.
  - SUPERADMIN protection rules remain in force.

### Decision 7: Use Dedicated Activity Logs With Timestamp-Only Stamp

- Date: 2026-05-10
- Owner: Team
- Status: Accepted
- Context: `stamp` should reflect the latest change date on HR rows, while admins need a full timeline of HR and user-management actions.
- Options Considered: keep only `stamp`, derive history from `stamp`, create a separate audit table
- Decision: Use a dedicated `activity_logs` table for full audit history, and store only the latest timestamp in each row's `stamp`.
- Reason:
  - `stamp` can only represent the latest change and cannot preserve a timeline.
  - A dedicated audit table supports filtering, pagination, and future reporting from the Admin page.
  - Database-driven logging keeps behavior consistent across CRUD screens and admin RPCs.
- Impact:
  - HR table writes should refresh `stamp` automatically.
  - Activity logs should include HR data changes and user activation/role changes.
  - Admin should expose a read-only `Activity Logs` tab for `ADMIN` and `SUPERADMIN`.
