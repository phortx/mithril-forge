import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import posthog from 'posthog-js'
import './index.css'

import App from './App.tsx'
import { StatusPage } from './components/StatusPage.tsx'
import { ConfirmUserPage } from './components/ConfirmUserPage.tsx'
import { SignUpPage } from './components/SignUpPage.tsx'
import { LoginPage } from './components/LoginPage.tsx'
import { CookieConsentBanner } from './components/CookieConsentBanner.tsx'

posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY || '', {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  person_profiles: 'identified_only',
  opt_out_capturing_by_default: true,
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/status" element={<StatusPage />} />
        <Route path="/users/confirm" element={<ConfirmUserPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={<App />} />
      </Routes>
      <CookieConsentBanner />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'linear-gradient(135deg, rgba(42, 31, 22, 0.95) 0%, rgba(26, 20, 16, 0.98) 100%)',
            border: '1px solid var(--color-forge-tan)',
            color: 'var(--color-forge-parchment-light)',
            fontFamily: 'var(--font-heading)',
            fontSize: '0.875rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.6)',
          },
          success: {
            iconTheme: {
              primary: 'var(--color-forge-green-light)',
              secondary: 'var(--color-forge-darkest)',
            },
          },
          error: {
            iconTheme: {
              primary: 'var(--color-forge-burgundy-light)',
              secondary: 'var(--color-forge-parchment-light)',
            },
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>,
)
