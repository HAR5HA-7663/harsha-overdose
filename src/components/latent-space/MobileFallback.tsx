'use client'

import Link from 'next/link'
import { NODES } from '../../data/nodes'

type Props = {
  /** When true, render at all viewport widths (used as the WebGL-unavailable fallback). */
  force?: boolean
  /** When true, render full-screen (not a bottom sheet) — paired with force for no-WebGL hosts. */
  fullScreen?: boolean
}

export function MobileFallback({ force = false, fullScreen = false }: Props) {
  const projects = NODES.filter(n => n.kind === 'project')
  const teli = NODES.find(n => n.id === 'now')

  const visibilityClass = force ? '' : 'lg:hidden'
  const layoutClass = fullScreen
    ? 'fixed inset-0 z-20 overflow-y-auto pt-24 pb-12 px-4 pointer-events-auto'
    : 'fixed bottom-0 inset-x-0 z-20 max-h-[58vh] overflow-y-auto pt-10 pb-6 px-4 pointer-events-auto'
  const background = fullScreen
    ? 'var(--canvas)'
    : 'linear-gradient(to top, var(--canvas) 60%, transparent)'

  return (
    <section
      className={`${visibilityClass} ${layoutClass}`}
      style={{ background }}
    >
      <div className="max-w-md mx-auto space-y-5">
        <div>
          <p className="mono text-[10px] tracking-[0.3em] uppercase text-[var(--mute)] mb-1.5">Now</p>
          <p className="text-[var(--body-strong)] text-[14px] leading-[1.55]">
            <span className="text-[#F59E0B] font-medium">teli.ai</span> — Full Stack Engineer.
            Agentic voice + SMS for mortgage LOs (bevri.ai, NEXA Lending).{' '}
            <span className="mono text-[12px] text-[var(--body)]">function calling · streaming ASR/TTS · hybrid RAG over pgvector · multi-tenant RLS.</span>
          </p>
          {teli && (
            <Link
              href="/teli"
              className="inline-flex items-center gap-2 mt-3 px-3.5 py-2 rounded-[3px] text-[12px] font-medium"
              style={{ background: '#F59E0B', color: 'var(--on-primary)' }}
            >
              ▶ Watch the call →
            </Link>
          )}
        </div>

        <div>
          <p className="mono text-[10px] tracking-[0.3em] uppercase text-[var(--mute)] mb-2">Selected work</p>
          <ul className="space-y-2">
            {projects.slice(0, 5).map(p => {
              const d = p.detail.kind === 'project' ? p.detail : null
              return (
                <li key={p.id} className="text-[13px] leading-[1.4]">
                  <span className="text-[var(--ink)] font-medium">{p.title}</span>
                  <span className="text-[var(--mute)] mx-1.5">·</span>
                  <span className="text-[var(--body)]">{p.oneLiner}</span>
                  {d?.github && (
                    <a
                      href={d.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-[11px] text-[#67E8F9] underline underline-offset-2"
                    >
                      GitHub
                    </a>
                  )}
                </li>
              )
            })}
          </ul>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <Link
            href="/resume"
            className="px-3 py-1.5 rounded-[3px] text-[12px] font-medium"
            style={{ background: 'var(--ink)', color: 'var(--on-primary)' }}
          >
            Résumé
          </Link>
          <a
            href="mailto:harsha.yellela@gmail.com"
            className="px-3 py-1.5 rounded-[3px] text-[12px] font-medium text-[var(--body-strong)]"
            style={{ border: '1px solid var(--hairline)' }}
          >
            Email
          </a>
          <a
            href="https://github.com/HAR5HA-7663"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-[3px] text-[12px] font-medium text-[var(--body-strong)]"
            style={{ border: '1px solid var(--hairline)' }}
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/har5ha-7663"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-[3px] text-[12px] font-medium text-[var(--body-strong)]"
            style={{ border: '1px solid var(--hairline)' }}
          >
            LinkedIn
          </a>
        </div>

        {!fullScreen && (
          <p className="text-center mono text-[var(--mute)] text-[10px] tracking-[0.25em] uppercase pt-2">
            The graph above is interactive on desktop.
          </p>
        )}
        {fullScreen && (
          <div className="rounded-[4px] p-3.5 mt-2" style={{ background: 'var(--canvas-soft)', border: '1px solid var(--hairline)' }}>
            <p className="mono text-[10px] uppercase tracking-[0.25em] text-[var(--mute)] mb-2">3D graph · degraded</p>
            <p className="text-[var(--body)] text-[12px] leading-[1.55]">
              Your browser disabled WebGL so the interactive 3D knowledge-graph can&apos;t render.
              Try Chrome / Safari / Firefox with hardware acceleration enabled — the read-only
              version above still has everything.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
