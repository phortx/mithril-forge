import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Navigation } from './Navigation'
import { LogIn, Mail, KeyRound, Loader2, Sparkles } from 'lucide-react'

export function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim() || !password.trim()) {
      toast.error('Please provide an email and password.', {
        id: 'signup-error',
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        toast.success('Registration successful! Please check your email to confirm your account.', {
          id: 'signup-success',
          duration: 6000,
        })
        navigate('/')
      } else if (response.status === 409) {
        toast.error('A user with this email already exists.', {
          id: 'signup-error',
        })
      } else {
        const data = await response.json().catch(() => ({}))
        const errorMessage = data.error || 'Registration failed.'
        toast.error(`Error during registration: ${errorMessage}`, {
          id: 'signup-error',
        })
      }
    } catch {
      toast.error('Network error during registration.', {
        id: 'signup-error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="page-texture relative min-h-screen flex flex-col bg-forge-darkest text-forge-parchment font-body">
      <Navigation />
      <div className="relative z-10 max-w-md mx-auto flex flex-col gap-8 p-8 w-full flex-grow justify-center">
        <div className="panel-parchment panel-ornate rounded-lg p-8 flex flex-col gap-6">
          <div className="text-center">
            <h1 className="font-title text-3xl font-bold text-forge-gold tracking-widest title-glow">
              Join the Forge
            </h1>
            <p className="text-forge-tan text-sm mt-2 font-heading tracking-widest uppercase">
              Create an Account
            </p>
          </div>
          
          <div className="ornament-divider font-heading text-sm text-center">&#x2726;</div>

          <form onSubmit={handleSignUp} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="font-heading text-sm text-forge-tan uppercase tracking-widest flex items-center gap-2">
                <Mail size={14} />
                Email
              </label>
              <input
                id="email"
                type="email"
                disabled={isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-forge-darkest/50 border border-forge-leather rounded px-4 py-2.5 text-forge-parchment placeholder-forge-tan/30 focus:outline-none focus:border-forge-gold focus:ring-1 focus:ring-forge-gold/50 transition-all font-sans"
                placeholder="your.name@example.com"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="font-heading text-sm text-forge-tan uppercase tracking-widest flex items-center gap-2">
                <KeyRound size={14} />
                Password
              </label>
              <input
                id="password"
                type="password"
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-forge-darkest/50 border border-forge-leather rounded px-4 py-2.5 text-forge-parchment placeholder-forge-tan/30 focus:outline-none focus:border-forge-gold focus:ring-1 focus:ring-forge-gold/50 transition-all font-sans"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 flex items-center justify-center gap-2 w-full py-3 px-4 bg-forge-gold text-forge-darkest rounded font-heading uppercase tracking-widest font-bold hover:bg-forge-parchment-light transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Forging...
                </>
              ) : (
                <>
                  <Sparkles size={18} className="group-hover:animate-pulse" />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-2">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-forge-tan hover:text-forge-gold text-sm transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <LogIn size={14} />
              Already have an account? Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
