'use client'

import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, Billboard, Text } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import type { Beat } from './choreography'

type Props = {
  beat: Beat
  elapsed: number
}

// A floating glowing sphere with optional pulsing.
function Orb({
  position, color, label, sublabel, size = 1, active = false, pulse = 1,
}: {
  position: [number, number, number]
  color: string
  label: string
  sublabel?: string
  size?: number
  active?: boolean
  pulse?: number
}) {
  const ref = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  useFrame((s) => {
    if (!ref.current || !glowRef.current) return
    const t = s.clock.elapsedTime
    const base = active ? 1.18 : 1.0
    const wobble = active ? 1 + Math.sin(t * 4 * pulse) * 0.05 : 1
    const finalScale = size * base * wobble
    ref.current.scale.lerp(new THREE.Vector3(finalScale, finalScale, finalScale), 0.12)
    glowRef.current.scale.lerp(new THREE.Vector3(finalScale * 2.4, finalScale * 2.4, finalScale * 2.4), 0.12)
  })

  return (
    <group position={position}>
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={active ? 0.28 : 0.08} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={ref}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={active ? 1.8 : 0.7} roughness={0.3} metalness={0.3} />
      </mesh>
      <Billboard>
        <Text position={[0, size + 0.7, 0]} fontSize={0.32} color="#fff" anchorX="center" outlineColor="#000" outlineWidth={0.012}>{label}</Text>
        {sublabel && (
          <Text position={[0, size + 0.36, 0]} fontSize={0.18} color={color} anchorX="center">{sublabel}</Text>
        )}
      </Billboard>
    </group>
  )
}

// A beam between two orbs that gets brighter when "data" is flowing.
function Beam({ from, to, color, active }: {
  from: [number, number, number]
  to: [number, number, number]
  color: string
  active: boolean
}) {
  const curve = useMemo(() => {
    const start = new THREE.Vector3(...from)
    const end = new THREE.Vector3(...to)
    const mid = start.clone().add(end).multiplyScalar(0.5)
    mid.y += 0.4
    return new THREE.CatmullRomCurve3([start, mid, end])
  }, [from, to])

  const geom = useMemo(() => new THREE.TubeGeometry(curve, 24, 0.035, 6, false), [curve])
  const matRef = useRef<THREE.MeshBasicMaterial>(null)

  useFrame((s) => {
    if (!matRef.current) return
    const target = active ? 0.85 : 0.18
    matRef.current.opacity += (target - matRef.current.opacity) * 0.08
  })

  return (
    <mesh geometry={geom}>
      <meshBasicMaterial ref={matRef} color={color} transparent opacity={0.18} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  )
}

// pgvector chunks that light up during RAG step.
function VectorChunks({ active }: { active: boolean }) {
  const positions: [number, number, number][] = useMemo(() => [
    [-3.0, -1.4, -1.2], [-2.6, -2.0, -0.6], [-3.2, -2.4, -1.5], [-2.8, -1.6, -2.0],
    [-3.4, -1.0, -0.8], [-2.4, -2.6, -1.0], [-3.0, -1.8, -2.4],
  ], [])
  return (
    <group>
      {positions.map((p, i) => (
        <Float key={i} speed={1.4 + i * 0.2} rotationIntensity={0.4} floatIntensity={0.4}>
          <mesh position={p} rotation={[i, i * 0.7, 0]}>
            <boxGeometry args={[0.55, 0.32, 0.06]} />
            <meshStandardMaterial
              color="#7DD3FC"
              emissive="#7DD3FC"
              emissiveIntensity={active ? 1.4 : 0.15}
              transparent
              opacity={active ? 0.95 : 0.5}
            />
          </mesh>
        </Float>
      ))}
      <Billboard position={[-2.9, -0.4, -1.2]}>
        <Text fontSize={0.18} color="#7DD3FC" anchorX="center" outlineColor="#000" outlineWidth={0.005}>pgvector</Text>
      </Billboard>
    </group>
  )
}

// The phone object at the center.
function PhoneObject({ ringing }: { ringing: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  useFrame((s) => {
    if (!groupRef.current) return
    if (ringing) {
      const shake = Math.sin(s.clock.elapsedTime * 30) * 0.04
      groupRef.current.rotation.z = shake
    } else {
      groupRef.current.rotation.z += (0 - groupRef.current.rotation.z) * 0.1
    }
  })
  return (
    <group ref={groupRef}>
      <mesh>
        <capsuleGeometry args={[0.4, 1.4, 8, 16]} />
        <meshStandardMaterial color="#222" emissive="#FFB347" emissiveIntensity={ringing ? 1.2 : 0.4} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[0.85, 0.04, 8, 64]} />
        <meshBasicMaterial color="#FFB347" transparent opacity={ringing ? 0.7 : 0.25} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  )
}

function CameraRig() {
  const t = useRef(0)
  useFrame((s) => {
    t.current += s.clock.getDelta()
    s.camera.position.x = Math.sin(s.clock.elapsedTime * 0.12) * 0.6
    s.camera.position.y = 0.4 + Math.cos(s.clock.elapsedTime * 0.1) * 0.3
    s.camera.lookAt(0, 0, 0)
  })
  return null
}

export function CallScene({ beat, elapsed }: Props) {
  const isRinging = beat.phase === 'ringing'
  const isThinking = beat.phase === 'thinking'
  const isTool = beat.phase === 'tool-call'
  const isRag = beat.phase === 'rag'
  const isAgent = beat.phase === 'agent'
  const isBorrower = beat.phase === 'borrower'
  const isQualified = beat.phase === 'qualified'

  const retellActive = isRinging || isBorrower
  const openaiActive = isThinking || isTool || isAgent
  const elevenActive = isAgent
  const pgvectorActive = isRag

  return (
    <Canvas
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0.4, 6.5], fov: 50 }}
      style={{ background: '#06080F' }}
      dpr={[1, 2]}
    >
      <color attach="background" args={['#06080F']} />
      <fog attach="fog" args={['#06080F', 6, 28]} />
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 4, 4]} intensity={1.2} color="#FFB347" />
      <pointLight position={[-4, -2, 2]} intensity={0.6} color="#7DD3FC" />

      <CameraRig />

      {/* Center: the call (phone) */}
      <group position={[0, 0, 0]}>
        <PhoneObject ringing={retellActive} />
      </group>

      {/* Top: GPT-4o brain */}
      <Orb position={[0, 2.4, -1]} color="#86EFAC" label="GPT-4o" sublabel="brain · function calling" size={0.55} active={openaiActive} pulse={1.6} />

      {/* Right: Retell (telephony) */}
      <Orb position={[2.6, 0.6, -0.6]} color="#FFB347" label="Retell" sublabel="number provider" size={0.45} active={retellActive} pulse={1.2} />

      {/* Left: ElevenLabs (voice) */}
      <Orb position={[-2.4, 1.0, -0.6]} color="#C084FC" label="ElevenLabs" sublabel="voice synthesis" size={0.45} active={elevenActive} pulse={1.4} />

      {/* Bottom-left cluster: pgvector chunks */}
      <VectorChunks active={pgvectorActive} />

      {/* Beams */}
      <Beam from={[2.6, 0.6, -0.6]}   to={[0, 0, 0]} color="#FFB347" active={retellActive} />
      <Beam from={[0, 2.4, -1]}       to={[0, 0, 0]} color="#86EFAC" active={openaiActive} />
      <Beam from={[-2.4, 1.0, -0.6]}  to={[0, 0, 0]} color="#C084FC" active={elevenActive} />
      <Beam from={[-3.0, -1.8, -1.4]} to={[0, 0, 0]} color="#7DD3FC" active={pgvectorActive} />

      {/* Qualified banner */}
      {isQualified && (
        <Billboard position={[0, 2.2, 0]}>
          <Text fontSize={0.48} color="#86EFAC" anchorX="center" outlineColor="#000" outlineWidth={0.02}>
            ✓ LEAD QUALIFIED
          </Text>
        </Billboard>
      )}

      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        minDistance={4}
        maxDistance={14}
        enablePan={false}
        autoRotate={false}
      />

      <EffectComposer multisampling={0}>
        <Bloom intensity={0.7} luminanceThreshold={0.3} luminanceSmoothing={0.45} mipmapBlur />
      </EffectComposer>
    </Canvas>
  )
}
