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
          initial={{ x: '110%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '110%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          className="fixed top-0 right-0 h-full w-full sm:w-[440px] z-30 bg-[#0A0D14]/95 backdrop-blur-xl border-l border-white/10 overflow-y-auto"
        >
          <div className="p-7 pt-20 sm:pt-8">
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: KIND_COLORS[node.kind] }}>
                  {kindLabel(node.kind)}
                </p>
                <h2 className="text-2xl font-bold text-white leading-tight">{node.title}</h2>
                <p className="text-white/60 text-sm mt-2 leading-snug">{node.oneLiner}</p>
              </div>
              <button
                onClick={onClose}
                className="text-white/40 hover:text-white text-lg leading-none -mt-1"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent my-5" />

            <DetailBody detail={node.detail} />

            <div className="flex flex-wrap gap-2 mt-6">
              {node.tags.slice(0, 8).map(tag => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full text-[10px] tracking-wider uppercase bg-white/5 text-white/50 border border-white/10"
                >
                  {tag}
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
      <div className="space-y-4">
        {detail.bio.map((p, i) => (
          <p key={i} className="text-white/80 text-sm leading-relaxed">{p}</p>
        ))}
        <a
          href={detail.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 px-5 py-2.5 rounded-md text-sm font-semibold tracking-wide transition-all hover:brightness-110"
          style={{ background: '#D4A855', color: '#0A0D14' }}
        >
          ↓ Download résumé
        </a>
      </div>
    )
  }
  if (detail.kind === 'skill') {
    return (
      <div>
        <p className="text-white/70 text-sm">Category: <span className="text-white">{detail.category}</span></p>
        <p className="text-white/40 text-xs mt-3 leading-relaxed">
          Cluster with related skills via the search bar (try the category name).
        </p>
      </div>
    )
  }
  if (detail.kind === 'project') {
    return (
      <div className="space-y-4">
        <p className="text-white/80 text-sm leading-relaxed">{detail.description}</p>
        {detail.impact && (
          <p className="text-[#D4A855] text-xs uppercase tracking-widest">★ {detail.impact}</p>
        )}
        <div className="flex flex-wrap gap-1.5">
          {detail.tech.map(t => (
            <span key={t} className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-white/60">{t}</span>
          ))}
        </div>
        <div className="flex gap-3 pt-2">
          {detail.github && (
            <a
              href={detail.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/70 underline underline-offset-2 hover:text-white"
            >
              GitHub ↗
            </a>
          )}
          {detail.live && (
            <a
              href={detail.live}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/70 underline underline-offset-2 hover:text-white"
            >
              Live demo ↗
            </a>
          )}
        </div>
      </div>
    )
  }
  if (detail.kind === 'experience') {
    return (
      <div className="space-y-4">
        <div className="text-xs text-white/50">
          <span className="text-white/80">{detail.company}</span> · {detail.location} · {detail.period}
        </div>
        {detail.current && (
          <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full text-[10px] tracking-wider bg-emerald-500/15 border border-emerald-500/40 text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> CURRENT
          </span>
        )}
        <ul className="space-y-2 mt-2">
          {detail.bullets.map((b, i) => (
            <li key={i} className="text-white/75 text-xs leading-relaxed flex gap-2">
              <span className="text-[#D4A855] flex-shrink-0">◆</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }
  if (detail.kind === 'contact') {
    return (
      <div className="space-y-3">
        <a href={`mailto:${detail.email}`} className="block text-sm text-white/80 hover:text-white">
          ✉ {detail.email}
        </a>
        <a href={detail.linkedin} target="_blank" rel="noopener noreferrer" className="block text-sm text-white/80 hover:text-white">
          ⌘ LinkedIn → linkedin.com/in/har5ha-7663
        </a>
        <a href={detail.github} target="_blank" rel="noopener noreferrer" className="block text-sm text-white/80 hover:text-white">
          ⌘ GitHub → github.com/HAR5HA-7663
        </a>
      </div>
    )
  }
  if (detail.kind === 'now') {
    return (
      <div className="space-y-5">
        <p className="text-white/85 text-sm leading-relaxed">{detail.description}</p>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1.5">Active clients</p>
          <div className="flex flex-wrap gap-1.5">
            {detail.clients.map(c => (
              <span key={c} className="px-2 py-1 text-[11px] rounded bg-[#FFB347]/10 text-[#FFB347] border border-[#FFB347]/30">{c}</span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1.5">Production stack</p>
          <div className="flex flex-wrap gap-1.5">
            {detail.stack.map(s => (
              <span key={s} className="px-2 py-0.5 text-[10px] rounded bg-white/5 text-white/70">{s}</span>
            ))}
          </div>
        </div>
        <Link
          href={detail.route}
          className="inline-block mt-2 px-5 py-3 rounded-md text-sm font-bold tracking-wide transition-all hover:brightness-110"
          style={{ background: '#FFB347', color: '#0A0D14' }}
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
