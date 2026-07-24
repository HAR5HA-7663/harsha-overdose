'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Billboard, Text } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import type { Beat } from './choreography'
import { useAdaptivePerf } from '../../lib/useAdaptivePerf'

type Props = {
  beat: Beat
}

// Scratch vectors shared across frame callbacks — useFrame runs sequentially,
// so reuse is safe and keeps the render loop allocation-free.
const SCRATCH = new THREE.Vector3()

// Deterministic pseudo-random for starfield/shelf jitter (stable across renders).
function lcg(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

// ───────────────────────── central call hub: ring + live waveform ─────────────────────────

// Five equalizer bars inside a glowing ring. Bars dance while someone speaks,
// shimmer low while the agent thinks, flatten when idle. Reads as "a live
// call" instantly — which a brown capsule never did.
function CallHub({ phase }: { phase: Beat['phase'] }) {
  const barRefs = useRef<(THREE.Mesh | null)[]>([])
  const ringRef = useRef<THREE.Mesh>(null)
  const speaking = phase === 'borrower' || phase === 'agent'
  const thinking = phase === 'thinking' || phase === 'tool-call' || phase === 'rag'
  const ringing = phase === 'ringing'
  const qualified = phase === 'qualified'

  const barColor = qualified ? '#86EFAC' : '#FFB347'

  useFrame((s) => {
    const t = s.clock.elapsedTime
    for (let i = 0; i < 5; i++) {
      const bar = barRefs.current[i]
      if (!bar) continue
      const target = speaking
        ? 0.28 + Math.abs(Math.sin(t * 6 + i * 1.7)) * 0.75
        : thinking
          ? 0.14 + Math.abs(Math.sin(t * 2.2 + i * 0.9)) * 0.12
          : ringing
            ? 0.1 + Math.abs(Math.sin(t * 9)) * 0.06
            : qualified
              ? 0.35 + Math.abs(Math.sin(t * 3 + i)) * 0.25
              : 0.08
      bar.scale.y += (target - bar.scale.y) * 0.25
    }
    if (ringRef.current) {
      const mat = ringRef.current.material as THREE.MeshBasicMaterial
      const target = ringing ? 0.85 : qualified ? 0.7 : 0.35
      mat.opacity += (target - mat.opacity) * 0.08
    }
  })

  return (
    <group>
      {/* Hub ring — faces the camera */}
      <mesh ref={ringRef}>
        <torusGeometry args={[1.05, 0.028, 12, 72]} />
        <meshBasicMaterial color={barColor} transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Soft core glow behind the bars */}
      <mesh>
        <circleGeometry args={[0.95, 48]} />
        <meshBasicMaterial color="#FFB347" transparent opacity={0.06} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Waveform bars */}
      {[-2, -1, 0, 1, 2].map((o, i) => (
        <mesh
          key={o}
          position={[o * 0.26, 0, 0.02]}
          ref={el => { barRefs.current[i] = el }}
          scale={[1, 0.08, 1]}
        >
          <boxGeometry args={[0.13, 1.3, 0.13]} />
          <meshStandardMaterial color={barColor} emissive={barColor} emissiveIntensity={1.6} roughness={0.3} />
        </mesh>
      ))}
      <SonarRings active={ringing} color="#FFB347" />
      <SonarRings active={qualified} color="#86EFAC" period={2.2} />
    </group>
  )
}

// Expanding + fading rings — sonar ping while the call rings, green burst on qualified.
function SonarRings({ active, color, period = 1.6 }: { active: boolean; color: string; period?: number }) {
  const refs = useRef<(THREE.Mesh | null)[]>([])
  useFrame((s) => {
    const t = s.clock.elapsedTime
    for (let i = 0; i < 2; i++) {
      const m = refs.current[i]
      if (!m) continue
      const mat = m.material as THREE.MeshBasicMaterial
      if (!active) {
        mat.opacity += (0 - mat.opacity) * 0.15
        continue
      }
      const p = ((t / period) + i * 0.5) % 1
      const scale = 1.1 + p * 2.6
      m.scale.set(scale, scale, scale)
      mat.opacity = (1 - p) * 0.4
    }
  })
  return (
    <>
      {[0, 1].map(i => (
        <mesh key={i} ref={el => { refs.current[i] = el }}>
          <ringGeometry args={[0.98, 1.02, 64]} />
          <meshBasicMaterial color={color} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </>
  )
}

// ───────────────────────── satellite orbs with rings + labels ─────────────────────────

function Orb({
  position, color, label, sublabel, size = 1, active = false, pulse = 1, labelSide = 'below', labelScale = 1,
}: {
  position: [number, number, number]
  color: string
  label: string
  sublabel: string
  size?: number
  active?: boolean
  pulse?: number
  labelSide?: 'above' | 'below'
  labelScale?: number
}) {
  const ref = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const orbitRef = useRef<THREE.Mesh>(null)

  useFrame((s) => {
    if (!ref.current || !glowRef.current) return
    const t = s.clock.elapsedTime
    const base = active ? 1.18 : 1.0
    const wobble = active ? 1 + Math.sin(t * 4 * pulse) * 0.05 : 1
    const finalScale = size * base * wobble
    ref.current.scale.lerp(SCRATCH.set(finalScale, finalScale, finalScale), 0.12)
    glowRef.current.scale.lerp(SCRATCH.set(finalScale * 1.55, finalScale * 1.55, finalScale * 1.55), 0.12)
    if (orbitRef.current) {
      orbitRef.current.rotation.z = t * (active ? 0.9 : 0.25)
      const mat = orbitRef.current.material as THREE.MeshBasicMaterial
      mat.opacity += ((active ? 0.55 : 0.18) - mat.opacity) * 0.1
    }
  })

  return (
    <group position={position}>
      {/* Tight halo — depth cue, not a pancake */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={active ? 0.16 : 0.06} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Core */}
      <mesh ref={ref}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={active ? 1.9 : 0.8} roughness={0.3} metalness={0.3} />
      </mesh>
      {/* Thin tilted orbit ring — ties the satellites to the graph language of the home page */}
      <mesh ref={orbitRef} rotation={[Math.PI / 2.4, 0.4, 0]}>
        <torusGeometry args={[size * 2.1, 0.012, 8, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.18} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Small fixed-size labels — bounded band, so no giant-label collisions */}
      <Billboard position={[0, labelSide === 'below' ? -(size * 2.1 + 0.42) : size * 2.1 + 0.62, 0]}>
        <Text fontSize={0.21 * labelScale} color={active ? '#f7f5f0' : '#dad2c1'} anchorX="center" outlineColor="#06080F" outlineWidth={0.014} letterSpacing={-0.01}>
          {label}
        </Text>
        <Text position={[0, -0.26 * labelScale, 0]} fontSize={0.13 * labelScale} color="#8f97a3" anchorX="center" outlineColor="#06080F" outlineWidth={0.008}>
          {sublabel}
        </Text>
      </Billboard>
    </group>
  )
}

// ───────────────────────── beams with flowing particles ─────────────────────────

function Beam({ from, to, color, active }: {
  from: [number, number, number]
  to: [number, number, number]
  color: string
  active: boolean
}) {
  const depKey = `${from[0]},${from[1]},${from[2]}|${to[0]},${to[1]},${to[2]}`

  const { geom, curve } = useMemo(() => {
    const start = new THREE.Vector3(from[0], from[1], from[2])
    const end = new THREE.Vector3(to[0], to[1], to[2])
    const mid = start.clone().add(end).multiplyScalar(0.5)
    mid.y += 0.4
    const c = new THREE.CatmullRomCurve3([start, mid, end])
    return { geom: new THREE.TubeGeometry(c, 24, 0.022, 6, false), curve: c }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depKey])

  const matRef = useRef<THREE.MeshBasicMaterial>(null)
  const particleRefs = useRef<(THREE.Mesh | null)[]>([])
  const flow = useRef(0)

  useFrame((_, dt) => {
    if (matRef.current) {
      const target = active ? 0.75 : 0.14
      matRef.current.opacity += (target - matRef.current.opacity) * 0.08
    }
    flow.current = (flow.current + dt * 0.45) % 1
    for (let i = 0; i < 3; i++) {
      const p = particleRefs.current[i]
      if (!p) continue
      const mat = p.material as THREE.MeshBasicMaterial
      if (!active) {
        mat.opacity += (0 - mat.opacity) * 0.12
        continue
      }
      const tt = (flow.current + i / 3) % 1
      curve.getPoint(tt, SCRATCH)
      p.position.copy(SCRATCH)
      // Fade in/out at the ends so particles don't pop
      mat.opacity = Math.sin(tt * Math.PI) * 0.9
    }
  })

  return (
    <group>
      <mesh geometry={geom}>
        <meshBasicMaterial ref={matRef} color={color} transparent opacity={0.14} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {[0, 1, 2].map(i => (
        <mesh key={i} ref={el => { particleRefs.current[i] = el }}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

// ───────────────────────── pgvector shelf: tidy index cards ─────────────────────────

function VectorShelf({ active, labelScale = 1 }: { active: boolean; labelScale?: number }) {
  const cards = useMemo(() => {
    const rand = lcg(7663)
    const out: { pos: [number, number, number]; rot: [number, number, number] }[] = []
    for (let i = 0; i < 6; i++) {
      const col = i % 2
      const row = Math.floor(i / 2)
      out.push({
        pos: [-3.15 + col * 0.62, -1.15 - row * 0.42, -1.2 + (rand() - 0.5) * 0.15],
        rot: [0, (rand() - 0.5) * 0.25, (rand() - 0.5) * 0.12],
      })
    }
    return out
  }, [])

  const refs = useRef<(THREE.Mesh | null)[]>([])
  useFrame((s) => {
    const t = s.clock.elapsedTime
    for (let i = 0; i < 6; i++) {
      const m = refs.current[i]
      if (!m) continue
      const mat = m.material as THREE.MeshStandardMaterial
      // Sequential shimmer while RAG is retrieving — reads as "scanning the index"
      const target = active ? 0.5 + Math.max(0, Math.sin(t * 3.2 - i * 0.8)) * 1.1 : 0.12
      mat.emissiveIntensity += (target - mat.emissiveIntensity) * 0.1
    }
  })

  return (
    <group>
      {cards.map((c, i) => (
        <mesh key={i} position={c.pos} rotation={c.rot} ref={el => { refs.current[i] = el }}>
          <boxGeometry args={[0.5, 0.3, 0.045]} />
          <meshStandardMaterial color="#7DD3FC" emissive="#7DD3FC" emissiveIntensity={0.12} transparent opacity={active ? 0.95 : 0.55} roughness={0.4} />
        </mesh>
      ))}
      <Billboard position={[-2.85, -2.42, -1.2]}>
        <Text fontSize={0.19 * labelScale} color="#7DD3FC" anchorX="center" outlineColor="#06080F" outlineWidth={0.012}>
          pgvector
        </Text>
        <Text position={[0, -0.24 * labelScale, 0]} fontSize={0.12 * labelScale} color="#8f97a3" anchorX="center" outlineColor="#06080F" outlineWidth={0.008}>
          hybrid RAG
        </Text>
      </Billboard>
    </group>
  )
}

// ───────────────────────── atmosphere: starfield + polar floor ─────────────────────────

function Starfield() {
  const geom = useMemo(() => {
    const rand = lcg(42)
    const n = 140
    const positions = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const r = 10 + rand() * 16
      const theta = rand() * Math.PI * 2
      const phi = Math.acos(2 * rand() - 1)
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6
      positions[i * 3 + 2] = -Math.abs(r * Math.cos(phi)) - 2
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    return g
  }, [])

  return (
    <points geometry={geom}>
      <pointsMaterial size={0.06} color="#67E8F9" transparent opacity={0.35} sizeAttenuation depthWrite={false} />
    </points>
  )
}

function PolarFloor() {
  return (
    <polarGridHelper
      args={[13, 8, 5, 48, '#16222c', '#101a22']}
      position={[0, -3.4, -1]}
      onUpdate={(h: THREE.PolarGridHelper) => {
        const mat = h.material as THREE.Material
        mat.transparent = true
        mat.opacity = 0.35
      }}
    />
  )
}

// ───────────────────────── camera + scene ─────────────────────────

function CameraRig() {
  // Subtle parallax only — the scene should feel composed, not swimmy.
  useFrame((s) => {
    s.camera.position.x = Math.sin(s.clock.elapsedTime * 0.08) * 0.35
    s.camera.position.y = 0.6 + Math.cos(s.clock.elapsedTime * 0.07) * 0.18
    s.camera.lookAt(0, 0, 0)
  })
  return null
}

export function CallScene({ beat }: Props) {
  const { tier, dpr } = useAdaptivePerf()
  // World-space text renders smaller in the short mobile band — compensate.
  const labelScale = tier === 'low' ? 1.3 : 1
  const isRinging = beat.phase === 'ringing'
  const isThinking = beat.phase === 'thinking'
  const isTool = beat.phase === 'tool-call'
  const isRag = beat.phase === 'rag'
  const isAgent = beat.phase === 'agent'
  const isBorrower = beat.phase === 'borrower'
  const isQualified = beat.phase === 'qualified'

  const telephonyActive = isRinging || isBorrower
  const openaiActive = isThinking || isTool || isAgent
  const elevenActive = isAgent
  const pgvectorActive = isRag

  return (
    <Canvas
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0.6, 16], fov: 48 }}
      style={{ background: '#06080F' }}
      dpr={dpr}
    >
      <color attach="background" args={['#06080F']} />
      <fog attach="fog" args={['#06080F', 14, 42]} />
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 4, 4]} intensity={1.2} color="#FFB347" />
      <pointLight position={[-4, -2, 2]} intensity={0.6} color="#7DD3FC" />

      <CameraRig />
      <Starfield />
      <PolarFloor />

      {/* Center: the live call */}
      <CallHub phase={beat.phase} />

      {/* Satellites */}
      <Orb position={[0, 2.6, -1]} color="#86EFAC" label="reasoning" sublabel="function calling" size={0.4} active={openaiActive} pulse={1.6} labelSide="above" labelScale={labelScale} />
      <Orb position={[3.0, 0.6, -0.6]} color="#FFB347" label="telephony" sublabel="PSTN" size={0.32} active={telephonyActive} pulse={1.2} labelScale={labelScale} />
      <Orb position={[-2.8, 1.0, -0.6]} color="#C084FC" label="voice" sublabel="streaming TTS" size={0.32} active={elevenActive} pulse={1.4} labelScale={labelScale} />
      <VectorShelf active={pgvectorActive} labelScale={labelScale} />

      {/* Beams with data-flow particles */}
      <Beam from={[3.0, 0.6, -0.6]}   to={[0, 0, 0]} color="#FFB347" active={telephonyActive} />
      <Beam from={[0, 2.6, -1]}       to={[0, 0, 0]} color="#86EFAC" active={openaiActive} />
      <Beam from={[-2.8, 1.0, -0.6]}  to={[0, 0, 0]} color="#C084FC" active={elevenActive} />
      <Beam from={[-3.0, -1.8, -1.4]} to={[0, 0, 0]} color="#7DD3FC" active={pgvectorActive} />

      {/* Qualified banner */}
      {isQualified && (
        <Billboard position={[0, 2.2, 1.5]}>
          <Text fontSize={0.5} color="#86EFAC" anchorX="center" outlineColor="#000" outlineWidth={0.02} letterSpacing={0.04}>
            ✓ LEAD QUALIFIED
          </Text>
        </Billboard>
      )}

      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        minDistance={10}
        maxDistance={24}
        enablePan={false}
        autoRotate={false}
      />

      {/* Bloom only on desktop — the additive-blend glow meshes keep the look
          on phones at a fraction of the GPU cost. */}
      {tier === 'high' && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.55} luminanceThreshold={0.35} luminanceSmoothing={0.5} mipmapBlur />
        </EffectComposer>
      )}
    </Canvas>
  )
}
