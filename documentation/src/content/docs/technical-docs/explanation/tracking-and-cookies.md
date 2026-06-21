---
title: Authentication, cookies, and security
description: How Mithril Forge handles identity, data storage, and user consent.
---

## Accounts and access

- **Optional accounts**: Accounts exist for specific features, but they are not mandatory. You can load the application and manage encounters without logging in, though you will miss out on account-specific features.
- **No strict boundaries**: There is no security boundary between the DM and Player views. Players opening the DM view URL can see hidden data. The application assumes you control both screens physically.

## CSRF protection

Spring Security's CSRF filter is disabled in `SecurityConfig.kt` on purpose. The app uses cookie-based sessions (`session_token`) and defends against CSRF in two places:

- The session cookie is set `SameSite=Strict` on every login response in `SessionsController.kt`. A `SameSite=Strict` cookie is not sent on cross-site requests, which blocks CSRF on authenticated write endpoints like `DELETE /api/session` and admin writes. Browsers treat `SameSite=Strict` as a complete CSRF mitigation.
- Unauthenticated writes (login, signup) cannot rely on the session cookie, since none exists yet. `POST /api/session`, `POST /api/users`, and `POST /api/users/confirm` are handled by `OriginCheckFilter`, which checks the `Origin` header against an allow-list and falls back to `Referer` if `Origin` is missing. Requests with neither header are rejected.

The allow-list mirrors `CorsConfig.kt`: `https://*.mithril-forge.site`, `https://mithril-forge.site`, and `http://localhost:*` for local development. If you add a new origin, update both places.

### Why no CSRF tokens

The SPA serves itself from the same Spring Boot origin in production, and auth is cookie-only. A CSRF token endpoint with a double-submit cookie would duplicate what `SameSite=Strict` already does for the authenticated surface, while adding plumbing across the frontend and backend. Non-cookie auth (Bearer/Authorization header, e.g. for a mobile client) is not CSRF-vulnerable, so adding that later would also remove the need for CSRF tokens.

## Local storage

- **Sync mechanism**: The active encounter state lives in `localStorage`. Updates trigger `storage` events to sync the DM and Player tabs.
- **Consent classification**: The cookie banner classifies `localStorage` usage as `necessary`.

## Analytics and consent

- **Opt-in tracking**: We use PostHog for analytics. Users must explicitly opt in.
- **Banner**: Uses `vanilla-cookieconsent`. It offers `necessary` (forced on) and `analytics` (off by default) categories.
- **Initialization**: PostHog starts in `main.tsx` with `opt_out_capturing_by_default: true`.
- **Toggle**: Accepting analytics calls `posthog.opt_in_capturing()`. Revoking it calls `posthog.opt_out_capturing()`.
- **Ad blockers**: We proxy PostHog traffic through the Spring Boot backend (`/t/**`) to bypass blockers and avoid DNS CNAME setup.
