'use client'

import { useMemo, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { KIND_COLORS } from '../../data/nodes'
import {
  getGraph,
  getNeighbors,
  embedQuery,
  cosineSim,
  type PositionedNode,
  type Link,
} from '../../lib/positioning'
import { NodeMesh } from './NodeMesh'

type Props = {
  query: string
  selectedId: string | null
  onSelect: (id: string | null) => void
  onNodes: (nodes: PositionedNode[]) => void
}

// Dense Obsidian-style link network: one merged LineSegments mesh with
// per-vertex colors so we don't blow up draw calls at 500+ links. A second,
// brighter LineSegments mesh is drawn on top for highlighted edges (focus +
// search matches). Bloom + additive blending gives the glowing-vault feel.
function GraphLinks({
  nodes,
  links,
  highlightSet,
  hasFocus,
  searchScores,
  hasSearch,
}: {
  nodes: PositionedNode[]
  links: Link[]
  highlightSet: Set<string> | null
  hasFocus: boolean
  searchScores: Record<string, number>
  hasSearch: boolean
}) {
  const posById = useMemo(() => {
    const m: Record<string, [number, number, number]> = {}
    for (const n of nodes) m[n.id] = n.position
    return m
  }, [nodes])

  // Base layer — every link drawn dimly. Wide-ish, low opacity.
  const baseGeom = useMemo(() => {
    const positions: number[] = []
    for (const l of links) {
      const a = posById[l.source]
      const b = posById[l.target]
      if (!a || !b) continue
      positions.push(a[0], a[1], a[2], b[0], b[1], b[2])
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    return g
  }, [links, posById])

  // Highlight layer — only links incident to focus/search rebuild this geometry.
  const highlightGeom = useMemo(() => {
    const positions: number[] = []
    if (!hasFocus && !hasSearch) {
      const g = new THREE.BufferGeometry()
      g.setAttribute('position', new THREE.Float32BufferAttribute([], 3))
      return g
    }
    for (const l of links) {
      const a = posById[l.source]
      const b = posById[l.target]
      if (!a || !b) continue
      let bright = false
      if (hasFocus && highlightSet && highlightSet.has(l.source) && highlightSet.has(l.target)) bright = true
      if (hasSearch) {
        const s = searchScores[l.source] || 0
        const t = searchScores[l.target] || 0
        if (s > 0.05 || t > 0.05) bright = true
      }
      if (!bright) continue
      positions.push(a[0], a[1], a[2], b[0], b[1], b[2])
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    return g
  }, [links, posById, highlightSet, hasFocus, searchScores, hasSearch])

  const baseOpacity = hasFocus || hasSearch ? 0.08 : 0.32
  const baseMat = useMemo(() => new THREE.LineBasicMaterial({
    color: '#67E8F9',
    transparent: true,
    opacity: baseOpacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }), [baseOpacity])

  const highlightMat = useMemo(() => new THREE.LineBasicMaterial({
    color: '#A5F3FC',
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }), [])

  const baseSegs = useMemo(() => new THREE.LineSegments(baseGeom, baseMat), [baseGeom, baseMat])
  const hlSegs = useMemo(() => new THREE.LineSegments(highlightGeom, highlightMat), [highlightGeom, highlightMat])

  return (
    <>
      <primitive object={baseSegs} />
      <primitive object={hlSegs} />
    </>
  )
}

function SceneCamera({ targetPosition }: { targetPosition: [number, number, number] | null }) {
  const controlsRef = useRef<any>(null)
  const { camera } = useThree()
  const targetVec = useRef(new THREE.Vector3())
  const camTargetVec = useRef(new THREE.Vector3())
  const hasTarget = useRef(false)

  useEffect(() => {
    if (targetPosition) {
      const [x, y, z] = targetPosition
      targetVec.current.set(x, y, z)
      const len = Math.sqrt(x * x + y * y + z * z) || 1
      const dir = new THREE.Vector3(x / len, y / len, z / len)
      const dollyDistance = 6
      camTargetVec.current.set(x + dir.x * dollyDistance, y + dir.y * dollyDistance, z + dir.z * dollyDistance)
      hasTarget.current = true
    } else {
      hasTarget.current = false
    }
  }, [targetPosition])

  useFrame(() => {
    if (hasTarget.current && controlsRef.current) {
      controlsRef.current.target.lerp(targetVec.current, 0.07)
      camera.position.lerp(camTargetVec.current, 0.05)
      controlsRef.current.update()
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.08}
      minDistance={5}
      maxDistance={35}
      autoRotate={!hasTarget.current}
      autoRotateSpeed={0.22}
    />
  )
}

export function LatentSpaceScene({ query, selectedId, onSelect, onNodes }: Props) {
  const { nodes, links } = useMemo(() => getGraph(), [])
  const neighbors = useMemo(() => getNeighbors(links), [links])
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  useEffect(() => {
    onNodes(nodes)
  }, [nodes, onNodes])

  const scores = useMemo(() => {
    if (!query.trim()) return {} as Record<string, number>
    const qEmb = embedQuery(query)
    const out: Record<string, number> = {}
    for (const n of nodes) {
      const s = cosineSim(qEmb, n.embedding)
      if (s > 0.05) out[n.id] = s
    }
    return out
  }, [nodes, query])

  // Focus set = hovered node + its neighbors, OR selected + neighbors.
  const focusId = hoveredId || selectedId
  const focusSet = useMemo(() => {
    if (!focusId) return null
    const s = new Set<string>([focusId])
    const ns = neighbors[focusId]
    if (ns) for (const n of ns) s.add(n)
    return s
  }, [focusId, neighbors])

  const selectedNode = nodes.find(n => n.id === selectedId) || null
  const targetPosition = selectedNode?.position || null

  const hasFocus = !!focusSet
  const hasSearch = Object.keys(scores).length > 0

  return (
    <Canvas
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 14], fov: 55 }}
      style={{ background: '#0a0908' }}
      dpr={[1, 2]}
      onPointerMissed={() => { /* click empty space — keep selection */ }}
    >
      <color attach="background" args={['#0a0908']} />
      <fog attach="fog" args={['#0a0908', 16, 30]} />
      <ambientLight intensity={0.3} />
      <pointLight position={[6, 6, 8]} intensity={0.6} color="#fcd9b0" />
      <pointLight position={[-8, -2, 4]} intensity={0.4} color="#67E8F9" />

      <GraphLinks
        nodes={nodes}
        links={links}
        highlightSet={focusSet}
        hasFocus={hasFocus}
        searchScores={scores}
        hasSearch={hasSearch}
      />

      {nodes.map(node => {
        const isFocused = focusId === node.id
        const isNeighbor = focusSet ? focusSet.has(node.id) : false
        const isHighlighted = hasSearch ? (scores[node.id] || 0) > 0.15 : isNeighbor
        const isDimmed = hasSearch
          ? !(scores[node.id] && scores[node.id] >= 0.05)
          : hasFocus
            ? !focusSet!.has(node.id)
            : false

        return (
          <NodeMesh
            key={node.id}
            node={node}
            score={scores[node.id]}
            isSelected={node.id === selectedId}
            isFocused={isFocused}
            isHighlighted={isHighlighted}
            isDimmed={isDimmed}
            color={KIND_COLORS[node.kind]}
            onSelect={() => onSelect(node.id === selectedId ? null : node.id)}
            onHover={setHoveredId}
          />
        )
      })}

      <SceneCamera targetPosition={targetPosition} />

      <EffectComposer multisampling={0}>
        <Bloom
          intensity={1.4}
          luminanceThreshold={0.12}
          luminanceSmoothing={0.35}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  )
}
