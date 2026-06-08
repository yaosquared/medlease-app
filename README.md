# MedLease Frontend

## Description

A web application for managing medical equipment leasing operations — handling lease contracts, equipment listings, payments, and multi-organization user management across vendor and clinic organizations.

## Tech Stack

| Tool         | Version | Purpose                    |
| ------------ | ------- | -------------------------- |
| Vue 3        | ^3.5    | UI framework               |
| Vite         | ^8.0    | Build tool & dev server    |
| Vue Router   | ^5.0    | Client-side routing        |
| Pinia        | ^3.0    | State management           |
| Pinia Colada | ^1.3    | Async query/mutation layer |
| Nuxt UI      | ^4.8    | UI component library       |
| Tailwind CSS | ^4.3    | Utility-first styling      |
| Axios        | ^1.16   | HTTP client                |
| Zod          | ^4.4    | Schema validation          |
| TypeScript   | ~6.0    | Type safety                |

## Requirements

- Node.js `^20.19.0` or `>=22.12.0`

## Environment Variables

Create a `.env` file at the project root:

```env
VITE_API_URL=https://localhost:7098

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

## Pages & Routing

### Public (no login required)

| Route       | Description                       |
| ----------- | --------------------------------- |
| `/login`    | Login page                        |
| `/register` | Organization + admin registration |

### Super Admin

| Route                | Description                                                      |
| -------------------- | ---------------------------------------------------------------- |
| `/dashboard`         | Overview stats (organizations, approvals, leases, payments)      |
| `/organizations`     | All organizations with tabs: All / Pending / Verified / Rejected |
| `/organizations/:id` | Organization detail — approve or reject with reason              |
| `/users`             | All users across all organizations                               |
| `/profile`           | View/edit own profile, change password                           |

### OrgAdmin (Vendor & Clinic)

| Route           | Description                                                      |
| --------------- | ---------------------------------------------------------------- |
| `/dashboard`    | Organization-scoped stats (leases, payments, equipment)          |
| `/organization` | View/edit own organization info                                  |
| `/users`        | Users in own org — add Staff/Viewer, deactivate                  |
| `/equipments`   | _(Vendor only)_ List, add, edit equipment                        |
| `/contracts`    | Contracts — approve/complete (Vendor) or create request (Clinic) |
| `/payments`     | Payments — confirm received (Vendor)                             |
| `/profile`      | View/edit own profile, change password                           |

### Staff (Vendor & Clinic)

| Route         | Description                                                                   |
| ------------- | ----------------------------------------------------------------------------- |
| `/dashboard`  | Org-scoped stats (contracts, payments, equipment)                             |
| `/equipments` | Equipment list — add/edit (Vendor Staff); browse/lease request (Clinic Staff) |
| `/contracts`  | View contracts and history (read-only for both Staff roles)                   |
| `/payments`   | View payments (Vendor Staff); record payment (Clinic Staff)                   |
| `/profile`    | View/edit own profile, change password                                        |

### Viewer

| Route         | Description                           |
| ------------- | ------------------------------------- |
| `/dashboard`  | Landing page (no content widgets)     |
| `/equipments` | Browse and view equipment (read-only) |

## Authentication

The app uses JWT-based auth with access + refresh tokens.

- Access token is stored in the Pinia auth store (in memory).
- Refresh token is used via `POST /api/auth/refresh` to obtain a new access token.
- Axios request interceptors automatically attach the JWT Bearer token to every request.
- Vue Router navigation guards enforce role-based access (`SuperAdmin` / `OrgAdmin` / `Staff` / `Viewer`) using route metadata (`requiresAuth`, `roles[]`).
