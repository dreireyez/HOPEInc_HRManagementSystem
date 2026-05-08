# Test Cases

Store QA test cases and evidence in this folder.

## Test Case Format

```md
# TC-001: Short Test Name

- Feature:
- Role:
- Sprint:
- Priority:
- Preconditions:
- Steps:
- Expected Result:
- Actual Result:
- Status:
- Evidence:
- Related Issue / PR:
```

## Required Coverage

- Email registration.
- Email login.
- Google OAuth registration.
- Google OAuth login.
- Login guard blocks `INACTIVE`.
- Login guard allows `ACTIVE`.
- USER sees only active HR rows.
- USER cannot see `stamp`.
- ADMIN can add and edit HR rows.
- ADMIN cannot soft-delete HR rows.
- SUPERADMIN can soft-delete HR rows.
- Employee soft-delete cascades to Job History.
- Employee recovery restores Job History according to approved rule.
- Deleted Items is blocked from USER.
- Deleted Items recovery works for ADMIN/SUPERADMIN.
- SUPERADMIN rows cannot be modified by ADMIN.
- Headcount by Department report.
- Salary Summary by Job report.
- Employee History report.
- No hard delete usage exists.

## Rights Matrix Requirement

Sprint 2 must include a 51-case matrix:

- 3 user types: SUPERADMIN, ADMIN, USER.
- 17 rights.
- Each case must show expected result, actual result, status, and evidence.

## Evidence Guidelines

- Link screenshots, terminal output, SQL query output, or PR comments.
- For blocked actions, include both UI behavior and service/RLS behavior when possible.
- For production checks, include the deployment URL and date tested.
- For failures, include reproduction steps and the smallest recommended fix.
