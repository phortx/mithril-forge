---
title: Admin Interface (Refine)
description: Technical overview of the Mithril Forge admin interface built with Refine.
---

# Admin Interface

Mithril Forge uses [Refine](https://refine.dev/) for its internal admin interface. This allows for rapid development of CRUD (Create, Read, Update, Delete) operations and management screens for administrative tasks.

## Why Refine?

Since the Mithril Forge backend uses **JetBrains Exposed** as its ORM, traditional Spring Boot admin generators (which usually rely heavily on Spring Data JPA/Hibernate) do not work out of the box.

Instead, we opted for a frontend-driven admin approach:

- **Headless UI:** Refine seamlessly integrates with our existing Tailwind CSS v4 setup.
- **React-Native:** It builds directly on top of our React 19 / Vite 8 stack.
- **Custom Backend Provider:** Refine communicates with standard REST endpoints that we expose specifically for administrative purposes via our Kotlin/Spring Boot backend.

## Integration Details

- **Location:** The admin interface lives at `/admin/*` inside the existing React SPA. The route is mounted lazily so the Refine/Recharts bundles are not loaded for regular DM or Player sessions.
- **Authentication:** Access requires the `ROLE_ADMIN` role. See [Roles and Admin access](roles-and-admin) for how to grant or revoke it.
- **API Communication:** A custom `fetch`-based `adminDataProvider` talks to the Spring Boot endpoints under `/api/admin/*`. Cookies (`session_token`) are sent automatically with `credentials: 'include'`.

## MVP Dashboard

The current scope of `/admin` is intentionally narrow:

- **KPI cards**: total registered users, verified count (with percentage), unverified count.
- **Growth chart**: registrations per day for the last 30 days, zero-filled for days without signups.

Both visuals are powered by the same endpoint:

```
GET /api/admin/users/stats
```

The endpoint also exposes `GET /api/admin/users` with simple page/size pagination, ready for a future users table.

## Backend filter chain

`SecurityConfig` requires `hasRole("ADMIN")` for `/api/admin/**`. Authentication itself is driven by the `session_token` cookie — a small `SessionTokenAuthFilter` decodes the JWT, loads the user, and sets the role on the Spring `SecurityContext`.

## Future Development

- Users table with edit/disable/delete actions
- Audit log of admin actions
- Bulk invitations
- Additional resources (e.g. sessions, support tickets)
