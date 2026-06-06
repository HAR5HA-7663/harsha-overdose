'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

type Props = {
  visible: boolean
}

export function HeroCard({ visible }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 16 }}
      transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
      className="hidden lg:block fixed bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
    >
      <div
        className="rounded-[4px] px-5 py-4 pointer-events-auto max-w-md backdrop-blur-md"
        style={{
          background: 'rgba(40, 35, 31, 0.78)',
          border: '1px solid var(--hairline)',
          boxShadow: '0 1px 0 rgba(255,255,255,0.04) inset, 0 12px 40px rgba(0,0,0,0.45)',
        }}
      >
        <div className="flex items-baseline gap-2 mb-1.5">
          <h1 className="font-display text-[var(--ink)] text-[22px] leading-[1.1] font-normal" style={{ letterSpacing: '-0.02em', fontVariationSettings: '"SOFT" 100, "opsz" 144' }}>
            Harsha Yellela
          </h1>
          <span className="serif-italic text-[var(--mute)] text-[15px]">— full-stack &amp; AI</span>
        </div>
        <p className="text-[var(--body)] text-[13px] leading-[1.55]">
          Full Stack Engineer at{' '}
          <span className="text-[#F59E0B] font-medium">teli.ai</span>
          . Agentic voice + SMS for mortgage LOs.{' '}
          <span className="mono text-[12px] text-[var(--body-strong)]">function calling · streaming ASR/TTS · hybrid RAG over pgvector · multi-tenant RLS.</span>
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
