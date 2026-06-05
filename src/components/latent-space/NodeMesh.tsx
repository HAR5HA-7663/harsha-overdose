'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard, Text } from '@react-three/drei'
import * as THREE from 'three'
import type { PositionedNode } from '../../lib/positioning'

type Props = {
  node: PositionedNode
  color: string
  score?: number
  isSelected: boolean
  isHighlighted: boolean   // search match OR neighbor of hover
  isFocused: boolean       // the hovered node itself
  isDimmed: boolean        // search active, this node is not a match
  onSelect: () => void
  onHover: (id: string | null) => void
}

// Obsidian-style: radius driven by node degree (link count).
function radiusFromDegree(degree: number, kind: PositionedNode['kind']): number {
  const base = kind === 'now' ? 0.55 : kind === 'about' ? 0.42 : 0.26
  const bump = Math.min(degree, 14) * 0.025
  return base + bump
}

export function NodeMesh({
  node, color, score, isSelected, isHighlighted, isFocused, isDimmed,
  onSelect, onHover,
}: Props) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  const baseR = radiusFromDegree(node.degree, node.kind)
  const isNow = node.kind === 'now'

  useFrame((s) => {
    if (!meshRef.current || !glowRef.current) return
    const t = s.clock.elapsedTime
    const pulse = isNow ? 1 + Math.sin(t * 2.0) * 0.06 : 1
    const focus = isFocused || hovered ? 1.4 : isSelected ? 1.2 : 1.0
    const dim = isDimmed ? 0.55 : 1
    const target = baseR * pulse * focus * dim
    meshRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.18)
    glowRef.current.scale.lerp(new THREE.Vector3(target * 1.9, target * 1.9, target * 1.9), 0.18)
  })

  // Color decisions — Obsidian uses muted color groups; highlight = brighter
  const dimColor = '#3a3a3a'
  const renderColor = isDimmed ? dimColor : color
  const labelColor = isDimmed ? '#5e5650' : isHighlighted || isFocused ? '#f7f5f0' : '#dad2c1'
  const showLabel = isFocused || isSelected || hovered || isNow || node.kind === 'about' || node.degree >= 6

  return (
    <group position={node.position}>
      {/* Soft glow halo — kept subtle so multiple nodes coexist visually */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 14, 14]} />
        <meshBasicMaterial
          color={renderColor}
          transparent
          opacity={isDimmed ? 0.02 : isFocused || isHighlighted ? 0.16 : isNow ? 0.12 : 0.07}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Core sphere */}
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onSelect() }}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          onHover(node.id)
          if (typeof document !== 'undefined') document.body.style.cursor = 'pointer'
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          setHovered(false)
          onHover(null)
          if (typeof document !== 'undefined') document.body.style.cursor = 'default'
        }}
      >
        <sphereGeometry args={[1, 20, 20]} />
        <meshStandardMaterial
          color={renderColor}
          emissive={renderColor}
          emissiveIntensity={isDimmed ? 0.2 : isFocused || isHighlighted ? 1.6 : isNow ? 1.4 : 0.9}
          roughness={0.45}
          metalness={0.15}
          opacity={isDimmed ? 0.6 : 1}
          transparent
        />
      </mesh>

      {/* Hero ring for the "Now" node */}
      {isNow && (
        <mesh rotation={[Math.PI / 2.6, 0, 0]}>
          <torusGeometry args={[1.5, 0.04, 8, 64]} />
          <meshBasicMaterial color={color} transparent opacity={0.45} blending={THREE.AdditiveBlending} />
        </mesh>
      )}

      {showLabel && (
        <Billboard>
          <Text
            position={[0, baseR + 0.32, 0]}
            fontSize={isNow ? 0.26 : 0.18}
            color={labelColor}
            anchorX="center"
            anchorY="middle"
            outlineColor="#1d1916"
            outlineWidth={0.012}
            letterSpacing={-0.02}
          >
            {node.title}
          </Text>
          {(isFocused || isSelected) && (
            <Text
              position={[0, baseR + 0.12, 0]}
              fontSize={0.13}
              color="#aea69c"
              anchorX="center"
              anchorY="middle"
              maxWidth={5}
              outlineColor="#1d1916"
              outlineWidth={0.006}
            >
              {node.oneLiner}
            </Text>
          )}
        </Billboard>
      )}

      {/* Search score badge */}
      {score !== undefined && score > 0.15 && (
        <Billboard>
          <Text
            position={[0, -baseR - 0.18, 0]}
            fontSize={0.10}
            color="#67E8F9"
            anchorX="center"
            anchorY="middle"
          >
            {`${(score * 100).toFixed(0)}%`}
          </Text>
        </Billboard>
      )}
    </group>
  )
}
