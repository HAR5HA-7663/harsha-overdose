'use client'

import { useEffect, useRef, useState } from 'react'

type Props = {
  query: string
  onQueryChange: (q: string) => void
  matchCount: number
}

const SUGGESTIONS = ['voice agents', 'RAG', 'mortgage', 'AWS', 'fine-tuning', 'pgvector', 'multi-tenant']

export function SearchOverlay({ query, onQueryChange, matchCount }: Props) {
  const [placeholderIdx, setPlaceholderIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (query) return
    const t = setInterval(() => setPlaceholderIdx(i => (i + 1) % SUGGESTIONS.length), 2400)
    return () => clearInterval(t)
  }, [query])

  // ⌘K / Ctrl+K focuses the search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isCmdK = (e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')
      const isSlash = e.key === '/' && document.activeElement?.tagName !== 'INPUT'
      if (isCmdK || isSlash) {
        e.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
      }
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        inputRef.current?.blur()
        if (query) onQueryChange('')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [query, onQueryChange])

  return (
    <div className="fixed top-16 sm:top-[72px] left-1/2 -translate-x-1/2 z-20 w-[88%] max-w-lg pointer-events-none">
      <div
        className="pointer-events-auto rounded-[4px] motion-ease motion-fast"
        style={{
          background: 'var(--canvas-soft)',
          border: '1px solid var(--hairline)',
          boxShadow: '0 1px 0 rgba(255,255,255,0.02) inset, 0 8px 32px rgba(0,0,0,0.4)',
        }}
      >
        <div className="flex items-center gap-3 px-3.5 py-2.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aea69c" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => onQueryChange(e.target.value)}
            placeholder={`Search the graph · try "${SUGGESTIONS[placeholderIdx]}"`}
            className="bg-transparent flex-1 text-[var(--ink)] text-[13px] placeholder:text-[var(--mute)] focus:outline-none"
            autoComplete="off"
            spellCheck={false}
            aria-label="Search the knowledge graph"
          />
          {query ? (
            <>
              <button
                onClick={() => onQueryChange('')}
                className="text-[var(--mute)] hover:text-[var(--ink)] text-[11px] tracking-wide font-medium motion-ease motion-fast"
              >
                clear
              </button>
              <span className="mono text-[11px] tabular-nums" style={{ color: '#67E8F9' }}>
                {matchCount}
              </span>
            </>
          ) : (
            <kbd
              className="mono text-[10px] px-1.5 py-0.5 rounded-[3px] text-[var(--body)] select-none"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--hairline)' }}
            >
              ⌘K
            </kbd>
          )}
        </div>
      </div>
      <p className="mono text-center text-[var(--mute)] text-[10px] tracking-[0.3em] mt-2 select-none uppercase">
        cosine similarity · client-side · press <span className="text-[var(--body)]">/</span> or <span className="text-[var(--body)]">⌘K</span>
      </p>
    </div>
  )
}
