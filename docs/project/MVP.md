# MVP Definition

Source document:

- `HopeHRS_Project_Development_Guide_CS (2).docx`

This file defines the intended MVP scope for HopeHRS.

## 1. App Overview

HopeHRS is a Human Resource Management System for Hope, Inc. The MVP focuses on managing HR employee data, job assignments, job definitions, departments, user access rights, deleted items, and basic reports.

## 2. Target Users

- SUPERADMIN
- ADMIN
- USER

## 3. Core Problem

Hope, Inc. needs a controlled HR system where staff can view HR data, HR managers can maintain it, and system administrators can enforce rights without exposing inactive records or audit fields to regular users.

## 4. Core Solution

The app provides a protected HR dashboard with rights-gated CRUD screens, soft-delete and recovery behavior, account activation, and reports. Supabase RLS and UI guards must both enforce the same permissions.

## 5. MVP Features

Include:

- Email/password authentication.
- Google OAuth authentication.
- Login guard for inactive users.
- User provisioning as `USER / INACTIVE`.
- Employees module.
- Job History module.
- Jobs module.
- Departments module.
- Deleted Items module.
- Admin user management.
- Headcount by department report.
- Salary summary by job report.
- Employee history report.
- Rights loading into a map after login.
- UI action gating using the 17-right model.
- Supabase RLS for visibility and write permissions.
- Soft-delete and recovery for HR records.
- Employee soft-delete cascade to Job History.

Exclude unless explicitly requested:

- Sales/customer/product/payment UI.
- Direct hard deletes for HR records.
- Private messaging.
- Payroll processing.
- Timekeeping.
- Recruitment or applicant tracking.
- Benefits administration.
- Any feature not present in the project guide, sprint deliverables, or SQL file.

## 6. App Pages

| Page | Route | Purpose |
|---|---|---|
| Login | `/login` | Email/password and Google OAuth sign-in. |
| Register | `/register` | Email/password and Google registration. |
| Auth Callback | `/auth/callback` | OAuth callback and login guard flow. |
| Employees | `/employees` | Employee table and primary HR landing page. |
| Employee Detail | `/employees/:empno` | Employee profile and job history panel. |
| Job History | `/jobhistory` | Job assignment history management. |
| Jobs | `/jobs` | Job code and job description management. |
| Departments | `/departments` | Department code and department name management. |
| Admin | `/admin` | User activation/deactivation and rights-sensitive user management. |
| Deleted Items | `/deleted-items` | Recovery view for inactive HR rows. |
| Headcount Report | `/reports/headcount-by-dept` | Active employee count by department. |
| Salary Report | `/reports/salary-summary-by-job` | Salary min/max/avg by job. |
| Employee History Report | `/reports/employee-history` | Full chronological job history for an employee. |

## 7. User Flows

### SUPERADMIN Flow

1. Logs in by email/password or Google OAuth.
2. Passes active-account login guard.
3. Can view, add, edit, soft-delete, and recover HR records.
4. Can access Deleted Items.
5. Can access Admin and reports.
6. Can see `stamp` fields.
7. Cannot be modified by ADMIN.

### ADMIN Flow

1. Logs in by email/password or Google OAuth.
2. Passes active-account login guard.
3. Can view active and inactive HR records where allowed.
4. Can add and edit HR records.
5. Can recover inactive HR records.
6. Cannot soft-delete HR records.
7. Can see `stamp` fields.
8. Must not modify SUPERADMIN accounts.

### USER Flow

1. Logs in by email/password or Google OAuth.
2. Passes active-account login guard only if active.
3. Can view active Employees, Job History, Jobs, and Departments.
4. Cannot add, edit, soft-delete, recover, or manage users.
5. Cannot access Deleted Items.
6. Cannot see inactive rows.
7. Cannot see `stamp` fields.

## 8. Data Scope

Core HR tables:

- `employee`
- `jobHistory`
- `job`
- `department`

Reference SQL also includes non-HR tables:

- `customer`
- `sales`
- `salesDetail`
- `product`
- `payment`
- `priceHist`

Do not build features around non-HR tables unless the user explicitly requests it.

## 9. MVP Scope Rules

- Keep the app HR-focused.
- Treat `record_status` as the deletion state.
- Treat `stamp` as admin audit metadata.
- Keep module access rights separate from visual hiding. UI hiding is not enough; RLS must also protect data.
- New users are inactive until ADMIN or SUPERADMIN activates them.
- Reports should use active HR records.
