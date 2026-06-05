// 3D force-directed positioning + pseudo-embedding for the knowledge-graph view.
// Obsidian-style: nodes repel each other, linked nodes attract, gentle pull to origin.

import { NODES, TAG_ANCHORS, type GalaxyNode } from '../data/nodes'

export type PositionedNode = GalaxyNode & {
  position: [number, number, number]
  embedding: number[]
  degree: number       // number of incident links — drives node radius (Obsidian)
}

export type Link = { source: string; target: string; weight: number }

// ───────────────────────── pseudo-embedding (unchanged) ─────────────────────────

const TAG_DIM_INDEX: Record<string, number> = {}
let nextDimIdx = 0
function tagDim(tag: string): number {
  const key = tag.toLowerCase()
  if (TAG_DIM_INDEX[key] === undefined) TAG_DIM_INDEX[key] = nextDimIdx++
  return TAG_DIM_INDEX[key]
}
function computeEmbedding(node: GalaxyNode, dims: number): number[] {
  const v = new Array(dims).fill(0)
  const all = [
    ...node.tags,
    ...node.title.toLowerCase().split(/\s+/),
    ...node.oneLiner.toLowerCase().split(/\s+/),
  ].filter(w => w.length > 2)
  for (const w of all) {
    const idx = tagDim(w) % dims
    v[idx] += 1
  }
  const mag = Math.sqrt(v.reduce((a, x) => a + x * x, 0)) || 1
  return v.map(x => x / mag)
}

// ───────────────────────── link discovery (degree drives node size) ─────────────────────────

function getLinks(): Link[] {
  const links: Link[] = []
  for (let i = 0; i < NODES.length; i++) {
    for (let j = i + 1; j < NODES.length; j++) {
      const a = new Set(NODES[i].tags)
      let shared = 0
      for (const t of NODES[j].tags) if (a.has(t)) shared++
      if (shared >= 2) links.push({ source: NODES[i].id, target: NODES[j].id, weight: shared })
    }
  }
  return links
}

function getDegrees(links: Link[]): Record<string, number> {
  const deg: Record<string, number> = {}
  for (const n of NODES) deg[n.id] = 0
  for (const l of links) {
    deg[l.source] = (deg[l.source] || 0) + l.weight
    deg[l.target] = (deg[l.target] || 0) + l.weight
  }
  return deg
}

// ───────────────────────── force-directed layout (3D, deterministic) ─────────────────────────

function seedRand(seed: string) {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (offset: number) => {
    const x = Math.sin(h + offset) * 10000
    return (x - Math.floor(x)) * 2 - 1
  }
}

function runForceLayout(
  nodes: GalaxyNode[],
  links: Link[],
  iterations = 480,
): Record<string, [number, number, number]> {
  // Seed positions near tag anchors so layout converges to a sensible map.
  const pos: Record<string, [number, number, number]> = {}
  const vel: Record<string, [number, number, number]> = {}

  for (const n of nodes) {
    const anchors = n.tags.map(t => TAG_ANCHORS[t]).filter(Boolean) as [number, number, number][]
    const r = seedRand(n.id)
    let cx = 0, cy = 0, cz = 0
    if (anchors.length > 0) {
      for (const a of anchors) { cx += a[0]; cy += a[1]; cz += a[2] }
      cx /= anchors.length; cy /= anchors.length; cz /= anchors.length
    }
    pos[n.id] = [cx + r(1) * 1.2, cy + r(2) * 1.2, cz + r(3) * 1.2]
    vel[n.id] = [0, 0, 0]
  }

  const idealLen = 3.2
  const repel = 22
  const center = 0.008
  const damping = 0.85

  for (let step = 0; step < iterations; step++) {
    // Repulsion (Coulomb-like) — every pair pushes apart, scaled by 1/r²
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i].id, b = nodes[j].id
        const dx = pos[b][0] - pos[a][0]
        const dy = pos[b][1] - pos[a][1]
        const dz = pos[b][2] - pos[a][2]
        const d2 = dx * dx + dy * dy + dz * dz + 0.05
        const d = Math.sqrt(d2)
        const f = repel / d2
        const ux = dx / d, uy = dy / d, uz = dz / d
        vel[a][0] -= ux * f; vel[a][1] -= uy * f; vel[a][2] -= uz * f
        vel[b][0] += ux * f; vel[b][1] += uy * f; vel[b][2] += uz * f
      }
    }

    // Link spring force — Hooke-like, pulls connected nodes toward idealLen
    for (const l of links) {
      const a = l.source, b = l.target
      const dx = pos[b][0] - pos[a][0]
      const dy = pos[b][1] - pos[a][1]
      const dz = pos[b][2] - pos[a][2]
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.001
      const k = 0.06 * Math.min(l.weight, 4)
      const f = k * (d - idealLen)
      const ux = dx / d, uy = dy / d, uz = dz / d
      vel[a][0] += ux * f; vel[a][1] += uy * f; vel[a][2] += uz * f
      vel[b][0] -= ux * f; vel[b][1] -= uy * f; vel[b][2] -= uz * f
    }

    // Gentle pull toward origin so the graph stays centered + doesn't drift.
    for (const n of nodes) {
      const p = pos[n.id]
      vel[n.id][0] -= p[0] * center
      vel[n.id][1] -= p[1] * center
      vel[n.id][2] -= p[2] * center
    }

    // Integrate + damp
    for (const n of nodes) {
      const v = vel[n.id]
      const p = pos[n.id]
      const stepLimit = 0.6
      const vmag = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2])
      const scale = vmag > stepLimit ? stepLimit / vmag : 1
      p[0] += v[0] * scale
      p[1] += v[1] * scale
      p[2] += v[2] * scale
      v[0] *= damping; v[1] *= damping; v[2] *= damping
    }
  }
  return pos
}

// ───────────────────────── public API ─────────────────────────

let _cache: { nodes: PositionedNode[]; links: Link[] } | null = null

export function getGraph(): { nodes: PositionedNode[]; links: Link[] } {
  if (_cache) return _cache

  // Reset embedding dim index for stable order.
  for (const k of Object.keys(TAG_DIM_INDEX)) delete TAG_DIM_INDEX[k]
  nextDimIdx = 0
  for (const n of NODES) {
    for (const t of n.tags) tagDim(t)
    for (const w of n.title.toLowerCase().split(/\s+/)) if (w.length > 2) tagDim(w)
    for (const w of n.oneLiner.toLowerCase().split(/\s+/)) if (w.length > 2) tagDim(w)
  }

  const links = getLinks()
  const degrees = getDegrees(links)
  const positions = runForceLayout(NODES, links)

  const nodes: PositionedNode[] = NODES.map(n => ({
    ...n,
    position: positions[n.id],
    embedding: computeEmbedding(n, 128),
    degree: degrees[n.id] || 0,
  }))

  _cache = { nodes, links }
  return _cache
}

// Back-compat for existing imports
export function getPositionedNodes(): PositionedNode[] {
  return getGraph().nodes
}
export function getConnections(): [string, string][] {
  return getGraph().links.map(l => [l.source, l.target])
}

export function embedQuery(query: string, dims = 128): number[] {
  const v = new Array(dims).fill(0)
  const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 2)
  for (const w of words) {
    const idx = tagDim(w) % dims
    v[idx] += 1
  }
  const mag = Math.sqrt(v.reduce((a, x) => a + x * x, 0)) || 1
  return v.map(x => x / mag)
}
export function cosineSim(a: number[], b: number[]): number {
  let dot = 0
  for (let i = 0; i < a.length; i++) dot += a[i] * b[i]
  return dot
}

// Adjacency list for hover-highlight.
export function getNeighbors(links: Link[]): Record<string, Set<string>> {
  const map: Record<string, Set<string>> = {}
  for (const l of links) {
    if (!map[l.source]) map[l.source] = new Set()
    if (!map[l.target]) map[l.target] = new Set()
    map[l.source].add(l.target)
    map[l.target].add(l.source)
  }
  return map
}
