'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

type Props = {
  visible: boolean
}

export function HeroCard({ visible }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 12 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 z-10 px-4 sm:px-0 w-full sm:w-auto pointer-events-none"
    >
      <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-black/55 backdrop-blur-md shadow-2xl px-5 sm:px-6 py-4 pointer-events-auto">
        <div className="flex items-baseline gap-2 mb-1">
          <h1 className="text-white text-lg sm:text-xl font-bold tracking-tight">Harsha Yellela</h1>
          <span className="text-[10px] tracking-widest uppercase text-white/40">3+ yrs</span>
        </div>
        <p className="text-white/80 text-xs sm:text-sm leading-snug">
          Full Stack Engineer @{' '}
          <span className="text-[#FFB347] font-semibold">teli.ai</span>{' '}
          · voice + SMS AI agents for mortgage · GPT-4o · LangChain · AWS
        </p>
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <a
            href="/Harsha_Yellela_resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-md text-[11px] font-semibold tracking-wide uppercase transition-all hover:brightness-110"
            style={{ background: '#D4A855', color: '#0A0D14' }}
          >
            ↓ Résumé
          </a>
          <Link
            href="/teli"
            className="px-3.5 py-1.5 rounded-md text-[11px] font-semibold tracking-wide uppercase transition-all hover:brightness-110 flex items-center gap-1.5"
            style={{ background: 'transparent', border: '1px solid #FFB347', color: '#FFB347' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFB347] animate-pulse" />
            Watch the call →
          </Link>
          <a
            href="mailto:harsha.yellela@gmail.com"
            className="px-3.5 py-1.5 rounded-md text-[11px] font-semibold tracking-wide uppercase text-white/55 hover:text-white transition-colors"
          >
            ✉ Email
          </a>
        </div>
      </div>
    </motion.div>
  )
}
