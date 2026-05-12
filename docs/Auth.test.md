# Sprint 1 – Auth Flow Test Cases
**Branch:** `test/sprint1-auth-flows`  
**Tester:** M5 – QA / Documentation Specialist  
**Date:** May 2026  
**Total Cases:** 12  

---

## Test Environment
| Key | Value |
|-----|-------|
| Frontend | React + Vite |
| Backend | Supabase (PostgreSQL + Auth) |
| Auth Methods | Email/Password, Google OAuth |
| User Table | `public.user` (userid, user_type, record_status) |
| RPC | `provision_new_user()` |
| Browser | Chrome / Firefox (latest) |

---

## TC-S1-001 · Email Registration (Happy Path)
**Module:** Registration  
**Steps:**
1. Navigate to `/register`
2. Enter a valid new email (e.g. `newuser@test.com`)
3. Enter a valid password (min 6 characters)
4. Click Register

**Expected:** Success message shown; row created in `public.user` with `record_status = INACTIVE`  
**Result:** `[ ] PASS   [ ] FAIL`  
**Notes:**

---

## TC-S1-002 · Google OAuth Registration – New User (Happy Path)
**Module:** Registration  
**Steps:**
1. Navigate to `/register`
2. Click **Sign in with Google**
3. Complete Google OAuth consent flow

**Expected:** `provision_new_user()` RPC called; row created in `public.user` with `record_status = INACTIVE`; redirected to `/auth/callback`  
**Result:** `[ ] PASS   [ ] FAIL`  
**Notes:**

---

## TC-S1-003 · Duplicate Email Registration (Negative)
**Module:** Registration  
**Precondition:** Email already registered  
**Steps:**
1. Navigate to `/register`
2. Enter an already-registered email
3. Enter any password
4. Click Register

**Expected:** Error displayed ("User already registered" or equivalent); no duplicate record created  
**Result:** `[ ] PASS   [ ] FAIL`  
**Notes:**

---

## TC-S1-004 · Weak Password Registration (Edge Case)
**Module:** Registration  
**Steps:**
1. Navigate to `/register`
2. Enter a valid new email
3. Enter a password shorter than 6 characters
4. Click Register

**Expected:** Supabase validation error shown; registration blocked  
**Result:** `[ ] PASS   [ ] FAIL`  
**Notes:**

---

## TC-S1-005 · ACTIVE User Logs In via Email (Happy Path)
**Module:** Login Guard  
**Precondition:** User exists with `record_status = ACTIVE`  
**Steps:**
1. Navigate to `/login`
2. Enter ACTIVE user credentials
3. Click Login

**Expected:** Authenticated; redirected to `/dashboard`; `user` state set in `AuthContext`  
**Result:** `[ ] PASS   [ ] FAIL`  
**Notes:**

---

## TC-S1-006 · ACTIVE User Logs In via Google OAuth (Happy Path)
**Module:** Login Guard  
**Precondition:** Google account linked to ACTIVE user  
**Steps:**
1. Navigate to `/login`
2. Click **Sign in with Google**
3. Complete OAuth

**Expected:** Authenticated; redirected to `/dashboard`; `provision_new_user()` NOT called (user already exists)  
**Result:** `[ ] PASS   [ ] FAIL`  
**Notes:**

---

## TC-S1-007 · INACTIVE User Blocked on Email Login ⚠️ CRITICAL
**Module:** Login Guard  
**Precondition:** User exists with `record_status = INACTIVE`  
**Steps:**
1. Navigate to `/login`
2. Enter INACTIVE user credentials
3. Click Login

**Expected:**
- `supabase.auth.signOut()` called
- `user` state set to `null`
- Alert shown: *"Your account is pending activation by an administrator."*
- User cannot access `/dashboard`

**Result:** `[ ] PASS   [ ] FAIL`  
**Notes:**

---

## TC-S1-008 · INACTIVE Google User Blocked ⚠️ CRITICAL
**Module:** Login Guard  
**Precondition:** Google account linked to INACTIVE user  
**Steps:**
1. Navigate to `/login`
2. Click **Sign in with Google**
3. Complete OAuth as INACTIVE user

**Expected:** Login guard fires after OAuth; `signOut()` called; alert shown; user cannot reach dashboard  
**Result:** `[ ] PASS   [ ] FAIL`  
**Notes:**

---

## TC-S1-009 · New User Without DB Row Gets Provisioned (Edge Case)
**Module:** Login Guard  
**Precondition:** Auth session exists but no row in `public.user`  
**Steps:**
1. Simulate authenticated session with no `user` table row
2. Observe `AuthContext` behavior

**Expected:** `provision_new_user()` RPC called; user created with `record_status = INACTIVE`; login guard then blocks access  
**Result:** `[ ] PASS   [ ] FAIL`  
**Notes:**

---

## TC-S1-010 · AuthCallback Handles OAuth Redirect (Happy Path)
**Module:** AuthCallback  
**Steps:**
1. Initiate Google OAuth from `/register` or `/login`
2. Complete consent screen
3. Observe redirect to `/auth/callback`

**Expected:** `AuthCallback.jsx` processes token exchange; user redirected to `/dashboard` if ACTIVE  
**Result:** `[ ] PASS   [ ] FAIL`  
**Notes:**

---

## TC-S1-011 · Unauthenticated Access to /dashboard Blocked ⚠️ CRITICAL
**Module:** Route Guard  
**Precondition:** No active session  
**Steps:**
1. Clear all cookies/session storage
2. Navigate directly to `/dashboard`

**Expected:** Redirected to `/login`; dashboard content not rendered  
**Result:** `[ ] PASS   [ ] FAIL`  
**Notes:**

---

## TC-S1-012 · Authenticated User Cannot Access /login ⚠️ CRITICAL
**Module:** Route Guard  
**Precondition:** Active authenticated session  
**Steps:**
1. Log in as ACTIVE user
2. Navigate directly to `/login`

**Expected:** Redirected to `/dashboard`; login page not shown  
**Result:** `[ ] PASS   [ ] FAIL`  
**Notes:**

---

## Test Summary

| Metric | Value |
|--------|-------|
| Total Cases | 12 |
| Passed | ___ |
| Failed | ___ |
| Blocked | ___ |
| Tester | M5 |
| Date Executed | |

---

## Bug Report Log

| Bug ID | Test Case | Description | Steps to Reproduce | Severity | Status |
|--------|-----------|-------------|-------------------|----------|--------|
| BUG-001 | | | | | |
| BUG-002 | | | | | |