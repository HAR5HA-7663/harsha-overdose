'use client'

import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard, Text } from '@react-three/drei'
import * as THREE from 'three'
import type { PositionedNode } from '../../lib/positioning'

type Props = {
  node: PositionedNode
  color: string
  score?: number
  isSelected: boolean
  isHighlighted: boolean
  isDimmed: boolean
  onSelect: () => void
}

export function NodeMesh({ node, color, score, isSelected, isHighlighted, isDimmed, onSelect }: Props) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  const isNow = node.kind === 'now'
  const baseSize = isNow ? 0.45 : node.kind === 'about' ? 0.32 : 0.22

  useFrame((state) => {
    if (!meshRef.current || !glowRef.current) return
    const t = state.clock.elapsedTime
    const pulseAmount = isNow ? 0.18 : isSelected ? 0.12 : 0.04
    const pulse = 1 + Math.sin(t * (isNow ? 2.2 : 1.4) + node.position[0]) * pulseAmount
    const highlightBoost = isHighlighted ? 1.4 : 1
    const dimFactor = isDimmed ? 0.4 : 1
    const targetScale = baseSize * pulse * highlightBoost * dimFactor * (hovered ? 1.25 : 1)
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15)
    glowRef.current.scale.lerp(new THREE.Vector3(targetScale * 2.6, targetScale * 2.6, targetScale * 2.6), 0.15)
  })

  const glowColor = useMemo(() => new THREE.Color(color).multiplyScalar(isNow ? 2 : 1.3), [color, isNow])
  const showLabel = isSelected || hovered || isNow || node.kind === 'about'
  const showOneLiner = isSelected || hovered

  return (
    <group position={node.position}>
      {/* Outer glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={isDimmed ? 0.04 : (isNow ? 0.18 : 0.12)}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Core */}
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onSelect() }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default' }}
      >
        <sphereGeometry args={[1, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isNow ? 1.6 : isHighlighted ? 1.3 : 0.9}
          roughness={0.4}
          metalness={0.2}
          opacity={isDimmed ? 0.45 : 1}
          transparent
        />
      </mesh>

      {/* Phone ring for the "Now" node */}
      {isNow && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.2, 0.04, 8, 64]} />
          <meshBasicMaterial color={color} transparent opacity={0.5} blending={THREE.AdditiveBlending} />
        </mesh>
      )}

      {showLabel && (
        <Billboard>
          <Text
            position={[0, baseSize + 0.55, 0]}
            fontSize={0.32}
            color={isDimmed ? '#7a7a7a' : '#FFFFFF'}
            anchorX="center"
            anchorY="middle"
            outlineColor="#000"
            outlineWidth={0.012}
          >
            {node.title}
          </Text>
          {showOneLiner && (
            <Text
              position={[0, baseSize + 0.22, 0]}
              fontSize={0.18}
              color={color}
              anchorX="center"
              anchorY="middle"
              maxWidth={6}
              outlineColor="#000"
              outlineWidth={0.005}
            >
              {node.oneLiner}
            </Text>
          )}
        </Billboard>
      )}

      {/* Score badge during search */}
      {score !== undefined && score > 0.15 && (
        <Billboard>
          <Text
            position={[0, -baseSize - 0.25, 0]}
            fontSize={0.14}
            color="#D4A855"
            anchorX="center"
            anchorY="middle"
          >
            {`◆ ${(score * 100).toFixed(0)}%`}
          </Text>
        </Billboard>
      )}
    </group>
  )
}
