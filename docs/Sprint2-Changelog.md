# Sprint 2 Log
**Sprint:** Sprint 2 – Rights Management & RLS Enforcement  
**QA Member:** M5 – QA / Documentation Specialist  
**Status:** ✅ Completed  

---

## Sprint Goals
- Implement and verify 17-right permissions matrix (51 test cases)
- Enforce RLS on all 4 HR tables (employee, job, department, jobhistory)
- Implement soft-delete cascade for jobHistory
- Implement stamp column visibility by user type
- Protect SUPERADMIN role from ADMIN modification (UI + RLS)
- Build DeletedItems page for ADMIN recovery

---

## Task Log

| Date | Task | Assigned To | Status |
|------|------|-------------|--------|
| Week 3 | `usermodule_rights` table seeded with 17 rights per user type (51 total rows) | M1/M2 | ✅ Done |
| Week 3 | `UserRightsContext.jsx` verified: `can()` hook tested against all 17 rights | Dev Team | ✅ Done |
| Week 3 | RLS policies applied to `employee`, `job`, `department`, `jobhistory` tables | Dev Team | ✅ Done |
| Week 3 | Soft-delete implemented: `record_status` set to `INACTIVE` instead of hard delete | Dev Team | ✅ Done |
| Week 3 | Cascade: `jobHistory` rows filtered from USER view when employee is `INACTIVE` | Dev Team | ✅ Done |
| Week 3 | `DeletedItemsPage.jsx` built for ADMIN: shows soft-deleted employees with recovery | Dev Team | ✅ Done |
| Week 4 | Stamp column implemented: visible to ADMIN+, hidden from USER across all 4 tables | Dev Team | ✅ Done |
| Week 4 | SUPERADMIN protection: UI hides edit controls for SUPERADMIN rows from ADMIN | Dev Team | ✅ Done |
| Week 4 | SUPERADMIN RLS: UPDATE blocked at database level for ADMIN targeting SUPERADMIN rows | Dev Team | ✅ Done |
| Week 4 | M5: 51-case rights matrix tested and documented | M5 | ✅ Done |
| Week 4 | M5: Cascade, visibility, bypass, and stamp tests executed | M5 | ✅ Done |
| Week 4 | M5: Sprint 2 log compiled with findings and resolutions | M5 | ✅ Done |

---

## Findings & Resolutions

### F2-001 – RLS Blocked ADMIN From Viewing Deleted Items
**Finding:** RLS policy initially blocked ADMIN from viewing INACTIVE employees in the Deleted Items page because the policy only allowed access to `record_status = ACTIVE`.  
**Resolution:** RLS policy updated to grant ADMIN and SUPERADMIN read access to all `record_status` values.  
**Resolved By:** Dev Team — verified by M5

---

### F2-002 – Stamp Column Visible to USER
**Finding:** The stamp/audit column was rendering for USER role due to a missing conditional check in the table component — all columns were rendered regardless of `user_type`.  
**Resolution:** Column render wrapped in `can('stamp_visibility')` check using the `useRights()` hook.  
**Resolved By:** Dev Team — verified by M5

---

### F2-003 – Recovery Cascade Didn't Re-render Immediately
**Finding:** After ADMIN recovered employee 00001, the USER's job history view did not update until a manual page refresh — state was stale.  
**Resolution:** State management updated to refetch employee and jobHistory data after the recovery action resolves.  
**Resolved By:** Dev Team — verified by M5

---

## Sprint 2 Gate Confirmation

- ✅ 51-case rights matrix: all 51 test cases documented with expected results
- ✅ Soft-delete cascade confirmed: jobHistory hidden from USER on delete, restored on recovery
- ✅ RLS API bypass test passed: USER cannot retrieve INACTIVE rows even with direct API call
- ✅ Stamp visibility confirmed: shown to ADMIN+, hidden from USER across all 4 tables
- ✅ No hard-delete audit: zero `.delete()` calls found on HR tables in codebase
- ✅ SUPERADMIN protection: blocked at both UI and RLS levels
- ✅ Sprint 2 cleared — **Sprint 3 authorized to begin**