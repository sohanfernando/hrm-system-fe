# HRM System — Frontend

Next.js + Tailwind CSS frontend for the HRM System hiring task, talking to the FastAPI backend in
`hrm-system-be`.

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Styling:** Tailwind CSS v3 (classic `tailwind.config.ts` with an extended theme)
- **Auth:** JWT issued by the backend, kept in a cookie so route protection can run in middleware
- **State:** React context (`AuthProvider`) for the current user; plain `useState`/`fetch` per page —
  no extra data-fetching or form libraries

## Folder Structure

```
src/
  app/               # routes (App Router)
    login/
    register/
    dashboard/
    departments/
    positions/
    employees/
      new/           # onboarding page (details form + document upload)
      [id]/          # employee detail/edit + documents
    payroll/
  components/
    ui/              # Button, Input, Select, Table, Modal, Card, FileUpload, StatusBadge, ...
    layout/          # Sidebar, Navbar, DashboardLayout, AuthLayout
    providers/       # AuthProvider (current user, login/register/logout)
    departments/ positions/ employees/ payroll/ dashboard/
                     # module-specific form modals / sections
  lib/
    api.ts           # typed fetch client (one export per backend module)
    auth.ts          # token/user storage helpers
  types/             # TypeScript types mirroring the backend's DTOs
  proxy.ts           # route-protection middleware (Next.js "proxy" convention)
```

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables**

   ```bash
   copy .env.example .env.local    # Windows
   # cp .env.example .env.local    # macOS/Linux
   ```

   | Variable | Description |
   |---|---|
   | `NEXT_PUBLIC_API_URL` | Base URL of the running backend, e.g. `http://127.0.0.1:8000` |

3. **Make sure the backend is running** (see `hrm-system-be/README.md`) — this app has no data of
   its own; every screen is backed by live API calls.

4. **Run the dev server**

   ```bash
   npm run dev
   ```

   Open `http://localhost:3000`.

5. **Production build** (optional)

   ```bash
   npm run build
   npm start
   ```

## Authentication & Route Protection

- The JWT returned by `/auth/login` or `/auth/register` is stored in a cookie (`hrm_token`) rather
  than `localStorage`, so `src/proxy.ts` (Next.js middleware) can read it and redirect
  unauthenticated visitors away from `/dashboard`, `/departments`, `/positions`, `/employees`, and
  `/payroll` before the page ever renders. `AuthProvider` adds a client-side safety net for the case
  where the token is invalidated mid-session (e.g. a `401` from an API call).
- The register form has no role selector by design — a caller can never choose their own role. The
  backend auto-promotes the very first registered account to `ADMIN`; every account after that
  registers as `HR`. See the backend README for details and how to provision additional `ADMIN`
  accounts.
- `ADMIN` vs `HR` is reflected in the UI: both roles can create/update records, but **Delete**
  buttons only render for `ADMIN` users, matching the backend's authorization rules.

## Screens

| Screen | Route |
|---|---|
| Login | `/login` |
| Register | `/register` |
| Dashboard | `/dashboard` |
| Departments | `/departments` |
| Positions | `/positions` |
| Employees (list) | `/employees` |
| Employee Onboarding (details + document upload) | `/employees/new` |
| Employee Detail (edit + documents) | `/employees/[id]` |
| Payroll | `/payroll` |

## Coding Standards Followed

- No inline `style={{ }}` anywhere — all styling is Tailwind utility classes.
- Reusable UI primitives (`Button`, `Input`, `Select`, `Table`, `Modal`, `Card`, `FileUpload`,
  `StatusBadge`, `FormWrapper`, plus `Textarea`, `Alert`, `Spinner`, `EmptyState`, `Pagination`,
  `ConfirmDialog`, `PageHeader`) live in `components/ui/`, each in its own file.
- `tailwind.config.ts` extends `theme.colors`, `fontSize`, `spacing`, `borderRadius`, and `boxShadow`
  with named tokens (`primary`, `success`, `heading`, `card`, etc.) instead of hardcoding values in
  components.
- Every API-driven screen handles loading (`Spinner`/skeleton row), empty (`EmptyState`), success,
  and error (`Alert`) states.
- Employee document upload validates file type (`.pdf`, `.jpg`, `.jpeg`, `.png`) and size (5 MB) on
  the client before upload, in addition to the backend's own validation.

## Notes

- `npm run build` and `npm run lint` both pass clean (zero errors/warnings) as of this write-up.
- No test suite is included; the app was manually verified end-to-end against the live backend
  (auth, all five CRUD modules, document upload/download/delete, and dashboard aggregation).
