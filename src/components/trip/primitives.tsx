"use client";

import { useState, type ReactNode } from "react";
import type { StopKind } from "@/data/trip";
import type { Tone } from "@/lib/trip/engine";

/* ---------- Icon: one set, one stroke, 16/20/24 ---------- */

const PATHS = {
  car: "M5 17h14M6 17v2M18 17v2M3 13l2-6h14l2 6v4H3v-4ZM7.5 13.5h.01M16.5 13.5h.01",
  boat: "M2 20c2 1 4 1 6 0s4-1 6 0 4 1 6 0M4 16l-1-5h18l-1 5M7 11V6h10v5M12 3v3",
  hike: "M13 4a1 1 0 1 0 2 0 1 1 0 0 0-2 0M10 21l2-6 3 3v3M12 15l-1-5 4-2 2 3 3 1M9 11l-3 2v3",
  pin: "M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11ZM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  home: "M3 11l9-7 9 7M5 10v10h14V10M10 20v-6h4v6",
  food: "M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M17 21V3c-2 1-3 3-3 6v4h3",
  bed: "M3 18V7M3 13h18v5M21 18v-5a3 3 0 0 0-3-3h-7v3M7 11.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z",
  locate: "M12 2v3M12 19v3M2 12h3M19 12h3M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  route: "M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM6 15V9a3 3 0 0 1 3-3h4M18 9v6a3 3 0 0 1-3 3h-4",
  nav: "M3 11l18-8-8 18-2-8-8-2Z",
  check: "M5 12.5l4.5 4.5L19 7.5",
  chevron: "M9 6l6 6-6 6",
  sun: "M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4",
  sunset: "M12 10V3M8.5 6.5 12 3l3.5 3.5M4.2 13.2l1.4 1.4M18.4 14.6l1.4-1.4M2 18h20M7 18a5 5 0 0 1 10 0M4 22h16",
  cloud: "M7 18a4 4 0 1 1 .7-7.9A5.5 5.5 0 0 1 18 11a3.5 3.5 0 0 1 0 7H7Z",
  alert: "M12 9v4M12 17h.01M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3 2",
  spinner: "M12 3a9 9 0 1 0 9 9",
  layers: "M12 3 2 8l10 5 10-5-10-5ZM2 13l10 5 10-5",
  wave: "M2 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0",
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, size = 16, className = "" }: { name: IconName; size?: 16 | 20 | 24 | 14; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={`${name === "spinner" ? "animate-spin" : ""} shrink-0 ${className}`}>
      <path d={PATHS[name]} />
    </svg>
  );
}

export const KIND_ICON: Record<StopKind, IconName> = {
  home: "home",
  drive: "car",
  visit: "pin",
  hike: "hike",
  cruise: "boat",
  food: "food",
  stay: "bed",
};

/* ---------- Tone dictionary ---------- */

export const TONE: Record<Tone, { text: string; dot: string; ring: string }> = {
  good: { text: "text-(--t-pos)", dot: "bg-(--t-pos)", ring: "border-(--t-pos)/40" },
  warn: { text: "text-(--t-warn)", dot: "bg-(--t-warn)", ring: "border-(--t-warn)/40" },
  bad: { text: "text-(--t-neg)", dot: "bg-(--t-neg)", ring: "border-(--t-neg)/45" },
  info: { text: "text-(--t-accent)", dot: "bg-(--t-accent)", ring: "border-(--t-accent)/35" },
};

export function StatusPill({ tone, children }: { tone: Tone; children: ReactNode }) {
  const t = TONE[tone];
  return (
    <span className={`inline-flex h-7 items-center gap-2 rounded-full border bg-(--t-surface-2) px-3 text-[12px] font-medium tracking-wide ${t.ring} ${t.text}`}>
      <span className={`trip-live-dot size-1.5 rounded-full ${t.dot}`} />
      {children}
    </span>
  );
}

/* ---------- SceneSwap: keyed crossfade, exit plays before removal ---------- */

type Scene = { key: string; node: ReactNode; leaving: boolean };

export function SceneSwap({ sceneKey, children, className = "" }: { sceneKey: string; children: ReactNode; className?: string }) {
  const [scenes, setScenes] = useState<Scene[]>([{ key: sceneKey, node: children, leaving: false }]);
  const [lastKey, setLastKey] = useState(sceneKey);

  // Derive during render (no effect): a new key pushes a scene, the old ones start leaving.
  let view = scenes;
  if (sceneKey !== lastKey) {
    view = [...scenes.map((s) => ({ ...s, leaving: true })), { key: sceneKey, node: children, leaving: false }];
    setLastKey(sceneKey);
    setScenes(view);
  } else {
    view = scenes.map((s) => (s.key === sceneKey && !s.leaving ? { ...s, node: children } : s));
  }

  return (
    <div className={`trip-scene ${className}`}>
      {view.map((s) => (
        <div
          key={s.key + (s.leaving ? ":out" : "")}
          data-scene={s.leaving ? "out" : "in"}
          data-motion
          inert={s.leaving}
          aria-hidden={s.leaving || undefined}
          onAnimationEnd={(e) => {
            if (s.leaving && e.target === e.currentTarget) setScenes((all) => all.filter((x) => !(x.key === s.key && x.leaving)));
          }}
        >
          {s.node}
        </div>
      ))}
    </div>
  );
}

/* ---------- Collapse ---------- */

export function Collapse({ open, children, id }: { open: boolean; children: ReactNode; id?: string }) {
  return (
    <div id={id} className="trip-collapse" data-state={open ? "open" : "closed"} data-motion inert={!open} aria-hidden={!open || undefined}>
      <div>{children}</div>
    </div>
  );
}

/* ---------- Buttons ---------- */

const BTN_BASE =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-[14px] font-medium transition-[background-color,border-color,color,transform] duration-(--m-control) ease-(--m-ease-in) active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--t-accent) disabled:opacity-50";

const BTN_VARIANT = {
  primary: "bg-(--t-accent) text-(--t-accent-ink) hover:bg-(--t-accent)/90",
  secondary: "border border-(--t-border-strong) bg-(--t-surface-2) text-(--t-ink) hover:bg-(--t-surface-3)",
  ghost: "text-(--t-muted) hover:bg-(--t-surface-2) hover:text-(--t-ink)",
} as const;

export function Button({
  variant = "secondary",
  icon,
  children,
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof BTN_VARIANT; icon?: IconName }) {
  return (
    <button type="button" className={`${BTN_BASE} ${BTN_VARIANT[variant]} ${className}`} {...rest}>
      {icon ? <Icon name={icon} /> : null}
      {children}
    </button>
  );
}

export function LinkButton({
  variant = "secondary",
  icon,
  children,
  className = "",
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: keyof typeof BTN_VARIANT; icon?: IconName }) {
  return (
    <a className={`${BTN_BASE} ${BTN_VARIANT[variant]} ${className}`} target="_blank" rel="noreferrer" {...rest}>
      {icon ? <Icon name={icon} /> : null}
      {children}
    </a>
  );
}

/** Round floating control on the map. */
export function MapButton({ label, icon, active, onClick }: { label: string; icon: IconName; active?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      onClick={onClick}
      className={`grid size-11 place-items-center rounded-full border shadow-lg backdrop-blur transition-[background-color,color,border-color] duration-(--m-control) ease-(--m-ease-in) active:scale-95 ${
        active ? "border-(--t-user)/60 bg-(--t-user)/20 text-(--t-user)" : "border-(--t-border-strong) bg-(--t-surface-1)/85 text-(--t-ink)"
      }`}
    >
      <Icon name={icon} size={20} />
    </button>
  );
}
