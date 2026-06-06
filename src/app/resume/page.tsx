'use client'

import Link from 'next/link'
import { useState } from 'react'

const PDF_PATH = '/Harsha_Yellela_SDE.pdf'

export default function ResumePage() {
  const [loaded, setLoaded] = useState(false)

  return (
    <main className="fixed inset-0 overflow-hidden grid" style={{ background: 'var(--canvas)', gridTemplateRows: 'auto 1fr' }}>
      <header
        className="relative z-10 px-5 sm:px-6 py-3 flex items-center justify-between"
        style={{ background: 'var(--canvas)', borderBottom: '1px solid var(--hairline)' }}
      >
        <Link
          href="/"
          className="group flex items-center gap-2 text-[var(--ink)] text-[13px] font-medium px-2.5 py-1.5 rounded-[3px] hover:bg-[var(--canvas-soft)] transition-colors"
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: '#67E8F9', boxShadow: '0 0 8px #67E8F9' }} />
          Harsha Yellela
          <span className="text-[var(--mute)] text-[11px]">·</span>
          <span className="text-[var(--body)] text-[11px]">résumé · SDE</span>
        </Link>

        <div className="flex items-center gap-1.5">
          <a
            href={PDF_PATH}
            download="Harsha_Yellela_SDE.pdf"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] text-[12px] font-medium transition-all hover:brightness-95"
            style={{ background: 'var(--ink)', color: 'var(--on-primary)' }}
          >
            <span>↓</span> Download
          </a>
          <a
            href={PDF_PATH}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] text-[12px] font-medium text-[var(--body-strong)] hover:text-[var(--ink)] hover:bg-[var(--canvas-soft)] transition-colors"
            style={{ border: '1px solid var(--hairline)' }}
          >
            Open in new tab ↗
          </a>
          <a
            href="mailto:harsha.yellela@gmail.com?subject=teli.ai role"
            className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-[3px] text-[12px] font-medium transition-colors"
            style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.4)', color: '#F59E0B' }}
          >
            Email Harsha →
          </a>
        </div>
      </header>

      <section className="relative min-h-0">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <p className="mono text-[11px] uppercase tracking-[0.35em] text-[var(--mute)]">
              loading résumé
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#67E8F9] animate-pulse ml-2 align-middle" />
            </p>
          </div>
        )}
        <iframe
          src={`${PDF_PATH}#toolbar=1&navpanes=0&view=FitH`}
          className="w-full h-full"
          style={{ border: 'none', background: 'var(--canvas-soft)' }}
          title="Harsha Yellela — SDE résumé"
          onLoad={() => setLoaded(true)}
        />

        {/* Below-the-fold backup link for mobile / browsers that refuse to embed PDFs */}
        <noscript>
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <a
              href={PDF_PATH}
              className="rounded-[4px] px-5 py-3 text-[13px] font-medium"
              style={{ background: 'var(--ink)', color: 'var(--on-primary)' }}
            >
              Download résumé PDF
            </a>
          </div>
        </noscript>
      </section>
    </main>
  )
}
