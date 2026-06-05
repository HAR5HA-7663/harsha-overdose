'use client'

import { motion } from 'framer-motion'
import { KIND_COLORS } from '../../data/nodes'

type Props = { visible: boolean }

const ITEMS: Array<{ key: keyof typeof KIND_COLORS; label: string; count?: string }> = [
  { key: 'now', label: 'Current work' },
  { key: 'experience', label: 'Experience' },
  { key: 'project', label: 'Projects' },
  { key: 'skill', label: 'Skills' },
  { key: 'about', label: 'About' },
  { key: 'contact', label: 'Contact' },
]

export function GraphLegend({ visible }: Props) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : -8 }}
      transition={{ duration: 0.4 }}
      className="hidden lg:block fixed bottom-8 left-6 z-10 pointer-events-none"
    >
      <div
        className="rounded-[4px] px-4 py-3 pointer-events-auto"
        style={{ background: 'var(--canvas-soft)', border: '1px solid var(--hairline)' }}
      >
        <p className="mono text-[10px] tracking-[0.28em] uppercase text-[var(--mute)] mb-2.5">Groups</p>
        <ul className="space-y-1.5">
          {ITEMS.map(item => (
            <li key={item.key} className="flex items-center gap-2.5 text-[12px]">
              <span
                className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                style={{
                  background: KIND_COLORS[item.key],
                  boxShadow: `0 0 6px ${KIND_COLORS[item.key]}`,
                }}
              />
              <span className="text-[var(--body)]">{item.label}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 pt-2.5 border-t border-[var(--hairline)]">
          <p className="mono text-[10px] tracking-[0.2em] text-[var(--mute)] uppercase">
            drag · scroll · click
          </p>
        </div>
      </div>
    </motion.aside>
  )
}
