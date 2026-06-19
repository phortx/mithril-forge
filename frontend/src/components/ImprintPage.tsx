import { Link } from 'react-router-dom'
import { Scale, Mail, MapPin, Building2, FileDigit } from 'lucide-react'
import { Navigation } from './Navigation'

export function ImprintPage() {
  return (
    <div className="page-texture relative min-h-screen flex flex-col bg-forge-darkest text-forge-parchment font-body" data-testid="imprint-page">
      <Navigation />
      <div className="relative z-10 max-w-2xl mx-auto flex flex-col gap-8 p-8 w-full flex-grow">
        <header className="text-center">
          <h1 className="font-title text-5xl font-bold text-forge-gold tracking-widest title-glow mb-4">
            Imprint
          </h1>
          <Link to="/" className="text-forge-tan hover:text-forge-gold transition-colors text-sm font-heading tracking-wider uppercase flex items-center justify-center gap-2">
            &larr; Back to App
          </Link>
        </header>

        <div className="panel-parchment panel-ornate rounded-lg p-8 flex flex-col gap-6">
          <div className="flex items-center gap-4 pb-4 border-b border-forge-brown/30">
            <div className="bg-forge-brown/20 p-3 rounded-full border border-forge-leather">
              <Scale className="text-forge-gold-dim" size={24} />
            </div>
            <div>
              <h2 className="font-heading text-xl text-forge-parchment-light uppercase tracking-wide">
                Legal Notice
              </h2>
              <p className="text-forge-tan text-sm">
                Information according to § 5 TMG (German Telemedia Act)
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-5 text-forge-parchment">
            <div className="flex items-start gap-3">
              <Building2 className="text-forge-gold-dim mt-1 shrink-0" size={18} />
              <div>
                <p className="font-heading text-forge-parchment-light tracking-wide uppercase text-sm mb-1">Responsible</p>
                <p>Benjamin Klein</p>
                <p className="text-forge-tan text-sm">Entropy Labs</p>
                <p className="text-forge-tan text-sm">(Sole proprietorship / Einzelunternehmer)</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="text-forge-gold-dim mt-1 shrink-0" size={18} />
              <div>
                <p className="font-heading text-forge-parchment-light tracking-wide uppercase text-sm mb-1">Address</p>
                <p>Im Sonnenschein 2</p>
                <p>56244 Ötzingen</p>
                <p>Germany</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileDigit className="text-forge-gold-dim mt-1 shrink-0" size={18} />
              <div>
                <p className="font-heading text-forge-parchment-light tracking-wide uppercase text-sm mb-1">VAT ID</p>
                <p>DE328705890</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="text-forge-gold-dim mt-1 shrink-0" size={18} />
              <div>
                <p className="font-heading text-forge-parchment-light tracking-wide uppercase text-sm mb-1">Contact</p>
                <p>hello@mithril-forge.site</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
