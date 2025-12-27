# CLAUDE.md - Harsha Overdose Portfolio

> A Total Overdose (2005 video game) themed portfolio website for Harsha Vardhan Yellela

---

## Project Overview

This is a unique, interactive portfolio website inspired by **Total Overdose: A Gunslinger's Tale in Mexico** (2005), a third-person shooter that pays homage to Robert Rodriguez's Mexico Trilogy.

### Theme Elements
- **Grindhouse/Exploitation film aesthetic**
- **Mexican desert and urban barrio settings**
- **Combo meter system for skills**
- **Loco Moves as project showcases**
- **Rewind system for experience timeline**
- **Day of the Dead imagery for contact section**

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion, GSAP
- **Sound:** Howler.js
- **Deployment:** Vercel

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with fonts, metadata
│   ├── page.tsx            # Landing page (Wanted poster)
│   ├── globals.css         # Global styles, CSS variables
│   ├── projects/
│   │   └── page.tsx        # All 27 projects page with category filters
│   └── sections/           # Page sections
│       ├── Hero.tsx        # Wanted poster landing
│       ├── Map.tsx         # Los Toros city map navigation
│       ├── Skills.tsx      # Icon grid skills display (51 skills)
│       ├── Projects.tsx    # Loco Moves featured cards + View All button
│       ├── Experience.tsx  # Rewind timeline
│       └── Contact.tsx     # Day of the Dead contact
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── BulletHole.tsx
│   │   ├── ComboMeter.tsx
│   │   ├── LocoMoveCard.tsx
│   │   ├── RewindSlider.tsx
│   │   └── WantedPoster.tsx
│   ├── effects/            # Visual effects
│   │   ├── FilmGrain.tsx
│   │   ├── MuzzleFlash.tsx
│   │   └── Cursor.tsx
│   └── layout/             # Layout components
│       ├── Navigation.tsx
│       └── Footer.tsx
├── hooks/                  # Custom React hooks
│   ├── useSound.ts
│   ├── useBulletHoles.ts
│   └── useCombo.ts
├── lib/                    # Utilities
│   ├── sounds.ts
│   └── constants.ts
├── data/                   # Static data
│   ├── projects.ts
│   ├── skills.ts
│   └── experience.ts
└── public/
    ├── sounds/             # Audio files
    ├── images/             # Images
    └── fonts/              # Custom fonts
```

---

## Color Palette

```css
:root {
  /* Desert/Mexico */
  --sand: #D4A855;
  --terracotta: #C75B39;
  --adobe: #8B4513;
  --dusty-rose: #D4A574;

  /* Grindhouse */
  --blood-red: #8B0000;
  --film-grain: #1A1A1A;
  --sepia: #704214;
  --vintage-yellow: #FFD700;

  /* Accents */
  --neon-pink: #FF1493;
  --tequila-gold: #FFB347;
  --lime-green: #32CD32;

  /* UI */
  --combo-fire: #FF4500;
  --health-red: #FF0000;
  --ammo-yellow: #FFFF00;
}
```

---

## Key Features to Implement

### Phase 1: Core Structure
- [x] Project initialization
- [x] Global styles and CSS variables
- [x] Custom cursor (crosshair & revolver)
- [x] Film grain overlay effect
- [x] VHS scanlines effect
- [x] Basic layout structure

### Phase 2: Landing Page
- [x] Wanted poster design
- [x] Bullet hole click effects
- [x] Muzzle flash effects
- [x] Combo meter system
- [x] Entry animation
- [ ] Background music toggle

### Phase 3: Main Sections
- [x] About section (The Outlaw - classified dossier)
- [x] Skills section (Arsenal - 51 skills with devicon icons and category filters)
- [x] Loco Moves project cards (8 featured + 27 total on /projects page)
- [x] Rewind timeline for experience (VHS effect navigation)
- [x] Contact section with Day of Dead theme (Día de Contacto)

### Phase 4: Polish
- [x] Sound effects (gunshots, combo sounds with Web Audio API)
- [x] SEO metadata (OpenGraph, Twitter cards)
- [ ] Background music toggle
- [ ] Easter eggs (Konami code, etc.)
- [ ] Mobile responsiveness improvements

---

## Personal Information (for content)

- **Name:** Harsha Vardhan Yellela
- **Title:** "The Code Slinger"
- **Email:** harsha.yellela@gmail.com
- **Portfolio:** https://har5ha.in
- **GitHub:** https://github.com/HAR5HA-7663
- **LinkedIn:** https://www.linkedin.com/in/har5ha-7663
- **Location:** United States
- **Resume:** /harsha_yellela_resume.pdf (in public folder)

---

## Commands

```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm start

# Lint
npm run lint
```

---

## Task Log

| Date | Task | Details |
|------|------|---------|
| 2025-12-25 | Cowboy photo & fixes | Added cowboy_headshot.jpg, fixed timeline date order, updated status to "Recent M.S. Graduate" |
| 2025-12-27 | Resume link added | Added resume PDF to public/, added RESUME button in navbar (orange accent), added resume to Contact section |
| 2025-12-27 | Skills redesign | Replaced combo meter skills with clean icon grid using devicon CDN, removed Express/Azure/Ansible |
| 2025-12-27 | All projects page | Added 27 projects from projects.md, created /projects page with category filters, "View All Loco Moves" button on main page |

---

## Design References

- **Total Overdose gameplay:** Combo meter, Loco Moves, Rewind system
- **Robert Rodriguez films:** Desperado, El Mariachi, Grindhouse, Machete
- **Aesthetic:** Mexican desert, Day of the Dead, Luchador culture, Grindhouse posters

---

## Notes for Claude

When working on this project:
1. Maintain the grindhouse/Mexican aesthetic throughout
2. Prioritize interactivity and animations
3. Sound effects should enhance, not annoy (provide mute option)
4. Mobile experience should be simplified but still themed
5. Performance is critical - lazy load heavy assets
6. Accessibility should not be sacrificed for style

---

*Last Updated: December 2024*
