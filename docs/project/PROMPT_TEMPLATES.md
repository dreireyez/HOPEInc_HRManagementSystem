# Prompt Templates

Use these templates when asking an AI agent to work on HopeHRS.

All templates assume the repo contains the source-of-truth docs and that the agent must follow them strictly.

Keep detailed project rules in `AGENTS.md`. These templates are launch prompts, not duplicate policy documents.

## General Rule

Always start with:

`Read AGENTS.md first.`

Then identify:

- member role
- sprint number
- PR number
- exact `docs/project/ROLE_PR_MAP.md` reference

## General Project Prompt

```text
Read AGENTS.md first.

You are working in the HopeHRS repository.

Task:
<describe the task>

Constraints:
- Follow AGENTS.md non-negotiable rules.
- Keep changes focused and preserve existing team changes.
- Do not implement work blocked by an open decision in docs/decision-log.md.

Before editing:
- Inspect the relevant files.
- Explain the intended change briefly.

After editing:
- Run relevant tests or checks.
- Summarize changed files.
- Call out remaining risks, source conflicts, or manual setup.
```

## Role PR Prompt

```text
Read AGENTS.md first.

I am M<member> working on Sprint <n> PR-<n>.
Use docs/project/ROLE_PR_MAP.md for the exact branch, PR title, target branch, and deliverable.
Read the relevant section of docs/project/SPRINT_DELIVERABLES.md.
Use .github/pull_request_template.md for PR content.

Implement only this PR.
Preserve existing user/team changes.
Run the smallest useful verification command before reporting completion.
```

## Feature Implementation Prompt

```text
Read AGENTS.md first.

Implement this HopeHRS feature:

Feature:
<feature name and behavior>

Relevant module:
<Employees | Job History | Jobs | Departments | Admin | Deleted Items | Reports>

Expected access behavior:
<which user types can view/add/edit/delete/recover>

Required UI states:
- Loading
- Empty
- Error
- Success
- Permission denied or hidden actions where applicable

Rules:
- Follow AGENTS.md non-negotiable rules for user types, rights, stamp visibility, record_status, and hard-delete prevention.
- Keep data access in service functions or existing repo patterns.

Verification:
- Run available tests.
- Manually list the user-type cases checked.
```

## Database Migration Prompt

```text
Read AGENTS.md first.

Create or update a Supabase/PostgreSQL migration for HopeHRS.

Database task:
<describe migration, RLS policy, trigger, view, or seed>

Rules:
- Follow AGENTS.md non-negotiable rules for soft delete, record_status, stamp, RLS, and SUPERADMIN protection.
- Add or preserve stamp updates where relevant.

Required checks:
- Include SQL verification queries for row counts, FK integrity, or policy behavior.
- If adding RLS, describe expected behavior for SUPERADMIN, ADMIN, and USER.
- If adding a trigger, describe the before/after state.
```

## Soft Delete Prompt

```text
Read AGENTS.md first.

Implement soft delete or recovery for this HR table:

Table:
<employee | jobHistory | job | department>

Primary key:
<key fields>

Behavior:
- Follow AGENTS.md soft-delete, recovery, user visibility, and rights rules.
- Soft delete sets record_status = 'INACTIVE' and updates stamp.
- Recovery sets record_status = 'ACTIVE' and updates stamp.

Special rule:
- If employee is soft-deleted, all jobHistory rows for that employee must also become INACTIVE.
- If employee is recovered, related jobHistory rows should be restored according to the approved cascade rule.
```

## Auth And Rights Prompt

```text
Read AGENTS.md first.

Work on HopeHRS auth or rights.

Task:
<describe auth, login guard, UserRightsContext, useRights hook, provisioning, or route guard>

Rules:
- Follow AGENTS.md auth, provisioning, rights, route gating, and SUPERADMIN protection rules.

Verification:
- Check inactive login is blocked.
- Check active login is allowed.
- Check USER, ADMIN, and SUPERADMIN behavior separately.
```

## UI Prompt

```text
Read AGENTS.md first.

Build or update a HopeHRS UI screen.

Screen:
<screen name and route>

Data source:
<table, view, or service function>

Required behavior:
- Follow AGENTS.md user type, rights, stamp visibility, and record_status rules.
- Hide restricted buttons instead of showing broken actions.
- Show loading, empty, and error states.
- Keep layout responsive for mobile and desktop.

Design direction:
- Use a clean HR/admin dashboard style.
- Prioritize readable tables, clear forms, and predictable navigation.
- Avoid decorative landing-page UI.

Verification:
- Run frontend tests if available.
- Check for text overflow and broken mobile layout.
```

## QA Prompt

```text
Read AGENTS.md first.

Test this HopeHRS behavior:

Behavior:
<describe what to test>

Required coverage:
- SUPERADMIN case
- ADMIN case
- USER case
- Allowed action
- Blocked action
- UI behavior
- RLS or service-level behavior where applicable

Specific checks:
- 51-case rights matrix when rights are involved.
- Soft-delete cascade and recovery when employee status changes.
- USER cannot see INACTIVE records.
- USER cannot see stamp columns.
- No hard delete usage in app code.

Deliverable:
- List pass/fail results.
- Include reproduction steps for failures.
- Recommend the smallest fix for each failure.
```

## Code Review Prompt

```text
Read AGENTS.md first.

Review this HopeHRS change.

Focus on:
- Hard delete violations
- Rights bypasses
- USER visibility leaks
- Stamp visibility leaks
- SUPERADMIN protection gaps
- RLS policy mistakes
- Missing tests for blocked actions
- Secrets or .env files
- PR branch/target mistakes

Review style:
- List findings first.
- Include file and line references.
- Prioritize bugs and regressions over style comments.
- If no issues are found, say so and mention remaining test gaps.
```

## If You Want A Draft PR

Add this at the end of any template:

```text
When done, prepare and open a draft PR to dev using the exact title and .github/pull_request_template.md.
```

## If You Want Planning First

Add this instead:

```text
Do not implement yet. First summarize the task, affected files, and planned steps based on the repo docs.
```

## Short Reliable Prompt

```text
Read AGENTS.md first.
I am M<member>. Work on Sprint <n> PR-<n> from docs/project/ROLE_PR_MAP.md.
Use the exact branch, PR title, target branch, and PR template.
Implement only this PR.
```
