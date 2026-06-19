---
title: Roles and Admin access
description: How Mithril Forge's role model works and how to grant or revoke admin access.
---

# Roles and Admin access

Mithril Forge uses a simple role-based access control stored in the `users.role` column. Two roles are recognised today:

- `ROLE_USER` (default for every signup)
- `ROLE_ADMIN` (grants access to the `/admin` interface and `/api/admin/**` endpoints)

The value is stored **with** the `ROLE_` prefix in the database (Spring Security convention).

## How access is enforced

Two layers defend admin-only endpoints:

1. **Backend filter chain** — `SecurityConfig` requires `hasRole("ADMIN")` for `/api/admin/**`. A request without a valid `session_token` cookie, with an unknown user, or with `ROLE_USER` receives `403 Forbidden`.
2. **Frontend guard** — `<AdminGuard>` probes `/api/admin/users/stats` on mount. If the response is not `2xx`, the user is redirected to `/login?redirect=/admin`.

Only the app owner (or a delegated operator) should carry `ROLE_ADMIN`.

## How to grant admin access

The intended workflow is a one-off SQL update against the production database. Use the Postgres console of your environment (Railway, local Docker, etc.).

```sql
UPDATE users
SET    role = 'ROLE_ADMIN',
       updated_at = NOW()
WHERE  email = '[email protected]'
  AND  role <> 'ROLE_ADMIN';
```

The `AND role <> 'ROLE_ADMIN'` guard keeps the statement idempotent — re-running it is safe.

### Locally (development stack)

```sh
docker compose exec postgres psql -U myuser -d mydatabase \
  -c "UPDATE users SET role = 'ROLE_ADMIN', updated_at = NOW() \
      WHERE email = '[email protected]' AND role <> 'ROLE_ADMIN';"
```

### Railway (production)

1. Open the project on Railway.
2. Open the Postgres service → **Data** → **Query**.
3. Paste the SQL above, replace the email.
4. Run once. The change is immediate; the affected user can refresh `/admin` after reloading the page (the existing session already carries the new role because `SessionTokenAuthFilter` reads roles fresh from the DB on every request).

## How to revoke admin access

```sql
UPDATE users
SET    role = 'ROLE_USER',
       updated_at = NOW()
WHERE  email = '[email protected]'
  AND  role <> 'ROLE_USER';
```

The next request from that user will be rejected with `403`.

## Auditing who is admin

```sql
SELECT id, email, role, created_at, last_login_at
FROM   users
WHERE  role = 'ROLE_ADMIN'
ORDER  BY created_at DESC;
```

Run this periodically to verify only intended operators have elevated privileges.

## Future work

- Self-service role changes via the admin UI
- Audit log of admin actions
- Multi-role support (e.g. `ROLE_SUPPORT` with limited privileges)
