import { useEffect } from 'react'
import * as CookieConsent from 'vanilla-cookieconsent'
import posthog from 'posthog-js'

export function CookieConsentBanner() {
  useEffect(() => {
    CookieConsent.run({
      categories: {
        necessary: {
          enabled: true,
          readOnly: true,
        },
        analytics: {
          enabled: false,
        },
      },

      onConsent: ({ cookie }) => {
        if (cookie.categories.includes('analytics')) {
          posthog.opt_in_capturing()
        }
      },
      onChange: ({ cookie }) => {
        if (cookie.categories.includes('analytics')) {
          posthog.opt_in_capturing()
        } else {
          posthog.opt_out_capturing()
        }
      },

      language: {
        default: 'en',
        translations: {
          en: {
            consentModal: {
              title: 'We use cookies',
              description:
                'Mithril Forge uses Local Storage for core functionality (encounter state). We would also like to collect anonymous analytics data (PostHog) to help improve the app.',
              acceptAllBtn: 'Accept all',
              acceptNecessaryBtn: 'Necessary only',
              showPreferencesBtn: 'Manage preferences',
            },
            preferencesModal: {
              title: 'Cookie preferences',
              acceptAllBtn: 'Accept all',
              acceptNecessaryBtn: 'Necessary only',
              savePreferencesBtn: 'Save preferences',
              closeIconLabel: 'Close',
              sections: [
                {
                  title: 'Cookie usage',
                  description: 'Here you can choose which data we are allowed to store.',
                },
                {
                  title: 'Strictly necessary',
                  description:
                    'This storage (Local Storage) is required for Mithril Forge to load and save your encounters locally in the browser.',
                  linkedCategory: 'necessary',
                },
                {
                  title: 'Analytics & Tracking',
                  description:
                    'We use PostHog to anonymously understand how Mithril Forge is used. This helps us improve the app.',
                  linkedCategory: 'analytics',
                },
              ],
            },
          },
        },
      },
    })
  }, [])

  return null
}
