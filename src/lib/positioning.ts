// Deterministic 3D positioning + pseudo-embedding for galaxy nodes.
// Each node lands near the centroid of its tag anchors, plus jitter seeded by id.

import { NODES, TAG_ANCHORS, type GalaxyNode } from '../data/nodes'

export type PositionedNode = GalaxyNode & {
  position: [number, number, number]
  embedding: number[] // pseudo-embedding for cosine-similarity search
}

function seededJitter(seed: string): [number, number, number] {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  const rand = (offset: number) => {
    const x = Math.sin(h + offset) * 10000
    return (x - Math.floor(x)) * 2 - 1
  }
  return [rand(1) * 0.6, rand(2) * 0.6, rand(3) * 0.6]
}

// Compute node position as weighted centroid of tag anchors, plus jitter.
function computePosition(node: GalaxyNode): [number, number, number] {
  const anchors = node.tags
    .map(t => TAG_ANCHORS[t])
    .filter(Boolean) as [number, number, number][]

  if (anchors.length === 0) return seededJitter(node.id)

  const cx = anchors.reduce((a, p) => a + p[0], 0) / anchors.length
  const cy = anchors.reduce((a, p) => a + p[1], 0) / anchors.length
  const cz = anchors.reduce((a, p) => a + p[2], 0) / anchors.length
  const [jx, jy, jz] = seededJitter(node.id)
  return [cx + jx, cy + jy, cz + jz]
}

// Pseudo-embedding for client-side cosine similarity search.
// Each unique tag/word becomes a dimension. Vectors are sparse but consistent.
const TAG_DIM_INDEX: Record<string, number> = {}
let nextDimIdx = 0

function tagDim(tag: string): number {
  const key = tag.toLowerCase()
  if (TAG_DIM_INDEX[key] === undefined) {
    TAG_DIM_INDEX[key] = nextDimIdx++
  }
  return TAG_DIM_INDEX[key]
}

// Build pseudo-embedding from node tags + title words + oneLiner words.
function computeEmbedding(node: GalaxyNode, dims: number): number[] {
  const v = new Array(dims).fill(0)
  const all: string[] = [
    ...node.tags,
    ...node.title.toLowerCase().split(/\s+/),
    ...node.oneLiner.toLowerCase().split(/\s+/),
  ].filter(w => w.length > 2)

  for (const w of all) {
    const idx = tagDim(w) % dims
    v[idx] += 1
  }
  // L2 normalize
  const mag = Math.sqrt(v.reduce((a, x) => a + x * x, 0)) || 1
  return v.map(x => x / mag)
}

// Public: get all nodes with positions + embeddings.
export function getPositionedNodes(dims = 128): PositionedNode[] {
  // First pass: populate the tag-dim index from all node text so embeddings
  // are stable regardless of node iteration order.
  for (const n of NODES) {
    for (const t of n.tags) tagDim(t)
    for (const w of n.title.toLowerCase().split(/\s+/)) if (w.length > 2) tagDim(w)
    for (const w of n.oneLiner.toLowerCase().split(/\s+/)) if (w.length > 2) tagDim(w)
  }

  return NODES.map(n => ({
    ...n,
    position: computePosition(n),
    embedding: computeEmbedding(n, dims),
  }))
}

// Build query embedding using the same vocabulary as nodes.
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
  return dot // a, b are already normalized
}

// Compute connections: pairs of nodes that share >=2 tags.
export function getConnections(nodes: PositionedNode[]): [string, string][] {
  const pairs: [string, string][] = []
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = new Set(nodes[i].tags)
      let shared = 0
      for (const t of nodes[j].tags) if (a.has(t)) shared++
      if (shared >= 2) pairs.push([nodes[i].id, nodes[j].id])
    }
  }
  return pairs
}
