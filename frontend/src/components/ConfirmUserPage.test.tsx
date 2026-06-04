import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ConfirmUserPage } from './ConfirmUserPage'
import { afterEach, beforeEach, describe, expect, it, jest } from 'bun:test'

const originalFetch = globalThis.fetch

describe('ConfirmUserPage', () => {
  let mockFetch: ReturnType<typeof jest.fn>

  beforeEach(() => {
    mockFetch = jest.fn((url: string | URL | Request) => {
      const urlStr = url.toString()
      if (urlStr.includes('/api/users/confirm')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ isConfirmed: "true" }),
        })
      }
      return Promise.resolve({ ok: false })
    })
    globalThis.fetch = mockFetch as unknown as typeof fetch
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  it('shows error and redirects to home if no token is provided', async () => {
    render(
      <MemoryRouter initialEntries={['/users/confirm']}>
        <Toaster />
        <Routes>
          <Route path="/users/confirm" element={<ConfirmUserPage />} />
          <Route path="/" element={<div data-testid="home-page">Home</div>} />
        </Routes>
      </MemoryRouter>
    )

    // Wait for the toast to appear
    expect(await screen.findByText('Kein Token in der Anfrage gefunden.')).toBeInTheDocument()
    
    // Wait for navigation to /
    expect(await screen.findByTestId('home-page')).toBeInTheDocument()
  })

  it('calls confirm API and shows success toast if token is valid', async () => {
    render(
      <MemoryRouter initialEntries={['/users/confirm?token=valid-token']}>
        <Toaster />
        <Routes>
          <Route path="/users/confirm" element={<ConfirmUserPage />} />
          <Route path="/" element={<div data-testid="home-page">Home</div>} />
        </Routes>
      </MemoryRouter>
    )

    // Wait for the API to be called
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled()
      // Check the URL has the correct token
      const callArgs = mockFetch.mock.calls[0]
      expect(callArgs[0]).toContain('token=valid-token')
      expect(callArgs[1].method).toBe('POST')
    })

    // Wait for the toast to appear
    expect(await screen.findByText('Konto erfolgreich bestätigt! Willkommen bei Mithril Forge!')).toBeInTheDocument()
    
    // Wait for navigation to /
    expect(await screen.findByTestId('home-page')).toBeInTheDocument()
  })

  it('shows error toast if API returns an error', async () => {
    mockFetch.mockImplementation((url: string | URL | Request) => {
      const urlStr = url.toString()
      if (urlStr.includes('/api/users/confirm')) {
        return Promise.resolve({
          ok: false,
          json: async () => ({ error: "token invalid" }),
        })
      }
      return Promise.resolve({ ok: false })
    })

    render(
      <MemoryRouter initialEntries={['/users/confirm?token=invalid-token']}>
        <Toaster />
        <Routes>
          <Route path="/users/confirm" element={<ConfirmUserPage />} />
          <Route path="/" element={<div data-testid="home-page">Home</div>} />
        </Routes>
      </MemoryRouter>
    )

    // Wait for the toast to appear
    expect(await screen.findByText('Fehler bei der Bestätigung: token invalid')).toBeInTheDocument()
    
    // Wait for navigation to /
    expect(await screen.findByTestId('home-page')).toBeInTheDocument()
  })

  it('shows network error toast if fetch throws', async () => {
    mockFetch.mockImplementation(() => Promise.reject(new Error('Network error')))

    render(
      <MemoryRouter initialEntries={['/users/confirm?token=some-token']}>
        <Toaster />
        <Routes>
          <Route path="/users/confirm" element={<ConfirmUserPage />} />
          <Route path="/" element={<div data-testid="home-page">Home</div>} />
        </Routes>
      </MemoryRouter>
    )

    // Wait for the toast to appear
    expect(await screen.findByText('Netzwerkfehler bei der Konto-Bestätigung.')).toBeInTheDocument()
    
    // Wait for navigation to /
    expect(await screen.findByTestId('home-page')).toBeInTheDocument()
  })
})
