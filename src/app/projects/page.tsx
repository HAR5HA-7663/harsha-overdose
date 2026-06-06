'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { allProjects, categories } from '@/data/projects'

export default function ProjectsPage() {
  const [active, setActive] = useState<string>('All')

  const filtered = useMemo(
    () => (active === 'All' ? allProjects : allProjects.filter(p => p.category === active)),
    [active],
  )

  return (
    <main className="min-h-screen" style={{ background: 'var(--canvas)' }}>
      <header
        className="sticky top-0 z-30"
        style={{ background: 'rgba(14, 12, 10, 0.85)', borderBottom: '1px solid var(--hairline)', backdropFilter: 'blur(8px)' }}
      >
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[var(--ink)] text-[13px] font-medium">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: '#67E8F9', boxShadow: '0 0 8px #67E8F9' }}
            />
            Harsha Yellela
            <span className="text-[var(--mute)] text-[11px]">·</span>
            <span className="text-[var(--body)] text-[11px]">all projects</span>
          </Link>
          <Link
            href="/"
            className="text-[var(--body-strong)] hover:text-[var(--ink)] text-[12px] font-medium px-2.5 py-1.5 rounded-[3px] hover:bg-[var(--canvas-soft)] transition-colors"
          >
            ← back to graph
          </Link>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 pt-10 pb-6">
        <p className="mono text-[11px] uppercase tracking-[0.32em] text-[var(--mute)]">Projects</p>
        <h1 className="text-[var(--ink)] text-[36px] md:text-[44px] font-normal mt-2.5" style={{ letterSpacing: '-0.025em', lineHeight: 1.05 }}>
          {allProjects.length} things <span className="serif-italic text-[var(--body-strong)]">I've shipped</span>
        </h1>
        <p className="text-[var(--body)] text-[14px] mt-3 max-w-2xl leading-[1.55]">
          A flat list, sorted by category. The interactive graph view at{' '}
          <Link href="/" className="text-[#67E8F9] underline underline-offset-2">/</Link>{' '}
          is a better place to explore by topic — this page is for when you want everything at once.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 mb-6">
        <div className="flex flex-wrap gap-1.5">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`mono px-2.5 py-1 rounded-[3px] text-[11px] tracking-[0.05em] transition-colors ${
                active === cat ? 'text-[var(--on-primary)]' : 'text-[var(--body)] hover:text-[var(--ink)]'
              }`}
              style={
                active === cat
                  ? { background: 'var(--ink)' }
                  : { background: 'var(--canvas-soft)', border: '1px solid var(--hairline)' }
              }
            >
              {cat}{' '}
              <span className={active === cat ? 'opacity-60' : 'text-[var(--mute)]'}>
                {cat === 'All' ? allProjects.length : allProjects.filter(p => p.category === cat).length}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <ul style={{ borderTop: '1px solid var(--hairline)' }}>
          {filtered.map(p => (
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

      <footer style={{ borderTop: '1px solid var(--hairline)' }}>
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-wrap items-center justify-between gap-3 text-[12px]">
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
