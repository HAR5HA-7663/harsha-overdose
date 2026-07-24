'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { SMSPanel } from '../../components/teli/SMSPanel'
import { EmailPanel } from '../../components/teli/EmailPanel'
import { Subtitles } from '../../components/teli/Subtitles'
import { EngineerMode } from '../../components/teli/EngineerMode'
import { SceneErrorBoundary } from '../../components/teli/SceneErrorBoundary'
import { BEATS, getCurrentBeat, TOTAL_DURATION, type Beat } from '../../components/teli/choreography'

const CallScene = dynamic(
  () => import('../../components/teli/CallScene').then(m => m.CallScene),
  { ssr: false, loading: () => null },
)

function SceneFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-6">
      <div
        className="max-w-md text-center rounded-[4px] p-6"
        style={{ background: 'var(--canvas-soft)', border: '1px solid var(--hairline)' }}
      >
        <p className="mono text-[10px] uppercase tracking-[0.3em] text-[var(--mute)]">3D scene · degraded</p>
        <h2 className="text-[var(--ink)] text-[18px] font-medium mt-2 tracking-[-0.015em]">
          WebGL unavailable in this browser
        </h2>
        <p className="text-[var(--body)] text-[13px] mt-2 leading-[1.5]">
          The cinematic 3D scene needs hardware-accelerated WebGL. Subtitles,
          progress, SMS, email, and engineer mode below still work.
        </p>
      </div>
    </div>
  )
}

// Architecture key — small static legend in the corner explaining what the
// 4 colored orbs in the scene mean. Renders instead of fighting for label
// real-estate in 3D.
function ArchKey() {
  const items = [
    { label: 'reasoning', sub: 'function calling', color: '#86EFAC' },
    { label: 'voice', sub: 'streaming TTS', color: '#C084FC' },
    { label: 'telephony', sub: 'PSTN', color: '#FFB347' },
    { label: 'pgvector', sub: 'hybrid RAG', color: '#7DD3FC' },
  ]
  return (
    <div
      className="rounded-[4px] px-3 py-2.5 space-y-1.5"
      style={{ background: 'rgba(14, 12, 10, 0.72)', border: '1px solid var(--hairline)', backdropFilter: 'blur(6px)' }}
    >
      <p className="mono text-[9px] uppercase tracking-[0.3em] text-[var(--mute)] mb-1">stack</p>
      {items.map(it => (
        <div key={it.label} className="flex items-center gap-2">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: it.color, boxShadow: `0 0 6px ${it.color}` }}
          />
          <span className="mono text-[11px] text-[var(--ink)] tracking-[-0.005em]">{it.label}</span>
          <span className="mono text-[10px] text-[var(--mute)]">· {it.sub}</span>
        </div>
      ))}
    </div>
  )
}

export default function TeliPage() {
  const [paused, setPaused] = useState(false)
  const [engineerOpen, setEngineerOpen] = useState(false)

  // Discrete choreography state — flips ~16 times per 46s loop. The 60fps
  // clock lives in refs and writes straight to the DOM below, so React only
  // re-renders on actual beat/panel changes instead of every animation frame.
  const [beat, setBeat] = useState<Beat>(BEATS[0])
  const [smsSent, setSmsSent] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [smsPhase, setSmsPhase] = useState<'idle' | 'composing' | 'sent'>('idle')

  const elapsedRef = useRef(0)
  const barRef = useRef<HTMLDivElement>(null)
  const clockRef = useRef<HTMLSpanElement>(null)

  const syncDiscrete = useCallback((elapsed: number) => {
    const t = elapsed % TOTAL_DURATION
    const b = getCurrentBeat(elapsed)
    setBeat(prev => (prev === b ? prev : b))
    const sms = BEATS.some(x => x.emit === 'sms-sent' && x.time <= t)
    const email = BEATS.some(x => x.emit === 'email-sent' && x.time <= t)
    setSmsSent(prev => (prev === sms ? prev : sms))
    setEmailSent(prev => (prev === email ? prev : email))
    const phase: 'idle' | 'composing' | 'sent' = sms ? 'sent' : t >= 22 ? 'composing' : 'idle'
    setSmsPhase(prev => (prev === phase ? prev : phase))
  }, [])

  const paintClock = useCallback((t: number) => {
    if (barRef.current) barRef.current.style.transform = `scaleX(${t / TOTAL_DURATION})`
    if (clockRef.current) clockRef.current.textContent = `${t.toFixed(1)}s / ${TOTAL_DURATION}s`
  }, [])

  useEffect(() => {
    if (paused) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = (now - last) / 1000
      last = now
      elapsedRef.current += dt
      const t = elapsedRef.current % TOTAL_DURATION
      paintClock(t)
      syncDiscrete(elapsedRef.current)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [paused, paintClock, syncDiscrete])

  const replay = useCallback(() => {
    elapsedRef.current = 0
    paintClock(0)
    syncDiscrete(0)
  }, [paintClock, syncDiscrete])

  return (
    <main
      className="fixed inset-0 flex flex-col overflow-y-auto md:grid md:overflow-hidden"
      style={{
        background: 'var(--canvas)',
        gridTemplateRows: 'auto minmax(0, 1fr) auto',
      }}
    >
      {/* ─────────────── BAND 1: HERO ─────────────── */}
      <header
        className="relative z-30 px-5 sm:px-7 pt-3.5 pb-4"
        style={{
          background:
            'linear-gradient(to bottom, var(--canvas) 0%, var(--canvas) 70%, rgba(14, 12, 10, 0.6) 100%)',
          borderBottom: '1px solid var(--hairline)',
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <Link
            href="/"
            className="group flex items-center gap-2 text-[var(--body-strong)] hover:text-[var(--ink)] text-[12px] font-medium px-2.5 py-1.5 rounded-[3px] hover:bg-[var(--canvas-soft)] transition-colors"
          >
            <span className="transition-transform group-hover:-translate-x-0.5">←</span>
            Graph
          </Link>
          <div className="flex items-center gap-2">
            <span
              className="mono flex items-center gap-2 px-2 py-1 rounded-[3px] text-[10px] tracking-[0.2em] uppercase"
              style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.4)', color: '#F59E0B' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
              live · cinematic
            </span>
            <button
              onClick={() => setEngineerOpen(true)}
              className="text-[12px] font-medium text-[var(--body-strong)] hover:text-[var(--ink)] px-2.5 py-1.5 rounded-[3px] hover:bg-[var(--canvas-soft)] transition-colors"
            >
              Engineer mode →
            </button>
          </div>
        </div>
        <div className="text-center max-w-3xl mx-auto">
          <p className="mono text-[10px] uppercase tracking-[0.4em] text-[#F59E0B]">
            teli.ai · sarah chen · refinance · cinematic
          </p>
          <h1
            className="font-display text-[var(--ink)] text-[22px] sm:text-[28px] md:text-[34px] mt-1.5 leading-[1.05] font-normal"
            style={{ letterSpacing: '-0.025em', fontVariationSettings: '"SOFT" 100, "opsz" 144' }}
          >
            A mortgage lead, qualified{' '}
            <span className="serif-italic text-[var(--body-strong)]">in real time</span>
          </h1>
          <p className="text-[var(--body)] text-[12.5px] sm:text-[13.5px] mt-1.5 max-w-2xl mx-auto leading-[1.5]">
            What I ship at teli.ai. Function-calling reasoning + streaming TTS over a telephony layer,
            hybrid RAG over pgvector, SMS + email follow-up — under 45 seconds.
          </p>
        </div>
      </header>

      {/* ─────────────── BAND 2: CINEMA (bounded 3D scene) ─────────────── */}
      {/* On phones the flex layout gives the scene a real, guaranteed height —
          previously the stacked panels in the footer squeezed it to a sliver. */}
      <section className="relative h-[44dvh] shrink-0 md:h-auto md:shrink md:min-h-0">
        <div className="absolute inset-0">
          <SceneErrorBoundary fallback={<SceneFallback />}>
            <CallScene beat={beat} />
          </SceneErrorBoundary>
        </div>

        {/* Subtitles float at the bottom-edge of the scene band, never near the hero */}
        <Subtitles beat={beat} />

        {/* Architecture key — top-left corner of the scene */}
        <div className="absolute top-4 left-4 z-10 pointer-events-auto hidden md:block">
          <ArchKey />
        </div>

        {/* Side rails — anchored to the edges of the cinema band only */}
        <div className="absolute top-1/2 right-4 -translate-y-1/2 z-10 w-[260px] hidden xl:block pointer-events-auto">
          <SMSPanel smsSent={smsSent} phase={smsPhase} />
        </div>
        <div className="absolute top-1/2 left-4 -translate-y-1/2 z-10 w-[260px] hidden xl:block pointer-events-auto">
          <EmailPanel emailSent={emailSent} />
        </div>
      </section>

      {/* ─────────────── BAND 3: CONTROLS + STACKED PANELS ─────────────── */}
      <footer
        className="relative z-30 px-4 sm:px-5 pt-3"
        style={{
          background: 'linear-gradient(to top, var(--canvas) 0%, var(--canvas) 70%, rgba(14, 12, 10, 0.6) 100%)',
          borderTop: '1px solid var(--hairline)',
          paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))',
        }}
      >
        {/* Progress + controls — first on phones so they sit right under the scene */}
        <div className="max-w-4xl mx-auto pointer-events-auto">
          <div
            className="rounded-[4px] px-4 py-2.5 flex items-center gap-3 sm:gap-4"
            style={{ background: 'var(--canvas-soft)', border: '1px solid var(--hairline)' }}
          >
            <button
              onClick={() => setPaused(p => !p)}
              className="text-[var(--ink)] hover:text-[#F59E0B] text-[14px] min-w-11 min-h-11 sm:min-w-6 sm:min-h-6 w-6 h-6 flex items-center justify-center transition-colors"
              aria-label={paused ? 'Play' : 'Pause'}
            >
              {paused ? '▶' : '❚❚'}
            </button>
            <button
              onClick={replay}
              className="text-[var(--body)] hover:text-[var(--ink)] mono text-[11px] tracking-[0.15em] uppercase transition-colors min-h-11 sm:min-h-6 flex items-center"
            >
              ↻ replay
            </button>
            <div className="flex-1 h-0.5 rounded-full overflow-hidden" style={{ background: 'var(--hairline)' }}>
              {/* Driven directly from the rAF loop via ref — scaleX transform,
                  no React re-render and no layout-triggering width animation. */}
              <div
                ref={barRef}
                className="h-full w-full"
                style={{ background: '#F59E0B', transform: 'scaleX(0)', transformOrigin: 'left' }}
              />
            </div>
            <span ref={clockRef} className="mono text-[var(--mute)] text-[10px] tabular-nums">
              0.0s / {TOTAL_DURATION}s
            </span>
          </div>
        </div>

        {/* Side panels stacked at narrow widths */}
        <div className="xl:hidden mt-3 max-w-3xl mx-auto pointer-events-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <SMSPanel smsSent={smsSent} phase={smsPhase} />
            <EmailPanel emailSent={emailSent} />
          </div>
        </div>
      </footer>

      <EngineerMode open={engineerOpen} onClose={() => setEngineerOpen(false)} />
    </main>
  )
}
