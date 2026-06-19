import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test'
import { AdminGuard } from './AdminGuard'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/admin/*"
          element={
            <AdminGuard>
              <div data-testid="protected">protected-content</div>
            </AdminGuard>
          }
        />
        <Route path="/login" element={<div data-testid="login">login-page</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('AdminGuard', () => {
  let mockFetch: ReturnType<typeof spyOn>

  beforeEach(() => {
    mockFetch = spyOn(globalThis, 'fetch').mockImplementation((() =>
      Promise.resolve(new Response(JSON.stringify({}), { status: 403 }),
      )) as unknown as typeof fetch)
  })

  afterEach(() => {
    mockFetch.mockRestore()
    localStorage.clear()
  })

  it('renders a loader while the auth check is pending', () => {
    mockFetch.mockImplementationOnce((() => new Promise(() => {})) as unknown as typeof fetch)
    renderAt('/admin/dashboard')
    expect(screen.getByText(/Loading/i)).toBeInTheDocument()
    expect(screen.queryByTestId('protected')).not.toBeInTheDocument()
  })

  it('renders children when the request succeeds', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ total: 1, verified: 1, unverified: 0, daily: [] }),
    } as Response)

    renderAt('/admin/dashboard')

    await waitFor(() => {
      expect(screen.getByTestId('protected')).toBeInTheDocument()
    })

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/admin/users/auth-check',
      expect.objectContaining({ credentials: 'include' }),
    )
  })

  it('redirects to /login when the request returns 403', async () => {
    renderAt('/admin/dashboard')

    await waitFor(() => {
      expect(screen.getByTestId('login')).toBeInTheDocument()
    })

    expect(screen.queryByTestId('protected')).not.toBeInTheDocument()
  })

  it('redirects to /login when fetch throws', async () => {
    mockFetch.mockRejectedValueOnce(new Error('network'))

    renderAt('/admin/dashboard')

    await waitFor(() => {
      expect(screen.getByTestId('login')).toBeInTheDocument()
    })
  })
})
