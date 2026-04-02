import { Code2, Bug } from 'lucide-react'

export function Footer() {
  const linkClass =
    'inline-flex items-center gap-1.5 text-forge-tan hover:text-forge-gold transition-colors'

  return (
    <footer className="max-w-4xl mx-auto px-8 pb-6 pt-2">
      <div className="ornament-divider font-heading text-sm">&#x2726;</div>
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-4 text-xs font-heading tracking-wider">
        <a
          href="https://github.com/phortx/mithril-forge"
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          <Code2 size={14} />
          GitHub
        </a>
        <a
          href="https://github.com/phortx/mithril-forge/issues/new"
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          <Bug size={14} />
          Report Bug
        </a>
<span className="text-forge-tan/40">v0.1</span>
      </div>
    </footer>
  )
}
