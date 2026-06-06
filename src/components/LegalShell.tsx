'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'

type Props = {
  title: string
  effectiveDate: string
  children: ReactNode
}

export function LegalShell({ title, effectiveDate, children }: Props) {
  return (
    <main className="min-h-screen" style={{ background: 'var(--canvas)' }}>
      <header className="sticky top-0 z-30" style={{ background: 'rgba(14, 12, 10, 0.85)', borderBottom: '1px solid var(--hairline)', backdropFilter: 'blur(8px)' }}>
        <div className="max-w-3xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[var(--ink)] text-[13px] font-medium">
            <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: '#67E8F9', boxShadow: '0 0 8px #67E8F9' }} />
            Harsha Yellela
            <span className="text-[var(--mute)] text-[11px]">·</span>
            <span className="text-[var(--body)] text-[11px]">har5ha.in</span>
          </Link>
          <Link
            href="/"
            className="text-[var(--body-strong)] hover:text-[var(--ink)] text-[12px] font-medium px-2.5 py-1.5 rounded-[3px] hover:bg-[var(--canvas-soft)] transition-colors"
          >
            ← back to graph
          </Link>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-6 py-12">
        <p className="mono text-[11px] uppercase tracking-[0.32em] text-[var(--mute)]">Legal</p>
        <h1 className="text-[var(--ink)] text-[40px] md:text-[48px] font-normal mt-3" style={{ letterSpacing: '-0.025em', lineHeight: 1.05 }}>
          {title}
        </h1>
        <p className="text-[var(--body)] text-[13px] mt-3 mono">Effective {effectiveDate}</p>

        <div className="h-px my-9" style={{ background: 'var(--hairline)' }} />

        <div className="prose-warp space-y-7 text-[var(--body-strong)] text-[15px] leading-[1.65]">
          {children}
        </div>

        <div className="h-px my-12" style={{ background: 'var(--hairline)' }} />

        <p className="text-[var(--mute)] text-[13px] leading-[1.55]">
          Questions about this document? Email{' '}
          <a href="mailto:harsha.yellela@gmail.com" className="text-[var(--ink)] underline underline-offset-2">harsha.yellela@gmail.com</a>.
        </p>
        <p className="text-[var(--mute)] text-[12px] mt-2 mono">
          Harsha Yellela · United States
        </p>
      </article>

      <footer style={{ borderTop: '1px solid var(--hairline)' }}>
        <div className="max-w-3xl mx-auto px-6 py-6 flex flex-wrap items-center justify-between gap-3 text-[12px]">
          <p className="text-[var(--mute)]">© {new Date().getFullYear()} Harsha Yellela.</p>
          <nav className="flex items-center gap-4 mono text-[11px] uppercase tracking-[0.12em]">
            <Link href="/" className="text-[var(--body)] hover:text-[var(--ink)]">graph</Link>
            <Link href="/teli" className="text-[var(--body)] hover:text-[var(--ink)]">/teli</Link>
            <Link href="/privacy" className="text-[var(--body)] hover:text-[var(--ink)]">privacy</Link>
            <Link href="/terms" className="text-[var(--body)] hover:text-[var(--ink)]">terms</Link>
          </nav>
        </div>
      </footer>
    </main>
  )
}
