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

// Animated link tubes — like Obsidian, brighter when their endpoints are highlighted
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

  const meshes = useMemo(() => {
    return links.map(l => {
      const a = posById[l.source]
      const b = posById[l.target]
      if (!a || !b) return null
      const start = new THREE.Vector3(...a)
      const end = new THREE.Vector3(...b)
      const points = [start, end]
      const geom = new THREE.BufferGeometry().setFromPoints(points)
      return { geom, link: l }
    }).filter(Boolean) as { geom: THREE.BufferGeometry; link: Link }[]
  }, [posById, links])

  return (
    <>
      {meshes.map(({ geom, link }) => {
        const sScore = searchScores[link.source] || 0
        const tScore = searchScores[link.target] || 0
        const matched = hasSearch && (sScore > 0.05 || tScore > 0.05)
        const isFocusEdge = hasFocus && highlightSet && (highlightSet.has(link.source) && highlightSet.has(link.target))
        const opacity = isFocusEdge ? 0.95 : matched ? 0.6 : hasFocus || hasSearch ? 0.05 : 0.22
        const color = isFocusEdge || matched ? '#67E8F9' : '#67E8F9'
        const mat = new THREE.LineBasicMaterial({
          color,
          transparent: true,
          opacity,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
        const line = new THREE.Line(geom, mat)
        return <primitive key={`${link.source}-${link.target}`} object={line} />
      })}
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
      camera={{ position: [0, 0, 18], fov: 50 }}
      style={{ background: '#0e0c0a' }}
      dpr={[1, 2]}
      onPointerMissed={() => { /* click empty space — keep selection */ }}
    >
      <color attach="background" args={['#0e0c0a']} />
      <fog attach="fog" args={['#0e0c0a', 22, 40]} />
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
          intensity={0.8}
          luminanceThreshold={0.18}
          luminanceSmoothing={0.4}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  )
}
