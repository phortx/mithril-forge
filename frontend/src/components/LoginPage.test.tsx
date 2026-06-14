import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { LoginPage } from './LoginPage'
import { describe, expect, it, spyOn, afterEach, beforeEach } from 'bun:test'
import toast from 'react-hot-toast'

describe('LoginPage', () => {
  let mockFetch: ReturnType<typeof spyOn>

  beforeEach(() => {
    mockFetch = spyOn(globalThis, 'fetch').mockImplementation((() => {
      return Promise.resolve({ 
        ok: false, 
        status: 400,
        json: async () => ({}),
        text: async () => "",
      }) as Promise<Response>
    }) as unknown as typeof fetch)
  })

  afterEach(() => {
    mockFetch.mockRestore()
    localStorage.clear()
    toast.remove()
  })

  it('renders the login form', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: 'Enter the Forge' })).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument()
  })

  it('sets isLoggedIn state to true on successful login and navigates to home', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ email: 'test@example.com' }),
    } as Response)

    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    await user.type(screen.getByLabelText('Email'), 'test@example.com')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Sign In' }))

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/session', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'password123' })
      }))
    })

    expect(localStorage.getItem('isLoggedIn')).toBe('true')
  })
})
