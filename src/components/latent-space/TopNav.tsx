'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export function TopNav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 pointer-events-none">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pointer-events-auto"
        >
          <Link href="/" className="text-white/85 font-mono text-[11px] sm:text-xs tracking-[0.25em] hover:text-white whitespace-nowrap">
            HARSHA · YELLELA
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="pointer-events-auto flex items-center gap-3 sm:gap-5"
        >
          <a
            href="/Harsha_Yellela_resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 hover:text-white text-[10px] sm:text-xs tracking-widest uppercase transition-colors hidden sm:inline whitespace-nowrap"
          >
            Résumé
          </a>
          <Link
            href="/teli"
            className="group flex items-center gap-2 text-[10px] sm:text-xs tracking-widest uppercase transition-colors whitespace-nowrap"
            style={{ color: '#FFB347' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFB347] animate-pulse" />
            <span className="group-hover:underline underline-offset-4">Now · /teli</span>
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </motion.div>
      </div>
    </header>
  )
}
