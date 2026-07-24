'use client'

import { useEffect, useRef } from 'react'
import type { Beat } from './choreography'

// The 46s choreography compressed into 7 readable pipeline steps. The strip is
// persistent — captions can fly by, but the flow chart always shows where the
// call is, what's done (✓), and what's coming.
const STEPS = [
  { t: 0,    n: '01', label: 'Incoming call',       color: '#F59E0B' },
  { t: 5,    n: '02', label: 'Borrower intent',     color: '#67E8F9' },
  { t: 9.5,  n: '03', label: 'Reasoning',           color: '#34D399' },
  { t: 13.5, n: '04', label: 'Tool call',           color: '#34D399' },
  { t: 16.5, n: '05', label: 'RAG lookup',          color: '#7DD3FC' },
  { t: 22,   n: '06', label: 'Agent replies',       color: '#C084FC' },
  { t: 33.5, n: '07', label: 'Qualified → SMS + email', color: '#86EFAC' },
]

export function StepFlow({ beat, onSeek }: { beat: Beat; onSeek: (t: number) => void }) {
  // Monotonic: driven by beat start-time, not phase, so the borrower's second
  // line at 31.5s doesn't bounce the highlight backwards.
  const activeIdx = STEPS.reduce((acc, s, i) => (s.t <= beat.time ? i : acc), 0)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef<HTMLButtonElement>(null)

  // Keep the active chip centered in the strip on phones — scroll the strip
  // itself, never the page.
  useEffect(() => {
    const el = activeRef.current
    const sc = scrollerRef.current
    if (!el || !sc || sc.scrollWidth <= sc.clientWidth) return
    sc.scrollTo({ left: el.offsetLeft - (sc.clientWidth - el.clientWidth) / 2, behavior: 'smooth' })
  }, [activeIdx])

  return (
    <div
      className="relative z-20 border-b"
      style={{ background: 'var(--canvas)', borderColor: 'var(--hairline)' }}
      aria-label="Call pipeline steps"
    >
      <div
        ref={scrollerRef}
        className="flex items-center gap-1.5 sm:justify-center overflow-x-auto px-4 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {STEPS.map((s, i) => {
          const done = i < activeIdx
          const active = i === activeIdx
          return (
            <span key={s.n} className="flex items-center gap-1.5 shrink-0">
              {i > 0 && <span className="mono text-[10px] text-[var(--mute)] select-none">→</span>}
              <button
                ref={active ? activeRef : undefined}
                onClick={() => onSeek(s.t)}
                aria-current={active ? 'step' : undefined}
                aria-label={`Jump to step ${s.n}: ${s.label}`}
                title={`Jump to ${s.label}`}
                className="mono inline-flex items-center gap-1.5 px-2 py-1 rounded-[3px] text-[10px] tracking-[0.08em] uppercase whitespace-nowrap cursor-pointer motion-ease motion-base hover:brightness-125"
                style={
                  active
                    ? { background: `${s.color}1f`, border: `1px solid ${s.color}66`, color: s.color }
                    : done
                      ? { border: '1px solid var(--hairline)', color: 'var(--body)' }
                      : { border: '1px solid var(--hairline)', color: 'var(--mute)', opacity: 0.55 }
                }
              >
                <span className="tabular-nums">{done ? '✓' : s.n}</span>
                {s.label}
              </button>
            </span>
          )
        })}
      </div>
    </div>
  )
}
