## Branch: '[docs/sprint1-activities]'

## What Changed?
*To establish the foundation of the system
*To set up the development environment using React, Vite, and Tailwind CSS
*To prepare backend integration using Supabase
*To implement basic navigation and protected routes for secure access

## Why Was It Needed?
*Initialized the project using Vite + React
*Installed and configured Tailwind CSS for UI styling
*Set up project structure (src, public, docs)
*Configured Supabase client using .env variables
*Implemented React Router for page navigation
*Created a ProtectedRoute system to restrict unauthorized access
*Updated README with setup and cloning instructions

## How Do I Test It?
1. Clone the repository
2. Run npm install
3. Run npm run dev
4. Open the app in browser (usually http://localhost:5173)
5. Navigate through routes to verify routing works
6. Try accessing protected routes to check if restriction is working


## PR Checklist
- [x] Branch created from `dev` 
- [x] Branch name follows naming convention (`feat/`, `fix/`, `db/`, `test/`, `docs/`) 
- [x] PR title is imperative and specific 
- [x] All Vitest tests pass (if applicable)
- [x] No `console.log` statements left in code
- [x] No `.env` files or secrets committed
- [x] Merge target is `dev` — **NEVER** merge directly to `main`

*Note: For reference, check the closed requests under the Pull Requests tab on GitHub.*
