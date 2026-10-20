"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import routes from "@/data/trip-routes.json";
import { DAYS, STOPS, type DayId, type LatLng, type Stop } from "@/data/trip";

type RouteKey = keyof typeof routes;

const DAY_LEGS: Record<DayId, RouteKey[]> = {
  sat: ["sat"],
  sun: ["sun_drive_in", "sun_drive_out"],
  mon: ["mon"],
};

const hike = STOPS.find((s) => s.kind === "hike");
const HIKE_PATH: LatLng[] = hike?.checkpoints?.map((c) => c.pos) ?? [];

export type MapStyle = "satellite" | "dark";

// Canvas strokes can't read CSS variables; read the tokens once from the page.
const token = (name: string, fallback: string) =>
  typeof document === "undefined" ? fallback : getComputedStyle(document.querySelector(".trip-root") ?? document.documentElement).getPropertyValue(name).trim() || fallback;
let DIM = "";
let USER = "";

const ESRI = "https://server.arcgisonline.com/ArcGIS/rest/services";
const ESRI_ATTR = 'Imagery &copy; <a href="https://www.esri.com">Esri</a>, Maxar, Earthstar Geographics';

/** Fewer tile requests: load when panning stops, keep a small buffer, standard-res tiles only. */
const LIGHT_TILES: L.TileLayerOptions = { maxZoom: 18, maxNativeZoom: 16, updateWhenIdle: true, updateWhenZooming: false, keepBuffer: 1, detectRetina: false };

function tileLayers(style: MapStyle): L.TileLayer[] {
  if (style === "satellite") {
    return [
      L.tileLayer(`${ESRI}/World_Imagery/MapServer/tile/{z}/{y}/{x}`, { ...LIGHT_TILES, maxNativeZoom: 18, attribution: ESRI_ATTR }),
    ];
  }
  return [
    L.tileLayer(`${ESRI}/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}`, { ...LIGHT_TILES, attribution: '&copy; <a href="https://www.esri.com">Esri</a>, HERE, Garmin, OpenStreetMap contributors' }),
    L.tileLayer(`${ESRI}/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}`, LIGHT_TILES),
  ];
}

/** Space the floating chrome covers, so framing never hides a pin under it. */
const FRAME = { paddingTopLeft: [28, 120] as L.PointTuple, paddingBottomRight: [72, 48] as L.PointTuple };

export type MapUser = { pos: LatLng; accuracy: number; heading: number | null } | null;

type Props = {
  day: DayId;
  stops: Stop[];
  targetId?: string;
  doneIds: string;
  user: MapUser;
  beam: LatLng[] | null;
  /** Where you should be heading; framed with you on the first fix. */
  focus: LatLng | null;
  follow: boolean;
  fitSignal: number;
  reducedMotion: boolean;
  mapStyle: MapStyle;
  onPick: (id: string) => void;
  onUserPan: () => void;
};

function drawIn(poly: L.Polyline) {
  const el = poly.getElement() as SVGPathElement | undefined;
  if (!el) return;
  el.style.setProperty("--len", String(Math.ceil(el.getTotalLength())));
  el.classList.add("trip-route-draw");
  // Once drawn, drop the dash so zooming never shows a gap.
  el.addEventListener("animationend", () => el.classList.remove("trip-route-draw"), { once: true });
}

export default function TripMap({ day, stops, targetId, doneIds, user, beam, focus, follow, fitSignal, reducedMotion, mapStyle, onPick, onUserPan }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const routeLayer = useRef<L.LayerGroup | null>(null);
  const tiles = useRef<L.LayerGroup | null>(null);
  const svgRenderer = useRef<L.Renderer | null>(null);
  const pinLayer = useRef<L.LayerGroup | null>(null);
  const youMarker = useRef<L.Marker | null>(null);
  const youAcc = useRef<L.Circle | null>(null);
  const beamLine = useRef<L.Polyline | null>(null);
  const hadFix = useRef(false);
  const pickRef = useRef(onPick);
  const panRef = useRef(onUserPan);

  useEffect(() => {
    pickRef.current = onPick;
    panRef.current = onUserPan;
  }, [onPick, onUserPan]);

  // Create the map once.
  useEffect(() => {
    if (!host.current || map.current) return;
    DIM = token("--t-faint", "gray");
    USER = token("--t-user", "dodgerblue");
    const m = L.map(host.current, { zoomControl: false, attributionControl: true, zoomSnap: 0.5, fadeAnimation: false, preferCanvas: true });
    tiles.current = L.layerGroup().addTo(m);
    m.attributionControl.setPrefix(false);
    // A starting view over the whole route; the day fit flies in from here.
    m.fitBounds(L.latLngBounds([[42.4, -86.8], [46.7, -83.3]]), { animate: false });
    routeLayer.current = L.layerGroup().addTo(m);
    pinLayer.current = L.layerGroup().addTo(m);
    m.on("dragstart", () => panRef.current());
    map.current = m;
    const ro = new ResizeObserver(() => m.invalidateSize());
    ro.observe(host.current);
    return () => {
      ro.disconnect();
      m.remove();
      map.current = null;
    };
  }, []);

  // Base map style.
  useEffect(() => {
    const layer = tiles.current;
    if (!layer) return;
    layer.clearLayers();
    tileLayers(mapStyle).forEach((t) => t.addTo(layer));
  }, [mapStyle]);

  // Routes for the chosen day, drawn in; other days faint.
  useEffect(() => {
    const m = map.current;
    const layer = routeLayer.current;
    if (!m || !layer) return;
    layer.clearLayers();
    for (const d of DAYS) {
      if (d.id === day) continue;
      for (const k of DAY_LEGS[d.id]) L.polyline(routes[k] as LatLng[], { color: DIM, opacity: 0.35, weight: 3, interactive: false }).addTo(layer);
    }
    // Day routes stay SVG for the one-time draw-in; everything else goes on the canvas.
    const svg = svgRenderer.current ?? (svgRenderer.current = L.svg());
    const drawn: L.Polyline[] = [];
    for (const k of DAY_LEGS[day]) {
      const line = routes[k] as LatLng[];
      drawn.push(L.polyline(line, { className: "trip-route-day", weight: 5, lineCap: "round", interactive: false, renderer: svg }).addTo(layer));
    }
    if (day === "sun") drawn.push(L.polyline(HIKE_PATH, { className: "trip-route-hike", weight: 4, interactive: false, renderer: svg }).addTo(layer));
    if (!reducedMotion) drawn.forEach(drawIn);
  }, [day, reducedMotion]);

  // Stop pins (rebuilt only when what they show changes).
  useEffect(() => {
    const layer = pinLayer.current;
    if (!layer) return;
    layer.clearLayers();
    const done = new Set(doneIds.split(","));
    const seen = new Set<string>();
    let n = 0;
    for (const s of stops) {
      if (s.kind === "drive") continue;
      n += 1;
      // Several stops at the house share one pin.
      if (seen.has(s.place.id) && s.id !== targetId) continue;
      seen.add(s.place.id);
      const html = `<div class="trip-pin-dot" data-kind="${s.kind}" data-state="${done.has(s.id) ? "done" : "later"}" data-target="${s.id === targetId}">${n}</div>`;
      const marker = L.marker(s.place.pos, {
        icon: L.divIcon({ className: "trip-pin", html, iconSize: [26, 26], iconAnchor: [13, 13] }),
        keyboard: true,
        title: s.title,
        zIndexOffset: s.id === targetId ? 1000 : 0,
      });
      marker.on("click", () => pickRef.current(s.id));
      marker.addTo(layer);
    }
    if (day === "sun" && hike?.checkpoints) {
      for (const cp of hike.checkpoints.slice(1, -1)) {
        L.marker(cp.pos, { icon: L.divIcon({ className: "trip-pin", html: '<div class="trip-pin-cp"></div>', iconSize: [12, 12], iconAnchor: [6, 6] }), title: cp.name, interactive: false }).addTo(layer);
      }
    }
  }, [day, stops, targetId, doneIds]);

  // Fit the day when it changes or on request.
  useEffect(() => {
    const m = map.current;
    if (!m) return;
    const pts: LatLng[] = DAY_LEGS[day].flatMap((k) => routes[k] as LatLng[]);
    m.flyToBounds(L.latLngBounds(pts), { ...FRAME, duration: reducedMotion ? 0 : 1.1, animate: !reducedMotion });
  }, [day, fitSignal, reducedMotion]);

  // You: dot, accuracy ring, heading cone.
  useEffect(() => {
    const m = map.current;
    if (!m) return;
    if (!user) {
      youMarker.current?.remove();
      youAcc.current?.remove();
      youMarker.current = null;
      youAcc.current = null;
      return;
    }
    if (!youMarker.current) {
      youMarker.current = L.marker(user.pos, {
        icon: L.divIcon({ className: "trip-pin", html: '<div class="trip-you"><div class="trip-you-cone"></div><div class="trip-you-pulse"></div><div class="trip-you-core"></div></div>', iconSize: [22, 22], iconAnchor: [11, 11] }),
        zIndexOffset: 2000,
        interactive: false,
        keyboard: false,
      }).addTo(m);
      youAcc.current = L.circle(user.pos, { radius: user.accuracy, color: USER, weight: 1, opacity: 0.3, fillColor: USER, fillOpacity: 0.08, interactive: false }).addTo(m);
    } else {
      youMarker.current.setLatLng(user.pos);
      youAcc.current?.setLatLng(user.pos).setRadius(user.accuracy);
    }
    const el = youMarker.current.getElement()?.querySelector<HTMLElement>(".trip-you-cone");
    if (el) {
      el.style.setProperty("--heading", `${user.heading ?? 0}deg`);
      el.style.opacity = user.heading === null ? "0" : "1";
    }
  }, [user]);

  // Live route from you to the target.
  useEffect(() => {
    const m = map.current;
    if (!m) return;
    if (!beam || beam.length < 2) {
      beamLine.current?.remove();
      beamLine.current = null;
      return;
    }
    if (!beamLine.current) beamLine.current = L.polyline(beam, { color: USER, weight: 4, dashArray: "6 8", interactive: false }).addTo(m);
    else beamLine.current.setLatLngs(beam);
  }, [beam]);

  // Camera follows you: first fix frames you + the target, then keeps you centred.
  useEffect(() => {
    const m = map.current;
    if (!m || !user) return;
    if (!follow) {
      hadFix.current = false;
      return;
    }
    if (!hadFix.current) {
      hadFix.current = true;
      const pts: LatLng[] = focus ? [user.pos, focus] : [user.pos, user.pos];
      m.flyToBounds(L.latLngBounds(pts), { ...FRAME, maxZoom: 15, animate: !reducedMotion, duration: reducedMotion ? 0 : 1.4 });
      return;
    }
    if (!m.getBounds().pad(-0.25).contains(user.pos)) m.panTo(user.pos, { animate: !reducedMotion, duration: 0.6 });
  }, [user, follow, focus, reducedMotion]);

  return <div ref={host} data-style={mapStyle} className="trip-map absolute inset-0" />;
}
