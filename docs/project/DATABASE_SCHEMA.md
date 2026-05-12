# Database Schema

Source files:

- `HopeDB (3).sql`
- `HopeHRS_Project_Development_Guide_CS (2).docx`
- `HopeHRS_Sprint_Deliverables_and_PR_Expectations_CS (3).docx`

This file separates what exists in the provided SQL file from what the HopeHRS project must add through migrations.

## Source SQL Summary

`HopeDB (3).sql` contains base SQL for a fictitious Hope, Inc. database.

It includes these tables:

- `employee`
- `department`
- `job`
- `jobHistory`
- `customer`
- `sales`
- `product`
- `salesDetail`
- `payment`
- `priceHist`

HopeHRS focuses on the HR tables only unless a task explicitly asks for the broader sales tables.

## Core HR Tables From SQL

### `employee`

Primary key: `empno`

| Column | Type | Notes |
|---|---|---|
| `empno` | `VARCHAR(5)` | Primary key |
| `lastname` | `VARCHAR(15)` | Employee last name |
| `firstname` | `VARCHAR(15)` | Employee first name |
| `gender` | `CHAR(1)` | Check: `M` or `F` |
| `birthdate` | `DATE` | Date of birth |
| `hiredate` | `DATE` | Date hired |
| `sepDate` | `DATE` | Nullable separation date |

Seed count conflict:

- Sprint/project guide says 31 employees.
- SQL file contains 32 `INSERT INTO employee` statements.
- TODO: Team must confirm whether grading expects 31 or 32 employee rows.

### `department`

Primary key: `deptCode`

| Column | Type | Notes |
|---|---|---|
| `deptCode` | `VARCHAR(3)` | Primary key |
| `deptName` | `VARCHAR(20)` | Department name |

Expected seed rows from source docs: 8 departments.

### `job`

Primary key: `jobCode`

| Column | Type | Notes |
|---|---|---|
| `jobCode` | `VARCHAR(4)` | Primary key |
| `jobDesc` | `VARCHAR(20)` | Job description |

SQL file contains 14 `INSERT INTO job` statements.

### `jobHistory`

Composite primary key: `empNo`, `jobCode`, `effDate`

| Column | Type | Notes |
|---|---|---|
| `empNo` | `VARCHAR(5)` | FK to `employee` |
| `jobCode` | `VARCHAR(4)` | FK to `job` |
| `effDate` | `DATE` | Effective date |
| `salary` | `DECIMAL(10,2)` | Check: salary >= 0 |
| `deptCode` | `VARCHAR(4)` | FK to `department` |

SQL file contains 54 `INSERT INTO jobHistory` statements.

## Relationships

- `jobHistory.empNo` references `employee.empno`.
- `jobHistory.jobCode` references `job.jobCode`.
- `jobHistory.deptCode` references `department.deptCode`.
- `sales.empNo` also references `employee.empno`, but sales is outside the HopeHRS MVP scope.

## Required Migration Additions

The provided SQL file does not include these HopeHRS-required fields. Add them through migrations:

| Table | Required Column | Purpose |
|---|---|---|
| `employee` | `record_status VARCHAR(10) DEFAULT 'ACTIVE'` | Soft-delete state |
| `employee` | `stamp VARCHAR(60)` | Audit string |
| `jobHistory` | `record_status VARCHAR(10) DEFAULT 'ACTIVE'` | Soft-delete state |
| `jobHistory` | `stamp VARCHAR(60)` | Audit string |
| `job` | `record_status VARCHAR(10) DEFAULT 'ACTIVE'` | Soft-delete state |
| `job` | `stamp VARCHAR(60)` | Audit string |
| `department` | `record_status VARCHAR(10) DEFAULT 'ACTIVE'` | Soft-delete state |
| `department` | `stamp VARCHAR(60)` | Audit string |

Use a check constraint or equivalent policy to keep `record_status` to `ACTIVE` and `INACTIVE`.

## Required Rights and Auth Tables

The project guide requires these app-level tables or equivalent Supabase-backed structures:

| Table | Purpose |
|---|---|
| `user` | App users and user type: SUPERADMIN, ADMIN, USER |
| `Module` | Five modules: Emp_Mod, JH_Mod, Job_Mod, Dept_Mod, Adm_Mod |
| `user_module` | Maps user to module access |
| `rights` | 17 individual rights |
| `UserModule_Rights` | Maps users to individual right values |

Required seed:

- SUPERADMIN email: `jcesperanza@neu.edu.ph`
- userId from guide: `user1`
- user_type: `SUPERADMIN`
- record_status: `ACTIVE`
- all 17 rights: `right_value = 1`

New registered users:

- user_type: `USER`
- record_status: `INACTIVE`
- HR VIEW rights enabled.
- ADD, EDIT, DEL, and ADM rights disabled.

## Required RLS Policy Patterns

Apply to `employee`, `jobHistory`, `job`, and `department`:

- SELECT: USER sees only `ACTIVE`; ADMIN and SUPERADMIN see all.
- INSERT: allowed only when the matching ADD right is enabled.
- UPDATE edit fields: allowed only when the matching EDIT right is enabled.
- UPDATE `record_status` to `INACTIVE`: allowed only when the matching DEL right is enabled.
- UPDATE `record_status` to `ACTIVE`: allowed for ADMIN and SUPERADMIN according to recovery rules.

Admin module RLS must also ensure:

- ADMIN cannot update SUPERADMIN rows.
- ADMIN cannot update `user_type`.
- ADMIN cannot modify `UserModule_Rights` rows belonging to SUPERADMIN.

## Required Triggers

### `provision_new_user()`

Fires when a Supabase auth user is created.

Required behavior:

- Create app user row.
- Set new account to `USER / INACTIVE`.
- Insert module/right defaults.
- Enable VIEW rights for HR modules.
- Disable ADD, EDIT, DEL, and ADM rights.

### `cascade_employee_soft_delete()`

Fires when `employee.record_status` changes.

Required behavior:

- If employee changes from `ACTIVE` to `INACTIVE`, set related `jobHistory` rows to `INACTIVE`.
- If employee changes from `INACTIVE` to `ACTIVE`, restore related `jobHistory` rows to `ACTIVE` according to the approved cascade rule.
- Update `stamp` fields during cascade.

## Required Views

### `employee_current_job`

Purpose: latest active Job History row per active employee with job and department labels.

Expected fields include:

- `empno`
- `lastname`
- `firstname`
- `gender`
- `hiredate`
- `jobCode`
- `jobDesc`
- `salary`
- `deptCode`
- `deptName`
- `currentEffDate`

### `headcount_by_dept`

Purpose: count active employees by department using latest active job history rows.

Expected fields include:

- `deptCode`
- `deptName`
- `activeHeadcount`

### `salary_summary_by_job`

Purpose: salary min, max, and average per active job from active job history rows.

Expected fields include:

- `jobCode`
- `jobDesc`
- `assignments`
- `minSalary`
- `maxSalary`
- `avgSalary`

## Verification Queries To Include In DB PRs

Each database PR should include relevant checks such as:

```sql
select count(*) from employee;
select count(*) from department;
select count(*) from job;
select count(*) from jobHistory;

select count(*)
from jobHistory jh
left join employee e on e.empno = jh.empNo
where e.empno is null;

select count(*)
from jobHistory jh
left join job j on j.jobCode = jh.jobCode
where j.jobCode is null;

select count(*)
from jobHistory jh
left join department d on d.deptCode = jh.deptCode
where d.deptCode is null;
```

## SQL File Caveats

- `HopeDB (3).sql` starts with `DROP TABLE` statements. Do not run it blindly against a shared or production database.
- The SQL file has no Supabase RLS policies.
- The SQL file has no HopeHRS auth rights tables.
- The SQL file has no soft-delete columns.
- The SQL file has no triggers.
- The SQL file has no report views.
- The SQL file has broader non-HR tables that are out of MVP scope.
