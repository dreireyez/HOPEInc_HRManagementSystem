# Sprint 3 – E2E Production Test Results
**Branch:** `test/sprint3-e2e-production`  
**Environment:** Production  
**Production URL:** [INSERT URL]  
**Tester:** M5 – QA / Documentation Specialist  
**Date:** May 2026  

---

## Pre-Test Checklist

| Check | Done | Notes |
|-------|------|-------|
| Production DB seeded (5+ employee records) | [ ] | |
| SUPERADMIN test account active | [ ] | |
| ADMIN test account active | [ ] | |
| USER test account active | [ ] | |
| 4th INACTIVE account exists (for activation test) | [ ] | |
| All 4 HR modules accessible in production | [ ] | |
| Reports page accessible | [ ] | |
| All 3 report types generate without error | [ ] | |

---

## Module: Employee Management

| TC | User Type | Action | Expected | Pass/Fail | Screenshot |
|----|-----------|--------|----------|-----------|------------|
| TC-E2E-001 | SUPERADMIN | View employee list | Full list visible | [ ] P [ ] F | |
| TC-E2E-002 | SUPERADMIN | Add new employee | Record created | [ ] P [ ] F | |
| TC-E2E-003 | SUPERADMIN | Edit employee | Record updated | [ ] P [ ] F | |
| TC-E2E-004 | SUPERADMIN | Soft-delete employee | Moved to deleted | [ ] P [ ] F | |
| TC-E2E-005 | ADMIN | View employee list | Full list visible | [ ] P [ ] F | |
| TC-E2E-006 | ADMIN | Add new employee | Record created | [ ] P [ ] F | |
| TC-E2E-007 | ADMIN | Edit employee | Record updated | [ ] P [ ] F | |
| TC-E2E-008 | USER | View employee list | ACTIVE only visible | [ ] P [ ] F | |
| TC-E2E-009 | USER | Attempt to add employee | Button hidden/blocked | [ ] P [ ] F | |
| TC-E2E-010 | USER | Attempt to edit employee | Option hidden/blocked | [ ] P [ ] F | |

---

## Module: Job Management

| TC | User Type | Action | Expected | Pass/Fail | Screenshot |
|----|-----------|--------|----------|-----------|------------|
| TC-E2E-011 | SUPERADMIN | View job list | Full list visible | [ ] P [ ] F | |
| TC-E2E-012 | SUPERADMIN | Add new job | Record created | [ ] P [ ] F | |
| TC-E2E-013 | SUPERADMIN | Edit job | Record updated | [ ] P [ ] F | |
| TC-E2E-014 | ADMIN | Add and edit jobs | Actions succeed | [ ] P [ ] F | |
| TC-E2E-015 | USER | View job list | ACTIVE jobs visible | [ ] P [ ] F | |
| TC-E2E-016 | USER | Attempt to add/edit job | Blocked | [ ] P [ ] F | |

---

## Module: Department Management

| TC | User Type | Action | Expected | Pass/Fail | Screenshot |
|----|-----------|--------|----------|-----------|------------|
| TC-E2E-017 | SUPERADMIN | View department list | Full list visible | [ ] P [ ] F | |
| TC-E2E-018 | SUPERADMIN | Add new department | Record created | [ ] P [ ] F | |
| TC-E2E-019 | SUPERADMIN | Edit department | Record updated | [ ] P [ ] F | |
| TC-E2E-020 | ADMIN | Add and edit departments | Actions succeed | [ ] P [ ] F | |
| TC-E2E-021 | USER | View departments | ACTIVE visible | [ ] P [ ] F | |
| TC-E2E-022 | USER | Attempt to add/edit dept | Blocked | [ ] P [ ] F | |

---

## Module: Job History

| TC | User Type | Action | Expected | Pass/Fail | Screenshot |
|----|-----------|--------|----------|-----------|------------|
| TC-E2E-023 | SUPERADMIN | View job history | Full history visible | [ ] P [ ] F | |
| TC-E2E-024 | SUPERADMIN | Add job history entry | Entry created | [ ] P [ ] F | |
| TC-E2E-025 | ADMIN | View and add job history | Actions succeed | [ ] P [ ] F | |
| TC-E2E-026 | USER | View job history | ACTIVE employee history only | [ ] P [ ] F | |
| TC-E2E-027 | USER | Attempt to add entry | Blocked | [ ] P [ ] F | |

---

## Reports

| TC | User Type | Report | Expected | Pass/Fail | Screenshot |
|----|-----------|--------|----------|-----------|------------|
| TC-E2E-028 | SUPERADMIN | Employee Report | Generates successfully | [ ] P [ ] F | |
| TC-E2E-029 | SUPERADMIN | Department Report | Generates successfully | [ ] P [ ] F | |
| TC-E2E-030 | SUPERADMIN | Job Report | Generates successfully | [ ] P [ ] F | |
| TC-E2E-031 | ADMIN | Employee Report | Generates successfully | [ ] P [ ] F | |
| TC-E2E-032 | ADMIN | Department Report | Generates successfully | [ ] P [ ] F | |
| TC-E2E-033 | ADMIN | Job Report | Generates successfully | [ ] P [ ] F | |
| TC-E2E-034 | USER | Attempt to access Reports | Page hidden / blocked | [ ] P [ ] F | |

---

## Admin Activation

| TC | Action | Expected | Pass/Fail | Screenshot |
|----|--------|----------|-----------|------------|
| TC-E2E-035 | SUPERADMIN sees INACTIVE user in Admin page | User listed | [ ] P [ ] F | |
| TC-E2E-036 | SUPERADMIN activates the account | Status → ACTIVE | [ ] P [ ] F | |
| TC-E2E-037 | Newly activated user logs in | Dashboard accessible | [ ] P [ ] F | |
| TC-E2E-038 | ADMIN attempts activation | Blocked (R16 denied) | [ ] P [ ] F | |

---

## Cascade Tests (Production)

| TC | Action | Expected | Pass/Fail | Screenshot |
|----|--------|----------|-----------|------------|
| TC-E2E-039 | SUPERADMIN soft-deletes employee 00001 | Removed from USER view | [ ] P [ ] F | |
| TC-E2E-040 | USER views employee list after delete | Employee 00001 absent | [ ] P [ ] F | |
| TC-E2E-041 | ADMIN recovers employee 00001 | Returns to ACTIVE | [ ] P [ ] F | |
| TC-E2E-042 | USER views employee list after recovery | Employee 00001 visible again | [ ] P [ ] F | |

---

## Final Summary

| Metric | Value |
|--------|-------|
| Total Scenarios | 42 |
| Modules Passed | ___ / 4 |
| Reports Passed | ___ / 3 |
| User Types Verified | ___ / 3 |
| Admin Activation | [ ] PASS [ ] FAIL |
| Cascade Confirmed | [ ] PASS [ ] FAIL |
| Overall Status | [ ] ALL PASS [ ] ISSUES FOUND |
| Tester | M5 |
| Date Completed | |