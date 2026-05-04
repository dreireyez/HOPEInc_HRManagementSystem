# Agent Instructions: HOPE, INC. HR Management System

## Project Context
- **Purpose:** A comprehensive Human Resource Management System encompassing employee records, job history tracking, department management, and role-based access control.
- **Primary Users:** HR Staff (USER), HR Managers (ADMIN), System Administrators (SUPERADMIN).

## Tech Stack & Architecture
- **Frontend:** React 18 with Vite
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v6
- **Backend/Database:** Supabase (PostgreSQL, Supabase Auth, Row Level Security)
- **Testing:** Vitest + React Testing Library

## Token & Context Optimization (Crucial)
- **Exclude Directories:** Never scan `node_modules`, `dist`, or build folders.
- **Library Focus:** When writing UI, prioritize mobile-first responsive design using Tailwind utility classes.
- **Supabase & Security (CRITICAL):** 
  - Always assume strict Row Level Security (RLS) is active. 
  - **NO HARD DELETES:** Never suggest or write `.delete()` methods for HR tables. All deletions are soft-deletes implemented via `.update({ record_status: 'INACTIVE' })`.
  - **Role Filtering:** Always verify the `currentUser.user_type` before suggesting queries. If the user is a standard `'USER'`, queries must explicitly include `.eq('record_status', 'ACTIVE')`.

## Coding Standards
- **File Extensions:** Use `.jsx` for all React UI components and routing files. Use `.js` strictly for pure logic files, such as Supabase service layers (e.g., `employeeService.js`).
- **Architecture:** Maintain separation of concerns. Do not mix database API calls directly inside UI components; import them from the `src/services/` directory.
- **Syntax:** Use functional components, Hooks, and ES6 module syntax (`import`/`export`).
- **Documentation:** Maintain clear JSDoc comments for API service functions and route guards, as this project serves as an academic submission and requires clear trace history.