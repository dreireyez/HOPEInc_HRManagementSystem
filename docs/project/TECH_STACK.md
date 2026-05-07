# Approved Tech Stack

This project prioritizes a practical 6-week delivery for the HopeHRS MVP.

## Recommended Stack

| Area | Tool |
|---|---|
| Frontend | React 18 |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| Backend | Supabase |
| Database | Supabase PostgreSQL |
| Authentication | Supabase Auth with email/password and Google OAuth |
| Authorization | Supabase RLS plus React rights map |
| State | React Context API |
| Unit/Integration Tests | Vitest |
| Component Tests | React Testing Library |
| Deployment | Vercel or Netlify |
| Version Control | Git + GitHub |

## Required Environment Variables

Commit these names in `.env.example`, never real values:

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Production deployments must configure the same values in Vercel or Netlify.

## Why This Stack

- React and Vite support fast student-team delivery.
- Tailwind CSS is suitable for a clean HR/admin dashboard UI.
- Supabase provides Auth, PostgreSQL, triggers, views, and RLS in one platform.
- React Context is enough for auth session and rights map.
- Vitest and React Testing Library fit the required testing scope.

## Do Not Use Without Approval

- Next.js
- Firebase
- Laravel
- Django
- Express-only backend
- Mobile-native stack
- A second database outside Supabase

These may be valid tools generally, but switching stacks creates schedule and integration risk.

## Implementation Rules

- Keep data access in service functions or established repo patterns.
- Keep Supabase migrations under `db/migrations`.
- Keep user-facing views responsive for desktop and mobile.
- Do not commit generated secrets, Supabase service-role keys, or `.env` files.
- Prefer simple database views for reports over duplicating report logic in UI code.
