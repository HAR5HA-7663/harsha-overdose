'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import type { GalaxyNode, NodeDetail } from '../../data/nodes'
import { KIND_COLORS } from '../../data/nodes'

type Props = {
  node: GalaxyNode | null
  onClose: () => void
}

export function DetailPanel({ node, onClose }: Props) {
  return (
    <AnimatePresence>
      {node && (
        <motion.aside
          key={node.id}
          initial={{ x: '105%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '105%', opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 240 }}
          className="fixed top-0 right-0 h-full w-full sm:w-[440px] z-30 overflow-y-auto"
          style={{ background: 'var(--canvas)', borderLeft: '1px solid var(--hairline)' }}
        >
          <div className="p-7 pt-20 sm:pt-8">
            <div className="flex items-start justify-between mb-5 gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ background: KIND_COLORS[node.kind], boxShadow: `0 0 6px ${KIND_COLORS[node.kind]}` }}
                  />
                  <p className="mono text-[10px] tracking-[0.3em] uppercase text-[var(--mute)]">
                    {kindLabel(node.kind)}
                  </p>
                </div>
                <h2 className="font-display text-[28px] text-[var(--ink)] leading-[1.1] font-normal" style={{ letterSpacing: '-0.02em', fontVariationSettings: '"SOFT" 100, "opsz" 144' }}>
                  {node.title}
                </h2>
                <p className="text-[var(--body)] text-[14px] mt-2 leading-[1.5]">{node.oneLiner}</p>
              </div>
              <button
                onClick={onClose}
                className="text-[var(--mute)] hover:text-[var(--ink)] text-[14px] leading-none -mt-1 px-2 py-1.5 rounded-[3px] hover:bg-[var(--canvas-soft)]"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="h-px my-5" style={{ background: 'var(--hairline)' }} />

            <DetailBody detail={node.detail} />

            <div className="flex flex-wrap gap-1.5 mt-6">
              {node.tags.slice(0, 8).map(tag => (
                <span
                  key={tag}
                  className="mono px-2 py-0.5 rounded-[3px] text-[10px] tracking-[0.05em] text-[var(--body)]"
                  style={{ background: 'var(--canvas-soft)', border: '1px solid var(--hairline)' }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

function DetailBody({ detail }: { detail: NodeDetail }) {
  if (detail.kind === 'about') {
    return (
      <div className="space-y-3.5">
        {detail.bio.map((p, i) => (
          <p key={i} className="text-[var(--body-strong)] text-[14px] leading-[1.55]">{p}</p>
        ))}
        <a
          href={detail.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 px-4 py-2 rounded-[3px] text-[13px] font-medium transition-all hover:brightness-95"
          style={{ background: 'var(--ink)', color: 'var(--on-primary)' }}
        >
          Download résumé →
        </a>
      </div>
    )
  }
  if (detail.kind === 'skill') {
    return (
      <div>
        <p className="text-[var(--body)] text-[13px]">
          Category: <span className="text-[var(--ink)]">{detail.category}</span>
        </p>
        <p className="serif-italic text-[var(--mute)] text-[14px] mt-3 leading-[1.5]">
          Search the graph for related skills using the box above.
        </p>
      </div>
    )
  }
  if (detail.kind === 'project') {
    const cs = detail.caseStudy
    return (
      <div className="space-y-4">
        <p className="text-[var(--body-strong)] text-[14px] leading-[1.55]">{detail.description}</p>
        {detail.impact && (
          <p className="mono text-[11px] uppercase tracking-[0.2em]" style={{ color: '#67E8F9' }}>
            ★ {detail.impact}
          </p>
        )}

        {cs && (
          <div className="rounded-[4px] p-4 space-y-4" style={{ background: 'var(--canvas-soft)', border: '1px solid var(--hairline)' }}>
            <div>
              <p className="mono text-[9px] uppercase tracking-[0.32em] text-[var(--mute)] mb-1">Problem</p>
              <p className="text-[var(--body-strong)] text-[13px] leading-[1.55]">{cs.problem}</p>
            </div>

            <div>
              <p className="mono text-[9px] uppercase tracking-[0.32em] text-[var(--mute)] mb-2">Approach</p>
              <ol className="space-y-2.5">
                {cs.approach.map((step, i) => (
                  <li key={step.title} className="flex gap-3">
                    <span className="mono text-[10px] text-[#67E8F9] mt-1 tabular-nums w-4 flex-shrink-0">
                      0{i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[var(--ink)] text-[12.5px] font-medium leading-[1.35]">{step.title}</p>
                      <p className="text-[var(--body)] text-[12px] leading-[1.5] mt-0.5">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <p className="mono text-[9px] uppercase tracking-[0.32em] text-[var(--mute)] mb-2">Receipts</p>
              <div className="grid grid-cols-3 gap-2">
                {cs.metrics.map(m => (
                  <div
                    key={m.label}
                    className="rounded-[3px] px-2 py-2 text-center"
                    style={{ background: 'var(--canvas)', border: '1px solid var(--hairline)' }}
                  >
                    <p className="font-display text-[var(--ink)] text-[16px] leading-[1.05] font-normal" style={{ letterSpacing: '-0.015em', fontVariationSettings: '"SOFT" 100, "opsz" 144' }}>
                      {m.value}
                    </p>
                    <p className="mono text-[8.5px] uppercase tracking-[0.18em] text-[var(--mute)] mt-1">
                      {m.label}
                    </p>
                  </div>
                ))}
              </div>
              {cs.receipt && (
                <p className="mono text-[10px] text-[var(--mute)] mt-2.5 truncate">
                  <span className="text-[var(--body)]">→</span> {cs.receipt}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-1.5">
          {detail.tech.map(t => (
            <span key={t} className="mono px-2 py-0.5 rounded-[3px] text-[11px] text-[var(--body)]" style={{ background: 'var(--canvas-soft)' }}>
              {t}
            </span>
          ))}
        </div>
        <div className="flex gap-3 pt-1">
          {detail.github && (
            <a href={detail.github} target="_blank" rel="noopener noreferrer" className="text-[12px] text-[var(--body-strong)] underline underline-offset-2 hover:text-[var(--ink)]">
              GitHub ↗
            </a>
          )}
          {detail.live && (
            <a href={detail.live} target="_blank" rel="noopener noreferrer" className="text-[12px] text-[var(--body-strong)] underline underline-offset-2 hover:text-[var(--ink)]">
              Live demo ↗
            </a>
          )}
        </div>
      </div>
    )
  }
  if (detail.kind === 'experience') {
    return (
      <div className="space-y-3">
        <div className="text-[12px] text-[var(--mute)]">
          <span className="text-[var(--body-strong)]">{detail.company}</span> · {detail.location} · {detail.period}
        </div>
        {detail.current && (
          <span
            className="inline-flex items-center gap-2 px-2 py-0.5 rounded-[3px] text-[10px] tracking-widest uppercase mono"
            style={{ background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.4)', color: '#34D399' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" /> Current
          </span>
        )}
        <ul className="space-y-2 mt-3">
          {detail.bullets.map((b, i) => (
            <li key={i} className="text-[var(--body-strong)] text-[13px] leading-[1.55] flex gap-2.5">
              <span className="text-[#67E8F9] flex-shrink-0">›</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }
  if (detail.kind === 'contact') {
    return (
      <div className="space-y-2.5">
        <a href={`mailto:${detail.email}`} className="block text-[13px] text-[var(--body-strong)] hover:text-[var(--ink)]">
          → {detail.email}
        </a>
        <a href={detail.linkedin} target="_blank" rel="noopener noreferrer" className="block text-[13px] text-[var(--body-strong)] hover:text-[var(--ink)]">
          → linkedin.com/in/har5ha-7663
        </a>
        <a href={detail.github} target="_blank" rel="noopener noreferrer" className="block text-[13px] text-[var(--body-strong)] hover:text-[var(--ink)]">
          → github.com/HAR5HA-7663
        </a>
      </div>
    )
  }
  if (detail.kind === 'now') {
    return (
      <div className="space-y-4">
        <p className="text-[var(--body-strong)] text-[14px] leading-[1.55]">{detail.description}</p>
        <div>
          <p className="mono text-[10px] uppercase tracking-[0.28em] text-[var(--mute)] mb-2">Active clients</p>
          <div className="flex flex-wrap gap-1.5">
            {detail.clients.map(c => (
              <span
                key={c}
                className="px-2 py-1 text-[11px] rounded-[3px] font-medium"
                style={{ background: 'rgba(245, 158, 11, 0.08)', color: '#F59E0B', border: '1px solid rgba(245, 158, 11, 0.3)' }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="mono text-[10px] uppercase tracking-[0.28em] text-[var(--mute)] mb-2">Production stack</p>
          <div className="flex flex-wrap gap-1.5">
            {detail.stack.map(s => (
              <span key={s} className="mono px-2 py-0.5 text-[11px] rounded-[3px] text-[var(--body)]" style={{ background: 'var(--canvas-soft)' }}>
                {s}
              </span>
            ))}
          </div>
        </div>
        <Link
          href={detail.route}
          className="inline-flex items-center gap-2 mt-2 px-4 py-2.5 rounded-[3px] text-[13px] font-medium transition-all"
          style={{ background: '#F59E0B', color: 'var(--on-primary)' }}
        >
          ▶ Enter the call →
        </Link>
      </div>
    )
  }
  return null
}

function kindLabel(k: GalaxyNode['kind']): string {
  return {
    about: 'About',
    skill: 'Skill',
    project: 'Project',
    experience: 'Experience',
    contact: 'Contact',
    now: 'Now · current work',
  }[k]
}
