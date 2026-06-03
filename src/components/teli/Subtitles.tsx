'use client'

import { AnimatePresence, motion } from 'framer-motion'
import type { Beat } from './choreography'

type Props = { beat: Beat; elapsed: number }

const SPEAKER_LABEL: Record<NonNullable<Beat['speaker']>, { name: string; color: string }> = {
  sarah: { name: 'Sarah Chen', color: '#7DD3FC' },
  agent: { name: 'teli.ai agent', color: '#FFB347' },
}

const PHASE_LABEL: Record<Beat['phase'], string> = {
  ringing: 'RINGING',
  borrower: 'BORROWER',
  thinking: 'GPT-4o · THINKING',
  'tool-call': 'FUNCTION CALL',
  rag: 'pgvector · RAG',
  agent: 'AGENT · ELEVENLABS',
  qualified: 'QUALIFIED',
  idle: 'IDLE',
}

const PHASE_COLOR: Record<Beat['phase'], string> = {
  ringing: '#FFB347',
  borrower: '#7DD3FC',
  thinking: '#86EFAC',
  'tool-call': '#86EFAC',
  rag: '#7DD3FC',
  agent: '#C084FC',
  qualified: '#86EFAC',
  idle: '#FFFFFF',
}

export function Subtitles({ beat, elapsed }: Props) {
  const speaker = beat.speaker ? SPEAKER_LABEL[beat.speaker] : null
  const isCode = beat.phase === 'thinking' || beat.phase === 'tool-call' || beat.phase === 'rag'

  return (
    <div className="absolute inset-x-0 bottom-32 z-10 px-6 pointer-events-none">
      <div className="max-w-3xl mx-auto text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${beat.time}-${beat.caption}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <span
                className="px-2 py-0.5 rounded-full text-[9px] font-mono tracking-[0.25em] uppercase"
                style={{ background: `${PHASE_COLOR[beat.phase]}22`, color: PHASE_COLOR[beat.phase], border: `1px solid ${PHASE_COLOR[beat.phase]}44` }}
              >
                {PHASE_LABEL[beat.phase]}
              </span>
              {speaker && (
                <span className="text-[10px] tracking-widest uppercase" style={{ color: speaker.color }}>
                  {speaker.name}
                </span>
              )}
            </div>
            {isCode ? (
              <p className="font-mono text-sm text-white/90 leading-snug" style={{ textShadow: '0 0 24px rgba(0,0,0,0.8)' }}>
                {beat.caption}
              </p>
            ) : (
              <p className="text-base md:text-lg text-white leading-snug font-light" style={{ textShadow: '0 0 24px rgba(0,0,0,0.85)' }}>
                {beat.caption}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
