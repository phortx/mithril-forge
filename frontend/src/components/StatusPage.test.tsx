import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { StatusPage } from './StatusPage'
import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test'

describe('StatusPage', () => {
  let mockFetch: ReturnType<typeof spyOn>

  beforeEach(() => {
    mockFetch = spyOn(globalThis, 'fetch').mockImplementation(((url: string | URL | Request) => {
      const urlStr = url.toString()
      if (urlStr === '/api/status') {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({ status: 'ok' }),
          text: async () => "",
        }) as Promise<Response>
      }
      if (urlStr === 'https://api.open5e.com/v1/monsters/?limit=1') {
        return Promise.resolve({ ok: true, status: 200, json: async () => ({}), text: async () => "" }) as Promise<Response>
      }
      return Promise.resolve({ ok: false, status: 400, json: async () => ({}), text: async () => "" }) as Promise<Response>
    }) as unknown as typeof fetch)
  })

  afterEach(() => {
    mockFetch.mockRestore()
  })

  it('renders system status title', async () => {
    render(
      <BrowserRouter>
        <StatusPage />
      </BrowserRouter>
    )
    
    // Wait for the heading to appear (and let promises settle to avoid act warnings)
    expect(await screen.findByRole('heading', { name: 'System Status' })).toBeInTheDocument()
    
    // Wait for at least one element to finish loading so the test doesn't end prematurely
    await waitFor(() => {
      expect(screen.getAllByText(/AVAILABLE|ONLINE|OFFLINE/).length).toBeGreaterThan(0)
    })
  })

  it('shows online status for backend and open5e when fetch is successful', async () => {
    render(
      <BrowserRouter>
        <StatusPage />
      </BrowserRouter>
    )

    await waitFor(() => {
      const onlineElements = screen.getAllByText('ONLINE')
      // Backend and Open5e should both be ONLINE
      expect(onlineElements.length).toBe(2)
    })
  })

  it('shows offline status when fetch fails', async () => {
    mockFetch.mockImplementation(() => Promise.reject(new Error('Network error')))
    
    render(
      <BrowserRouter>
        <StatusPage />
      </BrowserRouter>
    )

    await waitFor(() => {
      const offlineElements = screen.getAllByText('OFFLINE')
      expect(offlineElements.length).toBe(2)
    })
  })

  it('shows localStorage and Crypto API as available', async () => {
    render(
      <BrowserRouter>
        <StatusPage />
      </BrowserRouter>
    )

    await waitFor(() => {
      // Both localStorage and crypto API should show AVAILABLE in the test environment
      const availableElements = screen.getAllByText('AVAILABLE')
      expect(availableElements.length).toBe(2)
    })
  })
})
