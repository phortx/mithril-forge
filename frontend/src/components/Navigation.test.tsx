import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { Navigation } from './Navigation'
import { describe, expect, it, spyOn, afterEach, beforeEach } from 'bun:test'

describe('Navigation', () => {
  let mockFetch: ReturnType<typeof spyOn>

  beforeEach(() => {
    mockFetch = spyOn(globalThis, 'fetch').mockImplementation((() => Promise.resolve({ 
      ok: false,
      status: 400,
      json: async () => ({}),
      text: async () => "",
    } as Response)) as unknown as typeof fetch)
  })

  afterEach(() => {
    mockFetch.mockRestore()
    localStorage.clear()
  })

  it('renders the hamburger toggle button', () => {
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    )

    const toggleBtn = screen.getByTestId('nav-toggle')
    expect(toggleBtn).toBeInTheDocument()
    expect(toggleBtn).toHaveAttribute('aria-label', 'Open Menu')
  })

  it('initially renders the drawer closed', () => {
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    )

    const drawer = screen.getByTestId('nav-drawer')
    expect(drawer).toHaveAttribute('aria-hidden', 'true')
    expect(drawer).toHaveClass('-translate-x-full')

    const backdrop = screen.getByTestId('nav-backdrop')
    expect(backdrop).toHaveClass('pointer-events-none', 'opacity-0')
  })

  it('opens the drawer when clicking the toggle button', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    )

    const toggleBtn = screen.getByTestId('nav-toggle')
    await user.click(toggleBtn)

    const drawer = screen.getByTestId('nav-drawer')
    expect(drawer).toHaveAttribute('aria-hidden', 'false')
    expect(drawer).toHaveClass('translate-x-0')

    const backdrop = screen.getByTestId('nav-backdrop')
    expect(backdrop).toHaveClass('pointer-events-auto', 'opacity-100')
  })

  it('renders all navigation and footer meta links when open', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    )

    const toggleBtn = screen.getByTestId('nav-toggle')
    await user.click(toggleBtn)

    // Check screens links
    expect(screen.getByText('DM Screen')).toBeInTheDocument()
    expect(screen.getByText('Player Screen')).toBeInTheDocument()

    // Open meta links submenu
    const metaToggleBtn = screen.getByTestId('nav-meta-toggle')
    expect(screen.getByText('About & Support')).toBeInTheDocument()
    await user.click(metaToggleBtn)

    // Check footer meta links
    expect(screen.getByText('GitHub')).toBeInTheDocument()
    expect(screen.getByText('Report Bug')).toBeInTheDocument()
    expect(screen.getByText('Support on Ko-fi')).toBeInTheDocument()
    expect(screen.getByText('System Status')).toBeInTheDocument()
  })

  it('closes the drawer when clicking the close button', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    )

    // Open first
    const toggleBtn = screen.getByTestId('nav-toggle')
    await user.click(toggleBtn)
    
    const drawer = screen.getByTestId('nav-drawer')
    expect(drawer).toHaveAttribute('aria-hidden', 'false')

    // Close
    const closeBtn = screen.getByTestId('nav-close')
    await user.click(closeBtn)

    expect(drawer).toHaveAttribute('aria-hidden', 'true')
    expect(drawer).toHaveClass('-translate-x-full')
  })

  it('closes the drawer when clicking the backdrop', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    )

    // Open first
    const toggleBtn = screen.getByTestId('nav-toggle')
    await user.click(toggleBtn)
    
    const drawer = screen.getByTestId('nav-drawer')
    expect(drawer).toHaveAttribute('aria-hidden', 'false')

    // Click backdrop
    const backdrop = screen.getByTestId('nav-backdrop')
    await user.click(backdrop)

    expect(drawer).toHaveAttribute('aria-hidden', 'true')
    expect(drawer).toHaveClass('-translate-x-full')
  })

  it('closes the drawer when a navigation link is clicked', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/dm']}>
        <Navigation />
      </MemoryRouter>
    )

    // Open
    const toggleBtn = screen.getByTestId('nav-toggle')
    await user.click(toggleBtn)

    // Click Player Screen link
    const playerLink = screen.getByText('Player Screen')
    await user.click(playerLink)

    // Verify closed
    const drawer = screen.getByTestId('nav-drawer')
    expect(drawer).toHaveAttribute('aria-hidden', 'true')
  })

  it('shows Sign in and Sign up when not logged in', async () => {
    mockFetch.mockImplementation(() => Promise.resolve({ 
      ok: false,
      status: 400,
      json: async () => ({}),
      text: async () => "",
    } as Response))

    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    )

    // Wait for the useEffect fetch to complete
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/session')
    })

    const toggleBtn = screen.getByTestId('nav-toggle')
    await user.click(toggleBtn)

    expect(screen.getByText('Sign in')).toBeInTheDocument()
    expect(screen.getByText('Sign up')).toBeInTheDocument()
    expect(screen.queryByText('Log out')).not.toBeInTheDocument()
  })

  it('shows Log out and email when logged in and calls logout API on click', async () => {
    mockFetch.mockImplementation((url?: string | URL | Request, options?: RequestInit) => {
      if (url === '/api/session' && (!options || options.method === 'GET')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ email: 'test@example.com' }),
          text: async () => "",
        } as Response)
      }
      if (url === '/api/session' && options?.method === 'DELETE') {
        return Promise.resolve({ 
          ok: true,
          status: 200,
          json: async () => ({}),
          text: async () => "",
        } as Response)
      }
      return Promise.resolve({ 
        ok: false,
        status: 400,
        json: async () => ({}),
        text: async () => "",
      } as Response)
    })

    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    )

    const toggleBtn = screen.getByTestId('nav-toggle')
    await user.click(toggleBtn)

    // Wait for the email to appear which means the fetch has completed
    await waitFor(() => {
      expect(screen.getByText('test@example.com')).toBeInTheDocument()
    })

    expect(screen.queryByText('Sign in')).not.toBeInTheDocument()
    expect(screen.queryByText('Sign up')).not.toBeInTheDocument()
    
    const logoutBtn = screen.getByText('Log out')
    expect(logoutBtn).toBeInTheDocument()

    await user.click(logoutBtn)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/session', expect.objectContaining({
        method: 'DELETE'
      }))
    })

    // Should clear local storage
    expect(localStorage.getItem('isLoggedIn')).toBe('false')
    expect(localStorage.getItem('userEmail')).toBe('""')
  })
})
