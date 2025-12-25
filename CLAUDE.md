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
│   └── sections/           # Page sections
│       ├── Hero.tsx        # Wanted poster landing
│       ├── Map.tsx         # Los Toros city map navigation
│       ├── Skills.tsx      # Combo meter skills display
│       ├── Projects.tsx    # Loco Moves project cards
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
- [ ] Global styles and CSS variables
- [ ] Custom cursor (crosshair)
- [ ] Film grain overlay effect
- [ ] Basic layout structure

### Phase 2: Landing Page
- [ ] Wanted poster design
- [ ] Bullet hole click effects
- [ ] Entry animation
- [ ] Background music toggle

### Phase 3: Main Sections
- [ ] City map navigation
- [ ] Combo meter skills section
- [ ] Loco Moves project cards
- [ ] Rewind timeline for experience
- [ ] Contact section with Day of Dead theme

### Phase 4: Polish
- [ ] Sound effects throughout
- [ ] Easter eggs (Konami code, etc.)
- [ ] Mobile responsiveness
- [ ] Performance optimization
- [ ] SEO metadata

---

## Personal Information (for content)

- **Name:** Harsha Vardhan Yellela
- **Title:** "The Code Slinger"
- **Email:** harsha.yellela@gmail.com
- **GitHub:** https://github.com/HAR5HA-7663
- **LinkedIn:** https://www.linkedin.com/in/har5ha-7663
- **Location:** United States

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
| 2024-12-25 | Project initialized | Created Next.js 14 project with TypeScript, Tailwind, Framer Motion, GSAP, Howler.js |

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
