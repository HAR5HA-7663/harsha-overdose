'use client'

import { useState, useCallback, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { NODES } from '../data/nodes'
import { SearchOverlay } from '../components/latent-space/SearchOverlay'
import { DetailPanel } from '../components/latent-space/DetailPanel'
import { TopNav } from '../components/latent-space/TopNav'
import { HeroCard } from '../components/latent-space/HeroCard'
import { MobileFallback } from '../components/latent-space/MobileFallback'
import { GraphLegend } from '../components/latent-space/GraphLegend'
import { SceneErrorBoundary } from '../components/teli/SceneErrorBoundary'
import { embedQuery, cosineSim, getGraph, type PositionedNode } from '../lib/positioning'
import { useWebGLSupport } from '../lib/useWebGLSupport'

const LatentSpaceScene = dynamic(
  () => import('../components/latent-space/LatentSpaceScene').then(m => m.LatentSpaceScene),
  { ssr: false, loading: () => <SceneShimmer /> },
)

function SceneShimmer() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#0e0c0a]">
      <p className="font-[var(--font-mono-code)] mono text-[11px] text-[#aea69c] tracking-[0.35em] uppercase">
        rendering graph
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#67E8F9] animate-pulse ml-2 align-middle" />
      </p>
    </div>
  )
}

function WebGLFallbackScreen() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#0e0c0a] pointer-events-none">
      <div
        className="text-center max-w-md mx-6 rounded-[4px] p-6 pointer-events-auto"
        style={{ background: 'var(--canvas-soft)', border: '1px solid var(--hairline)' }}
      >
        <p className="mono text-[10px] uppercase tracking-[0.3em] text-[var(--mute)]">3D scene · degraded</p>
        <h2
          className="font-display text-[var(--ink)] text-[22px] mt-2 font-normal"
          style={{ letterSpacing: '-0.02em', fontVariationSettings: '"SOFT" 100, "opsz" 144' }}
        >
          WebGL is disabled in this browser
        </h2>
        <p className="text-[var(--body)] text-[13px] mt-2 leading-[1.55]">
          The interactive 3D knowledge graph needs hardware-accelerated WebGL. Enable hardware
          acceleration (Chrome: <span className="mono text-[12px]">chrome://settings/system</span>)
          or switch browsers — the read-only version below has everything.
        </p>
      </div>
    </div>
  )
}

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [, setLivePositionedNodes] = useState<PositionedNode[]>([])
  const webgl = useWebGLSupport()

  const allPositioned = useMemo(() => getGraph().nodes, [])

  const matchCount = useMemo(() => {
    if (!query.trim()) return 0
    const qEmb = embedQuery(query)
    return allPositioned.filter(n => cosineSim(qEmb, n.embedding) > 0.05).length
  }, [query, allPositioned])

  const selectedNode = NODES.find(n => n.id === selectedId) || null

  const handleSelect = useCallback((id: string | null) => {
    setSelectedId(id)
  }, [])

  const webglOk = webgl !== 'unavailable'

  return (
    <main className="fixed inset-0 overflow-hidden" style={{ background: '#0e0c0a' }}>
      <div className="absolute inset-0">
        <SceneErrorBoundary fallback={<WebGLFallbackScreen />}>
          {webglOk ? (
            <LatentSpaceScene
              query={query}
              selectedId={selectedId}
              onSelect={handleSelect}
              onNodes={setLivePositionedNodes}
            />
          ) : (
            <WebGLFallbackScreen />
          )}
        </SceneErrorBoundary>
      </div>
      <TopNav />
      {webglOk && (
        <>
          <SearchOverlay query={query} onQueryChange={setQuery} matchCount={matchCount} />
          <GraphLegend visible={!selectedId && !query} />
          <HeroCard visible={!selectedId && !query} />
          <DetailPanel node={selectedNode} onClose={() => setSelectedId(null)} />
          <MobileFallback />
        </>
      )}
      {!webglOk && <MobileFallback force fullScreen />}
    </main>
  )
}
