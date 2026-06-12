import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import { Navigation } from './Navigation'

export function ConfirmUserPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  const effectRan = useRef(false)

  useEffect(() => {
    // Avoid double run in React 18/19 StrictMode which could invalidate stateless token verification on backend if not idempotent (though verify is usually idempotent, double fetch is still nice to prevent)
    if (effectRan.current) return
    effectRan.current = true

    if (!token) {
      toast.error('No token found in the request.', {
        id: 'confirm-error',
      })
      navigate('/login')
      return
    }

    const confirmAccount = async () => {
      try {
        const response = await fetch(`/api/users/confirm?token=${encodeURIComponent(token)}`, {
          method: 'POST',
        })

        if (response.ok) {
          toast.success('Account successfully confirmed! Welcome to Mithril Forge!', {
            id: 'confirm-success',
            duration: 5000,
          })
        } else {
          const data = await response.json().catch(() => ({}))
          const errorMessage = data.error || 'Confirmation failed.'
          toast.error(`Confirmation error: ${errorMessage}`, {
            id: 'confirm-error',
            duration: 6000,
          })
        }
      } catch {
        toast.error('Network error during account confirmation.', {
          id: 'confirm-error',
          duration: 6000,
        })
      } finally {
        navigate('/login')
      }
    }

    confirmAccount()
  }, [token, navigate])

  return (
    <div className="page-texture relative min-h-screen flex flex-col bg-forge-darkest text-forge-parchment font-body">
      <Navigation />
      <div className="relative z-10 max-w-md mx-auto flex flex-col gap-8 p-8 w-full flex-grow justify-center">
        <div className="panel-parchment panel-ornate rounded-lg p-8 text-center flex flex-col gap-6 items-center">
          <h1 className="font-title text-3xl font-bold text-forge-gold tracking-widest title-glow">
            Mithril Forge
          </h1>
          
          <div className="ornament-divider font-heading text-sm w-full">&#x2726;</div>

          <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-forge-gold" size={48} />
            <p className="font-heading text-lg text-forge-parchment-light tracking-wide uppercase">
              Verifying seal...
            </p>
            <p className="text-forge-tan text-sm italic">
              Please wait a moment while your account is activated.
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
