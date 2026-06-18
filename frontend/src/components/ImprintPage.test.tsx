import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ImprintPage } from './ImprintPage'
import { describe, expect, it, spyOn, afterEach, beforeEach } from 'bun:test'

describe('ImprintPage', () => {
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
        <ImprintPage />
      </MemoryRouter>
    )

    expect(screen.getByText('Imprint')).toBeInTheDocument()
  })

  it('shows the name "Benjamin Klein"', () => {
    render(
      <MemoryRouter>
        <ImprintPage />
      </MemoryRouter>
    )

    expect(screen.getByText('Benjamin Klein')).toBeInTheDocument()
  })

  it('shows the VAT ID', () => {
    render(
      <MemoryRouter>
        <ImprintPage />
      </MemoryRouter>
    )

    expect(screen.getByText('DE328705890')).toBeInTheDocument()
  })

  it('shows the email address', () => {
    render(
      <MemoryRouter>
        <ImprintPage />
      </MemoryRouter>
    )

    expect(screen.getByText('bk@itws.de')).toBeInTheDocument()
  })
})
