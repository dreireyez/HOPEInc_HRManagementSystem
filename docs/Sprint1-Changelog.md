# 📌 Sprint 1 Changelog

## Overview
Sprint 1 covers the completion of **Milestones 1–3**, including project setup, UI development, authentication, and backend/database initialization.

---

## Member 1 (M1) — Project Setup & Foundation
**Status:** ✅ Completed  

### Features Implemented
- Initialized project using **Vite + React + Tailwind CSS**
- Configured **Supabase JS client** and environment variables (`.env`)
- Implemented routing using **React Router**
- Added **ProtectedRoute** for access control
- Created placeholder pages:
  - Home, Admin, Employees, Departments, Jobs, Deleted Items, Auth Callback

### Security & Workflow
- Enabled **GitHub branch protection**
  - Protected `dev` and `main`
  - Disabled direct pushes
- Added pull request (PR) template

### Project Setup
- Organized scalable project structure
- Installed dependencies and configured Tailwind CSS

### PRs
- **PR-01**: Initial project scaffold  
- **PR-02**: Supabase client initialization  
- **PR-03**: Routing and protected routes setup  
- **PR-04**: Branch protection configuration  

---

## Member 2 (M2) — UI & Authentication
**Status:** ✅ Completed  

### Features Implemented

#### Login Page
- Email/password authentication
- Google OAuth sign-in
- Input validation and error handling

#### Register Page
- Fields: First Name, Last Name, Username, Email, Password
- Google OAuth registration

#### Application Layout
- Navbar with logged-in user display
- Logout functionality

#### Navigation Sidebar (HR Modules)
- Employees  
- Job History  
- Jobs  
- Departments  
- Admin  
- Deleted Items *(visibility logic pending)*  

#### OAuth Callback
- `/auth/callback` page
- Loading state during session initialization

#### Responsive Design
- Optimized for mobile and desktop

### Notes
- Admin and Deleted Items visibility logic will be implemented in **Sprint 2**

### PRs
- **PR-01**: Login page (email/password + Google OAuth)  
- **PR-02**: Registration page with validation  
- **PR-03**: App shell (navbar, sidebar, layout)  
- **PR-04**: Auth callback page  

---

## Member 3 (M3) — Backend & Database
**Date Completed:** April 5, 2026  
**Status:** ✅ Completed  

### Features Implemented

#### Database Initialization
- Executed HopeDB schema:
  - employee (31 records)  
  - department (8 records)  
  - job (14 records)  
  - jobHistory (54 records)  

#### Access Control System
- Created and seeded:
  - user, module, user_module, rights tables
- Implemented role-based access structure

#### Record Enhancements
- Added `record_status` (default: ACTIVE)
- Added audit/stamp columns to:
  - employee, jobHistory, job, department

#### Modules & Rights
- Seeded **5 modules** and **17 rights**:
  - Emp_Mod, JH_Mod, Job_Mod, Dept_Mod, Adm_Mod

#### Super Admin
- Created SUPERADMIN user:
  - `joesperanza@neu.edu.ph`
- Granted full access (17 rights)

#### File Organization
- SQL scripts stored in `/db/migrations`
- Followed sequential naming convention

#### Documentation
- ERD diagram added to `/docs`

### PRs
- **PR-01**: Initial database schema  
- **PR-02**: Rights and seed scripts  
- **PR-03**: ERD documentation  
- **PR-04**: Data verification queries  

---

## ✅ Final Summary

All Sprint 1 milestones (**M1–M3**) were successfully completed.

The system now includes:
- A fully functional **frontend UI**
- **Authentication system** with Supabase and OAuth
- Structured **routing and layout**
- A complete **backend database with seeded data**
- **Role-based access control system**
- Proper **documentation and development workflow**

This establishes a solid foundation for **Sprint 2**, focusing on feature expansion and business logic implementation.
