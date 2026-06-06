'use client'

import { useEffect, useState } from 'react'

type Commit = {
  sha: string
  message: string
  timestamp: string
  url: string
}

const REPO = 'HAR5HA-7663/harsha-overdose'
const CACHE_KEY = `hy:livepulse:${REPO}`
const CACHE_TTL_MS = 30 * 60 * 1000 // 30 min — be polite to GitHub's 60/hr unauth limit

function formatAgo(iso: string): string {
  const then = new Date(iso).getTime()
  const ms = Date.now() - then
  const min = Math.floor(ms / 60_000)
  if (min < 1) return 'just now'
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const d = Math.floor(hr / 24)
  if (d < 30) return `${d}d ago`
  const mo = Math.floor(d / 30)
  return `${mo}mo ago`
}

export function LivePulse() {
  const [commit, setCommit] = useState<Commit | null>(null)
  const [, setTick] = useState(0)

  useEffect(() => {
    const cached = typeof window !== 'undefined' ? window.localStorage.getItem(CACHE_KEY) : null
    if (cached) {
      try {
        const { commit: c, at } = JSON.parse(cached) as { commit: Commit; at: number }
        if (Date.now() - at < CACHE_TTL_MS) {
          setCommit(c)
          return
        }
      } catch {
        // ignore corrupt cache
      }
    }
    const controller = new AbortController()
    fetch(`https://api.github.com/repos/${REPO}/commits/main`, {
      signal: controller.signal,
      headers: { Accept: 'application/vnd.github+json' },
    })
      .then(r => (r.ok ? r.json() : null))
      .then(j => {
        if (!j) return
        const c: Commit = {
          sha: (j.sha as string).slice(0, 7),
          message: ((j.commit?.message as string) || '').split('\n')[0].slice(0, 60),
          timestamp: j.commit?.author?.date as string,
          url: j.html_url as string,
        }
        setCommit(c)
        try {
          window.localStorage.setItem(CACHE_KEY, JSON.stringify({ commit: c, at: Date.now() }))
        } catch {
          // ignore localStorage quota errors
        }
      })
      .catch(() => {})
    return () => controller.abort()
  }, [])

  useEffect(() => {
    const id = window.setInterval(() => setTick(x => x + 1), 60_000)
    return () => window.clearInterval(id)
  }, [])

  if (!commit) return null

  return (
    <a
      href={commit.url}
      target="_blank"
      rel="noopener noreferrer"
      className="hidden sm:inline-flex items-center gap-2 mono px-2.5 py-1 rounded-[3px] text-[10px] tracking-[0.15em] uppercase transition-colors hover:bg-[var(--canvas-soft)]"
      style={{ border: '1px solid var(--hairline)', color: 'var(--mute)' }}
      title={`Last commit: ${commit.message}`}
    >
      <span className="relative inline-flex w-1.5 h-1.5">
        <span className="absolute inset-0 rounded-full bg-[#34D399] animate-ping opacity-60" />
        <span className="relative inline-block w-1.5 h-1.5 rounded-full bg-[#34D399]" />
      </span>
      <span className="text-[var(--body-strong)]">shipping</span>
      <span className="text-[var(--mute)]">·</span>
      <span className="text-[var(--body)]">{commit.sha}</span>
      <span className="text-[var(--mute)]">·</span>
      <span className="text-[var(--body)]">{formatAgo(commit.timestamp)}</span>
    </a>
  )
}
