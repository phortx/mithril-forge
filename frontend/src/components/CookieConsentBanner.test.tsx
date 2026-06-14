import { render } from '@testing-library/react'
import { describe, expect, it, mock, jest } from 'bun:test'

const runMock = jest.fn()
mock.module('vanilla-cookieconsent', () => {
  return {
    run: runMock,
  }
})

// Import after the mock
import { CookieConsentBanner } from './CookieConsentBanner'

describe('CookieConsentBanner', () => {
  it('calls CookieConsent.run with expected configuration on mount', () => {
    render(<CookieConsentBanner />)
    
    expect(runMock).toHaveBeenCalled()
    
    const runCallArg = runMock.mock.calls[0][0]
    expect(runCallArg.categories).toHaveProperty('necessary')
    expect(runCallArg.categories.necessary.enabled).toBe(true)
    expect(runCallArg.categories.necessary.readOnly).toBe(true)
    expect(runCallArg.categories).toHaveProperty('analytics')
    expect(runCallArg.categories.analytics.enabled).toBe(false)
    
    expect(runCallArg.language.default).toBe('de')
    expect(runCallArg.language.translations.de.consentModal).toBeDefined()
    expect(runCallArg.language.translations.de.preferencesModal).toBeDefined()
  })
})
