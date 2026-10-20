import type { Metadata, Viewport } from "next";
import TripClient from "@/components/trip/TripClient";

export const metadata: Metadata = {
  title: "Pictured Rocks · Oct 24 to 26",
  description: "Live trip companion.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0e0c0a", // ui-check-ignore: meta tag needs a literal, matches --canvas
};

export default function TripPage() {
  return <TripClient />;
}
