'use client'

import { useState, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { SMSPanel } from '../../components/teli/SMSPanel'
import { EmailPanel } from '../../components/teli/EmailPanel'
import { Subtitles } from '../../components/teli/Subtitles'
import { EngineerMode } from '../../components/teli/EngineerMode'
import { BEATS, getCurrentBeat, TOTAL_DURATION } from '../../components/teli/choreography'

const CallScene = dynamic(
  () => import('../../components/teli/CallScene').then(m => m.CallScene),
  { ssr: false, loading: () => null },
)

export default function TeliPage() {
  const [elapsed, setElapsed] = useState(0)
  const [paused, setPaused] = useState(false)
  const [engineerOpen, setEngineerOpen] = useState(false)

  useEffect(() => {
    if (paused) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = (now - last) / 1000
      last = now
      setElapsed(e => e + dt)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [paused])

  const beat = useMemo(() => getCurrentBeat(elapsed), [elapsed])
  const t = elapsed % TOTAL_DURATION
  const smsSent = BEATS.some(b => b.emit === 'sms-sent' && b.time <= t)
  const emailSent = BEATS.some(b => b.emit === 'email-sent' && b.time <= t)
  const progress = (t / TOTAL_DURATION) * 100
  // SMS "composing" phase: from the RAG step onward, agent is drafting the follow-up.
  const smsPhase: 'idle' | 'composing' | 'sent' =
    smsSent ? 'sent' : t >= 22 ? 'composing' : 'idle'

  return (
    <main className="fixed inset-0 overflow-hidden" style={{ background: 'var(--canvas)' }}>
      <div className="absolute inset-0">
        <CallScene beat={beat} elapsed={elapsed} />
      </div>

      {/* Top nav */}
      <header className="fixed top-0 left-0 right-0 z-20 pointer-events-none">
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5">
          <Link
            href="/"
            className="pointer-events-auto group flex items-center gap-2 text-[var(--body-strong)] hover:text-[var(--ink)] text-[12px] font-medium transition-colors px-2.5 py-1.5 rounded-[3px] hover:bg-[var(--canvas-soft)]"
          >
            <span className="transition-transform group-hover:-translate-x-0.5">←</span>
            Graph
          </Link>
          <div className="pointer-events-auto flex items-center gap-2">
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
      </header>

      {/* Hero overlay — fades after intro */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: elapsed > 7 ? 0 : 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute top-14 sm:top-16 left-1/2 -translate-x-1/2 z-10 text-center px-6 pointer-events-none max-w-3xl"
      >
        <p className="mono text-[10px] uppercase tracking-[0.4em] text-[#F59E0B]">teli.ai · sarah chen · refinance · cinematic</p>
        <h1 className="text-[var(--ink)] text-[26px] md:text-[34px] font-medium mt-2.5 leading-[1.1]" style={{ letterSpacing: '-0.025em' }}>
          A mortgage lead, qualified <span className="serif-italic text-[var(--body-strong)]">in real time</span>
        </h1>
        <p className="text-[var(--body)] text-[13px] md:text-[14px] mt-2.5 max-w-2xl mx-auto leading-[1.5]">
          What I ship at teli.ai. Voice on Retell + ElevenLabs + GPT-4o, RAG over pgvector,
          SMS + email follow-up — under 45 seconds.
        </p>
      </motion.div>

      {/* Compact running title — appears after hero fades */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: elapsed > 8 ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className="absolute top-14 sm:top-16 left-1/2 -translate-x-1/2 z-10 px-2.5 py-1 rounded-[3px] pointer-events-none"
        style={{ background: 'var(--canvas-soft)', border: '1px solid var(--hairline)' }}
      >
        <p className="mono text-[10px] uppercase tracking-[0.25em] text-[var(--body)] whitespace-nowrap">
          teli.ai · sarah · refi · live cinematic
        </p>
      </motion.div>

      {/* Subtitles */}
      <Subtitles beat={beat} elapsed={elapsed} />

      {/* Progress + controls */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none px-5 pb-4">
        <div className="max-w-4xl mx-auto pointer-events-auto">
          <div
            className="rounded-[4px] px-4 py-2.5 flex items-center gap-4"
            style={{ background: 'var(--canvas-soft)', border: '1px solid var(--hairline)' }}
          >
            <button
              onClick={() => setPaused(p => !p)}
              className="text-[var(--ink)] hover:text-[#F59E0B] text-[14px] w-6 h-6 flex items-center justify-center transition-colors"
              aria-label={paused ? 'Play' : 'Pause'}
            >
              {paused ? '▶' : '❚❚'}
            </button>
            <button
              onClick={() => setElapsed(0)}
              className="text-[var(--body)] hover:text-[var(--ink)] mono text-[11px] tracking-[0.15em] uppercase transition-colors"
            >
              ↻ replay
            </button>
            <div className="flex-1 h-0.5 rounded-full overflow-hidden" style={{ background: 'var(--hairline)' }}>
              <motion.div
                className="h-full"
                style={{ background: '#F59E0B' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <span className="mono text-[var(--mute)] text-[10px] tabular-nums">
              {t.toFixed(1)}s / {TOTAL_DURATION}s
            </span>
          </div>
        </div>
      </div>

      {/* Side panels — only at very wide viewports (XL+) so we don't crop them */}
      <div className="absolute top-1/2 right-5 -translate-y-1/2 z-10 w-[300px] hidden xl:block">
        <SMSPanel smsSent={smsSent} phase={smsPhase} />
      </div>
      <div className="absolute top-1/2 left-5 -translate-y-1/2 z-10 w-[300px] hidden xl:block">
        <EmailPanel emailSent={emailSent} />
      </div>

      {/* Tablet / mobile: stacked side panels below scene */}
      <div className="xl:hidden absolute inset-x-0 bottom-20 z-10 pointer-events-none">
        <div className="px-4 grid grid-cols-1 md:grid-cols-2 gap-3 pointer-events-auto max-h-[42vh] overflow-y-auto max-w-3xl mx-auto">
          <SMSPanel smsSent={smsSent} phase={smsPhase} />
          <EmailPanel emailSent={emailSent} />
        </div>
      </div>

      <EngineerMode open={engineerOpen} onClose={() => setEngineerOpen(false)} />
    </main>
  )
}
