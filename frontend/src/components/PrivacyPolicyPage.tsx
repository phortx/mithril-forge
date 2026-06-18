import { Link } from 'react-router-dom'
import { Shield } from 'lucide-react'
import { Navigation } from './Navigation'

export function PrivacyPolicyPage() {
  return (
    <div className="page-texture relative min-h-screen flex flex-col bg-forge-darkest text-forge-parchment font-body" data-testid="privacy-policy-page">
      <Navigation />
      <div className="relative z-10 max-w-2xl mx-auto flex flex-col gap-8 p-8 w-full flex-grow">
        <header className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="text-forge-gold" size={36} />
            <h1 className="font-title text-5xl font-bold text-forge-gold tracking-widest title-glow">
              Privacy Policy
            </h1>
          </div>
          <Link to="/" className="text-forge-tan hover:text-forge-gold transition-colors text-sm font-heading tracking-wider uppercase flex items-center justify-center gap-2">
            &larr; Back to App
          </Link>
        </header>

        <div className="panel-parchment panel-ornate rounded-lg p-8 flex flex-col gap-8">

          {/* 1. Controller */}
          <section>
            <h2 className="font-heading text-xl text-forge-parchment-light uppercase tracking-wide mb-3">
              1. Controller
            </h2>
            <p className="text-forge-tan text-sm leading-relaxed">
              Benjamin Klein<br />
              Entropy Labs<br />
              Im Sonnenschein 2<br />
              56244 Ötzingen<br />
              Germany<br />
              Email:{' '}
              <a href="mailto:bk@itws.de" className="text-forge-gold hover:underline">
                bk@itws.de
              </a>
            </p>
          </section>

          <hr className="border-forge-brown/30" />

          {/* 2. Data Processing */}
          <section>
            <h2 className="font-heading text-xl text-forge-parchment-light uppercase tracking-wide mb-3">
              2. Data Processing
            </h2>
            <ul className="text-forge-tan text-sm leading-relaxed mt-2 list-disc list-inside space-y-2">
              <li>
                <strong className="text-forge-parchment-light">User Accounts:</strong> We store your email address for authentication (Art. 6(1)(b) GDPR). Kept until account deletion.
              </li>
              <li>
                <strong className="text-forge-parchment-light">Server Logs:</strong> We log IP addresses and user agents for security (Art. 6(1)(f) GDPR). Deleted after 30 days.
              </li>
              <li>
                <strong className="text-forge-parchment-light">Analytics:</strong> With your consent (Art. 6(1)(a) GDPR), we collect anonymized usage data via PostHog. You can revoke consent via cookie settings.
              </li>
              <li>
                <strong className="text-forge-parchment-light">Cookies & Local Storage:</strong> We use Local Storage for necessary app state. We use PostHog cookies for analytics only with your consent.
              </li>
              <li>
                <strong className="text-forge-parchment-light">Third Parties:</strong> We host on Railway (EU). Your browser fetches data from api.open5e.com, exposing your IP to them.
              </li>
              <li>
                <strong className="text-forge-parchment-light">Encounter Data:</strong> Encounter data saved on our servers does not contain personal data.
              </li>
            </ul>
          </section>

          <hr className="border-forge-brown/30" />

          {/* 3. Your Rights */}
          <section>
            <h2 className="font-heading text-xl text-forge-parchment-light uppercase tracking-wide mb-3">
              3. Your Rights
            </h2>
            <p className="text-forge-tan text-sm leading-relaxed">
              Under the GDPR, you have the right to access, rectify, erase, restrict, and port your personal data, as well as object to its processing. Contact us at{' '}
              <a href="mailto:bk@itws.de" className="text-forge-gold hover:underline">
                bk@itws.de
              </a>{' '}
              to exercise these rights. You also have the right to lodge a complaint with a supervisory authority.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
