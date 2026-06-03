'use client'

import { useEffect, useState } from 'react'

type Props = {
  query: string
  onQueryChange: (q: string) => void
  matchCount: number
}

const SUGGESTIONS = ['voice agents', 'RAG', 'mortgage', 'AWS deployment', 'Fine-tuning']

export function SearchOverlay({ query, onQueryChange, matchCount }: Props) {
  const [placeholderIdx, setPlaceholderIdx] = useState(0)

  useEffect(() => {
    if (query) return
    const t = setInterval(() => setPlaceholderIdx(i => (i + 1) % SUGGESTIONS.length), 2400)
    return () => clearInterval(t)
  }, [query])

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-20 w-[92%] max-w-xl pointer-events-none">
      <div className="pointer-events-auto rounded-full border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl">
        <div className="flex items-center gap-3 px-5 py-3">
          <span className="text-[#D4A855] text-lg select-none">◆</span>
          <input
            type="text"
            value={query}
            onChange={e => onQueryChange(e.target.value)}
            placeholder={`Try "${SUGGESTIONS[placeholderIdx]}"`}
            className="bg-transparent flex-1 text-white text-sm placeholder:text-white/30 focus:outline-none"
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button
              onClick={() => onQueryChange('')}
              className="text-white/40 hover:text-white text-xs tracking-wider"
            >
              CLEAR
            </button>
          )}
          {query && (
            <span className="text-[#D4A855] text-xs tabular-nums">{matchCount} matches</span>
          )}
        </div>
      </div>
      <p className="text-center text-white/30 text-[10px] tracking-widest mt-2 select-none">
        SEARCH THE LATENT SPACE · COSINE SIMILARITY · CLIENT-SIDE
      </p>
    </div>
  )
}
