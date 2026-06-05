'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type Props = {
  smsSent: boolean
  phase?: 'idle' | 'composing' | 'sent'
}

const TEN_DLC_STEPS = [
  { code: '01', label: 'Brand registered', detail: 'teli.ai · DUNS verified · Tier 1' },
  { code: '02', label: 'Campaign filed', detail: 'mortgage-qualify-001 · low-volume mixed' },
  { code: '03', label: 'Use case approved', detail: 'Lead Gen · Customer Care' },
  { code: '04', label: 'MO/MT samples', detail: '5 message variants approved by TCR' },
  { code: '05', label: 'Carrier approval', detail: 'AT&T · T-Mobile · Verizon · green' },
  { code: '06', label: 'Live & throttled', detail: '4,500 segments/day · sub-2s' },
]

const SMS_MESSAGES = [
  { from: 'agent', text: "Hi Sarah, thanks for the call! Here's your refi quick-link: teli.ai/sec/4521", time: '+0:12' },
  { from: 'sarah', text: 'got it, will check it out!', time: '+1:48' },
  { from: 'agent', text: 'Great — Jonathan from NEXA will call you within the hour. Reply STOP to opt out.', time: '+1:52' },
]

export function SMSPanel({ smsSent, phase = 'idle' }: Props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className="rounded-[4px] p-4"
      style={{ background: 'var(--canvas-soft)', border: '1px solid var(--hairline)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="mono text-[10px] uppercase tracking-[0.3em] text-[var(--mute)]">SMS · side rail</p>
          <h3 className="text-[var(--ink)] text-[14px] font-medium mt-0.5 tracking-[-0.01em]">10DLC-compliant SMS agent</h3>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 px-2 py-1 rounded-[3px] mono text-[10px] tracking-widest uppercase transition-colors"
          style={{
            background: 'rgba(52, 211, 153, 0.08)',
            border: '1px solid rgba(52, 211, 153, 0.4)',
            color: '#34D399',
          }}
        >
          10DLC ✓
          <span className="text-[8px]">{expanded ? '▲' : '▼'}</span>
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden mb-3"
          >
            <div className="space-y-1 py-2" style={{ borderTop: '1px solid var(--hairline)', borderBottom: '1px solid var(--hairline)' }}>
              {TEN_DLC_STEPS.map((s, i) => (
                <motion.div
                  key={s.code}
                  initial={{ x: -6, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-start gap-3 text-[11px]"
                >
                  <span className="mono text-[#34D399]">{s.code}</span>
                  <div className="flex-1">
                    <span className="text-[var(--ink)]">{s.label}</span>
                    <span className="text-[var(--mute)] ml-2">{s.detail}</span>
                  </div>
                  <span className="text-[#34D399]">✓</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phone-style chat preview */}
      <div className="rounded-[4px] p-3 min-h-[180px]" style={{ background: 'var(--canvas)', border: '1px solid var(--hairline)' }}>
        <p className="mono text-[10px] text-[var(--mute)] mb-2 text-center">+1 (248) 555-0125 · 10DLC verified</p>
        <div className="space-y-2">
          {SMS_MESSAGES.slice(0, smsSent ? SMS_MESSAGES.length : 0).map((m, i) => (
            <motion.div
              key={i}
              initial={{ y: 6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.35 }}
              className={`max-w-[80%] rounded-[6px] px-3 py-2 text-[12px] ${
                m.from === 'agent' ? 'ml-auto' : ''
              }`}
              style={
                m.from === 'agent'
                  ? { background: 'rgba(245, 158, 11, 0.12)', color: '#F5C788' }
                  : { background: 'var(--canvas-soft)', color: 'var(--ink)' }
              }
            >
              <p className="leading-snug">{m.text}</p>
              <p className="mono text-[9px] text-[var(--mute)] mt-1 text-right">{m.time}</p>
            </motion.div>
          ))}
          {!smsSent && phase === 'idle' && (
            <p className="text-center text-[var(--mute)] text-[11px] py-12 serif-italic">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
                waiting for call to start …
              </span>
            </p>
          )}
          {!smsSent && phase === 'composing' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-[80%] rounded-[6px] px-3 py-3 text-[12px] ml-auto"
              style={{ background: 'rgba(245, 158, 11, 0.12)' }}
            >
              <span className="inline-flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F5C788] animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#F5C788] animate-pulse" style={{ animationDelay: '160ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#F5C788] animate-pulse" style={{ animationDelay: '320ms' }} />
              </span>
              <p className="mono text-[10px] text-[var(--mute)] mt-1.5">agent is drafting · 10DLC validated</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
