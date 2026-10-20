"use client";

import dynamic from "next/dynamic";

// GPS, clock and map are browser-only: render on the client so nothing flashes a server guess.
const TripApp = dynamic(() => import("./TripApp"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 flex flex-col bg-(--canvas)">
      <div className="h-[44svh] min-h-[260px] animate-pulse bg-(--canvas-band)" />
      <div className="-mt-4 flex-1 rounded-t-3xl border-t border-(--hairline) bg-(--canvas) p-4">
        <div className="h-7 w-28 animate-pulse rounded-full bg-(--canvas-band)" />
        <div className="mt-4 h-8 w-3/4 animate-pulse rounded-lg bg-(--canvas-band)" />
        <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-(--canvas-band)" />
      </div>
    </div>
  ),
});

export default function TripClient() {
  return <TripApp />;
}
