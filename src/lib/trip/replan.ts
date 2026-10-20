import travel from "@/data/trip-travel.json";
import { DAYS, PLACES, STOPS, type DayId, type LatLng, type Stop } from "@/data/trip";
import { distanceM, estimateDriveMin, sunTimes } from "./geo";

/**
 * Live re-plan. Fixed things never move (the cruise, checkout, check-in time, sunset).
 * Everything else slides, shortens or drops, lowest priority first, to protect them.
 */

export type ItemStatus = "planned" | "moved" | "shortened" | "dropped" | "spare" | "tight" | "missed";

export type PlanItem = {
  stop: Stop;
  start: number;
  end: number;
  status: ItemStatus;
  /** Minutes later (+) or earlier (-) than the original plan. */
  shiftMin: number;
  /** For fixed stops: minutes to spare at the arrive-by time (negative = late). */
  spareMin?: number;
  /** Why it changed, in a few words. */
  note?: string;
  /** You're standing at it right now. */
  inProgress?: boolean;
  /** Drive minutes from the previous stop (or from you). */
  travelMin: number;
};

export type Plan = { items: PlanItem[]; anchor?: PlanItem };

const ms = (iso: string) => new Date(iso).getTime();
const MIN = 60000;
const TRAVEL = travel.min as Record<string, Record<string, number | null>>;
const MUNISING: LatLng = [46.4118, -86.6497];

/** The hike is driven to at its trailhead. */
const roadId = (s: Stop) => (s.place.id === "chapelLoop" ? "chapelTh" : s.place.id);

function driveMin(fromId: string | null, fromPos: LatLng | null, to: Stop, live?: { toId: string; minutes: number }): number {
  const toId = roadId(to);
  if (fromId) {
    if (fromId === toId) return 0;
    const v = TRAVEL[fromId]?.[toId];
    if (v !== null && v !== undefined) return v;
  }
  if (fromPos) {
    if (live && live.toId === to.place.id) return Math.round(live.minutes);
    const d = distanceM(fromPos, to.place.pos);
    return d <= to.place.radius ? 0 : estimateDriveMin(d);
  }
  return 0;
}

const isFixed = (s: Stop) => !!s.hard;
const planned = (s: Stop) => (ms(s.end) - ms(s.start)) / MIN;

type Level = { shrinkOptional: boolean; dropOptional: boolean; shrinkNice: boolean; shrinkMust: boolean; dropNice: boolean };
const L0: Level = { shrinkOptional: false, dropOptional: false, shrinkNice: false, shrinkMust: false, dropNice: false };
/** Squeeze order: shorten optional, drop optional, shorten nice, shorten must, drop nice. */
const LADDER: Level[] = [
  L0,
  { ...L0, shrinkOptional: true },
  { ...L0, shrinkOptional: true, dropOptional: true },
  { ...L0, shrinkOptional: true, dropOptional: true, shrinkNice: true },
  { ...L0, shrinkOptional: true, dropOptional: true, shrinkNice: true, shrinkMust: true },
  { shrinkOptional: true, dropOptional: true, shrinkNice: true, shrinkMust: true, dropNice: true },
];

/** Minutes of cushion we try to keep before a fixed stop's arrive-by time. */
const BUFFER = 10;

type Cursor = { t: number; placeId: string | null; pos: LatLng | null };

/** Lay out one run of stops at a given squeeze level. Returns items + the cursor after them. */
function layout(stops: Stop[], from: Cursor, level: Level, sunset: number, inProgressId: string | null, live?: { toId: string; minutes: number }): { items: PlanItem[]; cur: Cursor; ok: boolean } {
  const items: PlanItem[] = [];
  let cur = { ...from };
  let ok = true;
  for (const s of stops) {
    const f = s.flex;
    const trav = s.id === inProgressId ? 0 : driveMin(cur.placeId, cur.pos, s, cur.placeId ? undefined : live);
    const arrive = cur.t + trav * MIN;

    if (isFixed(s) && s.id === inProgressId) {
      items.push({ stop: s, start: ms(s.start), end: ms(s.end), status: "spare", shiftMin: 0, travelMin: 0, inProgress: true });
      cur = { t: Math.max(ms(s.end), cur.t), placeId: roadId(s), pos: null };
      continue;
    }

    if (isFixed(s)) {
      const by = ms(s.arriveBy ?? s.start);
      const spare = Math.round((by - arrive) / MIN);
      if (arrive > ms(s.start)) {
        ok = false;
        items.push({ stop: s, start: ms(s.start), end: ms(s.end), status: "missed", shiftMin: 0, spareMin: spare, travelMin: trav, note: `${-spare} min late` });
        cur = { t: arrive, placeId: roadId(s), pos: null };
        continue;
      }
      if (spare < BUFFER) ok = false;
      items.push({ stop: s, start: ms(s.start), end: ms(s.end), status: spare < BUFFER ? "tight" : "spare", shiftMin: 0, spareMin: spare, travelMin: trav });
      cur = { t: ms(s.end), placeId: roadId(s), pos: null };
      continue;
    }

    if (!f) continue;
    const ideal = s.id === inProgressId ? Math.max(0, (ms(s.end) - from.t) / MIN) : planned(s);
    const pri = f.priority;
    let dur = ideal;
    let status: ItemStatus = "planned";
    let note: string | undefined;

    const drop = (pri === "optional" && level.dropOptional) || (pri === "nice" && level.dropNice);
    if (drop && s.id !== inProgressId) {
      items.push({ stop: s, start: arrive, end: arrive, status: "dropped", shiftMin: 0, travelMin: trav, note: "No time" });
      continue; // a dropped stop costs no travel: the next leg goes from where you are
    }
    if ((pri === "nice" && level.shrinkNice) || (pri === "must" && level.shrinkMust) || (pri === "optional" && level.shrinkOptional)) {
      if (f.min < dur) {
        dur = s.id === inProgressId ? Math.min(dur, f.min) : f.min;
        status = "shortened";
        note = f.shortNote ?? `${dur} min`;
      }
    }

    let start = arrive;
    if (f.notBefore) start = Math.max(start, ms(f.notBefore));
    let end = f.open ? Math.max(start, ms(s.end)) : start + dur * MIN;

    if (f.daylight) {
      if (start >= sunset - Math.max(f.min, 10) * MIN) {
        items.push({ stop: s, start, end: start, status: "dropped", shiftMin: 0, travelMin: trav, note: "After dark" });
        continue;
      }
      if (end > sunset) {
        end = sunset;
        status = "shortened";
        note = "Until sunset";
      }
    }
    if (f.deadline && end > ms(f.deadline)) {
      end = Math.max(start, ms(f.deadline));
      if (start > ms(f.deadline)) ok = false;
    }

    const shiftMin = Math.round((start - ms(s.start)) / MIN);
    // Only call it "moved" when it matters: 10+ min later, or a big jump earlier. Evenings just flex.
    if (status === "planned" && !f.open && (shiftMin >= 10 || shiftMin <= -30)) status = "moved";
    if (s.id === inProgressId && end - start < MIN) note = "Leave now";
    items.push({ stop: s, start, end, status, shiftMin, travelMin: trav, note, inProgress: s.id === inProgressId });
    cur = { t: end, placeId: roadId(s), pos: null };
  }
  return { items, cur, ok };
}

function planDay(day: DayId, from: Cursor, inProgressId: string | null, live?: { toId: string; minutes: number }): { items: PlanItem[]; cur: Cursor } {
  const dayInfo = DAYS.find((d) => d.id === day)!;
  const sunset = sunTimes(dayInfo.date, MUNISING).set.getTime();
  let stops = STOPS.filter((s) => s.day === day && s.kind !== "drive" && (ms(s.end) > from.t || s.id === inProgressId));
  // Standing at a stop means everything planned before it today is behind you.
  const idx = inProgressId ? stops.findIndex((s) => s.id === inProgressId) : -1;
  if (idx > 0) stops = stops.slice(idx);

  // Split at fixed stops / deadlines: each run before an anchor squeezes just enough to make it.
  const out: PlanItem[] = [];
  let cur = from;
  let run: Stop[] = [];
  const flush = (anchor: Stop | null) => {
    const group = anchor ? [...run, anchor] : run;
    let best = layout(group, cur, LADDER[0], sunset, inProgressId, live);
    for (const level of LADDER.slice(1)) {
      if (best.ok) break;
      best = layout(group, cur, level, sunset, inProgressId, live);
    }
    out.push(...best.items);
    cur = best.cur;
    run = [];
  };
  for (const s of stops) {
    if (isFixed(s)) flush(s);
    else if (s.flex?.deadline) {
      run.push(s);
      flush(null);
    } else run.push(s);
  }
  flush(null);
  return { items: out, cur };
}

/**
 * Re-plan everything still ahead.
 * `from`: where you are now (GPS), or null to assume you're on the original schedule.
 */
export function replan(now: number, pos: LatLng | null, inProgressId: string | null, live?: { toId: string; minutes: number }): Plan {
  const items: PlanItem[] = [];
  const firstStart = ms(STOPS[0].start);
  // Before the trip: project from the planned roll-out at home.
  let cur: Cursor = now < firstStart ? { t: firstStart, placeId: "home", pos: null } : { t: now, placeId: null, pos };
  if (!pos && now >= firstStart) {
    // No GPS: assume you're wherever the plan says.
    const at = STOPS.filter((s) => s.kind !== "drive" && ms(s.start) <= now).at(-1);
    cur = { t: now, placeId: at ? roadId(at) : "home", pos: null };
  }
  let started = false;
  for (const d of DAYS) {
    const dayEnd = ms(STOPS.filter((s) => s.day === d.id).at(-1)!.end);
    if (dayEnd <= cur.t) continue;
    const r = planDay(d.id, cur, started ? null : inProgressId, started ? undefined : live);
    items.push(...r.items);
    cur = r.cur;
    started = true;
  }
  const anchor = items.find((i) => i.stop.hard && i.end > now);
  return { items, anchor };
}

export const placeById = (id: string) => PLACES.find((p) => p.id === id);
