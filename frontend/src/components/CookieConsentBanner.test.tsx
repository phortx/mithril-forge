import { render } from '@testing-library/react'
import { describe, expect, it, mock, jest, beforeEach } from 'bun:test'

const runMock = jest.fn()
mock.module('vanilla-cookieconsent', () => {
  return {
    run: runMock,
  }
})

import posthog from 'posthog-js'
import { CookieConsentBanner } from './CookieConsentBanner'

describe('CookieConsentBanner', () => {
  beforeEach(() => {
    runMock.mockClear()
    ;(posthog.opt_in_capturing as ReturnType<typeof mock>).mockClear()
    ;(posthog.opt_out_capturing as ReturnType<typeof mock>).mockClear()
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
    
    expect(runCallArg.language.default).toBe('en')
    expect(runCallArg.language.translations.en.consentModal).toBeDefined()
    expect(runCallArg.language.translations.en.preferencesModal).toBeDefined()
  })

  it('opts in to posthog when analytics is accepted', () => {
    render(<CookieConsentBanner />)
    const runCallArg = runMock.mock.calls[0][0]
    
    // Simulate consent for analytics
    runCallArg.onConsent({ cookie: { categories: ['necessary', 'analytics'] } })
    expect(posthog.opt_in_capturing).toHaveBeenCalled()
    expect(posthog.opt_out_capturing).not.toHaveBeenCalled()
  })

  it('opts out of posthog when analytics is rejected', () => {
    render(<CookieConsentBanner />)
    const runCallArg = runMock.mock.calls[0][0]
    
    // Simulate consent change to reject analytics
    runCallArg.onChange({ cookie: { categories: ['necessary'] } })
    expect(posthog.opt_out_capturing).toHaveBeenCalled()
    
    // Simulate consent change to accept analytics
    runCallArg.onChange({ cookie: { categories: ['necessary', 'analytics'] } })
    expect(posthog.opt_in_capturing).toHaveBeenCalled()
  })
})
