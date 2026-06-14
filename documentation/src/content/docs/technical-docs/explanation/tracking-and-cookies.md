---
title: Tracking and cookies
description: How Mithril Forge handles analytics and user consent.
---

Mithril Forge uses PostHog to collect usage data. PostHog tracks unique user sessions and processes IP addresses. Since we do not want to collect data without permission, and because privacy laws require explicit consent, we ask users before we track them.

## The cookie banner

We use Vanilla CookieConsent to handle user permissions. The banner appears when a person visits the app for the first time. It offers two categories:

1. Necessary: This covers local storage for the encounter state. Users cannot opt out of this category because the app needs local storage to save data.
2. Analytics: This covers PostHog tracking. It is disabled by default.

## How the integration works

We initialize PostHog in the main application file. We pass the `opt_out_capturing_by_default: true` flag in the configuration object. This forces PostHog to stay dormant. It will not set cookies or send events.

The consent banner component handles the rest of the logic. When a user interacts with the banner, the component triggers specific callbacks.

If the user accepts the analytics category, the callback runs `posthog.opt_in_capturing()`. PostHog wakes up and begins tracking the session.

If the user declines the analytics category or revokes their consent later, the callback runs `posthog.opt_out_capturing()`. PostHog immediately stops tracking and clears its cookies.

## Development

You need two environment variables to make PostHog work:

- `VITE_PUBLIC_POSTHOG_KEY`: The public API key for the project.
- `VITE_PUBLIC_POSTHOG_HOST`: The URL of your PostHog instance.

When you build new interactive features, you should record the interaction. You do this by calling `posthog.capture()` with an event name and any relevant properties.
