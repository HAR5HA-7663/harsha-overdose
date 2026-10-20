import { DAYS, PLACES, PREP_TODO, STOPS, TRIP_END, type Checkpoint, type DayId, type LatLng, type Place, type Stop } from "@/data/trip";
import { distanceM, fmtDay, fmtTime, formatDuration, dateKey } from "./geo";
import { replan, type Plan, type PlanItem } from "./replan";

export type Tone = "good" | "warn" | "bad" | "info";

export type Pace = {
  at: Checkpoint;
  next?: Checkpoint;
  behindMin: number;
  milesLeft: number;
};

export type Guidance = {
  phase: "before" | "during" | "after";
  tone: Tone;
  pill: string;
  headline: string;
  detail: string;
  /** Where the plan wants you right now (or next). */
  target?: Stop;
  /** Where the Navigate button points: the target, or the stop after it once you're there. */
  nav?: Stop;
  /** Known trip place you are standing in, if any. */
  here?: Place;
  /** Stops planned at `here` that are not the target. */
  hereStops: Stop[];
  todo: string[];
  todoKey: string;
  travelMin?: number;
  distanceM?: number;
  backup?: string;
  pace?: Pace;
  /** Live re-plan of everything ahead. */
  plan: Plan;
  /** Today's adjustments worth telling you about. */
  changes: PlanItem[];
};

const ms = (iso: string) => new Date(iso).getTime();
const tripStart = ms(STOPS[0].start);
const tripEnd = ms(TRIP_END);

export function dayForTime(t: number): DayId {
  const key = dateKey(t);
  const hit = DAYS.find((d) => d.date === key);
  if (hit) return hit.id;
  return t < tripStart ? "sat" : "mon";
}

export function stopState(stop: Stop, t: number): "done" | "now" | "later" {
  if (t >= ms(stop.end)) return "done";
  if (t >= ms(stop.start)) return "now";
  return "later";
}

/** Smallest known place whose radius contains the position. */
export function placeAt(pos: LatLng): Place | undefined {
  let best: Place | undefined;
  for (const p of PLACES) {
    if (distanceM(pos, p.pos) <= p.radius && (!best || p.radius < best.radius)) best = p;
  }
  return best;
}

/** The stop the plan wants you at now: the current non-drive stop, or the destination of the current drive or gap. */
export function targetStop(t: number): Stop | undefined {
  const cur = STOPS.find((s) => t >= ms(s.start) && t < ms(s.end));
  if (cur && cur.kind !== "drive") return cur;
  return STOPS.find((s) => ms(s.start) >= (cur ? ms(cur.end) : t) && s.kind !== "drive");
}

/** Inside the stop's own radius (so the dock counts as "in town" for lunch). */
function atStop(stop: Stop, pos: LatLng | null, place?: Place): boolean {
  if (!pos) return false;
  return samePlace(stop, place) || distanceM(pos, stop.place.pos) <= stop.place.radius;
}

function samePlace(stop: Stop, place?: Place): boolean {
  if (!place) return false;
  if (stop.place.id === place.id) return true;
  // The hike counts the trailhead as being on the trail.
  return stop.kind === "hike" && (place.id === "chapelTh" || place.id === "chapelLoop");
}

function hikePace(stop: Stop, pos: LatLng, t: number): Pace | undefined {
  const cps = stop.checkpoints;
  if (!cps?.length) return undefined;
  // Trailhead and finish share a spot: before the halfway mark it is the start.
  const halfway = ms(cps[Math.floor(cps.length / 2)].at);
  let idx = 0;
  let bestD = Infinity;
  cps.forEach((cp, i) => {
    if (i === 0 && t > halfway) return;
    if (i === cps.length - 1 && t <= halfway) return;
    const d = distanceM(pos, cp.pos);
    if (d < bestD) {
      bestD = d;
      idx = i;
    }
  });
  const at = cps[idx];
  const next = cps[idx + 1];
  const behindMin = next ? Math.max(0, Math.round((t - ms(next.at)) / 60000)) : 0;
  return { at, next, behindMin, milesLeft: cps[cps.length - 1].mile - at.mile };
}

/** Road route to a place (`toId`), used only when it matches the place being judged. */
export type RouteInfo = { minutes: number; meters: number; toId: string } | null;

/** Which stop you're standing at: today's stop at this spot whose time is closest to now. */
function stopYouAreAt(t: number, pos: LatLng): Stop | undefined {
  const spot = placeAt(pos);
  const day = dayForTime(t);
  let best: Stop | undefined;
  let bestGap = Infinity;
  // The exact spot (the dock) wins over the wider area it sits in (town).
  const exact = STOPS.some((s) => s.day === day && s.kind !== "drive" && spot && s.place.id === spot.id);
  for (const s of STOPS) {
    if (s.day !== day || s.kind === "drive" || !atStop(s, pos, spot)) continue;
    if (exact && spot && !samePlace(s, spot)) continue;
    const gap = t < ms(s.start) ? ms(s.start) - t : t > ms(s.end) ? t - ms(s.end) : 0;
    if (gap < bestGap) {
      bestGap = gap;
      best = s;
    }
  }
  // Only count it if it's today's business (within 3 hours of its slot).
  return bestGap <= 3 * 3600000 ? best : undefined;
}

const live2 = (live: RouteInfo) => (live ? { toId: live.toId, minutes: live.minutes } : undefined);

function changesOf(plan: Plan, t: number): PlanItem[] {
  const today = dayForTime(t);
  // Earlier-than-planned is good news, and a missed fixed stop has its own banner.
  return plan.items.filter((i) => i.stop.day === today && !i.inProgress && (i.status === "dropped" || i.status === "shortened" || (i.status === "moved" && i.shiftMin > 0)));
}

export function guide(t: number, pos: LatLng | null, live: RouteInfo): Guidance {
  if (t < tripStart) {
    const first = STOPS[0];
    const plan = replan(t, null, null);
    const days = Math.floor((tripStart - t) / 86400000);
    const hours = Math.floor(((tripStart - t) % 86400000) / 3600000);
    const a = plan.anchor;
    return {
      phase: "before",
      tone: a && (a.status === "tight" || a.status === "missed") ? "warn" : "info",
      pill: "Getting ready",
      headline: days > 0 ? `Trip starts in ${days}d ${hours}h` : `Roll out in ${formatDuration((tripStart - t) / 60000)}`,
      detail: `${fmtDay(tripStart)} ${fmtTime(tripStart)} from ${first.place.name}`,
      target: first,
      nav: STOPS.find((s) => s.kind === "visit"),
      hereStops: [],
      todo: [...PREP_TODO, ...first.todo],
      todoKey: "prep",
      plan,
      changes: plan.items.filter((i) => i.stop.day === "sat" && (i.status === "dropped" || i.status === "shortened" || (i.status === "moved" && i.shiftMin > 0))),
    };
  }

  if (t > tripEnd) {
    return { phase: "after", tone: "good", pill: "Trip done", headline: "Welcome back", detail: "Pictured Rocks, Oct 24 to 26", hereStops: [], todo: [], todoKey: "after", plan: { items: [] }, changes: [] };
  }

  // No GPS: follow the clock and assume you're on schedule.
  if (!pos) {
    const target = targetStop(t) ?? STOPS[STOPS.length - 1];
    const cur = STOPS.find((s) => t >= ms(s.start) && t < ms(s.end));
    const driving = cur?.kind === "drive";
    const plan = replan(t, null, null);
    return {
      phase: "during",
      tone: "info",
      pill: "By the clock",
      headline: driving ? `On the road to ${target.title}` : target.title,
      detail: `${fmtTime(ms(target.start))} to ${fmtTime(ms(target.end))} · ${target.place.name}`,
      target,
      nav: target,
      hereStops: [],
      todo: driving && cur ? [...cur.todo, ...target.todo] : target.todo,
      todoKey: driving && cur ? cur.id : target.id,
      backup: target.backup,
      plan,
      changes: [],
    };
  }

  const here = placeAt(pos);
  const at = stopYouAreAt(t, pos);
  const plan = replan(t, pos, at?.id ?? null, live2(live));
  const changes = changesOf(plan, t);
  const live0 = plan.items.filter((i) => i.status !== "dropped" && i.status !== "missed");
  const first = live0[0];
  if (!first) {
    return { phase: "during", tone: "good", pill: "All done", headline: "Nothing left today", detail: "", hereStops: [], todo: [], todoKey: "none", plan, changes };
  }
  const next = live0[1];
  const anchor = plan.anchor;
  const missed = plan.items.find((i) => i.status === "missed" && i.stop.day === dayForTime(t));
  const base = {
    phase: "during" as const,
    target: first.stop,
    here,
    hereStops: here && !atStop(first.stop, pos, here) ? STOPS.filter((s) => samePlace(s, here)) : [],
    todo: first.stop.todo,
    todoKey: first.stop.id,
    backup: missed?.stop.backup ?? (anchor && anchor.status === "tight" ? anchor.stop.backup : first.stop.backup),
    plan,
    changes,
  };
  const skipped = changes.filter((c) => c.status === "dropped" && c.start <= first.start);
  const skipNote = skipped.length ? `Skip ${skipped.map((c) => c.stop.title.toLowerCase()).join(", ")}. ` : "";

  // A fixed stop is already lost: say so first.
  if (missed && (!first.stop.hard || first.stop.id !== missed.stop.id)) {
    return {
      ...base,
      nav: first.inProgress ? next?.stop : first.stop,
      tone: "bad",
      pill: "You'll miss it",
      headline: `${missed.stop.title} leaves at ${fmtTime(missed.start)}`,
      detail: `From here you'd arrive ${missed.note ?? "late"}. Use the backup below.`,
    };
  }

  // You're at the stop.
  if (first.inProgress) {
    const pace = first.stop.kind === "hike" ? hikePace(first.stop, pos, t) : undefined;
    const leaveNow = first.end - t < 60000;
    const tight = anchor && anchor.status === "tight";
    if (pace && pace.behindMin >= 20) {
      return {
        ...base,
        nav: next?.stop,
        pace,
        tone: "warn",
        pill: `${formatDuration(pace.behindMin)} behind`,
        headline: `At ${pace.at.name}`,
        detail: pace.next?.name === "Mosquito Beach" ? "Turn back at Chapel Rock to save the afternoon" : `${pace.milesLeft.toFixed(1)} mi to go`,
      };
    }
    return {
      ...base,
      nav: next?.stop,
      pace,
      tone: leaveNow || tight ? "warn" : "good",
      pill: leaveNow ? "Leave now" : t < ms(first.stop.start) ? "Early" : "You're here",
      headline: first.stop.title,
      detail: pace
        ? `${pace.next ? `Next: ${pace.next.name} by ${fmtTime(ms(pace.next.at))}` : "Last stretch"} · ${pace.milesLeft.toFixed(1)} mi to go`
        : first.stop.hard
          ? t < first.start
            ? `Boarding ${fmtTime(ms(first.stop.arriveBy ?? first.stop.start))}, departs ${fmtTime(first.start)}. Get in line early.`
            : `Back at ${fmtTime(first.end)}`
          : `${skipNote}${leaveNow ? "Time to go" : `Leave by ${fmtTime(first.end)}`}${next ? ` · next: ${next.stop.title} ${fmtTime(next.start)}` : ""}`,
    };
  }

  // On the way to a fixed stop.
  const away = `${formatDuration(first.travelMin)} away`;
  if (first.stop.hard) {
    const spare = first.spareMin ?? 0;
    const tone: Tone = spare < 0 ? "warn" : spare < 15 ? "warn" : "good";
    return {
      ...base,
      travelMin: first.travelMin,
      nav: first.stop,
      tone,
      pill: spare < 0 ? "Go now" : spare < 15 ? "Leave now" : "On track",
      headline: spare < 0 ? `Cutting it close: ${first.stop.title}` : `Head to ${first.stop.title}`,
      detail: `${skipNote}${away} · ${spare >= 0 ? `${spare} min to spare before boarding ${fmtTime(ms(first.stop.arriveBy ?? first.stop.start))}` : `boarding ${fmtTime(ms(first.stop.arriveBy ?? first.stop.start))}, departs ${fmtTime(first.start)}`}`,
    };
  }

  // On the way to a flexible stop.
  const anchorNote = anchor && anchor.stop.day === first.stop.day && anchor.spareMin !== undefined ? ` · ${anchor.stop.title.split(" ")[0]} ${anchor.spareMin >= 0 ? `${anchor.spareMin} min spare` : "at risk"}` : "";
  const cur = STOPS.find((s) => t >= ms(s.start) && t < ms(s.end));
  return {
    ...base,
    travelMin: first.travelMin,
    nav: first.stop,
    tone: skipped.length || (anchor && anchor.status === "tight") ? "warn" : "good",
    pill: skipped.length ? "Plan adjusted" : first.shiftMin >= 10 ? `${formatDuration(first.shiftMin)} behind` : "On track",
    headline: cur?.kind === "drive" && !skipped.length ? `On the road to ${first.stop.title}` : `Head to ${first.stop.title}`,
    detail: `${skipNote}${away} · arrive ${fmtTime(first.start)}${anchorNote}`,
  };
}

export function stopsForDay(day: DayId): Stop[] {
  return STOPS.filter((s) => s.day === day);
}
