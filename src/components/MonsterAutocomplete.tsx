import { useState, useRef, useEffect, useCallback } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { searchMonsters } from '../api/open5e'
import type { MonsterSearchResult } from '../types/statBlock'

type MonsterAutocompleteProps = {
  id?: string
  value: string
  onChange: (value: string) => void
  onSelect: (monster: MonsterSearchResult) => void
}

export function MonsterAutocomplete({ id, value, onChange, onSelect }: MonsterAutocompleteProps) {
  const [results, setResults] = useState<MonsterSearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(-1)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const doSearch = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }

    setIsLoading(true)
    try {
      const data = await searchMonsters(query)
      setResults(data)
      setIsOpen(data.length > 0)
      setHighlightIndex(-1)
    } catch {
      setResults([])
      setIsOpen(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleChange = (newValue: string) => {
    onChange(newValue)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => doSearch(newValue), 300)
  }

  const handleSelect = (monster: MonsterSearchResult) => {
    onSelect(monster)
    setIsOpen(false)
    setResults([])
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1))
    } else if (e.key === 'Enter' && highlightIndex >= 0) {
      e.preventDefault()
      handleSelect(results[highlightIndex])
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  return (
    <div ref={containerRef} className="relative flex-1">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (results.length > 0) setIsOpen(true) }}
          placeholder="Search SRD monsters or enter custom name..."
          id={id}
          className="input-forge rounded px-3 py-[9px] pl-9 font-body text-base w-full"
          aria-label="Monster name"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          role="combobox"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-forge-tan">
          {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
        </div>
      </div>

      {isOpen && results.length > 0 && (
        <ul
          className="absolute z-50 mt-1 w-full rounded bg-forge-dark border border-forge-leather shadow-lg max-h-60 overflow-y-auto"
          role="listbox"
        >
          {results.map((monster, i) => (
            <li
              key={monster.slug}
              role="option"
              aria-selected={i === highlightIndex}
              onClick={() => handleSelect(monster)}
              onMouseEnter={() => setHighlightIndex(i)}
              className={`px-3 py-2 cursor-pointer flex items-center justify-between ${
                i === highlightIndex
                  ? 'bg-forge-leather text-forge-parchment-light'
                  : 'text-forge-tan hover:bg-forge-brown'
              }`}
            >
              <span className="font-heading font-semibold">{monster.name}</span>
              <span className="text-xs text-forge-gold-dim">
                CR {monster.challenge_rating} &middot; {monster.type}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
