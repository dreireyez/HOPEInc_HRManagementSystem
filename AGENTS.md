# Agent Instructions: HOPE, INC. HR Management System

## Project Context

HopeHRS is a Human Resource Management System for Hope, Inc.

Purpose:

- Manage employee records.
- Track job history.
- Manage jobs and departments.
- Enforce role-based access control.
- Support soft-delete recovery and HR reports.

Primary users:

- USER - HR Staff
- ADMIN - HR Manager
- SUPERADMIN - System Administrator

## Read First

Before implementation, testing, database, documentation, or PR work, read these files in order:

1. `docs/project/ROLE_PR_MAP.md`
2. `docs/project/SPRINT_DELIVERABLES.md`
3. `docs/project/MVP.md`
4. `docs/project/TECH_STACK.md`
5. `docs/project/DATABASE_SCHEMA.md`
6. `docs/project/ACCEPTANCE_CRITERIA.md`

## Document Usage by Phase

### Before Building

- `AGENTS.md`
- `docs/project/ROLE_PR_MAP.md`
- `docs/project/SPRINT_DELIVERABLES.md`
- `docs/project/MVP.md`
- `docs/project/PROMPT_TEMPLATES.md`

Purpose:

- identify role, sprint, branch, and PR scope
- preserve MVP scope
- start from a task prompt with project constraints

### While Building

- `docs/project/TECH_STACK.md`
- `docs/project/DATABASE_SCHEMA.md`
- `docs/adr/README.md`

Purpose:

- stay inside the approved stack
- follow database, RLS, rights, and soft-delete rules
- record architecture decisions when needed

### While Testing and Documenting

- `docs/test-cases/README.md`
- `docs/prompt-logs/README.md`
- `docs/decision-log.md`
- `docs/project/ACCEPTANCE_CRITERIA.md`

Purpose:

- create QA evidence
- document AI usage
- record conflicts and team decisions
- verify rights, auth, RLS, soft-delete, reports, and deployment behavior

### Before Merging

- `docs/project/ROLE_PR_MAP.md`
- `docs/project/SPRINT_DELIVERABLES.md`
- `docs/project/ACCEPTANCE_CRITERIA.md`
- `.github/pull_request_template.md`
- `docs/decision-log.md`

Purpose:

- confirm branch, PR title, owner, and target branch
- format the PR body consistently
- verify no secrets, hard deletes, rights leaks, or USER visibility leaks were introduced

## Tech Stack

- Frontend: React 18 with Vite
- Styling: Tailwind CSS v4
- Routing: React Router v6
- Backend/Database: Supabase PostgreSQL
- Auth: Supabase Auth with email/password and Google OAuth
- Security: Supabase Row Level Security
- Testing: Vitest + React Testing Library

## Source of Truth Order

Use this order when sources conflict:

1. `docs/project/ROLE_PR_MAP.md`
2. `docs/project/SPRINT_DELIVERABLES.md`
3. `docs/project/MVP.md`
4. `docs/project/DATABASE_SCHEMA.md`
5. Current implemented code

If a source conflict appears, document it in `docs/decision-log.md` or the relevant PR.

If a task depends on an open decision in `docs/decision-log.md`, stop and ask for resolution before implementing that part.

## Token and Context Rules

- Do not scan `node_modules`, `dist`, build folders, or generated output unless explicitly needed.
- Use targeted file reads.
- Prefer `rg` or `rg --files` for search.
- Inspect only files relevant to the task.
- Preserve existing user/team changes.

## Non-Negotiable Security Rules

- Never hard-delete HR data.
- Do not use `.delete()` on HR tables.
- Do not write `DELETE FROM employee`, `DELETE FROM jobHistory`, `DELETE FROM job`, or `DELETE FROM department`.
- Soft delete means `.update({ record_status: 'INACTIVE' })`.
- USER must only see `record_status = 'ACTIVE'` rows.
- USER must never see `stamp` fields.
- Only SUPERADMIN can soft-delete HR records.
- ADMIN can add, edit, view, and recover where allowed, but cannot soft-delete HR records.
- ADMIN must not modify SUPERADMIN accounts.
- New registered users are `USER / INACTIVE` by default.
- Login guard must block inactive users.
- Do not commit secrets or `.env` files.

## Coding Standards

- Use `.jsx` for React UI components and routing files.
- Use `.js` for pure logic files, service layers, and utilities.
- Keep database API calls out of UI components.
- Put Supabase service functions in `src/services/`.
- Use functional components, Hooks, and ES6 modules.
- Add clear JSDoc comments for API service functions and route guards.
- Use Tailwind utility classes for responsive UI.
- Prioritize readable HR/admin tables, forms, and predictable navigation.

## Branch Rules

- Work from `dev`.
- Feature PRs target `dev`.
- Sprint release PRs target `main`.
- Never merge feature work directly into `main`.

Allowed prefixes:

- `feat/`
- `feat/ui-`
- `feat/auth-`
- `feat/rights-`
- `db/`
- `test/`
- `docs/`
- `fix/`
- `chore/`

## Pull Request Rules

- Use exact branch and PR title from `docs/project/ROLE_PR_MAP.md` when applicable.
- PRs count only after review and merge into `dev`.
- Keep PRs module-sized.
- Database triggers, RLS policies, SQL views, and seed scripts should be separate `db/` PRs.
- PR descriptions must include what changed, why, how to test, and relevant permission or data checks.
- When asked to prepare, draft, open, or review a PR, read `.github/pull_request_template.md` first.

## Commit Message Template

Format:

```text
<type>(<scope>): <summary>
```

Allowed types:

- `feat`
- `fix`
- `db`
- `test`
- `docs`
- `chore`

Examples:

```text
docs(project): add agent workflow documentation
feat(employees): add employee service functions
db(rls): add employee visibility policies
test(rights): document 51-case rights matrix
```

## Agent Workflow

1. Read this file and relevant project docs.
2. Inspect the current repo state.
3. Identify files related to the task.
4. Preserve existing changes.
5. Check `docs/decision-log.md` for open decisions affecting the task.
6. Make a focused change.
7. Run the smallest useful verification command.
8. Report changed files, verification, risks, and source conflicts.

## Agent Final Response Format

Use this shape unless the user asks otherwise:

- Changed files
- Verification
- Risks / TODOs
- Source conflicts, if any

## Review Focus

When reviewing HopeHRS work, prioritize:

- Hard delete violations
- Rights bypasses
- USER inactive-record leaks
- USER `stamp` leaks
- SUPERADMIN protection gaps
- RLS mistakes
- Missing blocked-action tests
- Secrets or `.env` files
- Wrong branch or PR target

## Known Source Conflicts

- Sprint materials say the HR seed should contain 31 employees, but `HopeDB (3).sql` contains 32 employee inserts.
- ADMIN user management is required in Sprint 3, but one rights matrix source lists `ADM_USER` as ADMIN = NO.
- `HopeDB (3).sql` contains base tables only. It does not include `record_status`, `stamp`, RLS policies, auth user tables, rights tables, triggers, or report views.
