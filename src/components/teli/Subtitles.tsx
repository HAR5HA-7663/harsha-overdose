'use client'

import { AnimatePresence, motion } from 'framer-motion'
import type { Beat } from './choreography'

type Props = { beat: Beat; elapsed: number }

const SPEAKER_LABEL: Record<NonNullable<Beat['speaker']>, { name: string; color: string }> = {
  sarah: { name: 'Sarah Chen', color: '#67E8F9' },
  agent: { name: 'teli.ai agent', color: '#F59E0B' },
}

const PHASE_LABEL: Record<Beat['phase'], string> = {
  ringing: 'ringing',
  borrower: 'borrower',
  thinking: 'reasoning · thinking',
  'tool-call': 'function call',
  rag: 'pgvector · rag',
  agent: 'agent · tts',
  qualified: 'qualified',
  idle: 'idle',
}

const PHASE_COLOR: Record<Beat['phase'], string> = {
  ringing: '#F59E0B',
  borrower: '#67E8F9',
  thinking: '#34D399',
  'tool-call': '#34D399',
  rag: '#67E8F9',
  agent: '#A78BFA',
  qualified: '#34D399',
  idle: '#aea69c',
}

export function Subtitles({ beat }: Props) {
  const speaker = beat.speaker ? SPEAKER_LABEL[beat.speaker] : null
  const isCode = beat.phase === 'thinking' || beat.phase === 'tool-call' || beat.phase === 'rag'

  return (
    <div className="absolute inset-x-0 bottom-28 z-10 px-6 pointer-events-none">
      <div className="max-w-3xl mx-auto text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${beat.time}-${beat.caption}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <span
                className="mono px-2 py-0.5 rounded-[3px] text-[10px] tracking-[0.2em] uppercase"
                style={{
                  background: `${PHASE_COLOR[beat.phase]}1f`,
                  color: PHASE_COLOR[beat.phase],
                  border: `1px solid ${PHASE_COLOR[beat.phase]}55`,
                }}
              >
                {PHASE_LABEL[beat.phase]}
              </span>
              {speaker && (
                <span className="mono text-[10px] tracking-[0.2em] uppercase" style={{ color: speaker.color }}>
                  {speaker.name}
                </span>
              )}
            </div>
            {isCode ? (
              <p className="mono text-[13px] text-[var(--body-strong)] leading-snug" style={{ textShadow: '0 0 18px rgba(0,0,0,0.85)' }}>
                {beat.caption}
              </p>
            ) : (
              <p className="text-[var(--ink)] text-[16px] md:text-[18px] leading-snug" style={{ textShadow: '0 0 22px rgba(0,0,0,0.9)', letterSpacing: '-0.01em' }}>
                {beat.caption}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
