import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, Database, CheckCircle2, XCircle, Loader2, Globe, ShieldCheck } from 'lucide-react'
import { Navigation } from './Navigation'

export function StatusPage() {
  const [backendStatus, setBackendStatus] = useState<'loading' | 'online' | 'offline'>('loading')
  const [localStorageStatus] = useState<'checking' | 'available' | 'unavailable'>(() => {
    try {
      const testKey = '__test__'
      localStorage.setItem(testKey, testKey)
      localStorage.removeItem(testKey)
      return 'available'
    } catch {
      return 'unavailable'
    }
  })
  const [open5eStatus, setOpen5eStatus] = useState<'loading' | 'online' | 'offline'>('loading')
  const [cryptoStatus] = useState<'checking' | 'available' | 'unavailable'>(() => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      try {
        crypto.randomUUID()
        return 'available'
      } catch {
        return 'unavailable'
      }
    }
    return 'unavailable'
  })

  useEffect(() => {
    // Check backend
    const checkBackend = async () => {
      try {
        const response = await fetch('/api/status')
        if (response.ok) {
          const data = await response.json()
          if (data.status === 'ok') {
            setBackendStatus('online')
          } else {
            setBackendStatus('offline')
          }
        } else {
          setBackendStatus('offline')
        }
      } catch {
        setBackendStatus('offline')
      }
    }

    checkBackend()

    // Check Open5e API
    const checkOpen5e = async () => {
      try {
        const response = await fetch('https://api.open5e.com/v1/monsters/?limit=1')
        if (response.ok) {
          setOpen5eStatus('online')
        } else {
          setOpen5eStatus('offline')
        }
      } catch {
        setOpen5eStatus('offline')
      }
    }
    
    checkOpen5e()
  }, [])

  return (
    <div className="page-texture relative min-h-screen flex flex-col bg-forge-darkest text-forge-parchment font-body">
      <Navigation />
      <div className="relative z-10 max-w-2xl mx-auto flex flex-col gap-8 p-8 w-full flex-grow">
        <header className="text-center">
          <h1 className="font-title text-5xl font-bold text-forge-gold tracking-widest title-glow mb-4">
            System Status
          </h1>
          <Link to="/" className="text-forge-tan hover:text-forge-gold transition-colors text-sm font-heading tracking-wider uppercase flex items-center justify-center gap-2">
            &larr; Back to App
          </Link>
        </header>

        <div className="panel-parchment panel-ornate rounded-lg p-8 flex flex-col gap-6">
          {/* Backend Status */}
          <div className="flex items-center justify-between border-b border-forge-brown/30 pb-4">
            <div className="flex items-center gap-4">
              <div className="bg-forge-brown/20 p-3 rounded-full border border-forge-leather">
                <Activity className="text-forge-gold-dim" size={24} />
              </div>
              <div>
                <h2 className="font-heading text-xl text-forge-parchment-light uppercase tracking-wide">Backend Connection</h2>
                <p className="text-forge-tan text-sm">Internal API status and connectivity</p>
              </div>
            </div>
            <div>
              {backendStatus === 'loading' && (
                <span className="flex items-center gap-2 text-forge-gold-dim animate-pulse font-heading tracking-wider">
                  <Loader2 size={20} className="animate-spin" /> CHECKING...
                </span>
              )}
              {backendStatus === 'online' && (
                <span className="flex items-center gap-2 text-green-700 font-bold font-heading tracking-wider">
                  <CheckCircle2 size={20} /> ONLINE
                </span>
              )}
              {backendStatus === 'offline' && (
                <span className="flex items-center gap-2 text-red-700 font-bold font-heading tracking-wider">
                  <XCircle size={20} /> OFFLINE
                </span>
              )}
            </div>
          </div>

          {/* Open5e API Status */}
          <div className="flex items-center justify-between border-b border-forge-brown/30 pb-4 pt-2">
            <div className="flex items-center gap-4">
              <div className="bg-forge-brown/20 p-3 rounded-full border border-forge-leather">
                <Globe className="text-forge-gold-dim" size={24} />
              </div>
              <div>
                <h2 className="font-heading text-xl text-forge-parchment-light uppercase tracking-wide">Open5e API</h2>
                <p className="text-forge-tan text-sm">External SRD monster database</p>
              </div>
            </div>
            <div>
              {open5eStatus === 'loading' && (
                <span className="flex items-center gap-2 text-forge-gold-dim animate-pulse font-heading tracking-wider">
                  <Loader2 size={20} className="animate-spin" /> CHECKING...
                </span>
              )}
              {open5eStatus === 'online' && (
                <span className="flex items-center gap-2 text-green-700 font-bold font-heading tracking-wider">
                  <CheckCircle2 size={20} /> ONLINE
                </span>
              )}
              {open5eStatus === 'offline' && (
                <span className="flex items-center gap-2 text-red-700 font-bold font-heading tracking-wider">
                  <XCircle size={20} /> OFFLINE
                </span>
              )}
            </div>
          </div>

          {/* Local Storage Status */}
          <div className="flex items-center justify-between border-b border-forge-brown/30 pb-4 pt-2">
            <div className="flex items-center gap-4">
              <div className="bg-forge-brown/20 p-3 rounded-full border border-forge-leather">
                <Database className="text-forge-gold-dim" size={24} />
              </div>
              <div>
                <h2 className="font-heading text-xl text-forge-parchment-light uppercase tracking-wide">Local Storage</h2>
                <p className="text-forge-tan text-sm">Required for saving encounters</p>
              </div>
            </div>
            <div>
              {localStorageStatus === 'checking' && (
                <span className="flex items-center gap-2 text-forge-gold-dim animate-pulse font-heading tracking-wider">
                  <Loader2 size={20} className="animate-spin" /> CHECKING...
                </span>
              )}
              {localStorageStatus === 'available' && (
                <span className="flex items-center gap-2 text-green-700 font-bold font-heading tracking-wider">
                  <CheckCircle2 size={20} /> AVAILABLE
                </span>
              )}
              {localStorageStatus === 'unavailable' && (
                <span className="flex items-center gap-2 text-red-700 font-bold font-heading tracking-wider">
                  <XCircle size={20} /> UNAVAILABLE
                </span>
              )}
            </div>
          </div>

          {/* Crypto API Status */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-4">
              <div className="bg-forge-brown/20 p-3 rounded-full border border-forge-leather">
                <ShieldCheck className="text-forge-gold-dim" size={24} />
              </div>
              <div>
                <h2 className="font-heading text-xl text-forge-parchment-light uppercase tracking-wide">Crypto API</h2>
                <p className="text-forge-tan text-sm">Required for secure unique IDs (randomUUID)</p>
              </div>
            </div>
            <div>
              {cryptoStatus === 'checking' && (
                <span className="flex items-center gap-2 text-forge-gold-dim animate-pulse font-heading tracking-wider">
                  <Loader2 size={20} className="animate-spin" /> CHECKING...
                </span>
              )}
              {cryptoStatus === 'available' && (
                <span className="flex items-center gap-2 text-green-700 font-bold font-heading tracking-wider">
                  <CheckCircle2 size={20} /> AVAILABLE
                </span>
              )}
              {cryptoStatus === 'unavailable' && (
                <span className="flex items-center gap-2 text-red-700 font-bold font-heading tracking-wider">
                  <XCircle size={20} /> UNAVAILABLE
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
