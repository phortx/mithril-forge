---
title: Tracking and cookies
description: How Mithril Forge handles analytics and user consent.
---

Mithril Forge uses PostHog for analytics. Only users who opt in are tracked.

## Cookie consent

The app uses [Vanilla Cookie Consent](https://cookieconsent.orestbida.com/) by Orest Bida (npm package: `vanilla-cookieconsent`). New visitors see a banner with two consent categories:

| Category    | Default             | Purpose                                                                                                   |
| ----------- | ------------------- | --------------------------------------------------------------------------------------------------------- |
| `necessary` | Enabled (read-only) | Local Storage for encounter state sync between DM and Player views. The app cannot function without this. |
| `analytics` | Disabled            | PostHog event tracking. Only activated when the user explicitly accepts.                                  |

The consent banner lives in `CookieConsentBanner.tsx`. It calls `CookieConsent.run()` inside a `useEffect` and returns `null` because the library manages its own DOM.

## Integration with PostHog

PostHog is initialized in `main.tsx` with `opt_out_capturing_by_default: true`, so it stays dormant until the user opts in.

The banner component toggles PostHog through two callbacks:

- `onConsent` runs on page load when a consent decision already exists (or on first visit after the user interacts with the banner). If the stored cookie includes `analytics`, it calls `posthog.opt_in_capturing()`.
- `onChange` runs when the user updates their preferences later, for example through the preferences modal. If `analytics` is now accepted, it calls `posthog.opt_in_capturing()`. If it was removed, it calls `posthog.opt_out_capturing()` to stop tracking and clear the cookies.

## Development setup

PostHog requires two environment variables:

- `VITE_PUBLIC_POSTHOG_KEY`: the project API key.
- `VITE_PUBLIC_POSTHOG_HOST`: the PostHog instance URL.

To track new interactive features, call `posthog.capture()` with the event name and relevant properties.

## Modifying the banner text

All wording for the banner and preferences modal is defined in the `language.translations` object inside `CookieConsentBanner.tsx`. The object has two sections: `consentModal` (title, description, button labels for the initial banner) and `preferencesModal` (title, section descriptions, button labels for the detailed view).

Edit the string values there and check the result in the browser.

## Bypassing ad blockers

Many ad blockers block tracking scripts even with a custom CNAME, because they uncloak the DNS record. Mithril Forge works around this by proxying all PostHog traffic through its Spring Boot backend at `/t/**`. The frontend points `api_host` at `/t`, which hides the traffic from blocklists and removes the need for DNS CNAME setup.
