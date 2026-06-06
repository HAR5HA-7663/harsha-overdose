import type { Metadata } from "next";
import { Fraunces, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

// Editorial serif display — Fraunces has SOFT + opsz axes for character.
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["SOFT", "opsz"],
  display: "swap",
});

// Italic moment serif — Instrument Serif italic for editorial lines.
const instrumentSerif = Instrument_Serif({
  variable: "--font-serif-edit",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

// Distinctive monospace.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-code",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://har5ha.in"),
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: "/favicon.svg",
  },
  title: "Harsha Yellela — Full Stack Engineer @ teli.ai",
  description:
    "Full Stack Engineer shipping agentic voice + SMS for the mortgage industry — function calling, streaming ASR/TTS, hybrid RAG over pgvector, multi-tenant Postgres RLS. Portfolio is a walkable knowledge graph; /teli is a cinematic mortgage call.",
  keywords: [
    "Harsha Yellela",
    "Full Stack Engineer",
    "AI Engineer",
    "ML Engineer",
    "Voice AI",
    "RAG",
    "LangChain",
    "teli.ai",
    "Portfolio",
    "Knowledge Graph",
  ],
  authors: [{ name: "Harsha Yellela" }],
  creator: "Harsha Yellela",
  openGraph: {
    title: "Harsha Yellela — Full Stack Engineer @ teli.ai",
    description: "A walkable knowledge graph of my work. /teli shows a live mortgage call being qualified by streaming voice + hybrid RAG.",
    url: "https://har5ha.in",
    siteName: "Harsha Yellela",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Harsha Yellela — Full Stack Engineer @ teli.ai",
    description: "A walkable knowledge graph. /teli is a cinematic mortgage call.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${GeistSans.variable} ${fraunces.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Harsha Vardhan Yellela",
              jobTitle: "Full Stack Engineer",
              affiliation: { "@type": "Organization", name: "teli.ai" },
              url: "https://har5ha.in",
              sameAs: [
                "https://linkedin.com/in/har5ha-7663",
                "https://github.com/HAR5HA-7663",
              ],
            }),
          }}
        />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
