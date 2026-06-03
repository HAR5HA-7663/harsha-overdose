'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export function TopNav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 pointer-events-none">
      <div className="flex items-center justify-between px-6 py-5">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pointer-events-auto"
        >
          <Link href="/" className="text-white/80 font-mono text-sm tracking-widest hover:text-white">
            HARSHA · YELLELA
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="pointer-events-auto flex items-center gap-5"
        >
          <a
            href="/Harsha_Yellela_resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/55 hover:text-white text-xs tracking-widest uppercase transition-colors"
          >
            Résumé
          </a>
          <Link
            href="/teli"
            className="group flex items-center gap-2 text-xs tracking-widest uppercase transition-colors"
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
