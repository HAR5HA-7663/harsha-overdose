import { DAYS, PLACES, PREP_TODO, STOPS, TRIP_END, type Checkpoint, type DayId, type LatLng, type Place, type Stop } from "@/data/trip";
import { distanceM, estimateDriveMin, fmtDay, fmtTime, formatDistance, formatDuration, dateKey } from "./geo";

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

export function guide(t: number, pos: LatLng | null, live: RouteInfo): Guidance {
  if (t < tripStart) {
    const first = STOPS[0];
    const days = Math.floor((tripStart - t) / 86400000);
    const hours = Math.floor(((tripStart - t) % 86400000) / 3600000);
    return {
      phase: "before",
      tone: "info",
      pill: "Getting ready",
      headline: days > 0 ? `Trip starts in ${days}d ${hours}h` : `Roll out in ${formatDuration((tripStart - t) / 60000)}`,
      detail: `${fmtDay(tripStart)} ${fmtTime(tripStart)} from ${first.place.name}`,
      target: first,
      nav: STOPS.find((s) => s.kind === "visit"),
      hereStops: [],
      todo: [...PREP_TODO, ...first.todo],
      todoKey: "prep",
    };
  }

  if (t > tripEnd) {
    return {
      phase: "after",
      tone: "good",
      pill: "Trip done",
      headline: "Welcome back",
      detail: "Pictured Rocks, Oct 24 to 26",
      hereStops: [],
      todo: [],
      todoKey: "after",
    };
  }

  let target = targetStop(t) ?? STOPS[STOPS.length - 1];
  // Already at the next stop while a soft one is still running? You're early there.
  // (Also when both match, if the next stop is the more specific spot, e.g. the dock inside town.)
  if (pos && !target.hard) {
    const spot = placeAt(pos);
    const following = STOPS.find((s) => ms(s.start) >= ms(target.end) && s.kind !== "drive");
    if (following && atStop(following, pos, spot) && (!atStop(target, pos, spot) || following.place.radius < target.place.radius)) target = following;
  }
  const cur = STOPS.find((s) => t >= ms(s.start) && t < ms(s.end));
  const driving = cur?.kind === "drive";
  const here = pos ? placeAt(pos) : undefined;
  const hereStops = here && !atStop(target, pos, here) ? STOPS.filter((s) => samePlace(s, here)) : [];
  const base = {
    phase: "during" as const,
    target,
    here,
    hereStops,
    todo: driving && cur ? [...cur.todo, ...target.todo] : target.todo,
    todoKey: driving && cur ? cur.id : target.id,
    backup: target.backup,
  };

  // No GPS: follow the clock.
  if (!pos) {
    return {
      ...base,
      nav: target,
      tone: "info",
      pill: "By the clock",
      headline: driving ? `On the road to ${target.title}` : target.title,
      detail: `${fmtTime(ms(target.start))} to ${fmtTime(ms(target.end))} · ${target.place.name}`,
    };
  }

  // At the planned place: Navigate points at what comes after.
  if (atStop(target, pos, here)) {
    const after = STOPS.find((s) => ms(s.start) >= ms(target.end) && s.kind !== "drive" && !samePlace(s, here));
    const leftMin = (ms(target.end) - t) / 60000;
    const started = t >= ms(target.start);
    const pace = target.kind === "hike" ? hikePace(target, pos, t) : undefined;
    if (pace && pace.behindMin >= 20) {
      return {
        ...base,
        nav: after,
        pace,
        tone: "warn",
        pill: `${formatDuration(pace.behindMin)} behind`,
        headline: `At ${pace.at.name}`,
        detail: pace.next?.name === "Mosquito Beach" ? "Turn back at Chapel Rock to save the afternoon" : `${pace.milesLeft.toFixed(1)} mi to go`,
      };
    }
    return {
      ...base,
      nav: after,
      pace,
      tone: "good",
      pill: started ? "You're here" : "Early",
      headline: target.title,
      detail: pace
        ? `${pace.next ? `Next: ${pace.next.name} by ${fmtTime(ms(pace.next.at))}` : "Last stretch"} · ${pace.milesLeft.toFixed(1)} mi to go`
        : started
          ? `${formatDuration(leftMin)} left · wrap up by ${fmtTime(ms(target.end))}`
          : `Starts ${fmtTime(ms(target.start))}`,
    };
  }

  // Somewhere else: can you still make it? Soft stops you can't reach are skipped for the next one.
  let goal = target;
  const skipped: Stop[] = [];
  const travel = (to: Place) => {
    if (live && live.toId === to.id) return { meters: live.meters, minutes: live.minutes };
    const m = distanceM(pos, to.pos);
    return { meters: m, minutes: estimateDriveMin(m) };
  };
  let { meters, minutes: travelMin } = travel(goal.place);
  for (;;) {
    const arrive = t + travelMin * 60000;
    if (goal.hard || arrive < ms(goal.end)) break;
    const after = STOPS.find((s) => ms(s.start) >= ms(goal.end) && s.kind !== "drive");
    if (!after) break;
    skipped.push(goal);
    goal = after;
    ({ meters, minutes: travelMin } = travel(goal.place));
    if (atStop(goal, pos, here)) break;
  }

  const skipNote = skipped.length ? `Skip ${skipped.map((s) => s.title.toLowerCase()).join(", ")}. ` : "";
  const withTravel = {
    ...base,
    target: goal,
    nav: goal,
    todo: goal.todo,
    todoKey: goal.id,
    backup: goal.backup,
    hereStops: here && !atStop(goal, pos, here) ? STOPS.filter((s) => samePlace(s, here)) : [],
    travelMin,
    distanceM: meters,
  };

  if (atStop(goal, pos, here)) {
    return { ...withTravel, travelMin: undefined, tone: "warn", pill: "Behind schedule", headline: goal.title, detail: `${skipNote}You're already here.` };
  }

  const arrival = t + travelMin * 60000;
  const deadline = ms(goal.arriveBy ?? goal.start);
  const slackMin = Math.round((deadline - arrival) / 60000);
  const away = `${formatDuration(travelMin)} away · ${formatDistance(meters)}`;

  if (goal.hard) {
    const departs = ms(goal.start);
    if (arrival > departs) {
      return { ...withTravel, tone: "bad", pill: "You'll miss it", headline: `${goal.title} leaves at ${fmtTime(departs)}`, detail: `${skipNote}You're ${away}.` };
    }
    if (arrival > deadline) {
      return { ...withTravel, tone: "warn", pill: "Go now", headline: `Cutting it close: ${goal.title}`, detail: `${skipNote}${away} · boarding ${fmtTime(deadline)}` };
    }
  } else if (slackMin < -10) {
    return { ...withTravel, tone: "warn", pill: `${formatDuration(-slackMin)} behind`, headline: `Head to ${goal.title}`, detail: `${skipNote}${away} · ${formatDuration((ms(goal.end) - arrival) / 60000)} there when you arrive` };
  }

  const leaveBy = deadline - travelMin * 60000;
  // On the road, being a few minutes off the plan is noise.
  const soon = !driving && slackMin < 15;
  return {
    ...withTravel,
    tone: skipped.length || soon ? "warn" : "good",
    pill: skipped.length ? "Change of plan" : soon ? "Leave now" : "On track",
    headline: driving && !skipped.length ? `On the road to ${goal.title}` : `Head to ${goal.title}`,
    detail: `${skipNote}${away}${soon ? "" : ` · leave by ${fmtTime(leaveBy)}`}`,
  };
}

export function stopsForDay(day: DayId): Stop[] {
  return STOPS.filter((s) => s.day === day);
}
