'use client'

import { motion, AnimatePresence } from 'framer-motion'

type Props = {
  emailSent: boolean
}

export function EmailPanel({ emailSent }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0A0D14]/85 backdrop-blur-md p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Side rail · Email</p>
          <h3 className="text-white text-sm font-semibold mt-1">Follow-up campaign</h3>
        </div>
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] tracking-widest uppercase border border-rose-400/40 bg-rose-400/10 text-rose-300">
          SMTP · BYOD
        </span>
      </div>

      <AnimatePresence>
        {emailSent ? (
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="rounded-lg bg-white/5 border border-white/10 overflow-hidden"
          >
            <div className="bg-white/5 px-3 py-2 border-b border-white/10 text-[11px] text-white/60 flex items-center justify-between">
              <span><span className="text-white/80">From:</span> jonathan@nexa.loans</span>
              <span className="text-emerald-400 text-[10px]">DELIVERED</span>
            </div>
            <div className="px-3 py-2 border-b border-white/10 text-[11px] text-white/60">
              <span className="text-white/80">To:</span> sarah.chen@gmail.com
            </div>
            <div className="px-3 py-2 border-b border-white/10 text-[12px] text-white">
              <span className="text-white/40 text-[10px] uppercase tracking-widest">Subject</span>
              <p className="mt-1">Your refinance options — let's chat tomorrow?</p>
            </div>
            <div className="px-3 py-3 text-[11.5px] text-white/75 leading-relaxed">
              <p>Hi Sarah,</p>
              <p className="mt-2">
                Following up on your call with our voice agent. Based on your home value and current
                rate, refinancing from a 30-year to a 15-year could save you around <strong className="text-[#FFB347]">$84,000</strong> over the life of the loan.
              </p>
              <p className="mt-2">
                I've blocked off 30 minutes tomorrow at 2pm ET if you'd like to walk through the numbers
                together.
              </p>
              <p className="mt-2 text-white/50">— Jonathan · NEXA Lending · NMLS #482718</p>
            </div>
          </motion.div>
        ) : (
          <p className="text-center text-white/30 text-[11px] italic py-16">
            Email queued behind the SMS follow-up …
          </p>
        )}
      </AnimatePresence>
    </div>
  )
}
