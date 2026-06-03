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

  return (
    <main className="fixed inset-0 overflow-hidden bg-[#06080F]">
      <div className="absolute inset-0">
        <CallScene beat={beat} elapsed={elapsed} />
      </div>

      {/* Top nav */}
      <header className="fixed top-0 left-0 right-0 z-20 pointer-events-none">
        <div className="flex items-center justify-between px-6 py-5">
          <Link href="/" className="pointer-events-auto group flex items-center gap-2 text-white/70 hover:text-white text-xs tracking-widest uppercase transition-colors">
            <span className="transition-transform group-hover:-translate-x-0.5">←</span>
            Latent space
          </Link>
          <div className="pointer-events-auto flex items-center gap-4">
            <span className="flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] tracking-widest uppercase bg-[#FFB347]/10 border border-[#FFB347]/40 text-[#FFB347]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFB347] animate-pulse" />
              Live · cinematic
            </span>
            <button
              onClick={() => setEngineerOpen(true)}
              className="text-xs tracking-widest uppercase text-white/55 hover:text-white transition-colors"
            >
              Engineer mode →
            </button>
          </div>
        </div>
      </header>

      {/* Hero overlay */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute top-20 left-1/2 -translate-x-1/2 z-10 text-center px-6 pointer-events-none max-w-3xl"
      >
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#FFB347]">teli.ai · Sarah Chen · refinance · cinematic</p>
        <h1 className="text-white text-3xl md:text-4xl font-bold mt-2" style={{ letterSpacing: '-0.02em' }}>
          A mortgage lead being qualified, in real time
        </h1>
        <p className="text-white/55 text-sm md:text-base mt-2 max-w-2xl mx-auto leading-relaxed">
          This is what I ship at teli.ai. Voice (Retell + ElevenLabs + GPT-4o) calls in,
          RAG over pgvector pulls historical context, the agent qualifies the lead,
          SMS + email follow up — all under 45 seconds.
        </p>
      </motion.div>

      {/* Subtitles */}
      <Subtitles beat={beat} elapsed={elapsed} />

      {/* Progress + controls */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none px-6 pb-5">
        <div className="max-w-4xl mx-auto pointer-events-auto">
          <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-md px-4 py-3 flex items-center gap-4">
            <button
              onClick={() => setPaused(p => !p)}
              className="text-white/70 hover:text-white text-base w-6 h-6 flex items-center justify-center"
              aria-label={paused ? 'Play' : 'Pause'}
            >
              {paused ? '▶' : '❚❚'}
            </button>
            <button
              onClick={() => setElapsed(0)}
              className="text-white/50 hover:text-white text-xs tracking-widest uppercase"
            >
              ↻ Replay
            </button>
            <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full bg-[#FFB347]"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <span className="text-white/40 text-[10px] tabular-nums font-mono">
              {t.toFixed(1)}s / {TOTAL_DURATION}s
            </span>
          </div>
        </div>
      </div>

      {/* Side panels — fixed positioned, do not overlap subtitles */}
      <div className="absolute top-1/2 right-4 -translate-y-1/2 z-10 w-[320px] hidden lg:block">
        <SMSPanel smsSent={smsSent} />
      </div>
      <div className="absolute top-1/2 left-4 -translate-y-1/2 z-10 w-[320px] hidden lg:block">
        <EmailPanel emailSent={emailSent} />
      </div>

      {/* Mobile / tablet: stacked side panels below scene */}
      <div className="lg:hidden absolute inset-x-0 bottom-20 z-10 pointer-events-none">
        <div className="px-4 grid grid-cols-1 gap-3 pointer-events-auto max-h-[42vh] overflow-y-auto">
          <SMSPanel smsSent={smsSent} />
          <EmailPanel emailSent={emailSent} />
        </div>
      </div>

      <EngineerMode open={engineerOpen} onClose={() => setEngineerOpen(false)} />
    </main>
  )
}
