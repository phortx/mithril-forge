---
title: Authentication, cookies, and security
description: How Mithril Forge handles identity, data storage, and user consent.
---

## Accounts and access

- **Optional accounts**: Accounts exist for specific features, but they are not mandatory. You can load the application and manage encounters without logging in, though you will miss out on account-specific features.
- **No strict boundaries**: There is no security boundary between the DM and Player views. Players opening the DM view URL can see hidden data. The application assumes you control both screens physically.

## Local storage

- **Sync mechanism**: The active encounter state lives in `localStorage`. Updates trigger `storage` events to sync the DM and Player tabs.
- **Consent classification**: The cookie banner classifies `localStorage` usage as `necessary`.

## Analytics and consent

- **Opt-in tracking**: We use PostHog for analytics. Users must explicitly opt in.
- **Banner**: Uses `vanilla-cookieconsent`. It offers `necessary` (forced on) and `analytics` (off by default) categories.
- **Initialization**: PostHog starts in `main.tsx` with `opt_out_capturing_by_default: true`.
- **Toggle**: Accepting analytics calls `posthog.opt_in_capturing()`. Revoking it calls `posthog.opt_out_capturing()`.
- **Ad blockers**: We proxy PostHog traffic through the Spring Boot backend (`/t/**`) to bypass blockers and avoid DNS CNAME setup.
