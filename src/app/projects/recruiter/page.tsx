'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { allProjects } from '@/data/projects'

const FEATURED_IDS = new Set([28, 5, 1, 14, 11])

const STATS = [
  { label: 'Years shipping', value: '3+' },
  { label: 'Projects on GitHub', value: '30+' },
  { label: 'AWS Lambda fns shipped', value: '94' },
  { label: 'Production uptime', value: '99%+' },
]

type SummaryEntry = { head: string; note?: string; body: string }

const SUMMARY: SummaryEntry[] = [
  {
    head: 'Current — teli.ai',
    body: 'Agentic voice + SMS for the mortgage industry. Function calling with structured-output tool schemas, streaming ASR with partial-result handling, sub-300ms TTS, hybrid RAG (BM25 + dense) over pgvector with cross-encoder reranking, multi-tenant Postgres RLS per loan officer, 10DLC SMS state machine. Clients: bevri.ai, NEXA Lending.',
  },
  {
    head: 'Then — Lawrence Tech (GRA)',
    body: 'Multi-agent orchestration with CrewAI + LangGraph + MCP servers, deployed on AWS Fargate/EKS. Hybrid OpenSearch retrieval over 10K+ docs with sub-second latency. Benchmarked no-code vs coded agent stacks to inform downstream work.',
  },
  {
    head: 'Before — Infor LN CD (Custom Development) team',
    note: 'Onsite, Hyderabad — built ERP integrations for clients like Ferrari, Boeing, and Triumph',
    body: 'REST integrations and event flows through Infor ION + AWS Lambda/S3. Containerized service deploys, cut release turnaround by 25%, drove pipeline failure frequency from weekly to monthly.',
  },
]

export default function RecruiterProjectsPage() {
  const [active, setActive] = useState<'featured' | 'all'>('featured')
  const projects = useMemo(
    () => (active === 'featured' ? allProjects.filter(p => FEATURED_IDS.has(p.id)) : allProjects),
    [active],
  )

  return (
    <main className="min-h-screen" style={{ background: 'var(--canvas)' }}>
      <header
        className="sticky top-0 z-30"
        style={{ background: 'rgba(14, 12, 10, 0.85)', borderBottom: '1px solid var(--hairline)', backdropFilter: 'blur(8px)' }}
      >
        <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[var(--ink)] text-[13px] font-medium">
            <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: '#67E8F9', boxShadow: '0 0 8px #67E8F9' }} />
            Harsha Yellela
            <span className="text-[var(--mute)] text-[11px]">·</span>
            <span className="text-[var(--body)] text-[11px]">recruiter view</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/resume"
              className="px-3 py-1.5 rounded-[3px] text-[12px] font-medium"
              style={{ background: 'var(--ink)', color: 'var(--on-primary)' }}
            >
              Résumé
            </Link>
            <Link
              href="/teli"
              className="px-3 py-1.5 rounded-[3px] text-[12px] font-medium inline-flex items-center gap-1.5"
              style={{ border: '1px solid rgba(245, 158, 11, 0.4)', color: '#F59E0B' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
              Watch the call →
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 pt-12">
        <p className="mono text-[11px] uppercase tracking-[0.32em] text-[var(--mute)]">For recruiters</p>
        <h1 className="text-[var(--ink)] text-[40px] md:text-[52px] font-normal mt-3" style={{ letterSpacing: '-0.025em', lineHeight: 1.04 }}>
          The 60-second version of <span className="serif-italic text-[var(--body-strong)]">my work</span>.
        </h1>
        <p className="text-[var(--body)] text-[15px] mt-4 max-w-2xl leading-[1.6]">
          Full Stack Engineer at <span className="text-[#F59E0B] font-medium">teli.ai</span>{' '}
          shipping agentic voice + SMS for the mortgage industry. The graph at{' '}
          <Link href="/" className="text-[#67E8F9] underline underline-offset-2">/</Link>{' '}
          is the long version; this page is the short one.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
        {STATS.map(s => (
          <div
            key={s.label}
            className="rounded-[4px] px-4 py-3"
            style={{ background: 'var(--canvas-soft)', border: '1px solid var(--hairline)' }}
          >
            <p className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--mute)]">{s.label}</p>
            <p className="text-[var(--ink)] text-[24px] font-normal mt-1 tracking-[-0.02em]">{s.value}</p>
          </div>
        ))}
      </section>

      <section className="max-w-5xl mx-auto px-6 mt-14">
        <p className="mono text-[11px] uppercase tracking-[0.32em] text-[var(--mute)] mb-5">Career arc</p>
        <div className="space-y-6">
          {SUMMARY.map(s => (
            <article key={s.head}>
              <h3 className="text-[var(--ink)] text-[17px] font-medium tracking-[-0.015em]">{s.head}</h3>
              {s.note && (
                <p className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--mute)] mt-1 mb-1.5">
                  {s.note}
                </p>
              )}
              <p className="text-[var(--body-strong)] text-[14px] leading-[1.6]">{s.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 mt-14">
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="mono text-[11px] uppercase tracking-[0.32em] text-[var(--mute)]">Projects</p>
            <h2 className="text-[var(--ink)] text-[24px] font-medium mt-1 tracking-[-0.015em]">
              {active === 'featured' ? 'Top picks' : 'All of them'}
            </h2>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setActive('featured')}
              className={`mono px-2.5 py-1 rounded-[3px] text-[11px] tracking-[0.05em] ${active === 'featured' ? 'text-[var(--on-primary)]' : 'text-[var(--body)]'}`}
              style={
                active === 'featured'
                  ? { background: 'var(--ink)' }
                  : { background: 'var(--canvas-soft)', border: '1px solid var(--hairline)' }
              }
            >
              Featured
            </button>
            <button
              onClick={() => setActive('all')}
              className={`mono px-2.5 py-1 rounded-[3px] text-[11px] tracking-[0.05em] ${active === 'all' ? 'text-[var(--on-primary)]' : 'text-[var(--body)]'}`}
              style={
                active === 'all'
                  ? { background: 'var(--ink)' }
                  : { background: 'var(--canvas-soft)', border: '1px solid var(--hairline)' }
              }
            >
              All
            </button>
          </div>
        </div>

        <ul style={{ borderTop: '1px solid var(--hairline)' }}>
          {projects.map(p => (
            <li
              key={p.id}
              className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] items-baseline gap-4 py-4"
              style={{ borderBottom: '1px solid var(--hairline)' }}
            >
              <div>
                <p className="text-[var(--ink)] text-[15px] font-medium tracking-[-0.01em]">{p.name}</p>
                <p className="mono text-[10px] uppercase tracking-[0.15em] text-[var(--mute)] mt-1">{p.category}</p>
              </div>
              <p className="text-[var(--body)] text-[13px] leading-[1.5]">{p.description}</p>
              <div className="flex items-center gap-3 mono text-[11px]">
                {p.tech.slice(0, 3).map(t => (
                  <span key={t} className="text-[var(--mute)]">{t}</span>
                ))}
                {p.github && (
                  <a href={p.github} target="_blank" rel="noopener noreferrer" className="text-[#67E8F9] underline underline-offset-2">
                    GitHub ↗
                  </a>
                )}
                {p.live && (
                  <a href={p.live} target="_blank" rel="noopener noreferrer" className="text-[#67E8F9] underline underline-offset-2">
                    Live ↗
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="max-w-5xl mx-auto px-6 mt-14 mb-16">
        <div
          className="rounded-[4px] p-6"
          style={{ background: 'var(--canvas-soft)', border: '1px solid var(--hairline)' }}
        >
          <p className="mono text-[10px] uppercase tracking-[0.32em] text-[var(--mute)] mb-2">Get in touch</p>
          <h3 className="text-[var(--ink)] text-[22px] font-medium tracking-[-0.015em]">Talk to me directly</h3>
          <p className="text-[var(--body)] text-[14px] mt-2 max-w-xl leading-[1.55]">
            On F-1 OPT, authorized to work in the US, H-1B sponsorship needed long-term. Remote or
            relocate, two weeks' notice.
          </p>
          <div className="flex flex-wrap gap-1.5 mt-4">
            <a
              href="mailto:harsha.yellela@gmail.com"
              className="px-3 py-1.5 rounded-[3px] text-[12px] font-medium"
              style={{ background: 'var(--ink)', color: 'var(--on-primary)' }}
            >
              Email
            </a>
            <a
              href="/linkedin"
              className="px-3 py-1.5 rounded-[3px] text-[12px] font-medium text-[var(--body-strong)]"
              style={{ border: '1px solid var(--hairline)' }}
            >
              LinkedIn
            </a>
            <a
              href="/github"
              className="px-3 py-1.5 rounded-[3px] text-[12px] font-medium text-[var(--body-strong)]"
              style={{ border: '1px solid var(--hairline)' }}
            >
              GitHub
            </a>
          </div>
        </div>
      </section>

      <footer style={{ borderTop: '1px solid var(--hairline)' }}>
        <div className="max-w-5xl mx-auto px-6 py-6 flex flex-wrap items-center justify-between gap-3 text-[12px]">
          <p className="text-[var(--mute)]">© {new Date().getFullYear()} Harsha Yellela.</p>
          <nav className="flex items-center gap-4 mono text-[11px] uppercase tracking-[0.12em]">
            <Link href="/" className="text-[var(--body)] hover:text-[var(--ink)]">graph</Link>
            <Link href="/teli" className="text-[var(--body)] hover:text-[var(--ink)]">/teli</Link>
            <Link href="/projects" className="text-[var(--body)] hover:text-[var(--ink)]">all projects</Link>
            <Link href="/privacy" className="text-[var(--body)] hover:text-[var(--ink)]">privacy</Link>
            <Link href="/terms" className="text-[var(--body)] hover:text-[var(--ink)]">terms</Link>
          </nav>
        </div>
      </footer>
    </main>
  )
}
