# HOPE, INC. Human Resource Management System

![Project Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-Latest-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green)

A comprehensive Human Resource Management System developed for HOPE, INC. This project is a 6-week academic term project for the College of Informatics and Computer Studies at New Era University (Academic Year 2025–2026). 

## 🚀 Tech Stack

* **Frontend:** React 18, Vite 
* **Styling:** Tailwind CSS v4 
* **Routing:** React Router v6 
* **Backend / Database:** Supabase (PostgreSQL, Auth, RLS)
* **Testing:** Vitest + React Testing Library 

## 🛠️ Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
* Node.js (v18 or higher recommended)
* npm or yarn
* Git

### Installation & Setup

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

## 🌿 Git Workflow and Branching Strategy

To maintain code stability and ensure peer review, this project enforces a strict branching strategy. **Direct pushes to `main` and `dev` are strictly forbidden.**

### Base Branches
* `main`: Production-ready code. Releases are merged here at the end of every sprint.
* `dev`: The stable integration branch. **All feature branches must be created from `dev`.**

### Feature Branch Naming Convention
When starting a new task, create a branch from `dev` using the following prefixes:

| Prefix | When to Use | Example |
| :--- | :--- | :--- |
| `feat/` | New features (UI, API, trigger, context) | `feat/employee-soft-delete` |
| `fix/` | Bug fixes | `fix/cascade-trigger-restore` |
| `db/` | Database changes (schema, migration, RLS, view) | `db/rls-employee-select` |
| `test/` | Writing or updating test files | `test/rights-51-cases` |
| `docs/` | Documentation only updates | `docs/user-manual-draft` |
| `refactor/` | Code cleanup with no behavior change | `refactor/employeeService-cleanup` |
| `chore/` | Config, tooling, dependencies | `chore/supabase-env-setup` |

*Note: Include the HR module name in the branch name where possible for easier tracking (e.g., `feat/ui-employee-list`).*

## 📁 Repository Structure

* `/src`: Contains all React frontend code (components, pages, contexts, lib).
* `/db`: Contains database schema, migration scripts, triggers, and RLS policies.
* `/docs`: Contains project documentation, sprint logs, ERD diagrams, and user manuals.

## 👥 Team Members & Roles

| Role | Responsibility |
| :--- | :--- |
| **M1** | Project Lead / Full-Stack Developer |
| **M2** | Frontend Developer (UI/UX) |
| **M3** | Backend / Database Engineer |
| **M4** | Rights & Authentication Specialist |
| **M5** | QA / Documentation Specialist |

---

