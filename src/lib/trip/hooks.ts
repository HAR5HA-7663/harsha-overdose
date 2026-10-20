"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import type { LatLng } from "@/data/trip";

/* ---------- Clock ---------- */

/** Wall clock, ticking every 15 s. A fixed `override` (sim mode) wins. */
export function useNow(override: number | null): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (override !== null) return;
    const id = window.setInterval(() => setNow(Date.now()), 15000);
    const onVisible = () => document.visibilityState === "visible" && setNow(Date.now());
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [override]);
  return override ?? now;
}

/* ---------- GPS ---------- */

export type GeoState =
  | { status: "idle" }
  | { status: "locating" }
  | { status: "live"; pos: LatLng; accuracy: number; heading: number | null; at: number }
  | { status: "denied" }
  | { status: "unavailable"; reason: string };

export function useGeolocation(enabled: boolean) {
  const [state, setState] = useState<GeoState>({ status: "idle" });
  const [wanted, setWanted] = useState(false);

  // Auto-start when permission was already granted on an earlier visit.
  useEffect(() => {
    if (!enabled || !navigator.permissions?.query) return;
    let alive = true;
    navigator.permissions
      .query({ name: "geolocation" as PermissionName })
      .then((p) => {
        if (!alive) return;
        if (p.state === "granted") setWanted(true);
        if (p.state === "denied") setState({ status: "denied" });
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !wanted) return;
    if (!("geolocation" in navigator)) {
      queueMicrotask(() => setState({ status: "unavailable", reason: "This browser has no location support." }));
      return;
    }
    const id = navigator.geolocation.watchPosition(
      (p) =>
        setState({
          status: "live",
          pos: [p.coords.latitude, p.coords.longitude],
          accuracy: p.coords.accuracy,
          heading: p.coords.heading !== null && (p.coords.speed ?? 0) > 1 ? p.coords.heading : null,
          at: p.timestamp,
        }),
      (err) => {
        if (err.code === err.PERMISSION_DENIED) setState({ status: "denied" });
        else setState((s) => (s.status === "live" ? s : { status: "unavailable", reason: "Can't get a GPS fix right now." }));
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 30000 },
    );
    return () => navigator.geolocation.clearWatch(id);
  }, [enabled, wanted]);

  const start = useCallback(() => {
    setState((s) => (s.status === "live" ? s : { status: "locating" }));
    setWanted(true);
  }, []);

  return { state, start };
}

/* ---------- Live route + ETA ---------- */

export type LiveRoute = { minutes: number; meters: number; line: LatLng[] };

type RouteResult = { key: string; route: LiveRoute | null; failed: boolean };

/** Road route from the phone to the target. Refetches when you move ~500 m, the target changes, or 2 minutes pass. */
export function useLiveRoute(from: LatLng | null, to: LatLng | null, bucket: number) {
  // Round the origin to ~100 m so small GPS jitter does not refetch.
  const fLat = from ? Number(from[0].toFixed(3)) : null;
  const fLng = from ? Number(from[1].toFixed(3)) : null;
  const tLat = to ? to[0] : null;
  const tLng = to ? to[1] : null;
  const key = fLat !== null && fLng !== null && tLat !== null && tLng !== null ? `${fLat},${fLng}>${tLat},${tLng}@${bucket}` : "";
  const [result, setResult] = useState<RouteResult>({ key: "", route: null, failed: false });

  useEffect(() => {
    if (fLat === null || fLng === null || tLat === null || tLng === null) return;
    const reqKey = `${fLat},${fLng}>${tLat},${tLng}@${bucket}`;
    const ctrl = new AbortController();
    const url = `https://router.project-osrm.org/route/v1/driving/${fLng},${fLat};${tLng},${tLat}?overview=simplified&geometries=geojson`;
    fetch(url, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: { routes?: { duration: number; distance: number; geometry: { coordinates: [number, number][] } }[] }) => {
        const r = d.routes?.[0];
        if (!r) throw new Error("no route");
        setResult({
          key: reqKey,
          failed: false,
          // The public router runs slow on rural highways; trim toward real-world times.
          route: { minutes: (r.duration / 60) * 0.85, meters: r.distance, line: r.geometry.coordinates.map(([lng, lat]) => [lat, lng]) },
        });
      })
      .catch((e: unknown) => {
        if ((e as Error).name !== "AbortError") setResult((prev) => ({ key: reqKey, route: prev.route, failed: true }));
      });
    return () => ctrl.abort();
  }, [fLat, fLng, tLat, tLng, bucket]);

  const fresh = result.key === key;
  // While refetching after a move, keep the last line only if it goes to the same place.
  const sameTarget = !!key && result.key.split(">")[1]?.split("@")[0] === key.split(">")[1]?.split("@")[0];
  return { route: sameTarget ? result.route : null, loading: !!key && !fresh, failed: fresh && result.failed };
}

/* ---------- Weather ---------- */

export type Weather = { temp: number; unit: string; short: string; wind: string; rain: number | null; period: string };
type WeatherResult = { key: string; data: Weather | null; failed: boolean };

export function useWeather(pos: LatLng | null, hourBucket: number) {
  const lat = pos ? Number(pos[0].toFixed(2)) : null;
  const lng = pos ? Number(pos[1].toFixed(2)) : null;
  const key = lat !== null && lng !== null ? `${lat},${lng}@${hourBucket}` : "";
  const [result, setResult] = useState<WeatherResult>({ key: "", data: null, failed: false });

  useEffect(() => {
    if (lat === null || lng === null) return;
    const reqKey = `${lat},${lng}@${hourBucket}`;
    const ctrl = new AbortController();
    fetch(`https://api.weather.gov/points/${lat},${lng}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("points"))))
      .then((p: { properties: { forecastHourly: string } }) => fetch(p.properties.forecastHourly, { signal: ctrl.signal }))
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("hourly"))))
      .then((f: { properties: { periods: { temperature: number; temperatureUnit: string; shortForecast: string; windSpeed: string; startTime: string; probabilityOfPrecipitation?: { value: number | null } }[] } }) => {
        const p = f.properties.periods[0];
        setResult({
          key: reqKey,
          failed: false,
          data: { temp: p.temperature, unit: p.temperatureUnit, short: p.shortForecast, wind: p.windSpeed, rain: p.probabilityOfPrecipitation?.value ?? null, period: p.startTime },
        });
      })
      .catch((e: unknown) => {
        if ((e as Error).name !== "AbortError") setResult((prev) => ({ key: reqKey, data: prev.data, failed: true }));
      });
    return () => ctrl.abort();
  }, [lat, lng, hourBucket]);

  const fresh = result.key === key;
  return { data: result.data, loading: !!key && !fresh && !result.data, failed: fresh && result.failed && !result.data };
}

/* ---------- Checklist (persisted per device) ---------- */

const STORE_KEY = "trip-pr-2026:done";
const listeners = new Set<() => void>();
let cache: Record<string, true> | null = null;

function readStore(): Record<string, true> {
  if (cache) return cache;
  try {
    cache = JSON.parse(localStorage.getItem(STORE_KEY) ?? "{}") as Record<string, true>;
  } catch {
    cache = {};
  }
  return cache;
}

function writeStore(next: Record<string, true>) {
  cache = next;
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(next));
  } catch {
    /* private mode: keep it in memory */
  }
  listeners.forEach((l) => l());
}

const EMPTY: Record<string, true> = {};

export function useChecklist() {
  const done = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    readStore,
    () => EMPTY,
  );
  const toggle = useCallback((id: string) => {
    const next = { ...readStore() };
    if (next[id]) delete next[id];
    else next[id] = true;
    writeStore(next);
  }, []);
  const reset = useCallback((prefix?: string) => {
    if (!prefix) return writeStore({});
    const next = { ...readStore() };
    Object.keys(next).forEach((k) => k.startsWith(prefix) && delete next[k]);
    writeStore(next);
  }, []);
  return { done, toggle, reset };
}

/* ---------- Reduced motion ---------- */

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}
