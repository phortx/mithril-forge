---
title: Tracking and cookies
description: How Mithril Forge handles analytics and user consent.
---

Mithril Forge uses PostHog for analytics. We only track users who give explicit permission.

## Cookie consent

The app uses Vanilla CookieConsent. New visitors see a banner with two choices:

1. Necessary: Saves the encounter state in local storage. This is required for the app to function.
2. Analytics: Enables PostHog tracking. This is off by default.

## Integration details

PostHog is initialized in the main application file with `opt_out_capturing_by_default: true`. It stays completely dormant until the user opts in.

The banner component handles the state changes. If a user accepts analytics, we call `posthog.opt_in_capturing()`, and tracking begins. If they decline or revoke consent later, we call `posthog.opt_out_capturing()` to stop tracking and clear the cookies.

## Development setup

PostHog requires two environment variables:

- `VITE_PUBLIC_POSTHOG_KEY`: The project API key.
- `VITE_PUBLIC_POSTHOG_HOST`: The PostHog instance URL.

To track new interactive features, call `posthog.capture()` with the event name and relevant properties.

## Bypassing ad blockers

Many ad blockers block tracking scripts even if you use a custom CNAME, because they uncloak the DNS record. To prevent this, Mithril Forge proxies all PostHog traffic through its own Spring Boot backend at `/t/**`. The frontend connects directly to this internal route (`api_host: '/t'`). This hides the traffic from blocklists and removes the need for DNS CNAME setup.
