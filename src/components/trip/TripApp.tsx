"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { DAYS, PLACES, STOPS, TRIP_END, type DayId, type LatLng, type Stop } from "@/data/trip";
import { dayForTime, guide, stopState, stopsForDay, type Guidance } from "@/lib/trip/engine";
import type { ItemStatus, PlanItem } from "@/lib/trip/replan";
import { dateKey, fmtDay, fmtTime, mapsDirectionsUrl, sunTimes } from "@/lib/trip/geo";
import { useChecklist, useGeolocation, useLiveRoute, useNow, usePrefersReducedMotion, useWeather, type GeoState } from "@/lib/trip/hooks";
import { Button, Collapse, Icon, KIND_ICON, LinkButton, MapButton, SceneSwap, StatusPill } from "./primitives";
import type { MapStyle, MapUser } from "./TripMap";
import "./trip.css";

const TripMap = dynamic(() => import("./TripMap"), {
  ssr: false,
  loading: () => <div className="trip-skeleton absolute inset-0 rounded-none" />,
});

const MUNISING: LatLng = [46.4118, -86.6497];
const HOUSE: LatLng = PLACES.find((p) => p.id === "house")!.pos;
const TRIP_START_MS = new Date(STOPS[0].start).getTime();
const TRIP_END_MS = new Date(TRIP_END).getTime();

/* ---------- Map style pref (per device, default simple dark map) ---------- */

const STYLE_KEY = "trip-pr-2026:map-v2";
const styleListeners = new Set<() => void>();
function readStyle(): MapStyle {
  try {
    return localStorage.getItem(STYLE_KEY) === "satellite" ? "satellite" : "dark";
  } catch {
    return "dark";
  }
}
function useMapStyle(): [MapStyle, (s: MapStyle) => void] {
  const style = useSyncExternalStore(
    (cb) => {
      styleListeners.add(cb);
      return () => styleListeners.delete(cb);
    },
    readStyle,
    () => "dark" as MapStyle,
  );
  const set = useCallback((s: MapStyle) => {
    try {
      localStorage.setItem(STYLE_KEY, s);
    } catch {
      /* private mode */
    }
    styleListeners.forEach((l) => l());
  }, []);
  return [style, set];
}

/* ---------- Sim mode (?sim=1) to rehearse the trip from anywhere ---------- */

type Sim = { on: boolean; t: number | null; at: string | null; gps: boolean };

function readSim(): Sim {
  const q = new URLSearchParams(window.location.search);
  const on = q.has("sim");
  const tRaw = q.get("t");
  const t = tRaw ? new Date(tRaw.length <= 16 ? `${tRaw}:00-04:00` : tRaw).getTime() : null;
  return { on, t: on ? (t && !Number.isNaN(t) ? t : TRIP_START_MS + 3600000 * 9) : null, at: on ? q.get("at") : null, gps: q.has("gps") };
}

export default function TripApp() {
  const [sim, setSim] = useState<Sim>(readSim);
  const reducedMotion = usePrefersReducedMotion();
  const now = useNow(sim.on ? sim.t : null);

  // Real GPS unless rehearsing with a pinned place.
  const useGps = !sim.on || (sim.gps && !sim.at);
  const geo = useGeolocation(useGps);
  const simPos = sim.on && sim.at ? PLACES.find((p) => p.id === sim.at)?.pos ?? null : null;
  const live0 = useGps && !simPos && geo.state.status === "live" ? geo.state : null;
  const uLat = simPos?.[0] ?? live0?.pos[0] ?? null;
  const uLng = simPos?.[1] ?? live0?.pos[1] ?? null;
  const uAcc = simPos ? 25 : live0?.accuracy ?? 0;
  const uHead = simPos ? null : live0?.heading ?? null;
  const user: MapUser = useMemo(
    () => (uLat !== null && uLng !== null ? { pos: [uLat, uLng], accuracy: uAcc, heading: uHead } : null),
    [uLat, uLng, uAcc, uHead],
  );
  const geoView: GeoState = useGps ? geo.state : user ? { status: "live", pos: user.pos, accuracy: 25, heading: null, at: now } : { status: "idle" };

  // First pass without a live route to know the target, then refine with the road ETA.
  const draft = guide(now, user?.pos ?? null, null);
  const routePlace = draft.phase === "during" && user && draft.travelMin !== undefined ? draft.target?.place ?? null : null;
  const routeTarget = routePlace?.pos ?? null;
  const live = useLiveRoute(user?.pos ?? null, routeTarget, Math.floor(now / 120000));
  const g: Guidance = live.route && routePlace ? guide(now, user?.pos ?? null, { minutes: live.route.minutes, meters: live.route.meters, toId: routePlace.id }) : draft;

  const autoDay = dayForTime(now);
  const [pickedDay, setPickedDay] = useState<DayId | null>(null);
  const day = pickedDay ?? autoDay;
  const dayStops = useMemo(() => stopsForDay(day), [day]);
  const doneIds = dayStops.filter((s) => stopState(s, now) === "done").map((s) => s.id).join(",");

  const [mapStyle, setMapStyle] = useMapStyle();
  const [follow, setFollow] = useState(true);
  const [fitSignal, setFitSignal] = useState(0);
  const [openStop, setOpenStop] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const pick = useCallback((id: string) => {
    const s = STOPS.find((x) => x.id === id);
    if (!s) return;
    setPickedDay(s.day);
    setOpenStop(id);
    setFollow(false);
    requestAnimationFrame(() => document.getElementById(`stop-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" }));
  }, []);

  const weatherPos = user?.pos ?? g.target?.place.pos ?? MUNISING;
  const weather = useWeather(weatherPos, Math.floor(now / 3600000));
  const sunDay = now >= TRIP_START_MS && now <= TRIP_END_MS ? dateKey(now) : DAYS.find((d) => d.id === day)!.date;
  const sun = sunTimes(sunDay, MUNISING);

  return (
    <div className="trip-root fixed inset-0 flex flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_440px]">
      {/* Map */}
      <section className="relative h-[44svh] min-h-[260px] shrink-0 lg:h-auto" aria-label="Trip map">
        <TripMap
          day={day}
          stops={dayStops}
          targetId={g.target?.id}
          doneIds={doneIds}
          user={user}
          beam={routeTarget ? live.route?.line ?? null : null}
          focus={g.phase === "before" ? HOUSE : g.target?.place.pos ?? null}
          follow={follow}
          fitSignal={fitSignal}
          reducedMotion={reducedMotion}
          mapStyle={mapStyle}
          onPick={pick}
          onUserPan={() => setFollow(false)}
        />
        <MapChrome now={now} weather={weather} sunset={sun.set} />
        <div className="absolute right-3 bottom-7 z-(--z-map-ui) flex flex-col gap-2 lg:bottom-4">
          <MapButton label={mapStyle === "satellite" ? "Switch to dark map" : "Switch to satellite"} icon="layers" onClick={() => setMapStyle(mapStyle === "satellite" ? "dark" : "satellite")} />
          <MapButton label="Show this day's route" icon="route" onClick={() => { setFollow(false); setFitSignal((n) => n + 1); }} />
          <MapButton label={user ? "Follow my location" : "Turn on location"} icon="locate" active={follow && !!user} onClick={() => { if (!user && useGps) geo.start(); setFollow(true); }} />
        </div>
      </section>

      {/* Panel */}
      <section
        ref={listRef}
        aria-label="What to do"
        className="trip-scroll relative z-(--z-sheet) -mt-4 min-h-0 flex-1 overflow-y-auto rounded-t-3xl border-t border-(--t-border) bg-(--t-surface-1) pb-[max(24px,env(safe-area-inset-bottom))] lg:mt-0 lg:rounded-none lg:border-t-0 lg:border-l"
      >
        <div className="mx-auto w-10 pt-2.5 lg:hidden" aria-hidden>
          <div className="h-1 rounded-full bg-(--t-border-strong)" />
        </div>
        <NowCard g={g} geo={geoView} onLocate={geo.start} routeLoading={live.loading} onShow={(id) => pick(id)} />
        <DayTabs day={day} onPick={(d) => { setPickedDay(d); setFollow(false); setOpenStop(null); }} />
        <SceneSwap sceneKey={day}>
          <Timeline stops={dayStops} now={now} plan={g.plan.items} targetId={g.target?.id} openId={openStop} onToggle={(id) => setOpenStop((cur) => (cur === id ? null : id))} onShow={pick} />
        </SceneSwap>
        <Collapse open={sim.on}>
          <SimPanel sim={sim} onChange={setSim} />
        </Collapse>
      </section>
    </div>
  );
}

/* ---------- Map chrome: title, clock, weather ---------- */

function MapChrome({ now, weather, sunset }: { now: number; weather: ReturnType<typeof useWeather>; sunset: Date }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-(--z-map-ui) flex items-start justify-between gap-2 p-3 pt-[max(12px,env(safe-area-inset-top))]">
      <div className="pointer-events-auto rounded-2xl border border-(--t-border) bg-(--t-surface-1) px-3.5 py-2 shadow-lg">
        <p className="text-[11px] font-medium tracking-[0.14em] text-(--t-accent) uppercase">Pictured Rocks</p>
        <p className="font-display text-[17px] leading-tight">Oct 24 to 26</p>
      </div>
      <div className="pointer-events-auto flex flex-col items-end gap-1.5">
        <div className="flex h-9 items-center gap-1.5 rounded-full border border-(--t-border) bg-(--t-surface-1) px-3 text-[13px] font-medium tabular-nums shadow-lg">
          <Icon name="clock" size={14} className="text-(--t-faint)" />
          {fmtDay(now)} {fmtTime(now)}
        </div>
        <div className="flex h-9 items-center gap-1.5 rounded-full border border-(--t-border) bg-(--t-surface-1) px-3 text-[13px] shadow-lg">
          <Icon name={weather.data && /sun|clear/i.test(weather.data.short) ? "sun" : "cloud"} size={14} className="text-(--t-faint)" />
          <SceneSwap sceneKey={weather.data ? "w" : weather.failed ? "f" : "l"}>
            {weather.data ? (
              <span className="tabular-nums">
                {weather.data.temp}°{weather.data.rain ? <span className="text-(--t-user)"> · {weather.data.rain}%</span> : null}
              </span>
            ) : weather.failed ? (
              <span className="text-(--t-faint)">—</span>
            ) : (
              <span className="trip-skeleton inline-block h-3.5 w-9" />
            )}
          </SceneSwap>
          <span className="mx-0.5 h-3.5 w-px bg-(--t-border-strong)" />
          <Icon name="sunset" size={14} className="text-(--t-sand)" />
          <span className="tabular-nums">{fmtTime(sunset)}</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Now card ---------- */

function GpsBadge({ geo }: { geo: GeoState }) {
  const label =
    geo.status === "live" ? `GPS ±${Math.round(geo.accuracy)} m` : geo.status === "locating" ? "Finding you" : geo.status === "denied" ? "Location blocked" : geo.status === "unavailable" ? "No GPS fix" : "Location off";
  const live = geo.status === "live";
  return (
    <span className={`inline-flex h-7 items-center gap-1.5 text-[12px] ${live ? "text-(--t-user)" : "text-(--t-faint)"}`}>
      <Icon name={geo.status === "locating" ? "spinner" : "locate"} size={14} />
      {label}
    </span>
  );
}

function NowCard({ g, geo, onLocate, routeLoading, onShow }: { g: Guidance; geo: GeoState; onLocate: () => void; routeLoading: boolean; onShow: (id: string) => void }) {
  const { done, toggle, reset } = useChecklist();
  const needsLocation = g.phase === "during" && (geo.status === "idle" || geo.status === "denied" || geo.status === "unavailable");
  const sceneKey = `${g.tone}|${g.pill}|${g.headline}`;
  const todoPrefix = `${g.todoKey}:`;
  const doneCount = g.todo.filter((t) => done[todoPrefix + t]).length;
  const anchorItem = g.plan.anchor && !g.plan.anchor.inProgress && g.plan.anchor.stop.id !== g.target?.id ? g.plan.anchor : g.plan.anchor && g.plan.anchor.status === "missed" ? g.plan.anchor : undefined;

  return (
    <div className="px-4 pt-3 pb-2 lg:px-6 lg:pt-6">
      <div className="flex items-center justify-between gap-3">
        <SceneSwap sceneKey={`${g.tone}|${g.pill}`}>
          <StatusPill tone={g.tone}>{g.pill}</StatusPill>
        </SceneSwap>
        <GpsBadge geo={geo} />
      </div>

      <SceneSwap sceneKey={sceneKey} className="mt-3">
        <div>
          <h1 className="text-[28px] leading-[1.1] tracking-[-0.02em] text-balance">{g.headline}</h1>
          <p className="mt-1.5 flex items-center gap-2 text-[14px] text-(--t-muted)">
            {routeLoading && g.travelMin !== undefined ? <Icon name="spinner" size={14} className="text-(--t-faint)" /> : null}
            {g.detail}
          </p>
          {g.target?.booked ? <BookedBadge text={g.target.booked} className="mt-2.5" /> : null}
        </div>
      </SceneSwap>

      <Collapse open={!!anchorItem}>
        <div className="pt-3">
          <AnchorChip item={anchorItem} />
        </div>
      </Collapse>

      <Collapse open={g.changes.length > 0}>
        <div className="pt-4">
          <p className="text-[11px] font-medium tracking-[0.14em] text-(--t-faint) uppercase">{g.phase === "before" ? "If you leave on time" : "Plan adjusted"}</p>
          <ul className="mt-2 space-y-1.5">
            {g.changes.map((c) => (
              <li key={c.stop.id}>
                <button type="button" onClick={() => onShow(c.stop.id)} className="flex min-h-11 w-full items-center gap-3 rounded-xl border border-(--t-border) bg-(--t-surface-2) px-3 py-2 text-left">
                  <Icon name={KIND_ICON[c.stop.kind]} className="text-(--t-faint)" />
                  <span className="min-w-0 flex-1">
                    <span className={`block truncate text-[13px] ${c.status === "dropped" ? "text-(--t-faint) line-through" : "text-(--t-ink)"}`}>{c.stop.title}</span>
                    <span className={`block truncate text-[12px] ${c.status === "missed" ? "text-(--t-neg)" : c.status === "dropped" ? "text-(--t-faint)" : "text-(--t-warn)"}`}>{changeText(c)}</span>
                  </span>
                  <span className="text-[12px] tabular-nums text-(--t-muted)">{c.status === "dropped" ? "" : fmtTime(c.start)}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </Collapse>

      <Collapse open={needsLocation}>
        <div className="pt-4">
          <div className="flex items-center gap-3 rounded-2xl border border-(--t-user)/30 bg-(--t-user)/10 p-3">
            <Icon name="locate" size={20} className="text-(--t-user)" />
            <p className="min-w-0 flex-1 text-[13px] leading-snug text-(--t-muted)">
              {geo.status === "denied" ? "Location is blocked. Allow it for this site in your browser settings, then reload." : "Turn on location to check if you're on track."}
            </p>
            <Button variant="primary" onClick={onLocate} disabled={geo.status === "denied"} className="shrink-0 px-3">
              {geo.status === "denied" ? "Blocked" : "Turn on"}
            </Button>
          </div>
        </div>
      </Collapse>

      <Collapse open={!!g.pace}>
        <div className="pt-4">
          <PaceMeter g={g} />
        </div>
      </Collapse>

      <Collapse open={!!g.backup && (g.tone === "bad" || g.tone === "warn")}>
        <div className="pt-4">
          <div className="flex gap-2.5 rounded-2xl border border-(--t-warn)/30 bg-(--t-warn)/10 p-3 text-[13px] leading-snug text-(--t-muted)">
            <Icon name="alert" size={16} className="mt-0.5 text-(--t-warn)" />
            <span>{g.backup}</span>
          </div>
        </div>
      </Collapse>

      <div className={`mt-4 grid gap-2 ${g.nav ? "grid-cols-[1fr_auto]" : "grid-cols-1"}`}>
        {g.nav ? (
          <>
            <LinkButton variant="primary" icon="nav" href={mapsDirectionsUrl(g.nav.place.nav)} className="min-w-0">
              <span className="truncate">
                Navigate to {g.nav.place.name.split(" · ")[0]}
              </span>
            </LinkButton>
            <Button variant="secondary" icon="pin" onClick={() => g.nav && onShow(g.nav.id)} aria-label="Show on map" className="px-3.5" />
          </>
        ) : null}
      </div>

      <Collapse open={g.hereStops.length > 0}>
        <div className="pt-5">
          <p className="text-[11px] font-medium tracking-[0.14em] text-(--t-faint) uppercase">You&apos;re at {g.here?.name}</p>
          <ul className="mt-2 divide-y divide-(--t-border) rounded-2xl border border-(--t-border) bg-(--t-surface-2)">
            {g.hereStops.map((s) => (
              <li key={s.id}>
                <button type="button" onClick={() => onShow(s.id)} className="flex min-h-12 w-full items-center gap-3 px-3.5 py-2.5 text-left">
                  <Icon name={KIND_ICON[s.kind]} className="text-(--t-faint)" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px]">{s.title}</span>
                    <span className="block text-[12px] text-(--t-faint)">
                      Planned {fmtDay(new Date(s.start))} {fmtTime(new Date(s.start))}
                    </span>
                  </span>
                  <Icon name="chevron" className="text-(--t-faint)" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </Collapse>

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-medium tracking-[0.14em] text-(--t-faint) uppercase">
            {g.phase === "before" ? "Before you go" : "To do here"}
            <span className="ml-2 tabular-nums text-(--t-muted)">
              {doneCount}/{g.todo.length}
            </span>
          </p>
          <button type="button" onClick={() => reset(todoPrefix)} disabled={doneCount === 0} className="min-h-11 px-2 text-[12px] text-(--t-faint) transition-[color,opacity] duration-(--m-control) hover:text-(--t-ink) disabled:opacity-40">
            Reset
          </button>
        </div>
        <SceneSwap sceneKey={g.todoKey}>
          <ul className="mt-1 space-y-1.5">
            {g.todo.map((t) => (
              <li key={t}>
                <CheckRow label={t} checked={!!done[todoPrefix + t]} onToggle={() => toggle(todoPrefix + t)} />
              </li>
            ))}
          </ul>
        </SceneSwap>
      </div>
    </div>
  );
}

function changeText(c: PlanItem): string {
  switch (c.status) {
    case "dropped":
      return `Skipped, ${c.note?.toLowerCase() ?? "no time"}`;
    case "shortened":
      return c.note ? `Shortened: ${c.note}` : "Shortened";
    case "moved":
      return c.shiftMin > 0 ? `${formatShift(c.shiftMin)} later than planned` : `${formatShift(-c.shiftMin)} earlier than planned`;
    case "missed":
      return `Can't make it, ${c.note ?? "late"}`;
    default:
      return "";
  }
}

function AnchorChip({ item }: { item?: PlanItem }) {
  if (!item) return <div className="h-11" />;
  const spare = item.spareMin ?? 0;
  const tone = item.status === "missed" ? "text-(--t-neg) border-(--t-neg)/40 bg-(--t-neg)/10" : item.status === "tight" ? "text-(--t-warn) border-(--t-warn)/40 bg-(--t-warn)/10" : "text-(--t-pos) border-(--t-pos)/30 bg-(--t-pos)/10";
  return (
    <div className={`flex min-h-11 items-center gap-2.5 rounded-xl border px-3 py-2 text-[13px] ${tone}`}>
      <Icon name="lock" />
      <span className="min-w-0 flex-1 truncate">
        <span className="text-(--t-ink)">{item.stop.title}</span> · {fmtDay(item.start)} {fmtTime(item.start)}
      </span>
      <span className="shrink-0 font-medium tabular-nums">{item.status === "missed" ? item.note : spare >= 0 ? `${formatShift(spare)} spare` : `${formatShift(-spare)} short`}</span>
    </div>
  );
}

function BookedBadge({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={`inline-flex h-7 items-center gap-1.5 rounded-full border border-(--t-pos)/35 bg-(--t-pos)/10 px-2.5 text-[12px] font-medium text-(--t-pos) ${className}`}>
      <Icon name="check" size={14} />
      {text}
    </span>
  );
}

function CheckRow({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
  return (
    <button type="button" role="checkbox" aria-checked={checked} onClick={onToggle} className="flex min-h-11 w-full items-start gap-3 rounded-xl px-1 py-2 text-left">
      <span
        className={`mt-px grid size-5 shrink-0 place-items-center rounded-md border transition-[background-color,border-color] duration-(--m-control) ease-(--m-ease-in) ${
          checked ? "border-(--t-accent) bg-(--t-accent) text-(--t-accent-ink)" : "border-(--t-border-strong) bg-transparent text-transparent"
        }`}
      >
        <Icon name="check" size={14} />
      </span>
      <span className={`text-[14px] leading-snug transition-[color,opacity] duration-(--m-control) ${checked ? "text-(--t-faint) line-through" : "text-(--t-ink)"}`}>{label}</span>
    </button>
  );
}

function PaceMeter({ g }: { g: Guidance }) {
  const p = g.pace;
  const total = g.target?.checkpoints?.at(-1)?.mile ?? 10;
  const mile = p ? total - p.milesLeft : 0;
  return (
    <div className="rounded-2xl border border-(--t-border) bg-(--t-surface-2) p-3.5">
      <div className="flex items-baseline justify-between text-[12px] text-(--t-faint)">
        <span>Trail progress</span>
        <span className="tabular-nums text-(--t-muted)">
          {mile.toFixed(1)} / {total} mi
        </span>
      </div>
      <div className="relative mt-2.5 h-2 overflow-hidden rounded-full bg-(--t-surface-3)">
        <div className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-(--t-sand) transition-transform duration-(--m-surface) ease-(--m-ease-in)" style={{ transform: `scaleX(${Math.min(1, mile / total)})` }} />
      </div>
      <div className="mt-2.5 flex justify-between gap-1 text-[11px] text-(--t-faint)">
        {g.target?.checkpoints?.slice(1, -1).map((c) => (
          <span key={c.name} className={c.mile <= mile ? "text-(--t-sand)" : ""}>
            {c.name}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- Day tabs ---------- */

function DayTabs({ day, onPick }: { day: DayId; onPick: (d: DayId) => void }) {
  const idx = DAYS.findIndex((d) => d.id === day);
  return (
    <div className="sticky top-0 z-10 border-y border-(--t-border) bg-(--t-surface-1)/95 px-4 py-2.5 lg:px-6">
      <div role="tablist" aria-label="Trip days" className="relative grid grid-cols-3 rounded-xl bg-(--t-surface-2) p-1">
        <span
          aria-hidden
          className="absolute inset-y-1 left-1 w-[calc((100%-8px)/3)] rounded-lg bg-(--t-surface-3) shadow transition-transform duration-(--m-surface) ease-(--m-ease-in)"
          style={{ transform: `translateX(${idx * 100}%)` }}
        />
        {DAYS.map((d) => (
          <button
            key={d.id}
            role="tab"
            aria-selected={d.id === day}
            onClick={() => onPick(d.id)}
            className={`relative min-h-11 rounded-lg text-[14px] font-medium transition-[color] duration-(--m-control) ${d.id === day ? "text-(--t-ink)" : "text-(--t-faint)"}`}
          >
            {d.label} {d.date.slice(8)}
          </button>
        ))}
      </div>
      <SceneSwap sceneKey={day}>
        <p className="mt-2 truncate text-center text-[12px] text-(--t-faint)">{DAYS[idx].theme}</p>
      </SceneSwap>
    </div>
  );
}

/* ---------- Timeline ---------- */

const STATE_LABEL = { done: "Done", now: "Now", later: "" } as const;

/** How a re-planned stop reads in the timeline. */
const PLAN_BADGE: Record<ItemStatus, ((i: PlanItem) => { text: string; cls: string }) | null> = {
  planned: null,
  spare: (i) => ({ text: i.inProgress ? "Fixed" : `Fixed · ${i.spareMin ?? 0} min spare`, cls: "text-(--t-pos) border-(--t-pos)/30" }),
  tight: (i) => ({ text: `Fixed · ${Math.max(0, i.spareMin ?? 0)} min spare`, cls: "text-(--t-warn) border-(--t-warn)/40" }),
  missed: (i) => ({ text: `Missed · ${i.note ?? "late"}`, cls: "text-(--t-neg) border-(--t-neg)/40" }),
  moved: (i) => ({ text: i.shiftMin > 0 ? `${formatShift(i.shiftMin)} later` : `${formatShift(-i.shiftMin)} earlier`, cls: "text-(--t-warn) border-(--t-warn)/35" }),
  shortened: (i) => ({ text: i.note ? `Shortened · ${i.note}` : "Shortened", cls: "text-(--t-warn) border-(--t-warn)/35" }),
  dropped: (i) => ({ text: `Skipped · ${i.note ?? "no time"}`, cls: "text-(--t-faint) border-(--t-border-strong)" }),
};

function formatShift(min: number) {
  return min >= 60 ? `${Math.floor(min / 60)} hr ${min % 60 ? `${min % 60} min` : ""}`.trim() : `${min} min`;
}

function PlanBadge({ item }: { item: PlanItem }) {
  const b = PLAN_BADGE[item.status]?.(item);
  if (!b) return null;
  return (
    <span className={`mt-1 inline-flex h-6 max-w-full items-center gap-1 truncate rounded-full border px-2 text-[11px] font-medium ${b.cls}`}>
      <Icon name={item.status === "spare" || item.status === "tight" ? "lock" : item.status === "missed" ? "alert" : "shuffle"} size={14} />
      <span className="truncate">{b.text}</span>
    </span>
  );
}

function Timeline({ stops, now, plan, targetId, openId, onToggle, onShow }: { stops: Stop[]; now: number; plan: PlanItem[]; targetId?: string; openId: string | null; onToggle: (id: string) => void; onShow: (id: string) => void }) {
  const byId = new Map(plan.map((i) => [i.stop.id, i]));
  return (
    <ol className="px-4 pt-3 pb-4 lg:px-6">
      {stops.map((s, i) => {
        const item = byId.get(s.id);
        const state = stopState(s, now);
        const isTarget = s.id === targetId;
        const open = openId === s.id;
        const last = i === stops.length - 1;
        const gone = item?.status === "dropped" || item?.status === "missed";
        const retimed = item && !gone && Math.abs(item.shiftMin) >= 5 && !s.flex?.open;
        return (
          <li key={s.id} id={`stop-${s.id}`} className={`relative grid grid-cols-[56px_28px_minmax(0,1fr)] gap-x-2 scroll-mt-28 transition-opacity duration-(--m-surface) ${gone ? "opacity-55" : ""}`}>
            <span className="pt-3 text-right text-[12px] leading-tight tabular-nums">
              <SceneSwap sceneKey={retimed ? `r${item.start}` : "p"}>
                {retimed ? (
                  <span className="flex flex-col items-end">
                    <span className="text-(--t-warn)">{fmtTime(item.start)}</span>
                    <span className="text-[11px] text-(--t-faint) line-through">{fmtTime(new Date(s.start))}</span>
                  </span>
                ) : (
                  <span className={state === "done" && !item ? "text-(--t-faint)" : "text-(--t-muted)"}>{fmtTime(new Date(s.start))}</span>
                )}
              </SceneSwap>
            </span>
            <span className="relative flex justify-center">
              <span className={`absolute top-0 bottom-0 w-px ${last ? "h-6" : ""} ${state === "done" && !item ? "bg-(--t-accent)/40" : "bg-(--t-border)"}`} />
              <span
                className={`relative mt-2.5 grid size-7 place-items-center rounded-full border transition-[background-color,border-color,color] duration-(--m-control) ${
                  isTarget ? "border-(--t-accent) bg-(--t-accent) text-(--t-accent-ink)" : state === "done" && !item ? "border-(--t-accent)/40 bg-(--t-surface-1) text-(--t-accent)" : "border-(--t-border-strong) bg-(--t-surface-1) text-(--t-faint)"
                }`}
              >
                <Icon name={state === "done" && !isTarget && !item ? "check" : KIND_ICON[s.kind]} size={14} />
              </span>
            </span>
            <div className="min-w-0 pb-1">
              <button type="button" aria-expanded={open} aria-controls={`stop-body-${s.id}`} onClick={() => onToggle(s.id)} className="flex min-h-12 w-full items-center gap-2 py-2 text-left">
                <span className="min-w-0 flex-1">
                  <span className={`flex items-center gap-1.5 truncate text-[15px] ${gone ? "text-(--t-faint) line-through" : state === "done" && !item ? "text-(--t-faint)" : "text-(--t-ink)"}`}>
                    <span className="truncate">{s.title}</span>
                    {s.booked ? <Icon name="check" size={14} className="text-(--t-pos)" /> : null}
                  </span>
                  <span className="block truncate text-[12px] text-(--t-faint)">
                    {s.place.name} · until {fmtTime(item && !gone && !s.flex?.open ? item.end : new Date(s.end))}
                  </span>
                  {item ? <PlanBadge item={item} /> : null}
                </span>
                <span className={`text-[11px] font-medium tracking-wide uppercase ${isTarget ? "text-(--t-accent)" : "text-(--t-faint)"}`}>{isTarget ? (item?.inProgress || state === "now" ? "Now" : "Next") : item ? "" : STATE_LABEL[state]}</span>
                <Icon name="chevron" className={`text-(--t-faint) transition-transform duration-(--m-control) ${open ? "rotate-90" : ""}`} />
              </button>
              <Collapse open={open} id={`stop-body-${s.id}`}>
                <div className="pb-3">
                  {s.booked ? <BookedBadge text={s.booked} className="mb-2" /> : null}
                  <ul className="space-y-1 text-[13px] leading-snug text-(--t-muted)">
                    {s.todo.map((t) => (
                      <li key={t} className="flex gap-2">
                        <span className="mt-[7px] size-1 shrink-0 rounded-full bg-(--t-faint)" />
                        {t}
                      </li>
                    ))}
                  </ul>
                  {s.tips?.map((t) => (
                    <p key={t} className="mt-2 flex gap-2 text-[12px] text-(--t-sand)">
                      <Icon name="alert" size={14} className="mt-px" />
                      {t}
                    </p>
                  ))}
                  {s.backup ? <p className="mt-2 text-[12px] text-(--t-warn)">{s.backup}</p> : null}
                  <div className="mt-3 flex gap-2">
                    <LinkButton icon="nav" href={mapsDirectionsUrl(s.place.nav)} className="min-h-10 px-3 text-[13px]">
                      Navigate
                    </LinkButton>
                    <Button icon="pin" variant="ghost" onClick={() => onShow(s.id)} className="min-h-10 px-3 text-[13px]">
                      Show on map
                    </Button>
                  </div>
                </div>
              </Collapse>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* ---------- Sim panel ---------- */

function SimPanel({ sim, onChange }: { sim: Sim; onChange: (s: Sim) => void }) {
  const span = TRIP_END_MS - TRIP_START_MS + 2 * 3600000;
  const from = TRIP_START_MS - 3600000;
  const t = sim.t ?? from;
  const places = PLACES.filter((p) => p.id !== "chapelLoop" && p.id !== "mackinac");
  return (
    <div className="mx-4 mt-2 mb-4 rounded-2xl border border-dashed border-(--t-border-strong) p-3.5 lg:mx-6">
      <p className="text-[11px] font-medium tracking-[0.14em] text-(--t-faint) uppercase">Rehearsal</p>
      <label className="mt-2 block text-[13px] text-(--t-muted)">
        {fmtDay(t)} {fmtTime(t)}
        <input
          type="range"
          min={0}
          max={span}
          step={15 * 60000}
          value={t - from}
          onChange={(e) => onChange({ ...sim, t: from + Number(e.target.value) })}
          className="mt-1 h-11 w-full accent-(--t-accent)"
        />
      </label>
      <div className="mt-1 flex flex-wrap gap-1.5">
        {[{ id: "", name: sim.gps ? "My GPS" : "No GPS" }, ...places].map((p) => (
          <button
            key={p.id || "none"}
            type="button"
            aria-pressed={(sim.at ?? "") === p.id}
            onClick={() => onChange({ ...sim, at: p.id || null })}
            className={`min-h-9 rounded-full border px-3 text-[12px] transition-[background-color,color,border-color] duration-(--m-control) ${
              (sim.at ?? "") === p.id ? "border-(--t-accent) bg-(--t-accent)/15 text-(--t-accent)" : "border-(--t-border) text-(--t-muted)"
            }`}
          >
            {p.name.split(" · ")[0]}
          </button>
        ))}
      </div>
    </div>
  );
}
