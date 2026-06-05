'use client'

import Link from 'next/link'
import { NODES } from '../../data/nodes'

export function MobileFallback() {
  const projects = NODES.filter(n => n.kind === 'project')
  const teli = NODES.find(n => n.id === 'now')

  return (
    <section
      className="lg:hidden fixed bottom-0 inset-x-0 z-20 max-h-[58vh] overflow-y-auto pt-10 pb-6 px-4 pointer-events-auto"
      style={{
        background: 'linear-gradient(to top, var(--canvas) 60%, transparent)',
      }}
    >
      <div className="max-w-md mx-auto space-y-5">
        <div>
          <p className="mono text-[10px] tracking-[0.3em] uppercase text-[var(--mute)] mb-1.5">Now</p>
          <p className="text-[var(--body-strong)] text-[14px] leading-[1.55]">
            <span className="text-[#F59E0B] font-medium">teli.ai</span> — Full Stack Engineer.
            Building voice + SMS AI agents for mortgage clients (bevri.ai, NEXA Lending).{' '}
            <span className="mono text-[12px] text-[var(--body)]">GPT-4o · Retell · ElevenLabs · pgvector · AWS.</span>
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
          <a
            href="/Harsha_Yellela_resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-[3px] text-[12px] font-medium"
            style={{ background: 'var(--ink)', color: 'var(--on-primary)' }}
          >
            Résumé
          </a>
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

        <p className="text-center mono text-[var(--mute)] text-[10px] tracking-[0.25em] uppercase pt-2">
          The graph above is interactive on desktop.
        </p>
      </div>
    </section>
  )
}
