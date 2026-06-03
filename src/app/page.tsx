'use client'

import { useState, useCallback, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { NODES } from '../data/nodes'
import { SearchOverlay } from '../components/latent-space/SearchOverlay'
import { DetailPanel } from '../components/latent-space/DetailPanel'
import { TopNav } from '../components/latent-space/TopNav'
import { IntroOverlay } from '../components/latent-space/IntroOverlay'
import { embedQuery, cosineSim, getPositionedNodes, type PositionedNode } from '../lib/positioning'

const LatentSpaceScene = dynamic(
  () => import('../components/latent-space/LatentSpaceScene').then(m => m.LatentSpaceScene),
  { ssr: false, loading: () => null },
)

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [livePositionedNodes, setLivePositionedNodes] = useState<PositionedNode[]>([])

  // Precompute positioned nodes for match-count UI (mirrors scene logic).
  const allPositioned = useMemo(() => getPositionedNodes(), [])

  const matchCount = useMemo(() => {
    if (!query.trim()) return 0
    const qEmb = embedQuery(query)
    return allPositioned.filter(n => cosineSim(qEmb, n.embedding) > 0.05).length
  }, [query, allPositioned])

  const selectedNode = NODES.find(n => n.id === selectedId) || null

  const handleSelect = useCallback((id: string | null) => {
    setSelectedId(id)
  }, [])

  return (
    <main className="fixed inset-0 overflow-hidden">
      <IntroOverlay />
      <div className="absolute inset-0">
        <LatentSpaceScene
          query={query}
          selectedId={selectedId}
          onSelect={handleSelect}
          onNodes={setLivePositionedNodes}
        />
      </div>
      <SearchOverlay query={query} onQueryChange={setQuery} matchCount={matchCount} />
      <TopNav />
      <DetailPanel node={selectedNode} onClose={() => setSelectedId(null)} />

      {/* Subtle hint at bottom */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <p className="text-white/35 font-mono text-[10px] tracking-[0.3em] uppercase">
          drag · scroll · click · search
        </p>
      </div>
    </main>
  )
}
