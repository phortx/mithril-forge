import { render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test'
import { DashboardPage } from './DashboardPage'

function makeDaily(): Array<{ date: string; count: number }> {
  const today = new Date('2026-06-19T00:00:00Z')
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today)
    d.setUTCDate(today.getUTCDate() - (29 - i))
    return { date: d.toISOString().slice(0, 10), count: i === 29 ? 3 : i % 4 === 0 ? 1 : 0 }
  })
}

describe('DashboardPage', () => {
  let mockFetch: ReturnType<typeof spyOn>

  beforeEach(() => {
    mockFetch = spyOn(globalThis, 'fetch').mockImplementation((() =>
      Promise.resolve(
        new Response(JSON.stringify({}), { status: 500 }),
      )) as unknown as typeof fetch)
  })

  afterEach(() => {
    mockFetch.mockRestore()
  })

  it('shows three KPI cards and growth chart with fetched data', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          total: 42,
          verified: 30,
          unverified: 12,
          daily: makeDaily(),
        }),
    } as Response)

    render(<DashboardPage />)

    await waitFor(() => {
      expect(screen.getByTestId('kpi-total').textContent).toContain('42')
    })

    expect(screen.getByTestId('kpi-total').textContent).toContain('Total Users')
    expect(screen.getByTestId('kpi-verified').textContent).toContain('30')
    expect(screen.getByTestId('kpi-verified').textContent).toContain('71%')
    expect(screen.getByTestId('kpi-unverified').textContent).toContain('12')
    expect(screen.getByTestId('growth-chart')).toBeInTheDocument()

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/admin/users/stats',
      expect.objectContaining({ credentials: 'include' }),
    )
  })

  it('shows an error when the request fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: () => Promise.reject(new Error('no json')),
    } as Response)

    render(<DashboardPage />)

    await waitFor(() => {
      expect(screen.getByText(/Failed to load dashboard/)).toBeInTheDocument()
    })
  })
})
