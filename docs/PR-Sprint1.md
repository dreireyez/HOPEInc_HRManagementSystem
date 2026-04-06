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
1. **Clone the Repository:**
   ```bash
   git clone <YOUR_REPOSITORY_URL>
   cd hope-hrs

2. **Install Dependencies:**
    ```bash
    npm install

3. **Environment Variables**:
    
    * Duplicate the `.env.example` file and rename it to `.env`.
    * Obtain the Supabase Project URL and Anon Key from the DB Engineer (M3) or your Supabase Dashboard.
    * Populate the variables in your local `.env` file. Never commit the `.env` file.

4. **Run the Development Server:**
    ```bash
    npm run dev
    ```
    The application will be available at http://localhost:5173


## PR Checklist
- [/] Branch created from `dev` 
- [ ] Branch name follows naming convention (`feat/`, `fix/`, `db/`, `test/`, `docs/`) 
- [ ] PR title is imperative and specific 
- [ ] All Vitest tests pass (if applicable)
- [ ] No `console.log` statements left in code
- [ ] No `.env` files or secrets committed
- [ ] Merge target is `dev` — **NEVER** merge directly to `main`

*Note: For reference, check the closed requests under the Pull Requests tab on GitHub.*
