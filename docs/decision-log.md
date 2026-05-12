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

- Date:
- Owner: Team
- Status: Open
- Context: Sprint 3 requires Admin user management, but one rights matrix source lists `ADM_USER` as ADMIN = NO.
- Options Considered: ADMIN has ADM_USER, only SUPERADMIN has ADM_USER, split activation from rights management
- Decision: TODO: Team must decide before Admin Module implementation.
- Reason: The app cannot implement consistent Admin UI and RLS without resolving this.
- Impact:
  - Admin route gating depends on this decision.
  - UserManagementPage behavior depends on this decision.
  - RLS for user management depends on this decision.
