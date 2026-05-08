# Acceptance Criteria

This file defines what must be true for the HopeHRS MVP to be considered complete.

## Final App Page Map

The deployed app must include and link to:

- Login
- Register
- Auth Callback
- Employees
- Employee Detail
- Job History
- Jobs
- Departments
- Admin
- Deleted Items
- Headcount by Department Report
- Salary Summary by Job Report
- Employee History Report

## Role-Based Acceptance

### SUPERADMIN

- Can log in with email/password and Google OAuth.
- Can view active and inactive HR rows.
- Can add, edit, soft-delete, and recover HR rows.
- Can access Deleted Items.
- Can access Admin.
- Can view reports.
- Can see `stamp` fields.
- Has all 17 rights enabled.

### ADMIN

- Can log in with email/password and Google OAuth.
- Can add and edit HR rows.
- Can recover inactive HR rows.
- Cannot soft-delete HR rows.
- Can access Deleted Items.
- Can see `stamp` fields.
- Cannot modify SUPERADMIN accounts.
- Admin user-management access must follow the resolved `ADM_USER` decision.

### USER

- Can log in only after activation.
- Can view active Employees, Job History, Jobs, and Departments.
- Cannot add, edit, soft-delete, recover, or manage users.
- Cannot access Deleted Items.
- Cannot see inactive rows.
- Cannot see `stamp` fields.
- Cannot access Admin.

## Database Acceptance

- `employee`, `jobHistory`, `job`, and `department` exist.
- `record_status` and `stamp` exist on all four HR tables.
- `record_status` defaults to `ACTIVE`.
- `record_status` supports `ACTIVE` and `INACTIVE`.
- RLS policies enforce USER active-only visibility.
- RLS policies enforce ADD, EDIT, DEL, recover, and admin-management rules.
- Employee soft-delete cascades to related `jobHistory` rows.
- Employee recovery restores related `jobHistory` rows according to the approved cascade rule.
- `employee_current_job` view works.
- `headcount_by_dept` view works.
- `salary_summary_by_job` view works.
- No hard delete is used for HR data.

## UI Acceptance

- All HR pages include loading, empty, and error states.
- Restricted buttons are hidden or disabled according to rights.
- USER does not see restricted navigation.
- SUPERADMIN rows in Admin UI are disabled for modification and explain why.
- Tables remain readable on mobile and desktop.
- Forms validate required fields and show clear errors.

## QA Acceptance

- 51-case rights matrix is documented.
- Soft-delete cascade test is documented.
- Recovery cascade test is documented.
- USER inactive visibility test is documented.
- USER stamp visibility test is documented.
- Hard delete audit is documented.
- Production auth checks are documented for email/password and Google OAuth.
- Final E2E test covers all three user types.

## PR and Release Acceptance

- Work branches are created from `dev`.
- Feature PRs target `dev`.
- Release PR targets `main`.
- PRs are reviewed before merge.
- No secrets are committed.
- README setup works from a clean clone.
- Live deployment URL is documented.

## Explicitly Out of Scope

- Non-HR sales/customer/product/payment features.
- Hard delete flows for HR data.
- Payroll.
- Timekeeping.
- Recruitment.
- Benefits.
- Features not listed in the sprint deliverables or project guide.
