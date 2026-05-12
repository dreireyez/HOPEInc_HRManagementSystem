# HopeHRS Design Elements & UI Guidelines

This document catalogs the primary UI elements, styles, and behaviors used across the HopeHRS application.

## 1. Global Aesthetics & Surfaces
- **Card Containers**: We use semi-transparent surface containers such as `bg-[rgba(255,255,255,0.84)]` and `bg-[rgba(248,251,255,0.96)]` to create a layered, frosted effect.
- **Shadows**: Custom shadow definitions are heavily utilized:
  - `shadow-inset`: Used for recessed areas, pills, and loading skeletons.
  - `shadow-outset-soft`: Used for elevated elements, buttons, and primary icon containers.
- **Typography**: 
  - Main headings use high-contrast dark colors (`text-[var(--color-on-surface)]`) with tight tracking (`tracking-tight`).
  - Metadata, dates, and IDs utilize uppercase monospace typography with wide tracking (`tracking-[0.24em]`) for technical emphasis.

## 2. Interactive List Elements
- **Interactive Surfaces**: Clickable or focusable list items (like the Recent Hires or Activity Logs) utilize the `interactive-surface` class.
- **Alternating Backgrounds**: To ensure high readability, lists utilize `odd:bg-[rgba(255,255,255,0.96)]` and `even:bg-[rgba(245,248,252,0.94)]`.

## 3. Avatars & Icons
- **Primary Gradient Bubbles**: Profile initials and standard icons are placed inside rounded containers with the `gradient-primary` class.
- **Material Symbols**: We utilize Google Material Symbols Outlined, occasionally forcing the solid fill variant using inline styles (`fontVariationSettings: "'FILL' 1"`).

## 4. RBAC Layout Behavior
- **Dynamic Grids**: The grid layouts scale dynamically based on the active user's role.
- **Example (Dashboard)**:
  - **ADMIN/SUPERADMIN**: The grid allocates 8 columns (`lg:col-span-8`) for the "Recent Hires" module, leaving 4 columns (`lg:col-span-4`) for the exclusive "Activity Logs" widget.
  - **USER**: The grid shifts gracefully, allocating all 12 columns (`lg:col-span-12`) for the "Recent Hires" module to prevent empty space.
