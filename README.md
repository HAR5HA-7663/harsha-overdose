# har5ha.in — Latent Space Portfolio

Personal portfolio of **Harsha Vardhan Yellela**, Full Stack Engineer at [teli.ai](https://teli.ai).

Live at **[har5ha.in](https://har5ha.in)**.

Instead of a scrolling resume page, the homepage is a **walkable 3D knowledge graph** — an Obsidian-style "latent space" where every node is a project, skill, job, or contact point, positioned by embedding similarity and connected by shared concepts.

## Pages

| Route | What it is |
|---|---|
| `/` | Interactive 3D knowledge graph (React Three Fiber). Drag/scroll/click nodes, or search — queries are embedded client-side and matched by cosine similarity, lighting up relevant nodes. Phones get a native bottom-sheet summary over the graph. |
| `/teli` | A 46-second cinematic replay of what I ship at teli.ai: a mortgage lead qualified in real time — telephony, function-calling reasoning, hybrid RAG over pgvector, streaming TTS, then 10DLC SMS + email follow-up. Includes an Engineer Mode panel with the real architecture. |
| `/projects` | Flat list of 31 shipped projects with category filters and GitHub links. |
| `/resume` | Inline PDF viewer with download link. |
| `/privacy`, `/terms` | Legal pages. |

## Stack

- **Next.js 16** (App Router, static prerender) + TypeScript
- **React Three Fiber + drei + postprocessing** — 3D scenes; bloom and pixel-ratio scale down automatically on mobile
- **Tailwind CSS v4** — warm-dark canvas theme via CSS variables, shared motion tokens
- **Framer Motion** — UI transitions (panels, overlays)
- **Fonts:** Fraunces (display), Geist Sans (body), JetBrains Mono (code), Instrument Serif (editorial italic)
- **Vercel** — deploys on push to `main`, with Analytics + Speed Insights

## Search: how it works

No backend, no API calls. Every node's tags, title, and one-liner are vectorized at load into a shared 128-dim term space; the search box vectorizes your query the same way in the browser and ranks nodes by cosine similarity. A deliberately tiny, dependency-free version of the retrieval pattern I build at work — visible end-to-end in `src/lib/positioning.ts`.

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm start       # serve the build
npm run lint
```

Deployment is automatic: push to `main` → Vercel builds and ships.

## Performance notes

- 3D scenes drop bloom post-processing and cap `devicePixelRatio` at 1.25 on coarse-pointer / narrow viewports.
- The `/teli` choreography clock runs on `requestAnimationFrame` refs and writes straight to the DOM — React only re-renders on beat changes, not every frame.
- `prefers-reduced-motion` collapses all animation durations.
