import { render } from '@testing-library/react'
import { describe, expect, it, mock, jest, beforeEach } from 'bun:test'

const runMock = jest.fn()
mock.module('vanilla-cookieconsent', () => {
  return {
    run: runMock,
  }
})

const posthogOptInMock = jest.fn()
const posthogOptOutMock = jest.fn()
mock.module('posthog-js', () => {
  return {
    default: {
      opt_in_capturing: posthogOptInMock,
      opt_out_capturing: posthogOptOutMock,
    }
  }
})

// Import after the mock
import { CookieConsentBanner } from './CookieConsentBanner'

describe('CookieConsentBanner', () => {
  beforeEach(() => {
    runMock.mockClear()
    posthogOptInMock.mockClear()
    posthogOptOutMock.mockClear()
  })

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

  it('opts in to posthog when analytics is accepted', () => {
    render(<CookieConsentBanner />)
    const runCallArg = runMock.mock.calls[0][0]
    
    // Simulate consent for analytics
    runCallArg.onConsent({ cookie: { categories: ['necessary', 'analytics'] } })
    expect(posthogOptInMock).toHaveBeenCalled()
    expect(posthogOptOutMock).not.toHaveBeenCalled()
  })

  it('opts out of posthog when analytics is rejected', () => {
    render(<CookieConsentBanner />)
    const runCallArg = runMock.mock.calls[0][0]
    
    // Simulate consent change to reject analytics
    runCallArg.onChange({ cookie: { categories: ['necessary'] } })
    expect(posthogOptOutMock).toHaveBeenCalled()
    
    // Simulate consent change to accept analytics
    runCallArg.onChange({ cookie: { categories: ['necessary', 'analytics'] } })
    expect(posthogOptInMock).toHaveBeenCalled()
  })
})
