'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { LivePulse } from './LivePulse'

export function TopNav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 pointer-events-none">
      <div className="flex items-center justify-between px-5 sm:px-6 py-3.5">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="pointer-events-auto"
        >
          <Link
            href="/"
            className="text-[var(--ink)] text-[13px] font-medium tracking-[-0.01em] hover:text-[var(--ink)] flex items-center gap-2"
          >
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: '#67E8F9', boxShadow: '0 0 8px #67E8F9' }}
            />
            Harsha Yellela
            <span className="text-[var(--mute)] text-[11px]">·</span>
            <span className="text-[var(--body)] text-[11px] tracking-[0.05em]">har5ha.in</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="pointer-events-auto flex items-center gap-2"
        >
          <LivePulse />
          <a
            href="/Harsha_Yellela_resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center px-2.5 py-1.5 text-[12px] font-medium text-[var(--body-strong)] hover:text-[var(--ink)] rounded-[3px] hover:bg-[var(--canvas-soft)] transition-colors"
          >
            Résumé
          </a>
          <a
            href="https://github.com/HAR5HA-7663"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center px-2.5 py-1.5 text-[12px] font-medium text-[var(--body-strong)] hover:text-[var(--ink)] rounded-[3px] hover:bg-[var(--canvas-soft)] transition-colors"
          >
            GitHub
          </a>
          <Link
            href="/teli"
            className="group inline-flex items-center gap-2 px-3 py-1.5 ml-1 text-[12px] font-medium rounded-[3px] transition-all"
            style={{
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              color: '#F59E0B',
            }}
          >
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: '#F59E0B', boxShadow: '0 0 6px #F59E0B' }}
            />
            <span className="tracking-tight">Now · /teli</span>
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </motion.div>
      </div>
    </header>
  )
}
