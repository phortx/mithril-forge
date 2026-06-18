import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { PrivacyPolicyPage } from './PrivacyPolicyPage'
import { describe, expect, it, spyOn, afterEach, beforeEach } from 'bun:test'

describe('PrivacyPolicyPage', () => {
  let mockFetch: ReturnType<typeof spyOn>

  beforeEach(() => {
    mockFetch = spyOn(globalThis, 'fetch').mockImplementation((() => {
      return Promise.resolve(new Response(JSON.stringify({}), { status: 400 }))
    }) as unknown as typeof fetch)
  })

  afterEach(() => {
    mockFetch.mockRestore()
    localStorage.clear()
  })

  it('renders the page title', () => {
    render(
      <MemoryRouter>
        <PrivacyPolicyPage />
      </MemoryRouter>
    )

    expect(screen.getByText('Privacy Policy')).toBeInTheDocument()
  })

  it('shows the controller name "Benjamin Klein"', () => {
    render(
      <MemoryRouter>
        <PrivacyPolicyPage />
      </MemoryRouter>
    )

    expect(screen.getByText(/Benjamin Klein/)).toBeInTheDocument()
  })

  it('shows the email address as a mailto link', () => {
    render(
      <MemoryRouter>
        <PrivacyPolicyPage />
      </MemoryRouter>
    )

    const emailLinks = screen.getAllByText('bk@itws.de')
    expect(emailLinks.length).toBeGreaterThan(0)
    expect(emailLinks[0].closest('a')).toHaveAttribute('href', 'mailto:bk@itws.de')
  })

  it('mentions PostHog', () => {
    render(
      <MemoryRouter>
        <PrivacyPolicyPage />
      </MemoryRouter>
    )

    expect(screen.getAllByText(/PostHog/).length).toBeGreaterThan(0)
  })

  it('mentions GDPR rights', () => {
    render(
      <MemoryRouter>
        <PrivacyPolicyPage />
      </MemoryRouter>
    )

    expect(screen.getByText(/Your Rights/)).toBeInTheDocument()
  })
})
