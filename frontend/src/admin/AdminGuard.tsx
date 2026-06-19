import { useEffect, useState, type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Loader } from './components/Loader'

type Status = 'pending' | 'authorized' | 'unauthorized'

export function AdminGuard({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>('pending')
  const location = useLocation()

  useEffect(() => {
    let cancelled = false
    const check = async () => {
      try {
        const response = await fetch('/api/admin/users/auth-check', {
          credentials: 'include',
        })
        if (cancelled) return
        setStatus(response.ok ? 'authorized' : 'unauthorized')
      } catch {
        if (!cancelled) setStatus('unauthorized')
      }
    }
    check()
    return () => {
      cancelled = true
    }
  }, [])

  if (status === 'pending') {
    return <Loader />
  }

  if (status === 'unauthorized') {
    const redirect = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/login?redirect=${redirect}`} replace />
  }

  return <>{children}</>
}
