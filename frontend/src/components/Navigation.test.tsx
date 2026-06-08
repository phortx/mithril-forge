import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { Navigation } from './Navigation'
import { describe, expect, it } from 'bun:test'

describe('Navigation', () => {
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
})
