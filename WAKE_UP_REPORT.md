# Wake-Up Report — Portfolio Rebuild

**Date:** 2026-06-02
**Duration:** ~3 hours autonomous
**Status:** SHIPPED. Live at https://har5ha.in + https://har5ha.in/teli

---

## What you wake up to

A completely rebuilt portfolio with two modes:

### `har5ha.in` — Latent Space (your job-search anchor)

A walkable 3D galaxy where every section of your portfolio is an embedding node:

- **6 node kinds:** about (gold), skill (sky), project (fuchsia), experience (green), contact (rose), now (orange-pulsing teli hero)
- **Real RAG search:** type "RAG", "voice agents", "mortgage", "Kubernetes" — nodes light up by cosine similarity with % match badges
- **Click to retrieve:** any node → cinematic camera dolly + slide-in detail panel with bio, tech, GitHub links
- **Bottom HeroCard (desktop):** name + role + employer + résumé + "Watch the call" CTAs always above the fold
- **Mobile fallback:** scrollable text view with role, current work, top 5 projects, all contact CTAs
- **Visual:** custom GLSL-style glow, bloom + chromatic aberration post-processing, ambient star field, animated connection lines between semantically-related nodes
- **Top nav:** persistent résumé link + pulsing "Now · /teli" link

### `har5ha.in/teli` — Cinematic mortgage call (your authenticity anchor)

A 45-second simulated call that *embodies* what you ship at teli.ai:

- **Story:** Sarah Chen, 32, Michigan, $340K home, refi inquiry from a NEXA Lending Facebook lead
- **3D stack visualization:** phone center (rings during ring phase), GPT-4o brain orb (top, pulses during thinking + function calls), Retell number provider (right, lights during call), ElevenLabs voice (left, lights during agent speech), pgvector chunks (bottom-left, light during RAG retrieval), animated data-flow beams between all of them
- **Choreographed beats:** ringing → borrower speaks → GPT-4o thinking → function call fires → pgvector RAG retrieval → agent speaks → SMS sent → email sent → qualified — all with synchronized subtitle phase chips and code overlays
- **SMS side panel:** 10DLC compliance flow expandable (Brand → Campaign → Use Case → MO/MT → Carrier → Live), live typing indicator from t=22s, full message sequence from t=33s
- **Email side panel:** loan-officer Jonathan Haddad NEXA Lending follow-up with $84K savings number
- **Engineer Mode overlay:** full production stack — Retell, ElevenLabs, GPT-4o, Node.js/Next.js, Python FastAPI, LangChain, Supabase + pgvector, SMTP BYOD, AWS ECS/EKS/Lambda, Docker, K8s, GitHub Actions + Jenkins
- **Controls:** play/pause, replay, scrubbable progress bar

---

## Recruiter verdict (Maya Chen, Sr Eng Recruiter, Series B AI startup)

> "Voice agents (Retell + ElevenLabs + GPT-4o function calling), pgvector RAG, 10DLC compliance, multi-tenant Postgres, AWS end-to-end — this is exactly the production AI/ML stack we run. **Yes, call him today.**"

Two rounds of feedback. Round 1 caught above-fold info issues (no role, no employer, no résumé CTA visible). Round 2 confirmed all P0s resolved.

Critiques saved to `/tmp/portfolio-shots/RECRUITER_CRITIQUE.md` and `/tmp/portfolio-shots/v2/RECRUITER_CRITIQUE_V2.md`.

---

## Files written (in this repo)

| Layer | File |
|---|---|
| Design spec | `docs/superpowers/specs/2026-06-02-portfolio-latent-space-and-teli-route-design.md` |
| Data | `src/data/nodes.ts` (28 node records) |
| Positioning | `src/lib/positioning.ts` (deterministic embedding + cosine sim) |
| Latent Space | `src/components/latent-space/*` (Scene, NodeMesh, SearchOverlay, DetailPanel, HeroCard, TopNav, IntroOverlay, MobileFallback) |
| /teli | `src/components/teli/*` (CallScene, SMSPanel, EmailPanel, Subtitles, EngineerMode, choreography.ts) |
| Pages | `src/app/page.tsx`, `src/app/teli/page.tsx`, `src/app/layout.tsx` |
| Globals | `src/app/globals.css` |

Deleted from layout: legacy Total Overdose film-grain + scanlines + cowboy fonts (incompatible with the new aesthetic).

---

## Commits to `origin/main`

```
77514df V4: live SMS typing indicator during qualification phase
d536eb4 V3: tighten /teli orb positions, HeroCard desktop-only
256b81b V2: recruiter critique fixes (HeroCard, mobile fallback, lower bloom)
d58cd88 V1: full LATENT SPACE homepage + /teli cinematic call
9c5e8ed Replace fake PNC Bank role with real teli.ai Full Stack Engineer role
```

---

## Open follow-ups (for whenever you wake up)

1. **Twilio → Retell correction in resumes.** Earlier in this session I had Twilio listed for teli.ai voice work — you corrected it to Retell mid-session. The portfolio + /teli scene + Engineer Mode all use Retell correctly. But resumes (`sde`, `ml`, `devops`, `ai_automation`, `java_fullstack`, `test_automation`, `resume`, `temp` — all in `/home/har5ha/Desktop/resume/resumes/html/`) and cover letters (`/home/har5ha/Desktop/resume/cover_letters/`) still say "Twilio" for the voice stack. Memory note saved at `~/.claude/projects/-home-har5ha-Desktop-resume/memory/teli_tech_stack.md`. Ask Claude to "fix the Retell vs Twilio thing in my resumes and cover letters" next session.

2. **Optional polish (recruiter v2 marked "polish, not signal"):**
   - Orb hover labels on the homepage galaxy (today it requires clicking)
   - Engineer Mode bottom row sometimes scroll-clips on shorter viewports
   - Connection-line opacity could be tuned higher when matches are active

3. **3D screenshots:** agent-browser headless can't render WebGL on this Linux machine, so I tested by hitting the deployed Vercel CDN. Production screenshots saved to `/tmp/portfolio-shots/v3/` if you want to see what I saw.

---

## Quick sanity-check URLs

- Home: https://har5ha.in
- Teli: https://har5ha.in/teli
- Print resume: https://har5ha.in/Harsha_Yellela_resume.pdf
- GitHub: https://github.com/HAR5HA-7663/harsha-overdose

Sleep well. The site is alive.
