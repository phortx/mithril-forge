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
        default: 'de',
        translations: {
          de: {
            consentModal: {
              title: 'Wir nutzen Cookies',
              description:
                'Mithril Forge nutzt Local Storage für die Kernfunktionen (Encounter State). Zusätzlich möchten wir gerne anonymisierte Analysedaten (PostHog) erheben, um die App zu verbessern.',
              acceptAllBtn: 'Alle akzeptieren',
              acceptNecessaryBtn: 'Nur notwendige',
              showPreferencesBtn: 'Einstellungen verwalten',
            },
            preferencesModal: {
              title: 'Cookie-Einstellungen',
              acceptAllBtn: 'Alle akzeptieren',
              acceptNecessaryBtn: 'Nur notwendige',
              savePreferencesBtn: 'Einstellungen speichern',
              closeIconLabel: 'Schließen',
              sections: [
                {
                  title: 'Cookie-Nutzung',
                  description: 'Hier kannst du entscheiden, welche Daten wir speichern dürfen.',
                },
                {
                  title: 'Technisch notwendig',
                  description:
                    'Diese Speicherung (Local Storage) ist zwingend erforderlich, damit Mithril Forge deine Encounter laden und lokal im Browser speichern kann.',
                  linkedCategory: 'necessary',
                },
                {
                  title: 'Analytics & Tracking',
                  description:
                    'Wir nutzen PostHog, um anonymisiert zu verstehen, wie Mithril Forge genutzt wird. Das hilft uns bei der Weiterentwicklung.',
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
