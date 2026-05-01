# Sprint 1 Log
**Sprint:** Sprint 1 – Authentication & Login Guard  
**QA Member:** M5 – QA / Documentation Specialist  
**Status:** ✅ Completed  

---

## Sprint Goals
- Implement email and Google OAuth registration
- Implement login guard (block INACTIVE users on both auth methods)
- Configure Supabase Auth providers and redirect URLs
- Implement `provision_new_user()` RPC for new Google sign-ups
- Set up development environment and README

---

## Task Log

| Date | Task | Assigned To | Status |
|------|------|-------------|--------|
| Sprint Start | Repository created; React + Vite scaffolded | All members | ✅ Done |
| Sprint Start | Supabase project provisioned; schema designed for `user`, `employee` tables | M1/M2 | ✅ Done |
| Week 1 | `AuthContext.jsx` implemented: email + Google login, login guard, `provision_new_user` RPC | Dev Team | ✅ Done |
| Week 1 | `Register.jsx` and `Login.jsx` pages created | Dev Team | ✅ Done |
| Week 1 | `AuthCallback.jsx` created for OAuth redirect handling | Dev Team | ✅ Done |
| Week 1 | Route guard implemented: unauthenticated users redirected to `/login` | Dev Team | ✅ Done |
| Week 2 | `UserRightsContext.jsx` implemented: rights fetched from `usermodule_rights` table | Dev Team | ✅ Done |
| Week 2 | M5: Sprint 1 auth test cases written (TC-S1-001 to TC-S1-012) | M5 | ✅ Done |
| Week 2 | M5: README drafted with full setup instructions | M5 | ✅ Done |
| Week 2 | Sprint 1 gate verified: login guard confirmed blocking INACTIVE on both auth methods | M5 + Team | ✅ Done |

---

## Findings & Resolutions

### F1-001 – INACTIVE Google Users Not Blocked Before Provisioning
**Finding:** INACTIVE users were not being blocked during Google OAuth if `provision_new_user` had not yet been called — the login guard only ran after the RPC, but the check was missing on re-fetch.  
**Resolution:** `AuthContext` updated to re-fetch `record_status` after provisioning completes and check it before setting user state.  
**Resolved By:** Dev Team — verified by M5

---

### F1-002 – Brief Flash of Protected Content on Load
**Finding:** On page load, protected content briefly appeared before the auth state resolved, because `loading` was not blocking renders fast enough.  
**Resolution:** "Synchronizing…" loading screen added in `AuthContext` — children are not rendered until `loading = false`.  
**Resolved By:** Dev Team — verified by M5

---

## Sprint 1 Gate Confirmation

- ✅ Database seeded with test users (ACTIVE and INACTIVE records present)
- ✅ Login guard confirmed blocking INACTIVE users on email login
- ✅ Login guard confirmed blocking INACTIVE users on Google OAuth
- ✅ `provision_new_user()` RPC confirmed working for new Google sign-ups
- ✅ Route guard confirmed: unauthenticated users redirected to `/login`
- ✅ Authenticated users redirected away from `/login`
- ✅ Sprint 1 cleared — **Sprint 2 authorized to begin**