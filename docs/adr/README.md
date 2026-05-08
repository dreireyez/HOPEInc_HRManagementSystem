# Architecture Decision Records

Store ADRs in this folder.

Use ADRs for decisions that affect architecture, permissions, database behavior, deployment, or sprint scope.

## File Naming

```text
0001-decision-title.md
0002-decision-title.md
```

## ADR Template

```md
# ADR-0001: Decision Title

## Status

Proposed | Accepted | Superseded

## Context

What problem or decision are we addressing?

## Options Considered

- Option 1
- Option 2
- Option 3

## Decision

What did we choose?

## Consequences

- Positive outcome
- Tradeoff or risk
- Follow-up work
```

## Required ADR Topics

- Supabase as backend, database, auth, and RLS platform.
- Email/password plus Google OAuth authentication.
- USER / INACTIVE provisioning for new accounts.
- 17-right authorization model.
- Soft-delete instead of hard delete.
- Employee to Job History cascade behavior.
- ADMIN and SUPERADMIN user-management boundary.
- Deployment target: Vercel or Netlify.

## ADR Rules

- Keep ADRs short and decision-focused.
- Link to sprint deliverables or PRs when relevant.
- Do not use ADRs to invent new product scope.
- If source materials conflict, state the conflict and record the team decision.
