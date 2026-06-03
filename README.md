# MedLease Frontend

## Description

A web application for managing medical equipment leasing operations — handling lease contracts, equipment listings, payments, and multi-organization user management across vendor and clinic organizations.

## Tech Stack

| Tool          | Version | Purpose                    |
| ------------- | ------- | -------------------------- |
| Vue 3         | ^3.5    | UI framework               |
| Vite          | ^8.0    | Build tool & dev server    |
| Vue Router    | ^5.0    | Client-side routing        |
| Pinia         | ^3.0    | State management           |
| @pinia/colada | ^1.3    | Async query/mutation layer |
| @nuxt/ui      | ^4.8    | UI component library       |
| Tailwind CSS  | ^4.3    | Utility-first styling      |
| Reka UI       | ^2.9    | Headless UI primitives     |
| Axios         | ^1.16   | HTTP client                |
| Zod           | ^4.4    | Schema validation          |
| jwt-decode    | ^4.0    | JWT token parsing          |
| VueUse        | ^14.3   | Composable utilities       |
| TypeScript    | ~6.0    | Type safety                |

## Requirements

- Node.js `^20.19.0` or `>=22.12.0`

## Environment Variables

Create a `.env` file at the project root:

```env
VITE_API_URL=http://localhost:5000

```

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```

## Pages & Routing

### Public (no login required)

| Route       | Description                       |
| ----------- | --------------------------------- |
| `/login`    | Login page                        |
| `/register` | Organization + admin registration |

### Super Admin

| Route                | Description                                             |
| -------------------- | ------------------------------------------------------- |
| `/dashboard`         | Overview stats (orgs, approvals, leases, payments)      |
| `/organizations`     | All orgs with tabs: All / Pending / Verified / Rejected |
| `/organizations/:id` | Org detail — approve or reject with reason              |
| `/users`             | All users across all organizations                      |
| `/profile`           | View/edit own profile, change password                  |

### OrgAdmin (Vendor & Clinic)

| Route           | Description                                                      |
| --------------- | ---------------------------------------------------------------- |
| `/dashboard`    | Org-scoped stats (leases, payments, equipment)                   |
| `/organization` | View/edit own org info                                           |
| `/users`        | Users in own org — add Staff/Viewer, deactivate                  |
| `/equipment`    | _(Vendor only)_ List, add, edit equipment                        |
| `/contracts`    | Contracts — approve/complete (Vendor) or create request (Clinic) |
| `/payments`     | Payments — confirm received (Vendor)                             |
| `/profile`      | View/edit own profile, change password                           |

## Authentication

The app uses JWT-based auth with access + refresh tokens.

- Access token is stored in memory (Pinia store).
- Refresh token is persisted (cookie or localStorage) and used via `POST /api/auth/refresh`.
- Axios interceptors handle automatic token refresh on 401 responses.
- Route guards in Vue Router enforce role-based access (SuperAdmin / OrgAdmin / Staff / Viewer).
