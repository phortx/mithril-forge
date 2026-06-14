import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ConfirmUserPage } from './ConfirmUserPage'
import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test'
import toast from 'react-hot-toast'

describe('ConfirmUserPage', () => {
  let mockFetch: ReturnType<typeof spyOn>

  beforeEach(() => {
    mockFetch = spyOn(globalThis, 'fetch').mockImplementation(((url: string | URL | Request) => {
      const urlStr = url.toString()
      if (urlStr.includes('/api/users/confirm')) {
        return Promise.resolve(new Response(JSON.stringify({ isConfirmed: "true" }), { status: 200 }))
      }
      return Promise.resolve(new Response(JSON.stringify({}), { status: 400 }))
    }) as unknown as typeof fetch)
  })

  afterEach(() => {
    mockFetch.mockRestore()
    toast.remove()
  })

  it('shows error and redirects to home if no token is provided', async () => {
    render(
      <MemoryRouter initialEntries={['/users/confirm']}>
        <Toaster />
        <Routes>
          <Route path="/users/confirm" element={<ConfirmUserPage />} />
          <Route path="/" element={<div data-testid="home-page">Home</div>} />
          <Route path="/login" element={<div data-testid="login-page">Login</div>} />
        </Routes>
      </MemoryRouter>
    )

    // Wait for the toast to appear
    expect(await screen.findByText('No token found in the request.')).toBeInTheDocument()
    
    // Wait for navigation to /login
    expect(await screen.findByTestId('login-page')).toBeInTheDocument()
  })

  it('calls confirm API and shows success toast if token is valid', async () => {
    render(
      <MemoryRouter initialEntries={['/users/confirm?token=valid-token']}>
        <Toaster />
        <Routes>
          <Route path="/users/confirm" element={<ConfirmUserPage />} />
          <Route path="/" element={<div data-testid="home-page">Home</div>} />
          <Route path="/login" element={<div data-testid="login-page">Login</div>} />
        </Routes>
      </MemoryRouter>
    )

    // Wait for the API to be called
    await waitFor(() => {
      // Find the specific call we care about, ignoring leaked calls from other async tests
      const callArgs = mockFetch.mock.calls.find((call: unknown[]) => typeof call[0] === 'string' && call[0].includes('token='))
      expect(callArgs).toBeDefined()
      expect(callArgs![0]).toContain('token=valid-token')
      expect(callArgs![1].method).toBe('POST')
    })

    // Wait for the toast to appear
    expect(await screen.findByText('Account successfully confirmed! Welcome to Mithril Forge!')).toBeInTheDocument()
    
    // Wait for navigation to /login
    expect(await screen.findByTestId('login-page')).toBeInTheDocument()
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
          <Route path="/login" element={<div data-testid="login-page">Login</div>} />
        </Routes>
      </MemoryRouter>
    )

    // Wait for the toast to appear
    expect(await screen.findByText('Confirmation error: token invalid')).toBeInTheDocument()
    
    // Wait for navigation to /login
    expect(await screen.findByTestId('login-page')).toBeInTheDocument()
  })

  it('shows network error toast if fetch throws', async () => {
    mockFetch.mockImplementation(() => Promise.reject(new Error('Network error')))

    render(
      <MemoryRouter initialEntries={['/users/confirm?token=some-token']}>
        <Toaster />
        <Routes>
          <Route path="/users/confirm" element={<ConfirmUserPage />} />
          <Route path="/" element={<div data-testid="home-page">Home</div>} />
          <Route path="/login" element={<div data-testid="login-page">Login</div>} />
        </Routes>
      </MemoryRouter>
    )

    // Wait for the toast to appear
    expect(await screen.findByText('Network error during account confirmation.')).toBeInTheDocument()
    
    // Wait for navigation to /login
    expect(await screen.findByTestId('login-page')).toBeInTheDocument()
  })
})
