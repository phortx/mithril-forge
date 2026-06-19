import { Link, useNavigate } from 'react-router-dom'
import { LogOut, Shield } from 'lucide-react'
import toast from 'react-hot-toast'
import type { ReactNode } from 'react'
import posthog from 'posthog-js'

export function ThemedLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await fetch('/api/session', { method: 'DELETE' })
      posthog.capture('user_logged_out')
      posthog.reset()
      navigate('/login')
    } catch {
      toast.error('Network error during logout.', { id: 'admin-logout-error' })
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-forge-darkest text-forge-parchment">
      <header className="border-b border-forge-leather bg-forge-brown/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Shield size={20} className="text-forge-gold" />
            <h1 className="font-title text-2xl text-forge-gold tracking-widest title-glow">
              Mithril Forge · Admin
            </h1>
          </div>
          <nav className="flex items-center gap-2">
            <Link
              to="/dm"
              className="px-3 py-1.5 rounded text-forge-tan hover:text-forge-gold hover:bg-forge-brown/50 text-sm font-heading uppercase tracking-wider"
            >
              Exit to App
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              data-testid="admin-logout"
              className="flex items-center gap-2 px-3 py-1.5 rounded bg-forge-brown/50 text-forge-tan border border-forge-leather hover:text-forge-gold hover:border-forge-gold-dim/50 hover:bg-forge-brown/80 transition-all text-sm font-heading uppercase tracking-wider cursor-pointer"
            >
              <LogOut size={14} />
              Log out
            </button>
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">{children}</main>
    </div>
  )
}
