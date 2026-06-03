'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Props = {
  smsSent: boolean
}

const TEN_DLC_STEPS = [
  { code: '01', label: 'Brand registered', detail: 'teli.ai — DUNS verified · Tier 1' },
  { code: '02', label: 'Campaign filed', detail: 'mortgage-qualify-001 · Low-Volume Mixed' },
  { code: '03', label: 'Use case approved', detail: 'Lead Generation · Customer Care' },
  { code: '04', label: 'MO/MT samples', detail: '5 message variants approved by TCR' },
  { code: '05', label: 'Carrier approval', detail: 'AT&T · T-Mobile · Verizon · all green' },
  { code: '06', label: 'Live & throttled', detail: '4,500 segments/day · sub-2s delivery' },
]

const SMS_MESSAGES = [
  { from: 'agent', text: "Hi Sarah, thanks for the call! Here's your refi quick-link: teli.ai/sec/4521", time: '+0:12' },
  { from: 'sarah', text: 'got it, will check it out!', time: '+1:48' },
  { from: 'agent', text: 'Great — Jonathan from NEXA will call you within the hour. Reply STOP to opt out.', time: '+1:52' },
]

export function SMSPanel({ smsSent }: Props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0A0D14]/85 backdrop-blur-md p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Side rail · SMS</p>
          <h3 className="text-white text-sm font-semibold mt-1">10DLC-compliant SMS agent</h3>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] tracking-widest uppercase border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 transition-colors"
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
            transition={{ duration: 0.25 }}
            className="overflow-hidden mb-3"
          >
            <div className="space-y-1.5 py-2 border-y border-white/5">
              {TEN_DLC_STEPS.map((s, i) => (
                <motion.div
                  key={s.code}
                  initial={{ x: -8, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 text-[11px]"
                >
                  <span className="font-mono text-emerald-400">{s.code}</span>
                  <div className="flex-1">
                    <span className="text-white/90">{s.label}</span>
                    <span className="text-white/40 ml-2">{s.detail}</span>
                  </div>
                  <span className="text-emerald-400">✓</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mock phone screen */}
      <div className="rounded-xl bg-black/50 border border-white/5 p-3 min-h-[180px]">
        <p className="text-[10px] text-white/40 mb-2 text-center">+1 (248) 555-0125 · 10DLC verified</p>
        <div className="space-y-2">
          {SMS_MESSAGES.slice(0, smsSent ? SMS_MESSAGES.length : 0).map((m, i) => (
            <motion.div
              key={i}
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.4 }}
              className={`max-w-[80%] rounded-2xl px-3 py-2 text-[12px] ${
                m.from === 'agent'
                  ? 'bg-[#FFB347]/15 text-[#FFD7A6] ml-auto rounded-tr-sm'
                  : 'bg-white/10 text-white/90 rounded-tl-sm'
              }`}
            >
              <p className="leading-snug">{m.text}</p>
              <p className="text-[9px] text-white/40 mt-1 text-right">{m.time}</p>
            </motion.div>
          ))}
          {!smsSent && (
            <p className="text-center text-white/30 text-[11px] italic py-12">
              Waiting for lead qualification …
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
