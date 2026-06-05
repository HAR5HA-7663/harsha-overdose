'use client'

import { useEffect, useState } from 'react'

type Props = {
  query: string
  onQueryChange: (q: string) => void
  matchCount: number
}

const SUGGESTIONS = ['voice agents', 'RAG', 'mortgage', 'AWS', 'Fine-tuning', 'pgvector']

export function SearchOverlay({ query, onQueryChange, matchCount }: Props) {
  const [placeholderIdx, setPlaceholderIdx] = useState(0)

  useEffect(() => {
    if (query) return
    const t = setInterval(() => setPlaceholderIdx(i => (i + 1) % SUGGESTIONS.length), 2400)
    return () => clearInterval(t)
  }, [query])

  return (
    <div className="fixed top-16 sm:top-[72px] left-1/2 -translate-x-1/2 z-20 w-[88%] max-w-lg pointer-events-none">
      <div
        className="pointer-events-auto rounded-[4px]"
        style={{ background: 'var(--canvas-soft)', border: '1px solid var(--hairline)' }}
      >
        <div className="flex items-center gap-3 px-3.5 py-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aea69c" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={e => onQueryChange(e.target.value)}
            placeholder={`Search the graph · try "${SUGGESTIONS[placeholderIdx]}"`}
            className="bg-transparent flex-1 text-[var(--ink)] text-[13px] placeholder:text-[var(--mute)] focus:outline-none"
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button
              onClick={() => onQueryChange('')}
              className="text-[var(--mute)] hover:text-[var(--ink)] text-[11px] tracking-wide font-medium"
            >
              clear
            </button>
          )}
          {query && (
            <span className="mono text-[11px] tabular-nums" style={{ color: '#67E8F9' }}>
              {matchCount}
            </span>
          )}
        </div>
      </div>
      <p className="mono text-center text-[var(--mute)] text-[10px] tracking-[0.3em] mt-2 select-none uppercase">
        cosine similarity · client-side · ⌘k
      </p>
    </div>
  )
}
