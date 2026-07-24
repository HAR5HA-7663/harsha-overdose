# CLAUDE.md — har5ha.in (Latent Space Portfolio)

Harsha Yellela's live portfolio at **har5ha.in**. The repo name `harsha-overdose` is historical — a scrapped game-themed design. The actual site is a dark **3D latent-space knowledge graph** portfolio. Do not resurrect the old theme.

## What the site is

- `/` — full-screen React Three Fiber knowledge graph. Every node (`src/data/nodes.ts`) is a project/skill/job/contact; tags cluster nodes via anchors + force layout (`src/lib/positioning.ts`). Search is client-side term-vector cosine similarity — no backend. Phones get a bottom-sheet summary (`MobileFallback`) over the graph.
- `/teli` — 46s cinematic mortgage-call demo (choreographed beats in `src/components/teli/choreography.ts`), SMS/email side rails, Engineer Mode overlay.
- `/projects` — flat list from `src/data/projects.ts` (legacy `locoMove`/`damage` fields are vestigial — keep populated, they're typed required).
- `/resume` — PDF iframe viewer (`public/Harsha_Yellela_SDE.pdf`).
- `/projects/recruiter`, `/privacy`, `/terms` — static pages.

## Stack

Next.js 16 App Router + TypeScript, Tailwind v4 (`@theme inline` in `globals.css`), React Three Fiber + drei + postprocessing, framer-motion. Fonts: Fraunces / Geist Sans / JetBrains Mono / Instrument Serif. All pages statically prerendered.

## Hard rules

- **Vercel free tier — deploys are push-to-`main`.** Batch work into ONE push after local build+QA. Never push incrementally.
- **No 60fps values in React state.** The /teli clock runs on rAF + refs writing straight to the DOM (progress bar = scaleX transform); React re-renders only on beat changes. Keep it that way for anything animating every frame.
- **3D perf tiers via `src/lib/useAdaptivePerf.ts`:** coarse-pointer/narrow viewports skip Bloom and cap dpr at 1.25. Any new Canvas work must respect the tier.
- **No per-frame allocations in `useFrame`** — reuse module-level scratch `Vector3`s.
- **Motion tokens** live in `globals.css` (`--ease-out`, `--duration-*`, `.motion-*` classes) — use them, don't invent new timings.
- **Touch targets ≥44px**, search inputs ≥16px font on mobile (iOS zoom), safe-area padding on fixed bottom UI.
- **Public site — confidentiality:** Bevri/teli content stays at resume level (capabilities, clients bevri.ai + NEXA Lending). Never publish internal pricing, team names, incident details, or repo/PR internals.

## Commands

```bash
npm run dev     # local dev
npm run build   # must pass before any push
npm run lint    # zero errors as of 2026-07-24 — keep it that way
npm start       # port 3000 often taken by Bevri dev server; use -p 3789
```

## Content sources

Bio/work facts come from the resume PDF and Harsha's brain wiki (`~/brain/`). The graph node copy in `nodes.ts` is the single source of truth for the site — About bio, teli/Bevri work, projects with case studies.
