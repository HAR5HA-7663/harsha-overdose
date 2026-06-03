'use client'

import Link from 'next/link'
import { NODES } from '../../data/nodes'

// Visible only on small screens — gives recruiters a scannable text view
// when the 3D galaxy isn't enough on a phone.
export function MobileFallback() {
  const projects = NODES.filter(n => n.kind === 'project')
  const teli = NODES.find(n => n.id === 'now')

  return (
    <section className="lg:hidden fixed bottom-0 inset-x-0 z-20 max-h-[55vh] overflow-y-auto bg-gradient-to-t from-[#06080F] via-[#06080F]/95 to-transparent pt-12 pb-6 px-4 pointer-events-auto">
      <div className="max-w-md mx-auto space-y-5">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-1">Now</p>
          <p className="text-white text-sm leading-snug">
            <span className="text-[#FFB347] font-semibold">teli.ai</span> · Full Stack Engineer ·
            building voice + SMS AI agents for mortgage clients (bevri.ai, NEXA Lending).
            GPT-4o · LangChain · pgvector · AWS.
          </p>
          {teli && (
            <Link
              href="/teli"
              className="inline-block mt-2 px-4 py-2 rounded-md text-[11px] font-semibold tracking-wider uppercase"
              style={{ background: '#FFB347', color: '#0A0D14' }}
            >
              ▶ Watch the call →
            </Link>
          )}
        </div>

        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-1">Selected work</p>
          <ul className="space-y-1.5">
            {projects.slice(0, 5).map(p => {
              const d = p.detail.kind === 'project' ? p.detail : null
              return (
                <li key={p.id} className="text-xs text-white/75">
                  <span className="text-white font-medium">{p.title}</span>
                  <span className="text-white/45 mx-1.5">·</span>
                  <span className="text-white/55">{p.oneLiner}</span>
                  {d?.github && (
                    <a href={d.github} target="_blank" rel="noopener noreferrer" className="ml-2 text-[10px] text-[#7DD3FC] underline">
                      GitHub
                    </a>
                  )}
                </li>
              )
            })}
          </ul>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <a
            href="/Harsha_Yellela_resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-md text-[11px] font-semibold tracking-wider uppercase"
            style={{ background: '#D4A855', color: '#0A0D14' }}
          >
            ↓ Résumé
          </a>
          <a
            href="mailto:harsha.yellela@gmail.com"
            className="px-3.5 py-2 rounded-md text-[11px] font-semibold tracking-wider uppercase border border-white/20 text-white/85"
          >
            ✉ Email
          </a>
          <a
            href="https://github.com/HAR5HA-7663"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-md text-[11px] font-semibold tracking-wider uppercase border border-white/20 text-white/85"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/har5ha-7663"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-md text-[11px] font-semibold tracking-wider uppercase border border-white/20 text-white/85"
          >
            LinkedIn
          </a>
        </div>

        <p className="text-center text-white/30 text-[10px] tracking-widest uppercase pt-2">
          The latent space above is interactive on desktop.
        </p>
      </div>
    </section>
  )
}
