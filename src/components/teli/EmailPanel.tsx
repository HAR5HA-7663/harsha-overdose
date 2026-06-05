'use client'

import { AnimatePresence, motion } from 'framer-motion'

type Props = {
  emailSent: boolean
}

export function EmailPanel({ emailSent }: Props) {
  return (
    <div
      className="rounded-[4px] p-4"
      style={{ background: 'var(--canvas-soft)', border: '1px solid var(--hairline)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="mono text-[10px] uppercase tracking-[0.3em] text-[var(--mute)]">Email · side rail</p>
          <h3 className="text-[var(--ink)] text-[14px] font-medium mt-0.5 tracking-[-0.01em]">Follow-up campaign</h3>
        </div>
        <span
          className="mono px-2 py-1 rounded-[3px] text-[10px] tracking-widest uppercase"
          style={{ background: 'rgba(251, 113, 133, 0.08)', border: '1px solid rgba(251, 113, 133, 0.4)', color: '#FB7185' }}
        >
          SMTP · BYOD
        </span>
      </div>

      <AnimatePresence>
        {emailSent ? (
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="rounded-[4px] overflow-hidden"
            style={{ background: 'var(--canvas)', border: '1px solid var(--hairline)' }}
          >
            <div
              className="px-3 py-2 text-[11px] flex items-center justify-between"
              style={{ background: 'var(--canvas-soft)', borderBottom: '1px solid var(--hairline)' }}
            >
              <span className="text-[var(--body)]">
                <span className="text-[var(--ink)]">From:</span> jonathan@nexa.loans
              </span>
              <span className="mono text-[#34D399] text-[10px]">DELIVERED</span>
            </div>
            <div className="px-3 py-2 text-[11px] text-[var(--body)]" style={{ borderBottom: '1px solid var(--hairline)' }}>
              <span className="text-[var(--ink)]">To:</span> sarah.chen@gmail.com
            </div>
            <div className="px-3 py-2" style={{ borderBottom: '1px solid var(--hairline)' }}>
              <span className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--mute)]">Subject</span>
              <p className="text-[var(--ink)] text-[12.5px] mt-1">Your refinance options — let's chat tomorrow?</p>
            </div>
            <div className="px-3 py-3 text-[11.5px] text-[var(--body-strong)] leading-[1.55]">
              <p>Hi Sarah,</p>
              <p className="mt-2">
                Following up on your call with our voice agent. Based on your home value and current
                rate, refinancing from a 30-year to a 15-year could save you around{' '}
                <strong className="text-[#F59E0B]">$84,000</strong> over the life of the loan.
              </p>
              <p className="mt-2">
                I've blocked off 30 minutes tomorrow at 2pm ET if you'd like to walk through the numbers.
              </p>
              <p className="mt-2 text-[var(--mute)] serif-italic">— Jonathan · NEXA Lending · NMLS #482718</p>
            </div>
          </motion.div>
        ) : (
          <p className="text-center text-[var(--mute)] text-[11px] py-16 serif-italic">
            email queued behind the SMS follow-up …
          </p>
        )}
      </AnimatePresence>
    </div>
  )
}
