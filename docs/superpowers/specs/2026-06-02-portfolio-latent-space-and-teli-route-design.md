# Portfolio Rebuild — Latent Space + /teli — Design Spec

**Date:** 2026-06-02
**Status:** Approved by user (autonomous build mode)
**Repo:** github.com/HAR5HA-7663/harsha-overdose (Next.js 16 + TypeScript + Tailwind)
**Deploy:** Vercel auto-deploy from `main` → har5ha.in

---

## 1. Vision

A two-route portfolio that fuses 3D animation, ML/RAG metaphors, and authentic AI voice-agent work into one cohesive artifact.

- `har5ha.in/` — **LATENT SPACE**. A walkable 3D galaxy where every section of the portfolio (about, skills, projects, experiences, contact, "now") is an embedding point. Pre-computed embeddings, projected to 3D, rendered as glowing nodes with a custom GLSL shader. A search bar performs real client-side cosine-similarity retrieval and lights up matches. The portfolio doesn't describe RAG — it *is* RAG.
- `har5ha.in/teli` — **TELI: A CALL IN PROGRESS**. A cinematic simulated demo of one perfectly choreographed mortgage-qualification call (Sarah Chen, refinance lead) flowing through the actual production stack at teli.ai: **Retell** (number provider) → **OpenAI GPT-4o** (brain + function calling) → **ElevenLabs** (voice synthesis) → **LangChain RAG over pgvector** (historical context retrieval) → loan officer hand-off. Voice is the hero; SMS (with a 10DLC compliance side panel) and email round out the modality story.

---

## 2. Audience & Success Criteria

**Primary audience:** Senior AI/ML hiring managers at Series A–C AI startups (Distyl-tier) and mid-to-senior recruiters at FAANG-adjacent AI orgs.

**Success criteria, in priority order:**
1. **30-second clarity** — within 30 seconds of landing, viewer understands: this person ships production LLM systems, currently builds voice AI for the mortgage industry, has the technical chops to wire it all together.
2. **Authenticity** — every claim is backed by a concrete artifact (project, code link, deployed demo). No vibes-only flex.
3. **Distinctiveness** — the visual identity is unforgettable. The viewer will remember this portfolio a week later when they bring it up in hiring discussions.
4. **Recruiter ergonomics** — resume button always reachable in ≤2 clicks. Contact CTA never more than one viewport away.

---

## 3. Decisions Locked

| Decision | Choice |
|---|---|
| Homepage architecture | Pure latent space — every section is a node, no traditional scrollable layout |
| /teli interactivity model | Cinematic simulated demo (no real API calls, no user mic) |
| /teli content scope | Voice hero + small SMS (10DLC badge) + email side panels |
| /teli ↔ home navigation | Both: distinguished teli node in galaxy + persistent top nav link |
| /teli demo story | One scripted call — Sarah Chen, 32, Michigan, $340K home, 30yr→15yr refi from NEXA Facebook lead |
| /teli scene rendering | 3D (R3F) — phone object, GPT-4o orb, ElevenLabs lip-sync, function-call beams |
| Shipping cadence | Premium-first: build full Phase 1 + Phase 2 in one autonomous run |

---

## 4. Architecture

### 4.1 Tech stack

- **Framework:** Next.js 16 (App Router), TypeScript, Tailwind CSS
- **3D:** `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`
- **Animation:** Framer Motion (UI overlays), spring physics for camera transitions
- **Embeddings:** Pre-computed at build time using a deterministic local embedder (we'll bundle a small static JSON of N×384-dim vectors representing each portfolio node)
- **Vector projection:** PCA to 3D, computed at build time, results bundled as `embeddings.json` with `{id, position3d:[x,y,z], embedding:number[]}`
- **Retrieval:** client-side cosine similarity in a Web Worker (`embeddings.worker.ts`)
- **Audio:** Howler.js (already in deps) for ambient hum + UI sound effects
- **Custom shaders:** GLSL fragment shader for the embedding glow + outer-rim chromatic edge

### 4.2 Routes

```
/             → LatentSpace page (3D galaxy, search, panel)
/teli         → Teli cinematic playback page
/projects     → kept as fallback for crawler indexing (low priority, can degrade)
/projects/recruiter → kept (it's a known good recruiter-friendly route)
```

### 4.3 Data model

`src/data/nodes.ts` — single source of truth for every node in the galaxy:

```ts
export type Node = {
  id: string
  kind: 'about' | 'skill' | 'project' | 'experience' | 'contact' | 'now'
  title: string
  oneLiner: string
  tags: string[]
  detail: { /* kind-specific shape */ }
  // populated at build time:
  embedding?: number[]   // 384-dim
  position?: [number, number, number]
}
```

Build-time script: `scripts/build-embeddings.ts` reads all nodes, computes embeddings (using a deterministic seed-based pseudo-embedder for v1 to avoid network deps; can swap in real OpenAI/sentence-transformers later), runs PCA→3D, writes `public/embeddings.json`.

### 4.4 Latent Space scene composition

- Camera: `PerspectiveCamera`, fov 50, initial position [0,0,15], OrbitControls (damped)
- Background: deep navy `#06080F` with a subtle starfield (R3F `Stars` from drei)
- Nodes: instanced meshes, each a sphere with custom `ShaderMaterial`
  - Vertex: standard MVP transform
  - Fragment: radial glow falloff + chromatic edge + node-kind color tint
- Connections: faint lines between nodes that share tags (e.g., all "RAG" nodes are linked)
- Search bar: floating glass UI top-center, types query → Web Worker computes similarity → emits per-node match scores → nodes scale + glow brighter proportionally
- Panel: when a node is clicked, camera dollies in (spring), 2D HTML overlay slides in from right with node details
- Top nav: corner brand mark + "Now →" link to /teli

### 4.5 /teli scene composition

The page is a single full-viewport 3D scene with a fixed-position UI overlay.

**3D objects:**
- Center: phone receiver (3D model, simple geometry — handset shape)
- Ring 1: GPT-4o brain orb (sphere with internal swirling particles, pulsing on each "think")
- Ring 2: ElevenLabs waveform (3D wavy ribbon, animated by sine wave)
- Ring 3: Retell number provider (a glowing tower with "RETELL" label)
- Connection beams: animated tube geometries connecting the three providers
- pgvector chunks: small floating cards labeled with mock retrieval results, light up during RAG step

**Choreography (45-second loop):**
1. **0:00–0:05** Phone rings (Retell tower flashes green, ringtone audio)
2. **0:05–0:12** Sarah's voice (placeholder TTS or labeled text bubble): "Hi, I'm looking to refinance..."
3. **0:12–0:18** GPT-4o orb pulses (thinking), text overlay: `agent.think("intent classification")` → "refinance_inquiry"
4. **0:18–0:25** Function call beam fires: `tools.get_loan_eligibility({ home_value: 340000, current_rate: 7.5 })` — visual: beam shoots from brain to a "tools" cluster
5. **0:25–0:32** RAG retrieval: pgvector chunks light up with mock historical context ("prior call notes", "credit summary")
6. **0:32–0:40** ElevenLabs waveform speaks (animated): "Sarah, based on your numbers, I can connect you to Jonathan, a senior LO..."
7. **0:40–0:45** Lead-qualified banner appears, side panel SMS auto-sends ("Confirmation #4521 - your docs link"), email envelope flies into the email side panel
8. Loop restarts

**Side panels** (fixed-position React overlays, not 3D):
- Right rail "SMS @ teli": small phone-frame component showing the 10DLC-registered SMS sequence with a small `10DLC ✓` compliance badge that, on click, expands to show the 6-step registration flow (Brand → Campaign → Use Case → MO/MT → Carrier Approval → Live)
- Bottom left "Email @ teli": small Gmail-style preview with the templated follow-up
- Bottom right "Engineer mode" toggle: when enabled, replaces the cinematic with a clean architecture diagram (system view) listing the actual production tech: Next.js, Node.js, FastAPI, Supabase, pgvector, AWS ECS/EKS/Lambda, GitHub Actions/Jenkins, 99%+ uptime

### 4.6 Mobile + a11y

- `useMediaQuery` detects narrow viewport; below 768px, galaxy switches to a flat 2D node-cloud rendered with R3F orthographic camera + tap-to-explore
- /teli mobile: 3D scene scales down, side panels stack below scene
- `prefers-reduced-motion` users get static node positions with no orbit + a step-by-step text walkthrough of the /teli call
- All interactive elements get accessible roles + keyboard nav

---

## 5. Out of scope (v1)

- Real audio recordings (we use placeholder synthesized TTS or text bubbles)
- Real OpenAI/ElevenLabs/Retell API calls
- Live user mic input (no Realtime API)
- Multi-language i18n
- Comments / blog posts
- Theme toggle (galaxy is dark mode only by design)

---

## 6. Build phases (compressed for one-session autonomous run)

1. Pre-flight: install 3D deps, scaffold types
2. Build-time embeddings script + PCA projection
3. Latent Space scene (no shader yet) + click panel + search worker
4. Custom shader + post-processing (bloom, chromatic aberration)
5. /teli scene (3D objects, choreography loop, side panels)
6. Navigation glue (teli node + top nav link with cinematic transition)
7. Mobile responsive + reduced-motion fallback
8. Local build verification (`npm run build`)
9. Push to main → Vercel deploys to har5ha.in
10. Agent-browser test pass as senior AI/ML recruiter
11. Iterate on findings
12. Final summary written to temp.txt
13. Shutdown

---

## 7. Verification plan (recruiter persona)

Persona: **Maya Chen**, Senior Engineering Recruiter, Series B AI startup ($500M valuation, 60 engineers), specifically hiring an AI/ML Software Engineer. She has 47 portfolios in her tab today; this is portfolio #18. She gives each portfolio 60 seconds before tab-closing.

**Walkthrough script run via agent-browser:**
1. Land on `/` — first paint must show galaxy within 2s, scroll cue visible
2. Note initial reaction (would she stay? what does she look for?)
3. Try the search bar — type "RAG" — verify nodes glow
4. Click the teli node — verify cinematic transition into /teli
5. Watch the 45-second choreography — does she understand what teli.ai does?
6. Inspect side panels — does the 10DLC badge build credibility?
7. Find resume — verify CTA reachable in ≤2 clicks
8. Find contact — verify accessible
9. Mobile — re-test the same flow on viewport 375×812

**Decision criteria for "ship":** ≥7 out of 9 steps pass without friction; resume + contact CTAs always within reach.

---

## 8. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Three.js bundle bloat | Tree-shake imports, use `@react-three/drei`'s individual subpaths |
| First-paint slow | Show a typewriter loading screen ("INITIALIZING LATENT SPACE...") during scene mount, lazy-load /teli scene |
| Recruiter doesn't realize "Now →" goes to teli demo | Tooltip on hover, teli node visually pulses brighter than others |
| Mobile WebGL crashes on old devices | Fallback to 2D HTML grid via try/catch on canvas context |
| Build breaks on Vercel | Test `npm run build` locally before push; check Next.js + R3F SSR compat (R3F components need `'use client'`) |

---

*Approved by user (autonomous build mode) — proceeding to writing-plans → implementation.*
