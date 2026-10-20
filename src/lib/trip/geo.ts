import type { LatLng } from "@/data/trip";

const R = 6371000;
const rad = (d: number) => (d * Math.PI) / 180;

/** Great-circle distance in meters. */
export function distanceM(a: LatLng, b: LatLng): number {
  const dLat = rad(b[0] - a[0]);
  const dLng = rad(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Rough driving minutes when no live route is available. */
export function estimateDriveMin(meters: number): number {
  const road = meters * 1.3;
  const kmh = meters < 5000 ? 30 : meters < 50000 ? 65 : 95;
  return Math.max(2, Math.round(road / 1000 / (kmh / 60)));
}

export function formatDistance(meters: number): string {
  const mi = meters / 1609.34;
  if (mi < 0.2) return `${Math.round(meters * 3.281)} ft`;
  return mi < 10 ? `${mi.toFixed(1)} mi` : `${Math.round(mi)} mi`;
}

export function formatDuration(min: number): string {
  const m = Math.max(0, Math.round(min));
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r ? `${h} hr ${r} min` : `${h} hr`;
}

const TZ = "America/Detroit";
const timeFmt = new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", minute: "2-digit" });
const dayFmt = new Intl.DateTimeFormat("en-US", { timeZone: TZ, weekday: "short" });
const dateKeyFmt = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });

export const fmtTime = (d: Date | number) => timeFmt.format(d);
export const fmtDay = (d: Date | number) => dayFmt.format(d);
/** YYYY-MM-DD in Michigan time. */
export const dateKey = (d: Date | number) => dateKeyFmt.format(d);

/** Sunrise and sunset (NOAA approximation) for a date key at a location. */
export function sunTimes(dayKey: string, pos: LatLng): { rise: Date; set: Date } {
  const [y, mo, d] = dayKey.split("-").map(Number);
  const noonUtc = Date.UTC(y, mo - 1, d, 12);
  const jd = noonUtc / 86400000 + 2440587.5;
  const n = Math.round(jd - 2451545.0 + 0.0008);
  const jStar = n - pos[1] / 360;
  const M = (357.5291 + 0.98560028 * jStar) % 360;
  const C = 1.9148 * Math.sin(rad(M)) + 0.02 * Math.sin(rad(2 * M)) + 0.0003 * Math.sin(rad(3 * M));
  const lambda = (M + C + 180 + 102.9372) % 360;
  const jTransit = 2451545.0 + jStar + 0.0053 * Math.sin(rad(M)) - 0.0069 * Math.sin(rad(2 * lambda));
  const decl = Math.asin(Math.sin(rad(lambda)) * Math.sin(rad(23.44)));
  const cosW = (Math.sin(rad(-0.83)) - Math.sin(rad(pos[0])) * Math.sin(decl)) / (Math.cos(rad(pos[0])) * Math.cos(decl));
  const w = (Math.acos(Math.min(1, Math.max(-1, cosW))) * 180) / Math.PI;
  const toDate = (j: number) => new Date((j - 2440587.5) * 86400000);
  return { rise: toDate(jTransit - w / 360), set: toDate(jTransit + w / 360) };
}

export function mapsDirectionsUrl(destination: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=driving`;
}
