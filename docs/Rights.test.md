# Sprint 2 – Rights Test Matrix Results
**Branch:** `test/sprint2-rights-51-cases`  
**Formula:** 3 user types × 17 rights = **51 test cases**  
**Tester:** M5 – QA / Documentation Specialist  
**Date:** May 2026  

---

## Rights Definition

| Right ID | Right Name | SUPERADMIN | ADMIN | USER |
|----------|-----------|:----------:|:-----:|:----:|
| R01 | View Employee List | ✅ | ✅ | ✅ |
| R02 | Add Employee | ✅ | ✅ | ❌ |
| R03 | Edit Employee | ✅ | ✅ | ❌ |
| R04 | Soft-Delete Employee | ✅ | ✅ | ❌ |
| R05 | View Deleted Items | ✅ | ✅ | ❌ |
| R06 | Recover Deleted Employee | ✅ | ✅ | ❌ |
| R07 | View Job History | ✅ | ✅ | ✅ |
| R08 | Add Job History Entry | ✅ | ✅ | ❌ |
| R09 | View Department List | ✅ | ✅ | ✅ |
| R10 | Add Department | ✅ | ✅ | ❌ |
| R11 | Edit Department | ✅ | ✅ | ❌ |
| R12 | View Job List | ✅ | ✅ | ✅ |
| R13 | Add Job | ✅ | ✅ | ❌ |
| R14 | Edit Job | ✅ | ✅ | ❌ |
| R15 | View Reports | ✅ | ✅ | ❌ |
| R16 | Activate/Deactivate Admin | ✅ | ❌ | ❌ |
| R17 | View User Management Page | ✅ | ✅ | ❌ |

---

## Full 51-Case Results

| TC ID | Right | Right Name | User Type | Expected | Pass / Fail | Notes |
|-------|-------|-----------|-----------|----------|-------------|-------|
| TC-S2-001 | R01 | View Employee List | SUPERADMIN | GRANTED | [ ] P [ ] F | |
| TC-S2-002 | R01 | View Employee List | ADMIN | GRANTED | [ ] P [ ] F | |
| TC-S2-003 | R01 | View Employee List | USER | GRANTED | [ ] P [ ] F | |
| TC-S2-004 | R02 | Add Employee | SUPERADMIN | GRANTED | [ ] P [ ] F | |
| TC-S2-005 | R02 | Add Employee | ADMIN | GRANTED | [ ] P [ ] F | |
| TC-S2-006 | R02 | Add Employee | USER | DENIED | [ ] P [ ] F | |
| TC-S2-007 | R03 | Edit Employee | SUPERADMIN | GRANTED | [ ] P [ ] F | |
| TC-S2-008 | R03 | Edit Employee | ADMIN | GRANTED | [ ] P [ ] F | |
| TC-S2-009 | R03 | Edit Employee | USER | DENIED | [ ] P [ ] F | |
| TC-S2-010 | R04 | Soft-Delete Employee | SUPERADMIN | GRANTED | [ ] P [ ] F | |
| TC-S2-011 | R04 | Soft-Delete Employee | ADMIN | GRANTED | [ ] P [ ] F | |
| TC-S2-012 | R04 | Soft-Delete Employee | USER | DENIED | [ ] P [ ] F | |
| TC-S2-013 | R05 | View Deleted Items | SUPERADMIN | GRANTED | [ ] P [ ] F | |
| TC-S2-014 | R05 | View Deleted Items | ADMIN | GRANTED | [ ] P [ ] F | |
| TC-S2-015 | R05 | View Deleted Items | USER | DENIED | [ ] P [ ] F | |
| TC-S2-016 | R06 | Recover Deleted Employee | SUPERADMIN | GRANTED | [ ] P [ ] F | |
| TC-S2-017 | R06 | Recover Deleted Employee | ADMIN | GRANTED | [ ] P [ ] F | |
| TC-S2-018 | R06 | Recover Deleted Employee | USER | DENIED | [ ] P [ ] F | |
| TC-S2-019 | R07 | View Job History | SUPERADMIN | GRANTED | [ ] P [ ] F | |
| TC-S2-020 | R07 | View Job History | ADMIN | GRANTED | [ ] P [ ] F | |
| TC-S2-021 | R07 | View Job History | USER | GRANTED | [ ] P [ ] F | |
| TC-S2-022 | R08 | Add Job History Entry | SUPERADMIN | GRANTED | [ ] P [ ] F | |
| TC-S2-023 | R08 | Add Job History Entry | ADMIN | GRANTED | [ ] P [ ] F | |
| TC-S2-024 | R08 | Add Job History Entry | USER | DENIED | [ ] P [ ] F | |
| TC-S2-025 | R09 | View Department List | SUPERADMIN | GRANTED | [ ] P [ ] F | |
| TC-S2-026 | R09 | View Department List | ADMIN | GRANTED | [ ] P [ ] F | |
| TC-S2-027 | R09 | View Department List | USER | GRANTED | [ ] P [ ] F | |
| TC-S2-028 | R10 | Add Department | SUPERADMIN | GRANTED | [ ] P [ ] F | |
| TC-S2-029 | R10 | Add Department | ADMIN | GRANTED | [ ] P [ ] F | |
| TC-S2-030 | R10 | Add Department | USER | DENIED | [ ] P [ ] F | |
| TC-S2-031 | R11 | Edit Department | SUPERADMIN | GRANTED | [ ] P [ ] F | |
| TC-S2-032 | R11 | Edit Department | ADMIN | GRANTED | [ ] P [ ] F | |
| TC-S2-033 | R11 | Edit Department | USER | DENIED | [ ] P [ ] F | |
| TC-S2-034 | R12 | View Job List | SUPERADMIN | GRANTED | [ ] P [ ] F | |
| TC-S2-035 | R12 | View Job List | ADMIN | GRANTED | [ ] P [ ] F | |
| TC-S2-036 | R12 | View Job List | USER | GRANTED | [ ] P [ ] F | |
| TC-S2-037 | R13 | Add Job | SUPERADMIN | GRANTED | [ ] P [ ] F | |
| TC-S2-038 | R13 | Add Job | ADMIN | GRANTED | [ ] P [ ] F | |
| TC-S2-039 | R13 | Add Job | USER | DENIED | [ ] P [ ] F | |
| TC-S2-040 | R14 | Edit Job | SUPERADMIN | GRANTED | [ ] P [ ] F | |
| TC-S2-041 | R14 | Edit Job | ADMIN | GRANTED | [ ] P [ ] F | |
| TC-S2-042 | R14 | Edit Job | USER | DENIED | [ ] P [ ] F | |
| TC-S2-043 | R15 | View Reports | SUPERADMIN | GRANTED | [ ] P [ ] F | |
| TC-S2-044 | R15 | View Reports | ADMIN | GRANTED | [ ] P [ ] F | |
| TC-S2-045 | R15 | View Reports | USER | DENIED | [ ] P [ ] F | |
| TC-S2-046 | R16 | Activate/Deactivate Admin | SUPERADMIN | GRANTED | [ ] P [ ] F | |
| TC-S2-047 | R16 | Activate/Deactivate Admin | ADMIN | DENIED | [ ] P [ ] F | |
| TC-S2-048 | R16 | Activate/Deactivate Admin | USER | DENIED | [ ] P [ ] F | |
| TC-S2-049 | R17 | View User Management Page | SUPERADMIN | GRANTED | [ ] P [ ] F | |
| TC-S2-050 | R17 | View User Management Page | ADMIN | GRANTED | [ ] P [ ] F | |
| TC-S2-051 | R17 | View User Management Page | USER | DENIED | [ ] P [ ] F | |

---

## Test Summary

| Metric | Value |
|--------|-------|
| Total Cases | 51 |
| Passed | ___ |
| Failed | ___ |
| Blocked | ___ |
| Tester | M5 |
| Date Executed | |