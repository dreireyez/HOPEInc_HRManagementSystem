# Sprint 1 – Rights Baseline Document
**PR-10: test/sprint1-rights-baseline**

**Date:** May 2026

---

# Overview

This document establishes the baseline rights definition for all 3 user types at the end of Sprint 1.

| Field | Value |
|---|---|
| Project | HOPE Inc. HR Management System |
| Sprint | Sprint 1 – Baseline Rights Definition |
| Prepared By | M5 – QA / Documentation Specialist |
| Purpose | Establish rights baseline before Sprint 2 testing |

---

# User Type Definitions

| User Type | Description |
|---|---|
| SUPERADMIN | Full system access including activation/deactivation |
| ADMIN | Full HR module access except SUPERADMIN controls |
| USER | Read-only access |

---

# Baseline Rights Matrix

| Right ID | Right Name | SUPERADMIN | ADMIN | USER |
|---|---|---|---|---|
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
| R17 | View User Management | ✅ | ✅ | ❌ |

---

# Implementation Reference

- Rights stored in `usermodule_rights`
- `right_value = 1` means granted
- `right_value = 0` means denied
- `can(rightId)` hook returns boolean access value
