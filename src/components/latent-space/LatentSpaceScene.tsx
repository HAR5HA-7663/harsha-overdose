'use client'

import { useMemo, useRef, useState, useCallback, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import { KIND_COLORS } from '../../data/nodes'
import { getPositionedNodes, getConnections, embedQuery, cosineSim, type PositionedNode } from '../../lib/positioning'
import { NodeMesh } from './NodeMesh'

type Props = {
  query: string
  selectedId: string | null
  onSelect: (id: string | null) => void
  onNodes: (nodes: PositionedNode[]) => void
}

function ConnectionLines({ nodes, connections, scores }: {
  nodes: PositionedNode[]
  connections: [string, string][]
  scores: Record<string, number>
}) {
  const positionsById = useMemo(() => {
    const m: Record<string, [number, number, number]> = {}
    for (const n of nodes) m[n.id] = n.position
    return m
  }, [nodes])

  const lineGeoms = useMemo(() => {
    return connections.map(([a, b]) => {
      const pa = positionsById[a]
      const pb = positionsById[b]
      if (!pa || !pb) return null
      const score = ((scores[a] || 0) + (scores[b] || 0)) / 2
      return { pa, pb, score, key: `${a}-${b}` }
    }).filter(Boolean) as { pa: [number, number, number]; pb: [number, number, number]; score: number; key: string }[]
  }, [connections, positionsById, scores])

  return (
    <>
      {lineGeoms.map(({ pa, pb, score, key }) => {
        const points = [new THREE.Vector3(...pa), new THREE.Vector3(...pb)]
        const geom = new THREE.BufferGeometry().setFromPoints(points)
        const opacity = 0.05 + score * 0.4
        const mat = new THREE.LineBasicMaterial({
          color: '#D4A855',
          transparent: true,
          opacity,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
        const line = new THREE.Line(geom, mat)
        return <primitive key={key} object={line} />

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
      const dir = new THREE.Vector3(x, y, z).normalize()
      const camOffset = dir.clone().multiplyScalar(4)
      camTargetVec.current.set(x + camOffset.x, y + camOffset.y, z + camOffset.z)
      hasTarget.current = true
    } else {
      hasTarget.current = false
    }
  }, [targetPosition])

  useFrame(() => {
    if (hasTarget.current && controlsRef.current) {
      controlsRef.current.target.lerp(targetVec.current, 0.08)
      camera.position.lerp(camTargetVec.current, 0.06)
      controlsRef.current.update()
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.08}
      minDistance={4}
      maxDistance={30}
      autoRotate={!hasTarget.current}
      autoRotateSpeed={0.25}
    />
  )
}

export function LatentSpaceScene({ query, selectedId, onSelect, onNodes }: Props) {
  const nodes = useMemo(() => getPositionedNodes(), [])
  const connections = useMemo(() => getConnections(nodes), [nodes])

  useEffect(() => {
    onNodes(nodes)
  }, [nodes, onNodes])

  // Compute search scores when query changes.
  const scores = useMemo(() => {
    if (!query.trim()) return {} as Record<string, number>
    const qEmb = embedQuery(query)
    const result: Record<string, number> = {}
    for (const n of nodes) {
      const s = cosineSim(qEmb, n.embedding)
      if (s > 0.05) result[n.id] = s
    }
    return result
  }, [nodes, query])

  const selectedNode = nodes.find(n => n.id === selectedId) || null
  const targetPosition = selectedNode?.position || null

  return (
    <Canvas
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 18], fov: 50 }}
      style={{ background: '#06080F' }}
      dpr={[1, 2]}
    >
      <color attach="background" args={['#06080F']} />
      <fog attach="fog" args={['#06080F', 12, 40]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <Stars radius={120} depth={50} count={2400} factor={4} saturation={0} fade speed={0.6} />

      <ConnectionLines nodes={nodes} connections={connections} scores={scores} />

      {nodes.map(node => (
        <NodeMesh
          key={node.id}
          node={node}
          score={scores[node.id]}
          isSelected={node.id === selectedId}
          isHighlighted={!!query && (scores[node.id] || 0) > 0.15}
          isDimmed={!!query && !(scores[node.id] >= 0.05)}
          color={KIND_COLORS[node.kind]}
          onSelect={() => onSelect(node.id === selectedId ? null : node.id)}
        />
      ))}

      <SceneCamera targetPosition={targetPosition} />

      <EffectComposer multisampling={0}>
        <Bloom
          intensity={0.55}
          luminanceThreshold={0.32}
          luminanceSmoothing={0.45}
          mipmapBlur
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(0.0004, 0.0008)}
          radialModulation={false}
          modulationOffset={0}
        />
      </EffectComposer>
    </Canvas>
  )
}
