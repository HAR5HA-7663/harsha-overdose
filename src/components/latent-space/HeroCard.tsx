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
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="hidden lg:block fixed bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
    >
      <div
        className="rounded-[4px] px-5 py-4 pointer-events-auto max-w-md"
        style={{ background: 'var(--canvas-soft)', border: '1px solid var(--hairline)' }}
      >
        <div className="flex items-baseline gap-2 mb-1.5">
          <h1 className="text-[var(--ink)] text-[18px] font-medium tracking-[-0.02em]">
            Harsha Yellela
          </h1>
          <span className="serif-italic text-[var(--mute)] text-[14px]">— full-stack &amp; AI</span>
        </div>
        <p className="text-[var(--body)] text-[13px] leading-[1.5]">
          Full Stack Engineer at{' '}
          <span className="text-[#F59E0B] font-medium">teli.ai</span>
          . Agentic voice + SMS for mortgage LOs.{' '}
          <span className="text-[var(--body-strong)]">function calling · streaming ASR/TTS · hybrid RAG over pgvector · multi-tenant Postgres RLS.</span>
        </p>
        <div className="flex flex-wrap items-center gap-1.5 mt-3.5">
          <a
            href="/Harsha_Yellela_resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-[3px] text-[12px] font-medium transition-all hover:brightness-95"
            style={{ background: 'var(--ink)', color: 'var(--on-primary)' }}
          >
            Résumé
          </a>
          <Link
            href="/teli"
            className="px-3 py-1.5 rounded-[3px] text-[12px] font-medium transition-all hover:bg-[rgba(245,158,11,0.1)] flex items-center gap-1.5"
            style={{ border: '1px solid rgba(245, 158, 11, 0.4)', color: '#F59E0B' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
            Watch the call →
          </Link>
          <a
            href="mailto:harsha.yellela@gmail.com"
            className="px-3 py-1.5 rounded-[3px] text-[12px] font-medium text-[var(--body)] hover:text-[var(--ink)] hover:bg-[var(--canvas)] transition-colors"
          >
            Email
          </a>
        </div>
      </div>
    </motion.div>
  )
}
