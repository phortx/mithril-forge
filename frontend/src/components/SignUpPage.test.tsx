import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import userEvent from '@testing-library/user-event'
import { SignUpPage } from './SignUpPage'
import { afterEach, beforeEach, describe, expect, it, jest } from 'bun:test'

const originalFetch = globalThis.fetch

describe('SignUpPage', () => {
  let mockFetch: ReturnType<typeof jest.fn>

  beforeEach(() => {
    mockFetch = jest.fn((url: string | URL | Request) => {
      const urlStr = url.toString()
      if (urlStr.includes('/api/users/')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ email: "test@example.com" }),
        })
      }
      return Promise.resolve({ ok: false })
    })
    globalThis.fetch = mockFetch as unknown as typeof fetch
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  it('renders the sign up form', () => {
    render(
      <MemoryRouter initialEntries={['/signup']}>
        <Routes>
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: /join the forge/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('submits form successfully and navigates to home', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/signup']}>
        <Toaster />
        <Routes>
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/" element={<div data-testid="home-page">Home</div>} />
        </Routes>
      </MemoryRouter>
    )

    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'securepassword')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled()
      const callArgs = mockFetch.mock.calls[0]
      expect(callArgs[0]).toContain('/api/users/')
      expect(callArgs[1].method).toBe('POST')
      expect(callArgs[1].body).toBe(JSON.stringify({ email: 'test@example.com', password: 'securepassword' }))
    })

    // Wait for the success toast
    expect(await screen.findByText(/Registration successful!/i)).toBeInTheDocument()
    
    // Wait for navigation to /
    expect(await screen.findByTestId('home-page')).toBeInTheDocument()
  })

  it('displays error toast when user already exists (409)', async () => {
    const user = userEvent.setup()
    mockFetch.mockImplementation(() => {
      return Promise.resolve({
        ok: false,
        status: 409,
      })
    })

    render(
      <MemoryRouter initialEntries={['/signup']}>
        <Toaster />
        <Routes>
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/" element={<div data-testid="home-page">Home</div>} />
        </Routes>
      </MemoryRouter>
    )

    await user.type(screen.getByLabelText(/email/i), 'existing@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(await screen.findByText(/A user with this email already exists./i)).toBeInTheDocument()
    expect(screen.queryByTestId('home-page')).not.toBeInTheDocument()
  })

  it('displays error toast when API returns 400', async () => {
    const user = userEvent.setup()
    mockFetch.mockImplementation(() => {
      return Promise.resolve({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Invalid password' })
      })
    })

    render(
      <MemoryRouter initialEntries={['/signup']}>
        <Toaster />
        <Routes>
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/" element={<div data-testid="home-page">Home</div>} />
        </Routes>
      </MemoryRouter>
    )

    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'short')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(await screen.findByText(/Error during registration: Invalid password/i)).toBeInTheDocument()
    expect(screen.queryByTestId('home-page')).not.toBeInTheDocument()
  })

  it('prevents submission with only whitespace', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/signup']}>
        <Toaster />
        <Routes>
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </MemoryRouter>
    )

    const emailInput = screen.getByLabelText(/email/i)
    const passInput = screen.getByLabelText(/password/i)

    await user.type(emailInput, '   ')
    await user.type(passInput, '   ')
    
    // HTML5 validation will likely prevent form submission, but if not, our custom logic handles it.
    // However, userEvent.click on a button inside a form with invalid required fields will trigger invalid events,
    // so let's bypass HTML validation by removing the 'required' attributes in DOM just to test our JS logic
    emailInput.removeAttribute('required')
    passInput.removeAttribute('required')
    
    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(mockFetch).not.toHaveBeenCalled()
    expect(await screen.findByText(/Please provide an email and password./i)).toBeInTheDocument()
  })
})
