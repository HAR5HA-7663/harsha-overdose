# Wake-Up Report — Portfolio Redesign (Warp + Obsidian)

**Date:** 2026-06-05 (second redesign pass)
**Status:** SHIPPED. Live at https://har5ha.in + https://har5ha.in/teli

---

## What's new in this pass

You asked for two things: implement the **Warp design.md** as the chrome,
and make the graph feel like an **Obsidian vault** instead of a generic
particle galaxy. Both done.

### Visual identity → Warp aesthetic

- Warm dark canvas: `#0e0c0a` base, `#1d1916` graph background, `#2b2622` band, `#383330` card surface, `#3f3a36` hairline
- Off-white ink `#f7f5f0` as the primary "color" — no chromatic accent
- Typography: **Inter** for everything, **Instrument Serif** for editorial italic moments ("— full-stack & AI", "in real time"), **DM Mono** for code, captions, badges, timestamps
- Tight 3-4 px radii throughout. No pills. No backdrop-blur. No drop-shadows. Hairlines + surface contrast carry elevation.
- All UI shells re-skinned: TopNav, SearchOverlay, HeroCard, GraphLegend (new), DetailPanel, MobileFallback, /teli hero, SMS/Email/Engineer panels, controls.

### Graph → Obsidian vault behavior

- **Force-directed 3D layout** (custom simulation in `src/lib/positioning.ts`) — repulsion + link springs + center pull, 480 iterations, recentered and clamped to ±8.5 each axis so the cluster always fits the camera.
- **Node radius scales with connection degree**. The "now" hub, LangChain, pgvector etc. become visibly larger because they have more semantic links.
- **Hover any node** → that node + its neighbors stay bright; everything else dims to ~30%. Classic Obsidian focus pattern.
- **Search dims non-matches** + shows % similarity chips on the matched nodes. Cosine sim runs client-side.
- **Cyan connection lines** (electric Obsidian feel) brighten when both endpoints are in the focus set.
- **GraphLegend** in the bottom-left (desktop) labels the six color groups.

### /teli still cinematic

The 45-second Sarah Chen refi call still works exactly as before — phone center, GPT-4o brain orb top, Retell + ElevenLabs flanking, pgvector chunks bottom-left, SMS panel with 10DLC expandable steps, email panel with NEXA follow-up, engineer-mode architecture overlay. Just re-skinned to the Warp palette.

---

## Files touched

```
src/app/globals.css                          full rewrite — Warp tokens
src/app/layout.tsx                            Inter + Instrument Serif + DM Mono
src/data/nodes.ts                             KIND_COLORS → Obsidian palette
src/lib/positioning.ts                        force-directed simulation
src/components/latent-space/LatentSpaceScene.tsx   cyan-line GraphLinks + focus highlight
src/components/latent-space/NodeMesh.tsx           degree-driven radius + dim/focus states
src/components/latent-space/SearchOverlay.tsx      Warp text-input chrome
src/components/latent-space/TopNav.tsx             cyan status dot + tight Warp links
src/components/latent-space/HeroCard.tsx           serif italic editorial, off-white CTA
src/components/latent-space/DetailPanel.tsx        hairline borders, mono tag chips
src/components/latent-space/MobileFallback.tsx     warm canvas gradient
src/components/latent-space/GraphLegend.tsx        NEW — Groups key bottom-left
src/components/teli/CallScene.tsx                  unchanged structure, Warp colors via tokens
src/components/teli/SMSPanel.tsx                   Warp card + cyan accents
src/components/teli/EmailPanel.tsx                 Warp card + rose accent
src/components/teli/Subtitles.tsx                  mono phase chips
src/components/teli/EngineerMode.tsx               Warp tabular layout
src/app/teli/page.tsx                              Warp chrome
src/app/page.tsx                                   simpler — graph + overlays only
```

`IntroOverlay.tsx` was dropped — Obsidian doesn't have a flashy "initializing" intro.

---

## Commits

```
6d2eaa3 Recenter graph at origin + clamp extent ±8.5
a3360d7 Make graph actually visible: bigger nodes, closer camera, tighter layout
dc9aa16 Fix invisible graph: nodes were 70% fogged at camera distance
892d363 Tune graph layout: bigger spread, camera back, smaller halo
e511105 Redesign: Warp aesthetic + Obsidian-style force-directed knowledge graph
```

Iterated 4 times on the layout/camera/fog to get the graph rendering correctly
(force layout was collapsing into a single blob, then nodes were too tiny, then
the cluster centroid drifted, then fog was killing visibility). v9 is the
ship state — verified at 1920, 1440, 390 viewports.

---

## Still on the open-followups list (from prior run)

1. **Twilio → Retell correction in resumes/cover letters.** The portfolio
   now uses Retell correctly everywhere; only the resume HTML files and cover
   letters still need the swap. Memory note saved at
   `~/.claude/projects/-home-har5ha-Desktop-resume/memory/teli_tech_stack.md`.

---

## Sanity-check URLs

- Home (Obsidian graph + Warp chrome): https://har5ha.in
- Teli (cinematic call): https://har5ha.in/teli
- Résumé: https://har5ha.in/Harsha_Yellela_resume.pdf
- Repo: https://github.com/HAR5HA-7663/harsha-overdose

Both pages confirmed live + functional via agent-browser at multiple viewports.

Sleep well. Site looks like an Obsidian vault now.
