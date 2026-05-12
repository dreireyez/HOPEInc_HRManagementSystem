# Prompt Logs

Each member should keep a prompt log showing how AI assistance was used and reviewed.

Prompt logs should support sprint evidence, not replace implementation or QA work.

## File Naming

```text
m1-prompt-log.md
m2-prompt-log.md
m3-prompt-log.md
m4-prompt-log.md
m5-prompt-log.md
```

## Prompt Log Template

````md
# M<member> Prompt Log

Member:
Role:

## Entry 1

Date:
Sprint:
PR:
Tool / AI Used:

Prompt:

```text
Paste the prompt or summarize it here.
```

Output Used:

-

Changes Made After Review:

-

Verification:

-

Reflection:

- What helped?
- What did you verify?
- What did you change manually?
````

## Minimum Expected Entries

- M1 Project Lead / Full-Stack Developer: scaffold, routing, services, deployment, release coordination.
- M2 Frontend Developer: login/register UI, app shell, HR pages, admin UI, reports UI.
- M3 Backend / Database Engineer: schema, migrations, seed data, RLS, triggers, views.
- M4 Rights & Authentication Specialist: AuthContext, Google OAuth, login guard, UserRightsContext, UI gating.
- M5 QA / Documentation Specialist: Vitest, rights matrix, cascade tests, sprint logs, manuals.

## Rules

- Do not paste secrets.
- Do not claim AI output was used without review.
- Log meaningful prompts only.
- Include what was changed manually after AI output.
- Include verification commands or manual checks where possible.
