import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Code2, Bug, Heart, Activity, LogIn, UserPlus, Info, ChevronDown, ChevronUp, Book, LogOut, User } from 'lucide-react'
import { useLocalStorage } from 'usehooks-ts'
import posthog from 'posthog-js'
import toast from 'react-hot-toast'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMetaOpen, setIsMetaOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage('isLoggedIn', false)
  const [userEmail, setUserEmail] = useLocalStorage('userEmail', '')

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/session')
        if (response.ok) {
          const data = await response.json()
          setIsLoggedIn(true)
          setUserEmail(data.email)
        } else {
          setIsLoggedIn(false)
          setUserEmail('')
        }
      } catch {
        // Ignore network errors on session check
      }
    }
    checkSession()
  }, [setIsLoggedIn, setUserEmail])

  const toggleNav = () => setIsOpen(!isOpen)
  const closeNav = () => setIsOpen(false)

  const handleLogout = async () => {
    try {
      await fetch('/api/session', { method: 'DELETE' })
      posthog.capture('user_logged_out')
      posthog.reset()
      setIsLoggedIn(false)
      setUserEmail('')
      closeNav()
      navigate('/login')
    } catch {
      toast.error('Network error during logout.', { id: 'logout-error' })
    }
  }

  // Only show navigation on non-confirm routes (optional, but good practice)
  if (location.pathname === '/users/confirm') {
    return null
  }

  const linkClass =
    'flex items-center gap-3 px-4 py-2.5 rounded bg-forge-brown/10 border border-transparent text-forge-tan hover:text-forge-gold hover:border-forge-leather hover:bg-forge-brown/30 transition-all font-sans text-base'
  const activeLinkClass =
    'flex items-center gap-3 px-4 py-2.5 rounded text-forge-gold bg-forge-brown/50 border border-forge-gold-dim/30 transition-all font-sans text-base font-semibold'

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggleNav}
        className="fixed top-6 left-6 z-30 p-2.5 rounded bg-forge-brown/90 border border-forge-gold-dim/40 text-forge-gold hover:text-forge-gold hover:border-forge-gold hover:bg-forge-brown transition-all shadow-[0_0_15px_rgba(0,0,0,0.8),0_0_10px_rgba(212,175,55,0.1)] focus:outline-none focus:ring-1 focus:ring-forge-gold/50 cursor-pointer"
        aria-label="Open Menu"
        data-testid="nav-toggle"
      >
        <Menu size={20} />
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeNav}
        data-testid="nav-backdrop"
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-96 bg-gradient-to-br from-forge-darkest/95 to-forge-brown/20 backdrop-blur-sm border-r-2 border-forge-gold/20 shadow-[20px_0_50px_rgba(0,0,0,0.9),5px_0_20px_rgba(212,175,55,0.1)] p-8 flex flex-col justify-between z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        data-testid="nav-drawer"
        aria-hidden={!isOpen}
      >
        <div>
          {/* Header */}
          <div className="flex flex-col items-center justify-center pb-6 border-b border-forge-leather mb-6 relative">
            <button
              onClick={closeNav}
              className="absolute top-0 right-0 p-1.5 rounded text-forge-tan hover:text-forge-gold hover:bg-forge-brown/40 transition-all focus:outline-none cursor-pointer"
              aria-label="Close Menu"
              data-testid="nav-close"
            >
              <X size={20} />
            </button>
            <img src="/logo.svg" alt="Mithril Forge Logo" className="h-40 w-auto mb-4 drop-shadow-[0_0_15px_rgba(201,168,76,0.2)]" />
            <span className="font-title text-2xl font-bold text-forge-gold tracking-wider title-glow text-center">
              Mithril Forge
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            <Link
              to="/dm"
              onClick={closeNav}
              className={location.pathname.startsWith('/dm') ? activeLinkClass : linkClass}
            >
              DM Screen
            </Link>
            <Link
              to="/player"
              onClick={closeNav}
              className={location.pathname.startsWith('/player') ? activeLinkClass : linkClass}
            >
              Player Screen
            </Link>
          </nav>

        </div>

        {/* Footer Area */}
        <div className="flex flex-col gap-4 pt-6 border-t border-forge-leather mt-auto">
          {/* Account Actions */}
          <div className="flex flex-col gap-2 w-full">
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-2 px-2 py-1.5 text-forge-parchment/70 font-sans text-sm" data-testid="nav-user-email">
                  <User size={14} />
                  <span className="truncate">{userEmail}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex-1 flex items-center justify-center gap-2 px-2 py-2.5 rounded bg-forge-brown/50 text-forge-tan border border-forge-leather hover:text-forge-gold hover:border-forge-gold-dim/50 hover:bg-forge-brown/80 transition-all font-sans text-sm font-medium cursor-pointer group"
                  data-testid="nav-log-out"
                >
                  <LogOut size={16} className="text-forge-parchment/60 group-hover:text-forge-gold transition-colors" />
                  Log out
                </button>
              </>
            ) : (
              <div className="flex gap-2 w-full">
                <Link
                  to="/login"
                  onClick={closeNav}
                  className="flex-1 flex items-center justify-center gap-2 px-2 py-2.5 rounded bg-forge-brown/50 text-forge-tan border border-forge-leather hover:text-forge-gold hover:border-forge-gold-dim/50 hover:bg-forge-brown/80 transition-all font-sans text-sm font-medium cursor-pointer group"
                  data-testid="nav-sign-in"
                >
                  <LogIn size={16} className="text-forge-parchment/60 group-hover:text-forge-gold transition-colors" />
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  onClick={closeNav}
                  className="flex-1 flex items-center justify-center gap-2 px-2 py-2.5 rounded bg-forge-brown/50 text-forge-tan border border-forge-leather hover:text-forge-gold hover:border-forge-gold-dim/50 hover:bg-forge-brown/80 transition-all font-sans text-sm font-medium cursor-pointer group"
                  data-testid="nav-sign-up"
                >
                  <UserPlus size={16} className="text-forge-parchment/60 group-hover:text-forge-gold transition-colors" />
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Meta Links Submenu */}
          <div className="flex flex-col border-t border-forge-leather/40 pt-4">
            <button
              onClick={() => setIsMetaOpen(!isMetaOpen)}
              className="flex items-center justify-between px-2 py-2 rounded text-forge-parchment/70 hover:text-forge-gold hover:bg-forge-brown/30 transition-all font-sans text-sm font-medium w-full cursor-pointer focus:outline-none"
              data-testid="nav-meta-toggle"
            >
              <span className="flex items-center gap-3">
                <Info size={14} />
                About & Support
              </span>
              {isMetaOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {isMetaOpen && (
              <div className="flex flex-col gap-1 mt-2 pl-4 border-l border-forge-leather/40 ml-2">
                <a
                  href="/documentation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-2 rounded text-forge-parchment/70 hover:text-forge-gold hover:bg-forge-brown/30 transition-all font-sans text-sm"
                >
                  <Book size={14} />
                  Documentation
                </a>
                <a
                  href="https://github.com/phortx/mithril-forge"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-2 rounded text-forge-parchment/70 hover:text-forge-gold hover:bg-forge-brown/30 transition-all font-sans text-sm"
                >
                  <Code2 size={14} />
                  GitHub
                </a>
                <a
                  href="https://github.com/phortx/mithril-forge/issues/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-2 rounded text-forge-parchment/70 hover:text-forge-gold hover:bg-forge-brown/30 transition-all font-sans text-sm"
                >
                  <Bug size={14} />
                  Report Bug
                </a>
                <a
                  href="https://ko-fi.com/phortx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-2 rounded text-forge-parchment/70 hover:text-forge-gold hover:bg-forge-brown/30 transition-all font-sans text-sm"
                >
                  <Heart size={14} />
                  Support on Ko-fi
                </a>
                <Link
                  to="/status"
                  onClick={closeNav}
                  className={
                    location.pathname === '/status'
                      ? 'flex items-center gap-3 px-4 py-2 rounded text-forge-gold bg-forge-brown/40 transition-all font-sans text-sm border border-forge-gold-dim/20'
                      : 'flex items-center gap-3 px-4 py-2 rounded text-forge-parchment/70 hover:text-forge-gold hover:bg-forge-brown/30 transition-all font-sans text-sm'
                  }
                >
                  <Activity size={14} />
                  System Status
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
